
-- Preflight checks
select current_user, current_setting('role', true);

select relname, relrowsecurity
from pg_class
where relname in ('user_transactions','user_properties');

select schemaname, tablename, policyname, cmd
from pg_policies
where tablename in ('user_transactions','user_properties')
order by tablename, policyname;

-- Migration: make each purchase uniquely identifiable + wire trigger + tighten RLS
begin;

-- 1) Add unique_purchase_key
alter table public.user_properties
  add column if not exists unique_purchase_key text;

-- Backfill existing rows with a stable key if missing
update public.user_properties
set unique_purchase_key = coalesce(mortgage_id, 'legacy-' || id::text)
where unique_purchase_key is null;

-- Create unique constraint on (user_address, unique_purchase_key)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'user_properties_user_address_unique_purchase_key_key'
  ) then
    alter table public.user_properties
      add constraint user_properties_user_address_unique_purchase_key_key
      unique (user_address, unique_purchase_key);
  end if;
end $$;

-- 2) Replace backfill function to use unique_purchase_key and per-purchase inserts
create or replace function public.backfill_user_property_from_tx(_tx_id uuid)
returns void
language plpgsql
security definer
set search_path to ''
as $function$
declare
  tx record;
  wallet text;
  prop_name text;
  prop_location text;
  img_url text;
  tx_amount numeric;
  purchase_price numeric;
  down_payment numeric;
  loan_amount numeric;
  monthly_payment numeric;
  equity_pct numeric;
  mapped_property_id bigint;
  unique_key text;
begin
  select * into tx
  from public.user_transactions
  where id = _tx_id;

  if not found then
    raise notice 'No transaction found for id %', _tx_id;
    return;
  end if;

  -- Only process property purchases that are completed
  if tx.transaction_type not in ('purchase','property_purchase') or tx.status <> 'completed' then
    return;
  end if;

  wallet := lower(coalesce(tx.user_wallet_address, ''));
  if wallet = '' then
    raise notice 'Transaction % has no wallet; skipping', _tx_id;
    return;
  end if;

  prop_name     := coalesce(tx.metadata->>'property_name', 'Unknown Property');
  prop_location := coalesce(tx.metadata->>'property_location', tx.metadata->>'location', 'Unknown Location');
  img_url       := coalesce(tx.metadata->>'image_url', '/placeholder.svg');
  tx_amount     := coalesce(tx.amount, 0);

  -- Prefer explicit price from metadata if present
  purchase_price := nullif(tx.metadata->>'propertyValue','')::numeric;
  if purchase_price is null then
    purchase_price := nullif(tx.metadata->>'purchase_price','')::numeric;
  end if;
  if purchase_price is null or purchase_price <= 0 then
    if tx_amount is not null and tx_amount > 0 then
      purchase_price := round(tx_amount / 0.20);
    else
      purchase_price := 0;
    end if;
  end if;

  down_payment := nullif(tx.metadata->>'downPayment','')::numeric;
  if down_payment is null or down_payment <= 0 then
    if tx.transaction_type in ('purchase','property_purchase') and tx_amount > 0 then
      down_payment := tx_amount;
    else
      down_payment := round(purchase_price * 0.20);
    end if;
  end if;

  loan_amount     := greatest(purchase_price - down_payment, 0);
  monthly_payment := (loan_amount * 0.05) / 12.0;
  equity_pct      := case when purchase_price > 0 then round((down_payment / purchase_price) * 100) else 0 end;

  mapped_property_id := case
    when lower(prop_name) like '%art deco loft%' then 1
    when lower(prop_name) like '%bahia%' then 2
    when lower(prop_name) like '%ericeira%' or lower(prop_name) like '%oceanview%' then 3
    else null
  end;

  -- Per-purchase unique key: mortgage_id preferred; else tx hash; else tx id
  unique_key := coalesce(nullif(tx.metadata->>'mortgage_id',''), nullif(tx.transaction_hash,''), _tx_id::text);

  insert into public.user_properties (
    user_wallet_address,
    property_name,
    property_location,
    image_url,
    purchase_price,
    down_payment,
    current_value,
    monthly_payment,
    remaining_balance,
    equity_percentage,
    is_active,
    mortgage_id,
    user_address,
    property_id,
    currency,
    purchase_price_base,
    down_payment_base,
    loan_amount_base,
    apr_bps,
    term_months,
    unique_purchase_key
  )
  values (
    wallet,
    prop_name,
    prop_location,
    img_url,
    purchase_price,
    down_payment,
    purchase_price,
    monthly_payment,
    loan_amount,
    equity_pct,
    true,
    nullif(tx.metadata->>'mortgage_id',''),
    wallet,
    mapped_property_id,
    'USDC-6',
    (purchase_price * 1000000)::bigint,
    (down_payment  * 1000000)::bigint,
    (loan_amount   * 1000000)::bigint,
    800,
    120,
    unique_key
  )
  on conflict (user_address, unique_purchase_key)
  do update set
    image_url            = excluded.image_url,
    current_value        = excluded.current_value,
    monthly_payment      = excluded.monthly_payment,
    remaining_balance    = excluded.remaining_balance,
    equity_percentage    = excluded.equity_percentage,
    is_active            = true,
    mortgage_id          = coalesce(excluded.mortgage_id, public.user_properties.mortgage_id),
    property_id          = coalesce(excluded.property_id, public.user_properties.property_id),
    purchase_price_base  = excluded.purchase_price_base,
    down_payment_base    = excluded.down_payment_base,
    loan_amount_base     = excluded.loan_amount_base,
    apr_bps              = excluded.apr_bps,
    term_months          = excluded.term_months,
    updated_at           = now();
end;
$function$;

-- 3) Ensure the AFTER INSERT trigger calls the trigger function (not the data function)
drop trigger if exists after_user_tx_backfill on public.user_transactions;

create trigger after_user_tx_backfill
after insert on public.user_transactions
for each row
execute function public.trg_after_user_tx_backfill();

-- 4) Tighten RLS on user_properties: remove permissive ALL policy, allow only SELECT
do $$
begin
  if exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='user_properties' and policyname='Allow wallet-based access for properties'
  ) then
    drop policy "Allow wallet-based access for properties" on public.user_properties;
  end if;
end $$;

-- Allow read access (keep simple for now; we can restrict to wallet claims later)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='user_properties' and policyname='User properties are viewable by everyone'
  ) then
    create policy "User properties are viewable by everyone"
      on public.user_properties
      for select
      using (true);
  end if;
end $$;

alter table public.user_properties enable row level security;

commit;

-- 5) Quick smoke backfill for recent purchases (safe/idempotent)
do $$
declare r record;
begin
  for r in
    select id
    from public.user_transactions
    where transaction_type in ('purchase','property_purchase')
    order by created_at desc
    limit 50
  loop
    perform public.backfill_user_property_from_tx(r.id);
  end loop;
end $$;

-- 6) Post-checks
select relname, relrowsecurity
from pg_class
where relname in ('user_transactions','user_properties');

select schemaname, tablename, policyname, cmd
from pg_policies
where tablename in ('user_transactions','user_properties')
order by tablename, policyname;

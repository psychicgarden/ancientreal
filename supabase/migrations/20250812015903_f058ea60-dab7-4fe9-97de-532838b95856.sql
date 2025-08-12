
-- 1) Settings: product knobs
create table if not exists public.app_settings (
  key   text primary key,
  value text not null
);

-- Min down set to 20.00% (in basis points)
insert into public.app_settings(key, value)
values ('min_down_pct_bps','2000')
on conflict (key) do update set value = excluded.value;

-- Money scale: legacy amounts are display dollars -> convert to USDC-6 base units
-- If you later find legacy rows already in cents or base units, update this key before re-running the backfill step.
insert into public.app_settings(key, value)
values ('money_scale','1000000')
on conflict (key) do update set value = excluded.value;

-- 2) Schema: add base-unit columns (backward compatible) + consistent keys
alter table public.user_properties
  add column if not exists user_address          text,
  add column if not exists property_id           bigint,
  add column if not exists currency              text not null default 'USDC-6',
  add column if not exists purchase_price_base   bigint,
  add column if not exists down_payment_base     bigint,
  add column if not exists loan_amount_base      bigint,
  add column if not exists apr_bps               integer,
  add column if not exists term_months           integer,
  add column if not exists principal_paid_base   bigint not null default 0,
  add column if not exists interest_paid_base    bigint not null default 0;

-- Generated remaining balance (server-derived, never client-written)
do $$
begin
  alter table public.user_properties
    add column remaining_balance_base bigint
    generated always as (greatest(loan_amount_base - principal_paid_base, 0)) stored;
exception
  when duplicate_column then null;
end$$;

-- 3) Safe validation trigger (integer math; server-computed loan_amount_base)
create or replace function public.app_validate_mortgage_data_base()
returns trigger
language plpgsql
as $$
declare
  min_down_bps integer := (select value::int from public.app_settings where key='min_down_pct_bps');
  min_down_amt bigint;
begin
  -- normalize
  new.user_address := lower(new.user_address);

  -- sanity
  if new.purchase_price_base is null or new.purchase_price_base <= 0 then
    raise exception 'purchase_price_base must be > 0';
  end if;
  if new.down_payment_base is null or new.down_payment_base < 0 then
    raise exception 'down_payment_base must be >= 0';
  end if;

  -- min down in bps (default to 20% if setting missing)
  min_down_amt := (new.purchase_price_base * coalesce(min_down_bps, 2000)) / 10000;
  if new.down_payment_base < min_down_amt then
    raise exception 'Down payment below minimum (% bps)', coalesce(min_down_bps, 2000);
  end if;

  -- server computes loan_amount_base
  new.loan_amount_base := new.purchase_price_base - new.down_payment_base;
  if new.loan_amount_base <= 0 then
    raise exception 'loan_amount_base must be > 0 (purchase - down)';
  end if;

  -- normalize paid fields
  new.principal_paid_base := coalesce(new.principal_paid_base, 0);
  new.interest_paid_base  := coalesce(new.interest_paid_base, 0);

  -- guard rails (defense-in-depth)
  if new.apr_bps is not null and (new.apr_bps < 0 or new.apr_bps > 3000) then
    raise exception 'apr_bps out of bounds (0..3000)';
  end if;
  if new.term_months is not null and (new.term_months < 12 or new.term_months > 360) then
    raise exception 'term_months out of bounds (12..360)';
  end if;

  new.updated_at := now();
  return new;
end;
$$;

-- Drop any older conflicting trigger, then add the new one
drop trigger if exists validate_mortgage_trigger on public.user_properties;
drop trigger if exists validate_mortgage_base_trigger on public.user_properties;

create trigger validate_mortgage_base_trigger
  before insert or update on public.user_properties
  for each row execute function public.app_validate_mortgage_data_base();

-- 4) Indexes: partial unique + lookups
create unique index if not exists uniq_user_property_base
  on public.user_properties(user_address, property_id)
  where user_address is not null and property_id is not null;

create index if not exists idx_user_props_user on public.user_properties(user_address);
create index if not exists idx_user_props_prop on public.user_properties(property_id);

-- 5) Backfill data safely

-- 5a) Lowercase user_address from legacy user_wallet_address
-- Only if we have a legacy value and user_address is null
update public.user_properties
set user_address = lower(user_wallet_address)
where user_address is null
  and user_wallet_address is not null;

-- 5b) Fill defaults for apr/term if missing
update public.user_properties
set apr_bps = coalesce(apr_bps, 800),
    term_months = coalesce(term_months, 120)
where (apr_bps is null or term_months is null);

-- 5c) Convert legacy decimals to base units using app_settings.money_scale
with ms as (
  select (select value::bigint from public.app_settings where key='money_scale') as scale
)
update public.user_properties up
set
  purchase_price_base = coalesce(up.purchase_price_base, round(up.purchase_price * ms.scale)::bigint),
  down_payment_base   = coalesce(up.down_payment_base,   round(up.down_payment   * ms.scale)::bigint)
from ms
where (up.purchase_price_base is null or up.down_payment_base is null)
  and up.purchase_price is not null
  and up.down_payment is not null;

-- 5d) Compute loan_amount_base from base-unit columns where missing
update public.user_properties
set loan_amount_base = purchase_price_base - down_payment_base
where loan_amount_base is null
  and purchase_price_base is not null
  and down_payment_base is not null;

-- 6) Optional sanity checks you can run after:
-- -- Min 20% down enforced?
-- with c as (
--   select id, purchase_price_base, down_payment_base
--   from public.user_properties
-- )
-- select count(*) as below_min_20pct
-- from c
-- where down_payment_base * 10000 < purchase_price_base * 2000;
--
-- -- Loan amount equals price - down?
-- select count(*) as loan_mismatch
-- from public.user_properties
-- where loan_amount_base <> (purchase_price_base - down_payment_base);
--
-- -- Negative balances (should be 0 because of GREATEST)
-- select count(*) as negative_balance
-- from public.user_properties
-- where remaining_balance_base < 0;

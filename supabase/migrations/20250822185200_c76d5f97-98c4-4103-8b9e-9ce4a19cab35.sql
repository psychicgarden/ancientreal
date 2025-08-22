-- Fix remaining functions with mutable search paths

-- Fix backfill_user_property_from_tx function (this one is long, so needs the fix)
CREATE OR REPLACE FUNCTION public.backfill_user_property_from_tx(_tx_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
  
  -- Mortgage calculation variables
  apr_decimal numeric;
  monthly_rate numeric;
  term_months_val integer;
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

  loan_amount := greatest(purchase_price - down_payment, 0);
  
  -- FIXED: Use proper compound interest amortization formula
  term_months_val := 120; -- Default term
  if loan_amount > 0 then
    apr_decimal := 0.08; -- 8% APR (800 bps)
    monthly_rate := apr_decimal / 12.0;
    
    if monthly_rate = 0 then
      monthly_payment := loan_amount / term_months_val;
    else
      -- Proper amortization formula: P * [r * (1 + r)^n] / [(1 + r)^n - 1]
      monthly_payment := loan_amount * (monthly_rate / (1 - power(1 + monthly_rate, -term_months_val)));
    end if;
  else
    monthly_payment := 0;
  end if;
  
  equity_pct := case when purchase_price > 0 then round((down_payment / purchase_price) * 100) else 0 end;

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
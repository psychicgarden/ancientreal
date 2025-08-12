
-- 1) Prevent duplicates: unique index by wallet + property name + location
CREATE UNIQUE INDEX IF NOT EXISTS ux_user_properties_wallet_name_location
  ON public.user_properties (user_wallet_address, property_name, property_location);

-- 2) Robust backfill for a single transaction (infers purchase price, normalizes metadata, upserts)
CREATE OR REPLACE FUNCTION public.backfill_user_property_from_tx(_tx_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  tx RECORD;
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
BEGIN
  SELECT * INTO tx
  FROM public.user_transactions
  WHERE id = _tx_id;

  IF NOT FOUND THEN
    RAISE NOTICE 'No transaction found for id %', _tx_id;
    RETURN;
  END IF;

  -- Only handle property purchases
  IF tx.transaction_type NOT IN ('purchase','property_purchase') OR tx.status <> 'completed' THEN
    RETURN;
  END IF;

  wallet := lower(coalesce(tx.user_wallet_address, ''));
  IF wallet = '' THEN
    RAISE NOTICE 'Transaction % has no wallet; skipping', _tx_id;
    RETURN;
  END IF;

  prop_name     := coalesce(tx.metadata->>'property_name', 'Unknown Property');
  prop_location := coalesce(tx.metadata->>'property_location', tx.metadata->>'location', 'Unknown Location');
  img_url       := coalesce(tx.metadata->>'image_url', '/placeholder.svg');
  tx_amount     := coalesce(tx.amount, 0);

  -- Prefer explicit values if present
  purchase_price := NULLIF(tx.metadata->>'propertyValue','')::numeric;
  IF purchase_price IS NULL THEN
    purchase_price := NULLIF(tx.metadata->>'purchase_price','')::numeric;
  END IF;

  -- If still unknown, assume amount is the down payment at 20% and derive total price
  IF purchase_price IS NULL OR purchase_price <= 0 THEN
    IF tx_amount IS NOT NULL AND tx_amount > 0 THEN
      purchase_price := round(tx_amount / 0.20);
    ELSE
      purchase_price := 0;
    END IF;
  END IF;

  -- Determine down payment
  down_payment := NULLIF(tx.metadata->>'downPayment','')::numeric;
  IF down_payment IS NULL OR down_payment <= 0 THEN
    IF tx.transaction_type = 'purchase' AND tx_amount > 0 THEN
      down_payment := tx_amount;
    ELSE
      down_payment := round(purchase_price * 0.20);
    END IF;
  END IF;

  -- Derived fields
  loan_amount     := greatest(purchase_price - down_payment, 0);
  -- simple monthly estimate @ ~5% annual of loan (kept consistent with prior logic)
  monthly_payment := (loan_amount * 0.05) / 12.0;
  equity_pct      := CASE WHEN purchase_price > 0 THEN round((down_payment / purchase_price) * 100) ELSE 0 END;

  -- Optional mapping to a property_id (kept lightweight; extend as needed)
  mapped_property_id := CASE
    WHEN lower(prop_name) LIKE '%art deco loft%'     THEN 1
    WHEN lower(prop_name) LIKE '%bahia%'             THEN 2
    WHEN lower(prop_name) LIKE '%ericeira%' OR lower(prop_name) LIKE '%oceanview%' THEN 3
    ELSE NULL
  END;

  -- Upsert into user_properties; ensure is_active when a completed purchase is processed
  INSERT INTO public.user_properties (
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
    -- base-unit fields
    user_address,
    property_id,
    currency,
    purchase_price_base,
    down_payment_base,
    loan_amount_base,
    apr_bps,
    term_months
  )
  VALUES (
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
    coalesce(tx.metadata->>'mortgage_id', NULL),
    wallet,
    mapped_property_id,
    'USDC-6',
    (purchase_price * 1000000)::bigint,
    (down_payment  * 1000000)::bigint,
    (loan_amount   * 1000000)::bigint,
    800,          -- 8.00% APR in bps
    120           -- 10-year term
  )
  ON CONFLICT (user_wallet_address, property_name, property_location)
  DO UPDATE SET
    image_url            = EXCLUDED.image_url,
    current_value        = EXCLUDED.current_value,
    monthly_payment      = EXCLUDED.monthly_payment,
    remaining_balance    = EXCLUDED.remaining_balance,
    equity_percentage    = EXCLUDED.equity_percentage,
    is_active            = true,
    mortgage_id          = COALESCE(EXCLUDED.mortgage_id, public.user_properties.mortgage_id),
    property_id          = COALESCE(EXCLUDED.property_id, public.user_properties.property_id),
    purchase_price_base  = EXCLUDED.purchase_price_base,
    down_payment_base    = EXCLUDED.down_payment_base,
    loan_amount_base     = EXCLUDED.loan_amount_base,
    apr_bps              = EXCLUDED.apr_bps,
    term_months          = EXCLUDED.term_months,
    updated_at           = now();

END;
$$;

-- 3) Trigger to auto-backfill for each new transaction
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'after_user_tx_backfill'
  ) THEN
    DROP TRIGGER after_user_tx_backfill ON public.user_transactions;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.trg_after_user_tx_backfill()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  PERFORM public.backfill_user_property_from_tx(NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER after_user_tx_backfill
AFTER INSERT ON public.user_transactions
FOR EACH ROW
EXECUTE FUNCTION public.trg_after_user_tx_backfill();

-- 4) Historical backfill for existing rows
SELECT public.backfill_user_property_from_tx(id)
FROM public.user_transactions
WHERE transaction_type IN ('purchase','property_purchase')
  AND status = 'completed';

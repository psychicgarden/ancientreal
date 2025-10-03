-- =========================================
-- PORTFOLIO DATA ACCESS FIX
-- =========================================
-- This migration fixes the portfolio display by:
-- 1. Creating triggers to auto-populate user_properties
-- 2. Creating a secure RPC to fetch portfolio data
-- 3. Adding performance indexes
-- =========================================

-- Step 1: Create triggers to auto-populate user_properties from transactions
DROP TRIGGER IF EXISTS user_tx_after_insert_backfill ON public.user_transactions;
CREATE TRIGGER user_tx_after_insert_backfill
  AFTER INSERT ON public.user_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_after_user_tx_insert();

-- Step 2: Create trigger to sync mortgage payment ledger to user_properties
DROP TRIGGER IF EXISTS mpl_after_insert_sync ON public.mortgage_payments_ledger;
CREATE TRIGGER mpl_after_insert_sync
  AFTER INSERT ON public.mortgage_payments_ledger
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_payment_to_user_properties();

-- Step 3: Create secure RPC function to fetch user portfolio
CREATE OR REPLACE FUNCTION public.get_user_portfolio(wallet text)
RETURNS TABLE (
  id uuid,
  user_wallet_address text,
  user_address text,
  property_name text,
  property_location text,
  image_url text,
  purchase_price numeric,
  down_payment numeric,
  current_value numeric,
  monthly_payment numeric,
  remaining_balance numeric,
  equity_percentage numeric,
  is_active boolean,
  mortgage_id text,
  property_id bigint,
  currency text,
  purchase_price_base bigint,
  down_payment_base bigint,
  loan_amount_base bigint,
  apr_bps integer,
  term_months integer,
  unique_purchase_key text,
  principal_paid_base bigint,
  interest_paid_base bigint,
  remaining_balance_base bigint,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    up.user_wallet_address,
    up.user_address,
    up.property_name,
    up.property_location,
    up.image_url,
    up.purchase_price,
    up.down_payment,
    COALESCE(up.current_value, up.purchase_price) as current_value,
    COALESCE(
      up.monthly_payment,
      public.calculate_monthly_payment(
        up.purchase_price - up.down_payment,
        COALESCE(up.apr_bps, 800),
        COALESCE(up.term_months, 120)
      )
    ) as monthly_payment,
    COALESCE(
      up.remaining_balance,
      up.purchase_price - up.down_payment
    ) as remaining_balance,
    COALESCE(
      up.equity_percentage,
      CASE 
        WHEN up.purchase_price > 0 THEN (up.down_payment / up.purchase_price) * 100
        ELSE 0
      END
    ) as equity_percentage,
    up.is_active,
    up.mortgage_id,
    up.property_id,
    up.currency,
    up.purchase_price_base,
    up.down_payment_base,
    up.loan_amount_base,
    COALESCE(up.apr_bps, 800) as apr_bps,
    COALESCE(up.term_months, 120) as term_months,
    up.unique_purchase_key,
    COALESCE(up.principal_paid_base, 0) as principal_paid_base,
    COALESCE(up.interest_paid_base, 0) as interest_paid_base,
    up.remaining_balance_base,
    up.created_at,
    up.updated_at
  FROM public.user_properties up
  WHERE lower(up.user_wallet_address) = lower(wallet)
     OR lower(up.user_address) = lower(wallet)
  ORDER BY up.created_at DESC;
END;
$$;

-- Step 4: Add performance index on lowercase wallet address
CREATE INDEX IF NOT EXISTS idx_user_properties_wallet_lower 
  ON public.user_properties (lower(user_wallet_address));

CREATE INDEX IF NOT EXISTS idx_user_properties_address_lower 
  ON public.user_properties (lower(user_address));

-- Step 5: Enable realtime for user_properties and user_transactions
ALTER TABLE public.user_properties REPLICA IDENTITY FULL;
ALTER TABLE public.user_transactions REPLICA IDENTITY FULL;

-- Add tables to realtime publication if not already added
DO $$
BEGIN
  -- Check and add user_properties
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'user_properties'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_properties;
  END IF;

  -- Check and add user_transactions
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'user_transactions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_transactions;
  END IF;
END $$;
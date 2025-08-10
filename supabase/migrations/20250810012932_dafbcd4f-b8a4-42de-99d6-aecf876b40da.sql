
-- 1) Clean slate: delete all data for this wallet
-- Target wallet (from your logs)
DO $$
DECLARE
  v_wallet text := lower('0x966fed85116f6d283921a6ed176d7643a99cbf94');
BEGIN
  -- Secondary market (if any)
  DELETE FROM public.secondary_trades
   WHERE lower(buyer_wallet_address) = v_wallet
      OR lower(seller_wallet_address) = v_wallet;

  DELETE FROM public.secondary_orders
   WHERE lower(owner_wallet_address) = v_wallet;

  -- Fractional investments + rental claims (if any)
  DELETE FROM public.investor_rental_claims
   WHERE lower(investor_wallet_address) = v_wallet;

  DELETE FROM public.fractional_investments
   WHERE lower(investor_wallet_address) = v_wallet;

  -- Payments
  DELETE FROM public.payment_history
   WHERE lower(user_wallet_address) = v_wallet;

  -- Developer investments
  DELETE FROM public.developer_investments
   WHERE lower(user_wallet_address) = v_wallet;

  -- Transactions (log)
  DELETE FROM public.user_transactions
   WHERE lower(user_wallet_address) = v_wallet;

  -- User properties (Portfolio)
  DELETE FROM public.user_properties
   WHERE lower(user_wallet_address) = v_wallet;
END $$;

-- 2) Wallet normalization triggers (lowercase on insert/update)

-- Helper: make-safe creation of trigger (utility block)
-- NOTE: Postgres doesn't support CREATE TRIGGER IF NOT EXISTS, so we guard with pg_trigger lookup.

-- user_properties (user_wallet_address)
CREATE OR REPLACE FUNCTION public.normalize_wallet_user_properties()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.user_wallet_address IS NOT NULL THEN
    NEW.user_wallet_address := lower(NEW.user_wallet_address);
  END IF;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_normalize_wallet_user_properties'
  ) THEN
    CREATE TRIGGER trg_normalize_wallet_user_properties
    BEFORE INSERT OR UPDATE ON public.user_properties
    FOR EACH ROW EXECUTE FUNCTION public.normalize_wallet_user_properties();
  END IF;
END $$;

-- user_transactions (user_wallet_address)
CREATE OR REPLACE FUNCTION public.normalize_wallet_user_transactions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.user_wallet_address IS NOT NULL THEN
    NEW.user_wallet_address := lower(NEW.user_wallet_address);
  END IF;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_normalize_wallet_user_transactions'
  ) THEN
    CREATE TRIGGER trg_normalize_wallet_user_transactions
    BEFORE INSERT OR UPDATE ON public.user_transactions
    FOR EACH ROW EXECUTE FUNCTION public.normalize_wallet_user_transactions();
  END IF;
END $$;

-- developer_investments (user_wallet_address)
CREATE OR REPLACE FUNCTION public.normalize_wallet_developer_investments()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.user_wallet_address IS NOT NULL THEN
    NEW.user_wallet_address := lower(NEW.user_wallet_address);
  END IF;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_normalize_wallet_developer_investments'
  ) THEN
    CREATE TRIGGER trg_normalize_wallet_developer_investments
    BEFORE INSERT OR UPDATE ON public.developer_investments
    FOR EACH ROW EXECUTE FUNCTION public.normalize_wallet_developer_investments();
  END IF;
END $$;

-- fractional_investments (investor_wallet_address)
CREATE OR REPLACE FUNCTION public.normalize_wallet_fractional_investments()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.investor_wallet_address IS NOT NULL THEN
    NEW.investor_wallet_address := lower(NEW.investor_wallet_address);
  END IF;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_normalize_wallet_fractional_investments'
  ) THEN
    CREATE TRIGGER trg_normalize_wallet_fractional_investments
    BEFORE INSERT OR UPDATE ON public.fractional_investments
    FOR EACH ROW EXECUTE FUNCTION public.normalize_wallet_fractional_investments();
  END IF;
END $$;

-- payment_history (user_wallet_address)
CREATE OR REPLACE FUNCTION public.normalize_wallet_payment_history()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.user_wallet_address IS NOT NULL THEN
    NEW.user_wallet_address := lower(NEW.user_wallet_address);
  END IF;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_normalize_wallet_payment_history'
  ) THEN
    CREATE TRIGGER trg_normalize_wallet_payment_history
    BEFORE INSERT OR UPDATE ON public.payment_history
    FOR EACH ROW EXECUTE FUNCTION public.normalize_wallet_payment_history();
  END IF;
END $$;

-- secondary_orders (owner_wallet_address)
CREATE OR REPLACE FUNCTION public.normalize_wallet_secondary_orders()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.owner_wallet_address IS NOT NULL THEN
    NEW.owner_wallet_address := lower(NEW.owner_wallet_address);
  END IF;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_normalize_wallet_secondary_orders'
  ) THEN
    CREATE TRIGGER trg_normalize_wallet_secondary_orders
    BEFORE INSERT OR UPDATE ON public.secondary_orders
    FOR EACH ROW EXECUTE FUNCTION public.normalize_wallet_secondary_orders();
  END IF;
END $$;

-- secondary_trades (buyer_wallet_address, seller_wallet_address)
CREATE OR REPLACE FUNCTION public.normalize_wallet_secondary_trades()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.buyer_wallet_address IS NOT NULL THEN
    NEW.buyer_wallet_address := lower(NEW.buyer_wallet_address);
  END IF;
  IF NEW.seller_wallet_address IS NOT NULL THEN
    NEW.seller_wallet_address := lower(NEW.seller_wallet_address);
  END IF;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_normalize_wallet_secondary_trades'
  ) THEN
    CREATE TRIGGER trg_normalize_wallet_secondary_trades
    BEFORE INSERT OR UPDATE ON public.secondary_trades
    FOR EACH ROW EXECUTE FUNCTION public.normalize_wallet_secondary_trades();
  END IF;
END $$;

-- investor_rental_claims (investor_wallet_address)
CREATE OR REPLACE FUNCTION public.normalize_wallet_investor_rental_claims()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.investor_wallet_address IS NOT NULL THEN
    NEW.investor_wallet_address := lower(NEW.investor_wallet_address);
  END IF;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_normalize_wallet_investor_rental_claims'
  ) THEN
    CREATE TRIGGER trg_normalize_wallet_investor_rental_claims
    BEFORE INSERT OR UPDATE ON public.investor_rental_claims
    FOR EACH ROW EXECUTE FUNCTION public.normalize_wallet_investor_rental_claims();
  END IF;
END $$;

-- 3) Backfill normalization (lowercase any existing data)
UPDATE public.user_properties SET user_wallet_address = lower(user_wallet_address) WHERE user_wallet_address IS NOT NULL;
UPDATE public.user_transactions SET user_wallet_address = lower(user_wallet_address) WHERE user_wallet_address IS NOT NULL;
UPDATE public.developer_investments SET user_wallet_address = lower(user_wallet_address) WHERE user_wallet_address IS NOT NULL;
UPDATE public.fractional_investments SET investor_wallet_address = lower(investor_wallet_address) WHERE investor_wallet_address IS NOT NULL;
UPDATE public.payment_history SET user_wallet_address = lower(user_wallet_address) WHERE user_wallet_address IS NOT NULL;
UPDATE public.secondary_orders SET owner_wallet_address = lower(owner_wallet_address) WHERE owner_wallet_address IS NOT NULL;
UPDATE public.secondary_trades SET buyer_wallet_address = lower(buyer_wallet_address) WHERE buyer_wallet_address IS NOT NULL;
UPDATE public.secondary_trades SET seller_wallet_address = lower(seller_wallet_address) WHERE seller_wallet_address IS NOT NULL;
UPDATE public.investor_rental_claims SET investor_wallet_address = lower(investor_wallet_address) WHERE investor_wallet_address IS NOT NULL;

-- 4) Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_properties_wallet ON public.user_properties (user_wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_transactions_wallet ON public.user_transactions (user_wallet_address);
CREATE INDEX IF NOT EXISTS idx_developer_investments_wallet ON public.developer_investments (user_wallet_address);
CREATE INDEX IF NOT EXISTS idx_fractional_investments_investor ON public.fractional_investments (investor_wallet_address);
CREATE INDEX IF NOT EXISTS idx_payment_history_wallet ON public.payment_history (user_wallet_address);
CREATE INDEX IF NOT EXISTS idx_secondary_orders_owner ON public.secondary_orders (owner_wallet_address);
CREATE INDEX IF NOT EXISTS idx_secondary_trades_buyer ON public.secondary_trades (buyer_wallet_address);
CREATE INDEX IF NOT EXISTS idx_secondary_trades_seller ON public.secondary_trades (seller_wallet_address);
CREATE INDEX IF NOT EXISTS idx_investor_rental_claims_investor ON public.investor_rental_claims (investor_wallet_address);

-- 5) Realtime hygiene: ensure full row data + publication
ALTER TABLE public.user_properties REPLICA IDENTITY FULL;
ALTER TABLE public.user_transactions REPLICA IDENTITY FULL;
ALTER TABLE public.developer_investments REPLICA IDENTITY FULL;

-- Publish tables to supabase_realtime (safe no-op if already added)
SELECT supabase_realtime.add_table(schema := 'public', table_name := 'user_properties');
SELECT supabase_realtime.add_table(schema := 'public', table_name := 'user_transactions');
SELECT supabase_realtime.add_table(schema := 'public', table_name := 'developer_investments');

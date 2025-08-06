-- Create table for secondary market orders
CREATE TABLE IF NOT EXISTS public.secondary_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_fractionalization_id UUID NOT NULL,
  order_type TEXT NOT NULL, -- 'buy' or 'sell'
  price_per_token NUMERIC NOT NULL,
  token_amount NUMERIC NOT NULL,
  tokens_filled NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open', -- open, partially_filled, filled, cancelled
  owner_wallet_address TEXT NOT NULL,
  expiry TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_secondary_orders_property ON public.secondary_orders (property_fractionalization_id);
CREATE INDEX IF NOT EXISTS idx_secondary_orders_status ON public.secondary_orders (status);

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS trg_secondary_orders_updated_at ON public.secondary_orders;
CREATE TRIGGER trg_secondary_orders_updated_at
BEFORE UPDATE ON public.secondary_orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS and basic policies (public read; simple writes)
ALTER TABLE public.secondary_orders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'secondary_orders' AND policyname = 'Secondary orders are viewable by everyone'
  ) THEN
    CREATE POLICY "Secondary orders are viewable by everyone"
    ON public.secondary_orders FOR SELECT
    USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'secondary_orders' AND policyname = 'Users can create secondary orders'
  ) THEN
    CREATE POLICY "Users can create secondary orders"
    ON public.secondary_orders FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'secondary_orders' AND policyname = 'Users can update secondary orders'
  ) THEN
    CREATE POLICY "Users can update secondary orders"
    ON public.secondary_orders FOR UPDATE
    USING (true);
  END IF;
END $$;

-- Create table for executed trades
CREATE TABLE IF NOT EXISTS public.secondary_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  property_fractionalization_id UUID NOT NULL,
  buyer_wallet_address TEXT NOT NULL,
  seller_wallet_address TEXT NOT NULL,
  token_amount NUMERIC NOT NULL,
  price_per_token NUMERIC NOT NULL,
  total_cost NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  transaction_hash TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_secondary_trades_order ON public.secondary_trades (order_id);
CREATE INDEX IF NOT EXISTS idx_secondary_trades_property ON public.secondary_trades (property_fractionalization_id);
CREATE INDEX IF NOT EXISTS idx_secondary_trades_buyer ON public.secondary_trades (buyer_wallet_address);
CREATE INDEX IF NOT EXISTS idx_secondary_trades_seller ON public.secondary_trades (seller_wallet_address);

DROP TRIGGER IF EXISTS trg_secondary_trades_updated_at ON public.secondary_trades;
CREATE TRIGGER trg_secondary_trades_updated_at
BEFORE UPDATE ON public.secondary_trades
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.secondary_trades ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'secondary_trades' AND policyname = 'Secondary trades are viewable by everyone'
  ) THEN
    CREATE POLICY "Secondary trades are viewable by everyone"
    ON public.secondary_trades FOR SELECT
    USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'secondary_trades' AND policyname = 'Users can create secondary trades'
  ) THEN
    CREATE POLICY "Users can create secondary trades"
    ON public.secondary_trades FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'secondary_trades' AND policyname = 'Users can update secondary trades'
  ) THEN
    CREATE POLICY "Users can update secondary trades"
    ON public.secondary_trades FOR UPDATE
    USING (true);
  END IF;
END $$;
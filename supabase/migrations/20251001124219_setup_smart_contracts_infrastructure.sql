/*
  # Smart Contracts Infrastructure Setup
  
  1. New Tables
    - `contract_addresses` - Stores deployed smart contract addresses
    - `contract_event_cursors` - Tracks blockchain event indexing progress
    - `user_properties` - Property ownership records (if not exists)
    - `mortgage_payments_ledger` - Payment history tracking
    - `user_transactions` - Transaction history
    - `app_settings` - System configuration
    
  2. Security
    - Enable RLS on all tables
    - Add restrictive policies for user data
    - Allow public read for contract addresses
    
  3. Functions
    - `apply_mortgage_payment` - Updates property balance after payment
    - `update_updated_at_column` - Timestamp trigger function
*/

-- Create update timestamp function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create app_settings table for configuration
CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default settings
INSERT INTO public.app_settings (key, value, description)
VALUES
  ('avax_to_usd_ratio', '100000000', 'Test environment: 1 AVAX = $100M USD for easy testing'),
  ('min_down_pct_bps', '2000', 'Minimum down payment: 20% (2000 basis points)')
ON CONFLICT (key) DO NOTHING;

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "App settings are viewable by everyone"
ON public.app_settings FOR SELECT USING (true);

CREATE POLICY "Only service role can manage app settings"
ON public.app_settings FOR ALL
USING (current_setting('request.jwt.claim.role', true) = 'service_role')
WITH CHECK (current_setting('request.jwt.claim.role', true) = 'service_role');

-- Create contract_addresses table
CREATE TABLE IF NOT EXISTS public.contract_addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_name TEXT NOT NULL,
  network TEXT NOT NULL DEFAULT 'fuji',
  address TEXT NOT NULL,
  deployment_tx_hash TEXT,
  deployed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  deployer_address TEXT,
  gas_used BIGINT,
  deployment_status TEXT NOT NULL DEFAULT 'deployed',
  abi_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(contract_name, network)
);

ALTER TABLE public.contract_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contract addresses are viewable by everyone"
ON public.contract_addresses FOR SELECT USING (true);

CREATE POLICY "Only service role can manage contract addresses"
ON public.contract_addresses FOR ALL
USING (current_setting('request.jwt.claim.role', true) = 'service_role')
WITH CHECK (current_setting('request.jwt.claim.role', true) = 'service_role');

CREATE TRIGGER update_contract_addresses_updated_at
BEFORE UPDATE ON public.contract_addresses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create contract_event_cursors table  
CREATE TABLE IF NOT EXISTS public.contract_event_cursors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_address TEXT NOT NULL,
  network TEXT NOT NULL DEFAULT 'fuji',
  event_name TEXT NOT NULL,
  last_block_scanned BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(contract_address, network, event_name)
);

ALTER TABLE public.contract_event_cursors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event cursors are viewable by everyone"
ON public.contract_event_cursors FOR SELECT USING (true);

CREATE POLICY "Only service role can manage event cursors"
ON public.contract_event_cursors FOR ALL
USING (current_setting('request.jwt.claim.role', true) = 'service_role')
WITH CHECK (current_setting('request.jwt.claim.role', true) = 'service_role');

-- Create user_properties table
CREATE TABLE IF NOT EXISTS public.user_properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_wallet_address TEXT,
  user_address TEXT,
  property_id INTEGER,
  property_name TEXT NOT NULL,
  property_location TEXT NOT NULL,
  purchase_price NUMERIC,
  down_payment NUMERIC,
  loan_amount NUMERIC,
  remaining_balance NUMERIC,
  monthly_payment NUMERIC,
  purchase_price_base BIGINT,
  down_payment_base BIGINT,
  loan_amount_base BIGINT,
  principal_paid_base BIGINT DEFAULT 0,
  interest_paid_base BIGINT DEFAULT 0,
  apr_bps INTEGER DEFAULT 800,
  term_months INTEGER DEFAULT 120,
  image_url TEXT,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  unique_purchase_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view user properties"
ON public.user_properties FOR SELECT USING (true);

CREATE POLICY "Service role has full access to user properties"
ON public.user_properties FOR ALL
USING (current_setting('request.jwt.claim.role', true) = 'service_role')
WITH CHECK (current_setting('request.jwt.claim.role', true) = 'service_role');

CREATE INDEX IF NOT EXISTS idx_user_properties_wallet_address
ON public.user_properties (lower(user_wallet_address));

CREATE INDEX IF NOT EXISTS idx_user_properties_user_address
ON public.user_properties (lower(user_address));

CREATE INDEX IF NOT EXISTS idx_user_properties_property_id
ON public.user_properties (property_id);

CREATE TRIGGER update_user_properties_updated_at
BEFORE UPDATE ON public.user_properties
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create mortgage_payments_ledger table
CREATE TABLE IF NOT EXISTS public.mortgage_payments_ledger (
  id SERIAL PRIMARY KEY,
  user_address TEXT NOT NULL,
  property_id INTEGER NOT NULL,
  principal_delta_base BIGINT NOT NULL DEFAULT 0,
  interest_delta_base BIGINT NOT NULL DEFAULT 0,
  tx_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.mortgage_payments_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view payment ledger"
ON public.mortgage_payments_ledger FOR SELECT USING (true);

CREATE POLICY "Service role has full access to payment ledger"
ON public.mortgage_payments_ledger FOR ALL
USING (current_setting('request.jwt.claim.role', true) = 'service_role')
WITH CHECK (current_setting('request.jwt.claim.role', true) = 'service_role');

CREATE INDEX IF NOT EXISTS idx_mortgage_payments_user_address
ON public.mortgage_payments_ledger (lower(user_address));

CREATE INDEX IF NOT EXISTS idx_mortgage_payments_tx_hash
ON public.mortgage_payments_ledger (tx_hash);

-- Create user_transactions table
CREATE TABLE IF NOT EXISTS public.user_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_wallet_address TEXT NOT NULL,
  transaction_type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  transaction_hash TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
ON public.user_transactions FOR SELECT USING (true);

CREATE POLICY "Service role has full access to transactions"
ON public.user_transactions FOR ALL
USING (current_setting('request.jwt.claim.role', true) = 'service_role')
WITH CHECK (current_setting('request.jwt.claim.role', true) = 'service_role');

-- Create apply_mortgage_payment function
CREATE OR REPLACE FUNCTION public.apply_mortgage_payment(
  p_user_address TEXT,
  p_property_id INTEGER,
  p_principal_delta_base BIGINT,
  p_interest_delta_base BIGINT,
  p_tx_hash TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  v_row public.user_properties%rowtype;
BEGIN
  p_user_address := lower(p_user_address);

  SELECT * INTO v_row
  FROM public.user_properties
  WHERE lower(user_address) = p_user_address
    AND property_id = p_property_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'user_properties row not found for % / %', p_user_address, p_property_id;
  END IF;

  UPDATE public.user_properties
  SET principal_paid_base = COALESCE(principal_paid_base, 0) + COALESCE(p_principal_delta_base, 0),
      interest_paid_base = COALESCE(interest_paid_base, 0) + COALESCE(p_interest_delta_base, 0),
      updated_at = now()
  WHERE lower(user_address) = p_user_address
    AND property_id = p_property_id;

  RETURN json_build_object(
    'ok', true,
    'user_address', p_user_address,
    'property_id', p_property_id,
    'principal_delta_base', p_principal_delta_base,
    'interest_delta_base', p_interest_delta_base,
    'tx_hash', p_tx_hash
  );
END
$$;

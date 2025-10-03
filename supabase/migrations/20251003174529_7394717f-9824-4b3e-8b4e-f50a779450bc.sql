-- Fix RLS policies for wallet-based authentication (no JWT)
-- This allows the demo to work with MetaMask wallet connections

-- Drop existing restrictive policies on platform_fees
DROP POLICY IF EXISTS "Users can create their own platform fee records" ON public.platform_fees;
DROP POLICY IF EXISTS "Users can view their own platform fees" ON public.platform_fees;
DROP POLICY IF EXISTS "System can update platform fee status" ON public.platform_fees;

-- Create new permissive policies for platform_fees (wallet-based auth)
CREATE POLICY "Anyone can create platform fees" 
ON public.platform_fees 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view platform fees" 
ON public.platform_fees 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update platform fees" 
ON public.platform_fees 
FOR UPDATE 
USING (true);

-- Ensure trigger exists on user_transactions to auto-create user_properties
DROP TRIGGER IF EXISTS trg_user_tx_after_insert_backfill ON public.user_transactions;

CREATE TRIGGER trg_user_tx_after_insert_backfill
  AFTER INSERT ON public.user_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_after_user_tx_insert();

-- Ensure trigger exists on mortgage_payments_ledger to update user_properties
DROP TRIGGER IF EXISTS trg_sync_payment_to_user_properties ON public.mortgage_payments_ledger;

CREATE TRIGGER trg_sync_payment_to_user_properties
  AFTER INSERT ON public.mortgage_payments_ledger
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_payment_to_user_properties();

-- Add helpful indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_properties_wallet_active 
ON public.user_properties(user_wallet_address, is_active) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_user_transactions_wallet_type 
ON public.user_transactions(user_wallet_address, transaction_type, status);

CREATE INDEX IF NOT EXISTS idx_mortgage_payments_user_property 
ON public.mortgage_payments_ledger(user_address, property_id);
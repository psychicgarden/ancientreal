-- Fix RLS policies to allow demo mode access for staking
-- Update user_staking RLS policies to allow demo wallet access
DROP POLICY IF EXISTS "Users can create their own staking data" ON public.user_staking;
DROP POLICY IF EXISTS "Users can update their own staking data" ON public.user_staking;
DROP POLICY IF EXISTS "Users can view their own staking data" ON public.user_staking;

CREATE POLICY "Users can create their own staking data" ON public.user_staking
FOR INSERT WITH CHECK (
  lower(user_wallet_address) = lower(COALESCE(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text), '')) 
  OR lower(user_wallet_address) = '0x966fed85116f6d283921a6ed176d7643a99cbf94'
);

CREATE POLICY "Users can update their own staking data" ON public.user_staking
FOR UPDATE USING (
  lower(user_wallet_address) = lower(COALESCE(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text), '')) 
  OR lower(user_wallet_address) = '0x966fed85116f6d283921a6ed176d7643a99cbf94'
);

CREATE POLICY "Users can view their own staking data" ON public.user_staking
FOR SELECT USING (
  lower(user_wallet_address) = lower(COALESCE(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text), '')) 
  OR lower(user_wallet_address) = '0x966fed85116f6d283921a6ed176d7643a99cbf94'
);

-- Update staking_transactions RLS policies to allow demo wallet access
-- (These already have demo wallet access, but let's ensure consistency)
DROP POLICY IF EXISTS "Users can create their own staking transactions" ON public.staking_transactions;
DROP POLICY IF EXISTS "Users can view their own staking transactions" ON public.staking_transactions;

CREATE POLICY "Users can create their own staking transactions" ON public.staking_transactions
FOR INSERT WITH CHECK (
  lower(user_wallet_address) = lower(COALESCE(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text), '')) 
  OR lower(user_wallet_address) = '0x966fed85116f6d283921a6ed176d7643a99cbf94'
);

CREATE POLICY "Users can view their own staking transactions" ON public.staking_transactions
FOR SELECT USING (
  lower(user_wallet_address) = lower(COALESCE(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text), '')) 
  OR lower(user_wallet_address) = '0x966fed85116f6d283921a6ed176d7643a99cbf94'
);

-- Ensure system can update transaction status (this already exists but let's be explicit)
DROP POLICY IF EXISTS "System can update staking transaction status" ON public.staking_transactions;
CREATE POLICY "System can update staking transaction status" ON public.staking_transactions
FOR UPDATE USING (true);
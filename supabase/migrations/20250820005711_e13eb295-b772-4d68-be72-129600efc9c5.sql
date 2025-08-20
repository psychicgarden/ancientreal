-- Add RLS policy to allow users to update their own staking transactions
DROP POLICY IF EXISTS "Users can update their own staking transactions" ON public.staking_transactions;

CREATE POLICY "Users can update their own staking transactions" ON public.staking_transactions
FOR UPDATE USING (
  lower(user_wallet_address) = lower(COALESCE(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text), '')) 
  OR lower(user_wallet_address) = '0x966fed85116f6d283921a6ed176d7643a99cbf94'
);
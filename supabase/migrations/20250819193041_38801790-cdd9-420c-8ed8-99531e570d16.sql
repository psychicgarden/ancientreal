-- Update RLS policies for staking tables to support demo mode

-- Drop all existing staking policies
DROP POLICY IF EXISTS "Users can create their own staking transactions" ON staking_transactions;
DROP POLICY IF EXISTS "Users can view their own staking transactions" ON staking_transactions;
DROP POLICY IF EXISTS "System can update staking transaction status" ON staking_transactions;
DROP POLICY IF EXISTS "Users can create their own staking records" ON user_staking;
DROP POLICY IF EXISTS "Users can view their own staking records" ON user_staking;
DROP POLICY IF EXISTS "Users can update their own staking records" ON user_staking;

-- Recreate policies with demo mode support for staking_transactions
CREATE POLICY "Users can create their own staking transactions" 
ON staking_transactions 
FOR INSERT 
WITH CHECK (
  lower(user_wallet_address) = lower(COALESCE(
    (current_setting('request.jwt.claims', true))::json ->> 'wallet_address',
    ''
  )) 
  OR lower(user_wallet_address) = '0x966fed85116f6d283921a6ed176d7643a99cbf94'
);

CREATE POLICY "Users can view their own staking transactions" 
ON staking_transactions 
FOR SELECT 
USING (
  lower(user_wallet_address) = lower(COALESCE(
    (current_setting('request.jwt.claims', true))::json ->> 'wallet_address',
    ''
  )) 
  OR lower(user_wallet_address) = '0x966fed85116f6d283921a6ed176d7643a99cbf94'
);

CREATE POLICY "System can update staking transaction status" 
ON staking_transactions 
FOR UPDATE 
USING (true);

-- Recreate policies with demo mode support for user_staking
CREATE POLICY "Users can view their own staking records" 
ON user_staking 
FOR SELECT 
USING (
  lower(user_wallet_address) = lower(COALESCE(
    (current_setting('request.jwt.claims', true))::json ->> 'wallet_address',
    ''
  )) 
  OR lower(user_wallet_address) = '0x966fed85116f6d283921a6ed176d7643a99cbf94'
);

CREATE POLICY "Users can create their own staking records" 
ON user_staking 
FOR INSERT 
WITH CHECK (
  lower(user_wallet_address) = lower(COALESCE(
    (current_setting('request.jwt.claims', true))::json ->> 'wallet_address',
    ''
  )) 
  OR lower(user_wallet_address) = '0x966fed85116f6d283921a6ed176d7643a99cbf94'
);

CREATE POLICY "Users can update their own staking records" 
ON user_staking 
FOR UPDATE 
USING (
  lower(user_wallet_address) = lower(COALESCE(
    (current_setting('request.jwt.claims', true))::json ->> 'wallet_address',
    ''
  )) 
  OR lower(user_wallet_address) = '0x966fed85116f6d283921a6ed176d7643a99cbf94'
);
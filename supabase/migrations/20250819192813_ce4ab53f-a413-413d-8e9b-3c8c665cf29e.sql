-- Update RLS policies for staking tables to support demo mode

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can create their own staking transactions" ON staking_transactions;
DROP POLICY IF EXISTS "Users can view their own staking transactions" ON staking_transactions;
DROP POLICY IF EXISTS "Users can update their own staking records" ON user_staking;
DROP POLICY IF EXISTS "Users can view their own staking records" ON user_staking;

-- Recreate policies with demo mode support
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

-- Insert demo staking data if it doesn't exist
INSERT INTO user_staking (
  user_wallet_address,
  total_staked,
  total_earned,
  current_apy,
  is_active
) VALUES (
  '0x966fed85116f6d283921a6ed176d7643a99cbf94',
  5000.00,
  245.50,
  8.0,
  true
) ON CONFLICT (user_wallet_address) DO UPDATE SET
  total_staked = EXCLUDED.total_staked,
  total_earned = EXCLUDED.total_earned,
  updated_at = now();

-- Insert demo transactions
INSERT INTO staking_transactions (
  user_wallet_address,
  transaction_type,
  amount,
  status,
  created_at
) VALUES 
(
  '0x966fed85116f6d283921a6ed176d7643a99cbf94',
  'deposit',
  5000.00,
  'completed',
  now() - interval '30 days'
),
(
  '0x966fed85116f6d283921a6ed176d7643a99cbf94',
  'yield',
  12.25,
  'completed',
  now() - interval '10 days'
),
(
  '0x966fed85116f6d283921a6ed176d7643a99cbf94',
  'yield',
  11.98,
  'completed',
  now() - interval '5 days'
) ON CONFLICT DO NOTHING;
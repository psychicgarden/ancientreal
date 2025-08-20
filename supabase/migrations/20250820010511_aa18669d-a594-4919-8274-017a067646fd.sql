-- Clean up duplicate staking records and prevent future duplicates

-- Step 1: Create a temporary table with consolidated staking data
CREATE TEMP TABLE consolidated_staking AS
SELECT 
  user_wallet_address,
  SUM(total_staked) as total_staked,
  SUM(total_earned) as total_earned,
  MAX(current_apy) as current_apy, -- Use the highest APY
  MAX(last_yield_calculation) as last_yield_calculation, -- Use the most recent calculation
  bool_or(is_active) as is_active, -- Active if any record is active
  MIN(created_at) as created_at, -- Keep the earliest creation date
  MAX(updated_at) as updated_at -- Keep the latest update date
FROM public.user_staking
GROUP BY user_wallet_address
HAVING COUNT(*) > 0;

-- Step 2: Delete all existing staking records
DELETE FROM public.user_staking;

-- Step 3: Insert consolidated records back
INSERT INTO public.user_staking (
  user_wallet_address,
  total_staked,
  total_earned,
  current_apy,
  last_yield_calculation,
  is_active,
  created_at,
  updated_at
)
SELECT 
  user_wallet_address,
  total_staked,
  total_earned,
  current_apy,
  last_yield_calculation,
  is_active,
  created_at,
  updated_at
FROM consolidated_staking;

-- Step 4: Add unique constraint to prevent future duplicates
ALTER TABLE public.user_staking 
ADD CONSTRAINT unique_user_wallet_staking 
UNIQUE (user_wallet_address);
-- Clean up stale payment records and reset payment tracking
-- This will fix the $700 payment display issue

-- Delete stale payment records from ledger
DELETE FROM public.mortgage_payments_ledger 
WHERE user_address IN (
  SELECT DISTINCT user_address 
  FROM public.user_properties 
  WHERE user_address IS NOT NULL
);

-- Reset payment tracking in user_properties to 0
UPDATE public.user_properties 
SET 
  principal_paid_base = 0,
  interest_paid_base = 0,
  updated_at = now()
WHERE user_address IS NOT NULL;

-- Also clean any recent payment history that might be stale
DELETE FROM public.payment_history 
WHERE user_wallet_address IN (
  SELECT DISTINCT user_wallet_address 
  FROM public.user_properties 
  WHERE user_wallet_address IS NOT NULL
);
-- Portfolio Reset SQL Script for wallet: 0x966fed85116f6d283921a6ed176d7643a99cbf94

-- Start transaction
BEGIN;

-- Step 1: Handle foreign key constraints first
-- Update property_fractionalization to remove references to user_properties we're about to delete
UPDATE public.property_fractionalization 
SET source_property_id = NULL, updated_at = now()
WHERE source_property_id IN (
    SELECT id FROM public.user_properties 
    WHERE lower(user_wallet_address) = lower('0x966fed85116f6d283921a6ed176d7643a99cbf94') 
       OR lower(user_address) = lower('0x966fed85116f6d283921a6ed176d7643a99cbf94')
);

-- Step 2: Delete fractional investments
DELETE FROM public.fractional_investments
WHERE lower(investor_wallet_address) = lower('0x966fed85116f6d283921a6ed176d7643a99cbf94');

-- Step 3: Delete user transactions  
DELETE FROM public.user_transactions
WHERE lower(user_wallet_address) = lower('0x966fed85116f6d283921a6ed176d7643a99cbf94');

-- Step 4: Delete user properties (now safe from foreign key constraints)
DELETE FROM public.user_properties
WHERE lower(user_wallet_address) = lower('0x966fed85116f6d283921a6ed176d7643a99cbf94') 
   OR lower(user_address) = lower('0x966fed85116f6d283921a6ed176d7643a99cbf94');

-- Step 5: Reset tokens_sold to 0 for all properties
UPDATE public.property_fractionalization 
SET tokens_sold = 0, updated_at = now();

-- Verify the reset worked
SELECT 
    'Verification Results' as status,
    (SELECT COUNT(*) FROM public.fractional_investments 
     WHERE lower(investor_wallet_address) = lower('0x966fed85116f6d283921a6ed176d7643a99cbf94')) as remaining_investments,
    (SELECT COUNT(*) FROM public.user_properties 
     WHERE lower(user_wallet_address) = lower('0x966fed85116f6d283921a6ed176d7643a99cbf94') 
        OR lower(user_address) = lower('0x966fed85116f6d283921a6ed176d7643a99cbf94')) as remaining_properties,
    (SELECT COUNT(*) FROM public.user_transactions 
     WHERE lower(user_wallet_address) = lower('0x966fed85116f6d283921a6ed176d7643a99cbf94')) as remaining_transactions;

-- Commit the transaction
COMMIT;
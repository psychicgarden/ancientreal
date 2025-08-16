-- Complete Platform Reset - Remove remaining platform fees and property records
-- Wallet: 0x966fed85116f6d283921a6ed176d7643a99cbf94

BEGIN;

-- Step 1: Delete platform fees for the wallet
DELETE FROM public.platform_fees
WHERE lower(user_wallet_address) = lower('0x966fed85116f6d283921a6ed176d7643a99cbf94');

-- Step 2: Delete any property fractionalization records that were created by this wallet
DELETE FROM public.property_fractionalization
WHERE lower(owner_wallet_address) = lower('0x966fed85116f6d283921a6ed176d7643a99cbf94');

-- Step 3: Verification query to ensure complete cleanup
SELECT 
    'Complete Platform Reset Verification' as status,
    (SELECT COUNT(*) FROM public.fractional_investments 
     WHERE lower(investor_wallet_address) = lower('0x966fed85116f6d283921a6ed176d7643a99cbf94')) as remaining_investments,
    (SELECT COUNT(*) FROM public.user_properties 
     WHERE lower(user_wallet_address) = lower('0x966fed85116f6d283921a6ed176d7643a99cbf94') 
        OR lower(user_address) = lower('0x966fed85116f6d283921a6ed176d7643a99cbf94')) as remaining_properties,
    (SELECT COUNT(*) FROM public.user_transactions 
     WHERE lower(user_wallet_address) = lower('0x966fed85116f6d283921a6ed176d7643a99cbf94')) as remaining_transactions,
    (SELECT COUNT(*) FROM public.platform_fees 
     WHERE lower(user_wallet_address) = lower('0x966fed85116f6d283921a6ed176d7643a99cbf94')) as remaining_platform_fees,
    (SELECT COUNT(*) FROM public.property_fractionalization 
     WHERE lower(owner_wallet_address) = lower('0x966fed85116f6d283921a6ed176d7643a99cbf94')) as remaining_owned_properties;

COMMIT;
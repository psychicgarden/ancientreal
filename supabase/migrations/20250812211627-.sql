-- Clear user properties safely by updating them to inactive instead of deleting
UPDATE public.user_properties 
SET is_active = false, 
    updated_at = now()
WHERE lower(user_wallet_address) = '0x966fed85116f6d283921a6ed176d7643a99cbf94';

-- Also clear user transactions for a clean slate
DELETE FROM public.user_transactions 
WHERE lower(user_wallet_address) = '0x966fed85116f6d283921a6ed176d7643a99cbf94';
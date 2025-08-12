-- Create archive table for user_properties if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_properties_archive AS 
SELECT * FROM public.user_properties WHERE false;

-- Archive user properties for the specific wallet
INSERT INTO public.user_properties_archive 
SELECT * FROM public.user_properties 
WHERE lower(user_wallet_address) = '0x966fed85116f6d283921a6ed176d7643a99cbf94';

-- Delete user properties for the specific wallet
DELETE FROM public.user_properties 
WHERE lower(user_wallet_address) = '0x966fed85116f6d283921a6ed176d7643a99cbf94';
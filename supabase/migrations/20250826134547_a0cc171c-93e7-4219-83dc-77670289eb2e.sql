-- Fix the Security Definer View issue by recreating the view without SECURITY DEFINER
-- Drop and recreate the app_user_properties view

DROP VIEW IF EXISTS public.app_user_properties;

-- Recreate the view without SECURITY DEFINER (default is SECURITY INVOKER which is safe)
CREATE VIEW public.app_user_properties AS
SELECT 
    id,
    COALESCE(lower(user_address), lower(user_wallet_address)) AS user_address,
    property_id,
    property_name,
    image_url,
    updated_at,
    purchase_price_base,
    down_payment_base,
    principal_paid_base,
    interest_paid_base,
    remaining_balance_base,
    purchase_price,
    down_payment,
    remaining_balance
FROM public.user_properties;

-- Confirm fix applied
SELECT 'Security Definer View issue fixed' as status;
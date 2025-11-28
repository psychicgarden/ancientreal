-- Fix Security Definer View issue for app_user_properties
-- The view should use SECURITY INVOKER to respect RLS policies of the underlying table

-- Drop the existing view
DROP VIEW IF EXISTS public.app_user_properties;

-- Recreate the view with SECURITY INVOKER (security_invoker = true)
-- This ensures the view respects the RLS policies of the underlying user_properties table
CREATE VIEW public.app_user_properties
WITH (security_invoker = true)
AS
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
FROM user_properties;

-- Grant appropriate permissions on the view
GRANT SELECT ON public.app_user_properties TO authenticated;
GRANT SELECT ON public.app_user_properties TO anon;
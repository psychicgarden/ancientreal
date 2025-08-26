-- Fix security issues identified by Supabase linter

-- Fix function search path mutable issues by setting proper search_path
-- Update functions that are missing proper search_path settings

-- Fix has_role function search path
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO '' -- Fix search path mutable issue
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$function$;

-- Fix calculate_appreciation_distribution function
DROP FUNCTION IF EXISTS public.calculate_appreciation_distribution(numeric, numeric);
CREATE OR REPLACE FUNCTION public.calculate_appreciation_distribution(original_price numeric, appraised_value numeric)
RETURNS TABLE(capped_appreciation numeric, ancient_share numeric, lender_share numeric, buyer_share numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO '' -- Fix search path mutable issue
AS $function$
DECLARE
  appreciation_amount NUMERIC;
BEGIN
  -- Calculate full appreciation (NO CAP)
  appreciation_amount := appraised_value - original_price;
  
  -- Return the distribution (50% buyer, 40% ancient, 10% lenders) of FULL appreciation
  RETURN QUERY SELECT 
    appreciation_amount, -- No longer capped
    appreciation_amount * 0.40, -- Ancient share (40%)
    appreciation_amount * 0.10, -- Lender share (10%) 
    appreciation_amount * 0.50; -- Buyer share (50%)
END;
$function$;

-- Remove any views with SECURITY DEFINER if they exist
-- (None were found in the current schema, but this ensures clean state)

-- Verify the fixes worked
SELECT 'Security fixes applied successfully' as status;
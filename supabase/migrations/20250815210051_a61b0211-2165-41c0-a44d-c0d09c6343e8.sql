-- Remove 110% appreciation cap from calculate_appreciation_distribution function
CREATE OR REPLACE FUNCTION public.calculate_appreciation_distribution(original_price numeric, appraised_value numeric)
 RETURNS TABLE(capped_appreciation numeric, ancient_share numeric, lender_share numeric, buyer_share numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
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

-- Update existing property_fractionalization records to remove appreciation cap
UPDATE public.property_fractionalization 
SET appreciation_cap_percent = NULL,
    updated_at = now()
WHERE appreciation_cap_percent IS NOT NULL;
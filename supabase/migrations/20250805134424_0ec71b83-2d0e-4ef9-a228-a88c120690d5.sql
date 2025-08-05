-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.calculate_appreciation_distribution(
  original_price NUMERIC,
  appraised_value NUMERIC
) RETURNS TABLE (
  capped_appreciation NUMERIC,
  ancient_share NUMERIC,
  lender_share NUMERIC,
  buyer_share NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  appreciation_amount NUMERIC;
  capped_amount NUMERIC;
BEGIN
  -- Calculate appreciation (capped at 110%)
  appreciation_amount := appraised_value - original_price;
  capped_amount := LEAST(appreciation_amount, original_price * 1.10);
  
  -- Return the distribution (50% buyer, 40% ancient, 10% lenders)
  RETURN QUERY SELECT 
    capped_amount,
    capped_amount * 0.40, -- Ancient share
    capped_amount * 0.10, -- Lender share
    capped_amount * 0.50; -- Buyer share
END;
$$;
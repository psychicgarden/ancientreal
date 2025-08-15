-- Add mortgage terms to property_fractionalization table
ALTER TABLE public.property_fractionalization 
ADD COLUMN IF NOT EXISTS mortgage_apr_bps INTEGER DEFAULT 800,
ADD COLUMN IF NOT EXISTS mortgage_term_months INTEGER DEFAULT 120;

-- Update existing properties with standard mortgage terms
UPDATE public.property_fractionalization 
SET 
  mortgage_apr_bps = 800,  -- 8% APR
  mortgage_term_months = 120  -- 10 years
WHERE mortgage_apr_bps IS NULL OR mortgage_term_months IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.property_fractionalization.mortgage_apr_bps IS 'Annual Percentage Rate in basis points (800 = 8%)';
COMMENT ON COLUMN public.property_fractionalization.mortgage_term_months IS 'Mortgage term length in months (120 = 10 years)';

-- Create function to calculate monthly payment consistently
CREATE OR REPLACE FUNCTION public.calculate_monthly_payment(
  loan_amount_usd NUMERIC,
  apr_bps INTEGER,
  term_months INTEGER
) RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  loan NUMERIC;
  apr NUMERIC;
  monthly_rate NUMERIC;
  payment NUMERIC;
BEGIN
  loan := GREATEST(0, COALESCE(loan_amount_usd, 0));
  apr := GREATEST(0, COALESCE(apr_bps, 0)) / 10000.0; -- Convert bps to decimal
  
  IF loan = 0 THEN
    RETURN 0;
  END IF;
  
  monthly_rate := apr / 12.0;
  
  IF monthly_rate = 0 THEN
    RETURN ROUND(loan / GREATEST(1, COALESCE(term_months, 120)), 2);
  END IF;
  
  -- Standard amortization formula: P * [r(1+r)^n] / [(1+r)^n - 1]
  payment := loan * (monthly_rate * POWER(1 + monthly_rate, term_months)) / 
              (POWER(1 + monthly_rate, term_months) - 1);
              
  RETURN ROUND(payment, 2);
END;
$$;
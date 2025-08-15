-- Fix security definer function by adding SET search_path
DROP FUNCTION IF EXISTS public.calculate_monthly_payment(NUMERIC, INTEGER, INTEGER);

CREATE OR REPLACE FUNCTION public.calculate_monthly_payment(
  loan_amount_usd NUMERIC,
  apr_bps INTEGER,
  term_months INTEGER
) RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path TO ''
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
-- Fix remaining security warnings from linter

-- Secure remaining database functions with SET search_path TO ''
CREATE OR REPLACE FUNCTION public.backfill_user_properties_from_transactions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    transaction_record RECORD;
    property_id_val bigint;
BEGIN
    -- Loop through completed property_purchase transactions that don't have corresponding user_properties
    FOR transaction_record IN 
        SELECT DISTINCT 
            ut.user_wallet_address,
            ut.amount,
            ut.created_at,
            ut.metadata
        FROM public.user_transactions ut
        WHERE ut.transaction_type = 'property_purchase' 
          AND ut.status = 'completed'
          AND NOT EXISTS (
              SELECT 1 FROM public.user_properties up 
              WHERE up.user_wallet_address = ut.user_wallet_address 
                AND up.property_name = (ut.metadata->>'property_name')
          )
    LOOP
        -- Determine property_id based on property name
        CASE 
            WHEN transaction_record.metadata->>'property_name' ILIKE '%art deco loft%' THEN
                property_id_val := 1;
            WHEN transaction_record.metadata->>'property_name' ILIKE '%bahia%' THEN
                property_id_val := 2;
            ELSE
                property_id_val := NULL;
        END CASE;
        
        -- Insert into user_properties
        INSERT INTO public.user_properties (
            user_wallet_address,
            property_name,
            property_location,
            purchase_price,
            down_payment,
            remaining_balance,
            monthly_payment,
            current_value,
            purchase_date,
            property_id,
            image_url
        ) VALUES (
            transaction_record.user_wallet_address,
            COALESCE(transaction_record.metadata->>'property_name', 'Unknown Property'),
            COALESCE(transaction_record.metadata->>'property_location', 'Unknown Location'),
            transaction_record.amount,
            transaction_record.amount * 0.2, -- Assuming 20% down payment
            transaction_record.amount * 0.8, -- Remaining 80%
            (transaction_record.amount * 0.8 * 0.05) / 12, -- Rough monthly payment estimate
            transaction_record.amount,
            transaction_record.created_at,
            property_id_val,
            COALESCE(transaction_record.metadata->>'image_url', '/placeholder.svg')
        );
    END LOOP;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_appreciation_distribution(original_price numeric, appraised_value numeric)
RETURNS TABLE(capped_appreciation numeric, ancient_share numeric, lender_share numeric, buyer_share numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.calculate_daily_yield()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  user_record RECORD;
  daily_yield NUMERIC;
  annual_rate NUMERIC := 0.08; -- 8% APY
  daily_rate NUMERIC;
BEGIN
  daily_rate := annual_rate / 365;
  
  FOR user_record IN 
    SELECT * FROM public.user_staking 
    WHERE is_active = true AND total_staked > 0
  LOOP
    daily_yield := user_record.total_staked * daily_rate;
    
    -- Update user's earned amount
    UPDATE public.user_staking 
    SET 
      total_earned = total_earned + daily_yield,
      last_yield_calculation = now(),
      updated_at = now()
    WHERE id = user_record.id;
    
    -- Log the yield transaction
    INSERT INTO public.staking_transactions (
      user_wallet_address,
      transaction_type,
      amount,
      status
    ) VALUES (
      user_record.user_wallet_address,
      'yield',
      daily_yield,
      'completed'
    );
  END LOOP;
END;
$function$;

CREATE OR REPLACE FUNCTION public.distribute_monthly_rental_income(property_frac_id uuid, rental_month date DEFAULT CURRENT_DATE)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  property_record RECORD;
  monthly_rent NUMERIC;
  expense_rate NUMERIC := 0.20; -- 20% for expenses (maintenance, taxes, etc.)
  management_fee_rate NUMERIC := 0.08; -- 8% management fee
  total_expenses NUMERIC;
  management_fee NUMERIC;
  net_distributable NUMERIC;
  investor_record RECORD;
  distribution_id UUID;
BEGIN
  -- Get property details
  SELECT * INTO property_record 
  FROM public.property_fractionalization 
  WHERE id = property_frac_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Property fractionalization not found';
  END IF;
  
  monthly_rent := property_record.monthly_base_rent;
  total_expenses := monthly_rent * expense_rate;
  management_fee := monthly_rent * management_fee_rate;
  net_distributable := monthly_rent - total_expenses - management_fee;
  
  -- Create rental distribution record
  INSERT INTO public.rental_income_distributions (
    property_fractionalization_id,
    distribution_date,
    total_rental_income,
    property_expenses,
    net_rental_income,
    management_fee_percent,
    management_fee_amount,
    distributable_amount,
    expense_breakdown
  ) VALUES (
    property_frac_id,
    rental_month,
    monthly_rent,
    total_expenses,
    monthly_rent - total_expenses,
    management_fee_rate * 100,
    management_fee,
    net_distributable,
    jsonb_build_object(
      'maintenance', total_expenses * 0.4,
      'property_taxes', total_expenses * 0.3,
      'insurance', total_expenses * 0.2,
      'utilities', total_expenses * 0.1
    )
  ) RETURNING id INTO distribution_id;
  
  -- Create individual claims for each investor
  FOR investor_record IN 
    SELECT 
      investor_wallet_address,
      SUM(ownership_percentage) as total_ownership
    FROM public.fractional_investments 
    WHERE property_id = property_frac_id 
    AND status = 'active'
    GROUP BY investor_wallet_address
  LOOP
    INSERT INTO public.investor_rental_claims (
      distribution_id,
      property_fractionalization_id,
      investor_wallet_address,
      ownership_percentage,
      claimable_amount
    ) VALUES (
      distribution_id,
      property_frac_id,
      investor_record.investor_wallet_address,
      investor_record.total_ownership,
      net_distributable * (investor_record.total_ownership / 100)
    );
  END LOOP;
  
  -- Update property tracking
  UPDATE public.property_fractionalization 
  SET 
    last_rental_distribution = rental_month,
    total_rental_collected = total_rental_collected + monthly_rent,
    property_expenses_ytd = property_expenses_ytd + total_expenses,
    updated_at = now()
  WHERE id = property_frac_id;
END;
$function$;

-- Enable RLS on app_user_properties (detected by linter)
ALTER TABLE public.app_user_properties ENABLE ROW LEVEL SECURITY;

-- Create basic policy for app_user_properties
CREATE POLICY "Users can view their own app user properties"
ON public.app_user_properties
FOR SELECT
USING (user_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));
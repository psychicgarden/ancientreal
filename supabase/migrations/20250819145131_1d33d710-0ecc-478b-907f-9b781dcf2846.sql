-- ZERO-RISK SECURITY FIXES
-- Phase 1: Enable RLS on Archive Tables (Critical - Zero Risk)

-- Enable RLS on user_properties_archive
ALTER TABLE public.user_properties_archive ENABLE ROW LEVEL SECURITY;

-- Enable RLS on user_transactions_archive  
ALTER TABLE public.user_transactions_archive ENABLE ROW LEVEL SECURITY;

-- Enable RLS on platform_fees_archive
ALTER TABLE public.platform_fees_archive ENABLE ROW LEVEL SECURITY;

-- Create restrictive RLS policies for user_properties_archive
CREATE POLICY "Users can view their own archived properties" 
ON public.user_properties_archive 
FOR SELECT 
USING (
  lower(user_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text))
  OR lower(user_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text))
);

-- Create restrictive RLS policies for user_transactions_archive
CREATE POLICY "Users can view their own archived transactions" 
ON public.user_transactions_archive 
FOR SELECT 
USING (
  lower(user_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text))
);

-- Create restrictive RLS policies for platform_fees_archive  
CREATE POLICY "Users can view their own archived platform fees" 
ON public.platform_fees_archive 
FOR SELECT 
USING (
  lower(user_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text))
);

-- Phase 2: Harden Database Functions (Very Low Risk)
-- Add SET search_path TO '' to functions missing this security parameter

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_staking_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'avatar_url');
  RETURN NEW;
END; 
$function$;

CREATE OR REPLACE FUNCTION public.validate_financial_amounts()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  -- Validate positive amounts for financial fields
  IF TG_TABLE_NAME = 'fractional_investments' THEN
    IF NEW.investment_amount <= 0 OR NEW.token_amount <= 0 OR NEW.ownership_percentage < 0 OR NEW.ownership_percentage > 100 THEN
      RAISE EXCEPTION 'Invalid financial amounts in fractional investments';
    END IF;
  END IF;
  
  IF TG_TABLE_NAME = 'collateral_loans' THEN
    IF NEW.loan_amount_base <= 0 OR NEW.collateral_equity_base <= 0 OR NEW.loan_to_value_percent < 0 OR NEW.loan_to_value_percent > 100 THEN
      RAISE EXCEPTION 'Invalid financial amounts in collateral loans';
    END IF;
  END IF;
  
  IF TG_TABLE_NAME = 'developer_investments' THEN
    IF NEW.investment_amount <= 0 OR NEW.ownership_percentage < 0 OR NEW.ownership_percentage > 100 THEN
      RAISE EXCEPTION 'Invalid financial amounts in developer investments';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

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
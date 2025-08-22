-- Phase 1: Add secure search path to database functions (Zero-Risk Security Hardening)

-- Fix app_validate_mortgage_data_base function
CREATE OR REPLACE FUNCTION public.app_validate_mortgage_data_base()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  min_down_bps INTEGER := (SELECT value::int FROM public.app_settings WHERE key='min_down_pct_bps');
  min_bps      INTEGER := COALESCE(min_down_bps, 2000); -- default 20%
  min_down_amt BIGINT;
BEGIN
  -- normalize address
  IF NEW.user_address IS NOT NULL THEN
    NEW.user_address := lower(NEW.user_address);
  END IF;

  -- required base-unit amounts
  IF NEW.purchase_price_base IS NULL OR NEW.purchase_price_base <= 0 THEN
    RAISE EXCEPTION 'purchase_price_base must be > 0';
  END IF;
  IF NEW.down_payment_base IS NULL OR NEW.down_payment_base < 0 THEN
    RAISE EXCEPTION 'down_payment_base must be >= 0';
  END IF;

  -- enforce min down in basis points
  min_down_amt := (NEW.purchase_price_base * min_bps) / 10000;
  IF NEW.down_payment_base < min_down_amt THEN
    RAISE EXCEPTION 'Down payment below minimum (% bps)', min_bps;
  END IF;

  -- derived loan amount
  NEW.loan_amount_base := NEW.purchase_price_base - NEW.down_payment_base;
  IF NEW.loan_amount_base <= 0 THEN
    RAISE EXCEPTION 'loan_amount_base must be > 0 (purchase - down)';
  END IF;

  -- rails
  IF NEW.apr_bps IS NULL OR NEW.apr_bps NOT BETWEEN 0 AND 3000 THEN
    RAISE EXCEPTION 'apr_bps out of bounds (0..3000)';
  END IF;
  IF NEW.term_months IS NULL OR NEW.term_months NOT BETWEEN 12 AND 360 THEN
    RAISE EXCEPTION 'term_months out of bounds (12..360)';
  END IF;

  -- normalize paid fields
  NEW.principal_paid_base := COALESCE(NEW.principal_paid_base, 0);
  NEW.interest_paid_base  := COALESCE(NEW.interest_paid_base, 0);

  -- timestamp if present
  BEGIN
    NEW.updated_at := now();
  EXCEPTION WHEN undefined_column THEN
    NULL;
  END;

  RETURN NEW;
END;
$function$;

-- Fix apply_mortgage_payment function  
CREATE OR REPLACE FUNCTION public.apply_mortgage_payment(p_user_address text, p_property_id integer, p_principal_delta_base bigint, p_interest_delta_base bigint, p_tx_hash text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  v_row public.user_properties%rowtype;
BEGIN
  -- normalize wallet to lowercase
  p_user_address := lower(p_user_address);

  SELECT * INTO v_row
  FROM public.user_properties
  WHERE user_address = p_user_address
    AND property_id = p_property_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'user_properties row not found for % / %', p_user_address, p_property_id
      USING errcode = 'P0001';
  END IF;

  UPDATE public.user_properties
  SET principal_paid_base = COALESCE(principal_paid_base, 0) + COALESCE(p_principal_delta_base, 0),
      interest_paid_base  = COALESCE(interest_paid_base,  0) + COALESCE(p_interest_delta_base,  0),
      updated_at          = now()
  WHERE user_address = p_user_address
    AND property_id  = p_property_id;

  RETURN json_build_object(
    'ok', true,
    'user_address', p_user_address,
    'property_id',  p_property_id,
    'principal_delta_base', p_principal_delta_base,
    'interest_delta_base',  p_interest_delta_base,
    'tx_hash', p_tx_hash
  );
END
$function$;

-- Fix backfill_user_properties_from_transactions function
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

-- Fix fn_validate_and_compute_user_property function
CREATE OR REPLACE FUNCTION public.fn_validate_and_compute_user_property()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  min_bps integer := 2000; -- 20%
BEGIN
  -- If purchase/down provided, compute loan and validate down>=20%
  IF NEW.purchase_price_base IS NOT NULL
     AND NEW.down_payment_base IS NOT NULL THEN

    IF NEW.down_payment_base * 10000 < NEW.purchase_price_base * min_bps THEN
      RAISE EXCEPTION 'Down payment must be at least 20%% of purchase price';
    END IF;

    NEW.loan_amount_base := NEW.purchase_price_base - NEW.down_payment_base;
  END IF;

  RETURN NEW;
END
$function$;

-- Fix validate_mortgage_data function
CREATE OR REPLACE FUNCTION public.validate_mortgage_data()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Ensure remaining balance doesn't exceed loan amount
  IF NEW.remaining_balance > (NEW.purchase_price - NEW.down_payment) THEN
    RAISE EXCEPTION 'Remaining balance cannot exceed loan amount';
  END IF;
  
  -- Ensure down payment is reasonable (5-50% of purchase price)
  IF NEW.down_payment < (NEW.purchase_price * 0.05) OR NEW.down_payment > (NEW.purchase_price * 0.5) THEN
    RAISE EXCEPTION 'Down payment must be between 5%% and 50%% of purchase price';
  END IF;
  
  RETURN NEW;
END;
$function$;
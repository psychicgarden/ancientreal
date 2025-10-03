-- Extend payment pipeline and public sales counts
-- 1) Update apply_mortgage_payment to adjust remaining balances as well
CREATE OR REPLACE FUNCTION public.apply_mortgage_payment(
  p_user_address text,
  p_property_id integer,
  p_principal_delta_base bigint,
  p_interest_delta_base bigint,
  p_tx_hash text DEFAULT NULL::text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated_rows INTEGER := 0;
  v_principal_delta_numeric NUMERIC;
BEGIN
  -- Normalize wallet
  p_user_address := lower(p_user_address);
  v_principal_delta_numeric := COALESCE(p_principal_delta_base, 0) / 1000000.0; -- base to USD

  -- Primary update by user_address
  UPDATE public.user_properties
  SET 
    principal_paid_base   = COALESCE(principal_paid_base, 0) + COALESCE(p_principal_delta_base, 0),
    interest_paid_base    = COALESCE(interest_paid_base, 0) + COALESCE(p_interest_delta_base, 0),
    remaining_balance_base = GREATEST(0, COALESCE(remaining_balance_base, loan_amount_base) - COALESCE(p_principal_delta_base, 0)),
    remaining_balance      = GREATEST(0, COALESCE(remaining_balance, (purchase_price - down_payment)) - v_principal_delta_numeric),
    updated_at            = now()
  WHERE user_address = p_user_address
    AND property_id = p_property_id;

  GET DIAGNOSTICS v_updated_rows = ROW_COUNT;

  -- Fallback by user_wallet_address
  IF v_updated_rows = 0 THEN
    UPDATE public.user_properties
    SET 
      principal_paid_base   = COALESCE(principal_paid_base, 0) + COALESCE(p_principal_delta_base, 0),
      interest_paid_base    = COALESCE(interest_paid_base, 0) + COALESCE(p_interest_delta_base, 0),
      remaining_balance_base = GREATEST(0, COALESCE(remaining_balance_base, loan_amount_base) - COALESCE(p_principal_delta_base, 0)),
      remaining_balance      = GREATEST(0, COALESCE(remaining_balance, (purchase_price - down_payment)) - v_principal_delta_numeric),
      updated_at            = now()
    WHERE lower(user_wallet_address) = p_user_address
      AND property_id = p_property_id;
    GET DIAGNOSTICS v_updated_rows = ROW_COUNT;
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'user_address', p_user_address,
    'property_id', p_property_id,
    'principal_delta_base', p_principal_delta_base,
    'interest_delta_base', p_interest_delta_base,
    'tx_hash', p_tx_hash,
    'rows_updated', v_updated_rows
  );
END
$$;

-- 2) Public aggregate RPC for landing page availability
CREATE OR REPLACE FUNCTION public.get_whole_properties_sold()
RETURNS TABLE(property_name text, property_location text, sold_count bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT up.property_name, up.property_location, count(*)::bigint AS sold_count
  FROM public.user_properties up
  WHERE up.is_active = true
  GROUP BY up.property_name, up.property_location
$$;
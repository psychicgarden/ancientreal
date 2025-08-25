-- Fix the apply_mortgage_payment function to work with Supabase client context
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
SET search_path TO ''
AS $function$
DECLARE
  v_updated_rows INTEGER := 0;
BEGIN
  -- Normalize wallet to lowercase
  p_user_address := lower(p_user_address);

  -- Simple UPDATE without SELECT FOR UPDATE (which causes read-only errors in Supabase)
  UPDATE public.user_properties
  SET 
    principal_paid_base = COALESCE(principal_paid_base, 0) + COALESCE(p_principal_delta_base, 0),
    interest_paid_base = COALESCE(interest_paid_base, 0) + COALESCE(p_interest_delta_base, 0),
    updated_at = now()
  WHERE user_address = p_user_address
    AND property_id = p_property_id;

  GET DIAGNOSTICS v_updated_rows = ROW_COUNT;

  -- Also try to update using user_wallet_address as fallback
  IF v_updated_rows = 0 THEN
    UPDATE public.user_properties
    SET 
      principal_paid_base = COALESCE(principal_paid_base, 0) + COALESCE(p_principal_delta_base, 0),
      interest_paid_base = COALESCE(interest_paid_base, 0) + COALESCE(p_interest_delta_base, 0),
      updated_at = now()
    WHERE lower(user_wallet_address) = p_user_address
      AND property_id = p_property_id;
    
    GET DIAGNOSTICS v_updated_rows = ROW_COUNT;
  END IF;

  RETURN json_build_object(
    'ok', true,
    'user_address', p_user_address,
    'property_id', p_property_id,
    'principal_delta_base', p_principal_delta_base,
    'interest_delta_base', p_interest_delta_base,
    'tx_hash', p_tx_hash,
    'rows_updated', v_updated_rows
  );
END
$function$;

-- Create a trigger function to automatically sync payments from ledger to user_properties
CREATE OR REPLACE FUNCTION public.sync_payment_to_user_properties()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Update user_properties when a payment is added to the ledger
  UPDATE public.user_properties
  SET 
    principal_paid_base = COALESCE(principal_paid_base, 0) + COALESCE(NEW.principal_delta_base, 0),
    interest_paid_base = COALESCE(interest_paid_base, 0) + COALESCE(NEW.interest_delta_base, 0),
    updated_at = now()
  WHERE user_address = lower(NEW.user_address)
    AND property_id = NEW.property_id;

  -- If no rows updated, try with user_wallet_address
  IF NOT FOUND THEN
    UPDATE public.user_properties
    SET 
      principal_paid_base = COALESCE(principal_paid_base, 0) + COALESCE(NEW.principal_delta_base, 0),
      interest_paid_base = COALESCE(interest_paid_base, 0) + COALESCE(NEW.interest_delta_base, 0),
      updated_at = now()
    WHERE lower(user_wallet_address) = lower(NEW.user_address)
      AND property_id = NEW.property_id;
  END IF;

  RETURN NEW;
END;
$function$;

-- Create the trigger
DROP TRIGGER IF EXISTS trg_mortgage_payment_sync ON public.mortgage_payments_ledger;
CREATE TRIGGER trg_mortgage_payment_sync
  AFTER INSERT ON public.mortgage_payments_ledger
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_payment_to_user_properties();

-- Fix existing payment data - update user_properties with existing ledger data
WITH payment_totals AS (
  SELECT 
    user_address,
    property_id,
    SUM(principal_delta_base) as total_principal,
    SUM(interest_delta_base) as total_interest
  FROM public.mortgage_payments_ledger
  GROUP BY user_address, property_id
)
UPDATE public.user_properties up
SET 
  principal_paid_base = pt.total_principal,
  interest_paid_base = pt.total_interest,
  updated_at = now()
FROM payment_totals pt
WHERE (lower(up.user_address) = lower(pt.user_address) OR lower(up.user_wallet_address) = lower(pt.user_address))
  AND up.property_id = pt.property_id;
-- Step A: Clean up the RPC function

-- 1. Drop the older overload (4-arg version)
DROP FUNCTION IF EXISTS public.apply_mortgage_payment(text, integer, bigint, bigint);

-- 2. Create the single, canonical 5-arg function (returns JSONB)
CREATE OR REPLACE FUNCTION public.apply_mortgage_payment(
  p_user_address         text,
  p_property_id          integer,
  p_principal_delta_base bigint,
  p_interest_delta_base  bigint,
  p_tx_hash              text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.apply_mortgage_payment(text, integer, bigint, bigint, text)
TO anon, authenticated, service_role;

-- 3. Standardize existing data so lookups don't miss
-- Lowercase all stored wallet addresses
UPDATE public.user_properties
SET user_address = lower(user_address)
WHERE user_address <> lower(user_address);

-- Backfill missing property_id using property name mapping
UPDATE public.user_properties
SET property_id = 1
WHERE property_id IS NULL AND property_name ILIKE '%mazunte%';

UPDATE public.user_properties
SET property_id = 2
WHERE property_id IS NULL AND property_name ILIKE '%bahia%';

UPDATE public.user_properties
SET property_id = 3
WHERE property_id IS NULL AND property_name ILIKE '%ericeira%';
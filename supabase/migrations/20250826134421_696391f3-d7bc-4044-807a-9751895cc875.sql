-- Fix remaining security issues

-- Fix reset_developer_project_funding function
DROP FUNCTION IF EXISTS public.reset_developer_project_funding(uuid);
CREATE OR REPLACE FUNCTION public.reset_developer_project_funding(p_project_id uuid DEFAULT NULL::uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO '' -- Fix search path mutable issue  
AS $function$
DECLARE
  v_reset_count integer := 0;
  v_result jsonb;
BEGIN
  -- If specific project ID provided, reset only that project
  IF p_project_id IS NOT NULL THEN
    UPDATE public.developer_projects 
    SET current_funding = 0, updated_at = now()
    WHERE id = p_project_id;
    
    GET DIAGNOSTICS v_reset_count = ROW_COUNT;
    
    -- Also delete all investments for this project
    DELETE FROM public.developer_investments 
    WHERE project_id = p_project_id;
    
  ELSE
    -- Reset all projects to low funding for testing
    UPDATE public.developer_projects 
    SET current_funding = CASE 
      WHEN target_funding > 0 THEN target_funding * 0.15  -- Set to 15% funding
      ELSE 0 
    END,
    updated_at = now();
    
    GET DIAGNOSTICS v_reset_count = ROW_COUNT;
    
    -- Delete all developer investments
    DELETE FROM public.developer_investments;
  END IF;
  
  -- Return summary
  v_result := jsonb_build_object(
    'reset_projects', v_reset_count,
    'project_id', COALESCE(p_project_id::text, 'all'),
    'timestamp', now()
  );
  
  RETURN v_result;
END;
$function$;

-- Fix sync_platform_fee_transaction function
DROP FUNCTION IF EXISTS public.sync_platform_fee_transaction();
CREATE OR REPLACE FUNCTION public.sync_platform_fee_transaction()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO '' -- Fix search path mutable issue
AS $function$
BEGIN
  -- Only process platform_fee transactions
  IF NEW.transaction_type = 'platform_fee' AND NEW.status = 'completed' THEN
    -- Insert into platform_fees table
    INSERT INTO public.platform_fees (
      user_wallet_address,
      property_id,
      fee_amount_usd,
      fee_amount_base,
      property_value_usd,
      fee_percentage,
      transaction_hash,
      payment_status
    ) VALUES (
      NEW.user_wallet_address,
      (NEW.metadata->>'property_id')::uuid,
      NEW.amount,
      (NEW.amount * 1000000)::bigint, -- Convert to base units (6 decimals for USDC)
      (NEW.metadata->>'property_value')::numeric,
      COALESCE((NEW.metadata->>'fee_percentage')::numeric, 3.0),
      NEW.transaction_hash,
      'completed'
    )
    ON CONFLICT DO NOTHING; -- Prevent duplicates
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Confirm fixes
SELECT 'Security path fixes applied to functions' as status;
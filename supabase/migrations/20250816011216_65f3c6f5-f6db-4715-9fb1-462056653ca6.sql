-- Drop the broken function and create a simple reset
DROP FUNCTION IF EXISTS public.reset_fractional_portfolio(p_wallet text);

-- Create a simple, lightweight reset function
CREATE OR REPLACE FUNCTION public.reset_fractional_portfolio(p_wallet text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
declare
  v_wallet text := lower(trim(p_wallet));
  v_deleted_investments int := 0;
  v_deleted_properties int := 0;
  v_deleted_transactions int := 0;
  v_updated_properties int := 0;
begin
  if v_wallet is null or v_wallet = '' then
    raise exception 'Wallet address is required';
  end if;

  -- Delete fractional investments
  delete from public.fractional_investments
  where lower(investor_wallet_address) = v_wallet;
  get diagnostics v_deleted_investments = row_count;

  -- Delete user properties
  delete from public.user_properties
  where lower(user_wallet_address) = v_wallet 
     or lower(user_address) = v_wallet;
  get diagnostics v_deleted_properties = row_count;

  -- Delete user transactions
  delete from public.user_transactions
  where lower(user_wallet_address) = v_wallet;
  get diagnostics v_deleted_transactions = row_count;

  -- Reset tokens_sold to 0 for all properties
  update public.property_fractionalization 
  set tokens_sold = 0, updated_at = now();
  get diagnostics v_updated_properties = row_count;

  return jsonb_build_object(
    'wallet', v_wallet,
    'deleted_investments', v_deleted_investments,
    'deleted_properties', v_deleted_properties,
    'deleted_transactions', v_deleted_transactions,
    'updated_properties', v_updated_properties
  );
end;
$$;
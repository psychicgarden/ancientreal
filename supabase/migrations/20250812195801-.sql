-- Fix the reset_fractional_portfolio function to include proper WHERE clauses
-- This prevents the "UPDATE requires a WHERE clause" error

CREATE OR REPLACE FUNCTION public.reset_fractional_portfolio(p_wallet text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
declare
  v_wallet text := lower(trim(p_wallet));
  v_inv_archived int := 0;
  v_inv_deleted  int := 0;
  v_claims_archived int := 0;
  v_claims_deleted  int := 0;
  v_orders_archived int := 0;
  v_orders_deleted  int := 0;
  v_trades_archived int := 0;
  v_trades_deleted  int := 0;
  v_properties_updated int := 0;
begin
  if v_wallet is null or v_wallet = '' then
    raise exception 'Wallet address is required';
  end if;

  -- Archive then delete investor_rental_claims for wallet
  insert into public.investor_rental_claims_archive
    select * from public.investor_rental_claims
    where lower(investor_wallet_address) = v_wallet;
  get diagnostics v_claims_archived = row_count;

  delete from public.investor_rental_claims
    where lower(investor_wallet_address) = v_wallet;
  get diagnostics v_claims_deleted = row_count;

  -- Archive then delete secondary_orders for wallet
  insert into public.secondary_orders_archive
    select * from public.secondary_orders
    where lower(owner_wallet_address) = v_wallet;
  get diagnostics v_orders_archived = row_count;

  delete from public.secondary_orders
    where lower(owner_wallet_address) = v_wallet;
  get diagnostics v_orders_deleted = row_count;

  -- Archive then delete secondary_trades where wallet was buyer or seller
  insert into public.secondary_trades_archive
    select * from public.secondary_trades
    where lower(buyer_wallet_address) = v_wallet
       or lower(seller_wallet_address) = v_wallet;
  get diagnostics v_trades_archived = row_count;

  delete from public.secondary_trades
    where lower(buyer_wallet_address) = v_wallet
       or lower(seller_wallet_address) = v_wallet;
  get diagnostics v_trades_deleted = row_count;

  -- Archive then delete fractional_investments for wallet
  insert into public.fractional_investments_archive
    select * from public.fractional_investments
    where lower(investor_wallet_address) = v_wallet;
  get diagnostics v_inv_archived = row_count;

  delete from public.fractional_investments
    where lower(investor_wallet_address) = v_wallet;
  get diagnostics v_inv_deleted = row_count;

  -- Recompute tokens_sold for properties that had investments from this wallet
  -- Only update properties that actually had investments from this wallet
  WITH affected_properties AS (
    SELECT DISTINCT property_id 
    FROM public.fractional_investments_archive 
    WHERE lower(investor_wallet_address) = v_wallet
  )
  UPDATE public.property_fractionalization pf
  SET tokens_sold = coalesce((
      SELECT sum(fi.token_amount)
      FROM public.fractional_investments fi
      WHERE fi.property_id = pf.id AND fi.status = 'active'
  ), 0),
      updated_at = now()
  WHERE pf.id IN (SELECT property_id FROM affected_properties);
  
  get diagnostics v_properties_updated = row_count;

  return jsonb_build_object(
    'wallet', v_wallet,
    'fractional_investments_archived', v_inv_archived,
    'fractional_investments_deleted',  v_inv_deleted,
    'rental_claims_archived',          v_claims_archived,
    'rental_claims_deleted',           v_claims_deleted,
    'secondary_orders_archived',       v_orders_archived,
    'secondary_orders_deleted',        v_orders_deleted,
    'secondary_trades_archived',       v_trades_archived,
    'secondary_trades_deleted',        v_trades_deleted,
    'properties_updated',              v_properties_updated
  );
end;
$function$
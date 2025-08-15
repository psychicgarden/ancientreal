-- Update the reset_fractional_portfolio function to include all portfolio-related tables
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
  v_user_props_archived int := 0;
  v_user_props_deleted int := 0;
  v_transactions_archived int := 0;
  v_transactions_deleted int := 0;
  v_fees_archived int := 0;
  v_fees_deleted int := 0;
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

  -- NEW: Archive and delete user_properties for wallet
  -- First, create archive table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.user_properties_archive (LIKE public.user_properties INCLUDING ALL);
  ALTER TABLE public.user_properties_archive ADD COLUMN IF NOT EXISTS archived_at timestamp with time zone DEFAULT now();

  insert into public.user_properties_archive
    select *, now() as archived_at from public.user_properties
    where lower(user_wallet_address) = v_wallet 
       or lower(user_address) = v_wallet;
  get diagnostics v_user_props_archived = row_count;

  delete from public.user_properties
    where lower(user_wallet_address) = v_wallet
       or lower(user_address) = v_wallet;
  get diagnostics v_user_props_deleted = row_count;

  -- NEW: Archive and delete user_transactions for wallet
  -- First, create archive table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.user_transactions_archive (LIKE public.user_transactions INCLUDING ALL);
  ALTER TABLE public.user_transactions_archive ADD COLUMN IF NOT EXISTS archived_at timestamp with time zone DEFAULT now();

  insert into public.user_transactions_archive
    select *, now() as archived_at from public.user_transactions
    where lower(user_wallet_address) = v_wallet;
  get diagnostics v_transactions_archived = row_count;

  delete from public.user_transactions
    where lower(user_wallet_address) = v_wallet;
  get diagnostics v_transactions_deleted = row_count;

  -- NEW: Archive and delete platform_fees for wallet
  -- First, create archive table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.platform_fees_archive (LIKE public.platform_fees INCLUDING ALL);
  ALTER TABLE public.platform_fees_archive ADD COLUMN IF NOT EXISTS archived_at timestamp with time zone DEFAULT now();

  insert into public.platform_fees_archive
    select *, now() as archived_at from public.platform_fees
    where lower(user_wallet_address) = v_wallet;
  get diagnostics v_fees_archived = row_count;

  delete from public.platform_fees
    where lower(user_wallet_address) = v_wallet;
  get diagnostics v_fees_deleted = row_count;

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
    'user_properties_archived',        v_user_props_archived,
    'user_properties_deleted',         v_user_props_deleted,
    'user_transactions_archived',      v_transactions_archived,
    'user_transactions_deleted',       v_transactions_deleted,
    'platform_fees_archived',         v_fees_archived,
    'platform_fees_deleted',          v_fees_deleted,
    'properties_updated',              v_properties_updated
  );
end;
$function$;
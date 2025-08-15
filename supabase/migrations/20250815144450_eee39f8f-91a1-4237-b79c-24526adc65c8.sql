-- Complete security fixes - secure remaining functions

CREATE OR REPLACE FUNCTION public.enforce_trusted_order_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
begin
  if tg_op = 'UPDATE'
     and (new.tokens_filled is distinct from old.tokens_filled
          or new.status is distinct from old.status) then
    if coalesce(current_setting('mazunte.trusted_fill', true), '') <> '1' then
      raise exception 'Direct updates to order fill/status are not allowed';
    end if;
  end if;
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.process_secondary_order_fill(_order_id uuid, _buyer_wallet_address text, _fill_amount numeric, _price_per_token numeric, _tx_hash text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
declare
  v_order record;
  v_remaining numeric;
  v_fill numeric;
  v_total_cost numeric;
  v_trade_id uuid;
begin
  -- Mark this transaction as trusted for order fill/status updates
  perform set_config('mazunte.trusted_fill', '1', true);

  -- Lock the order to avoid race conditions
  select * into v_order
  from public.secondary_orders
  where id = _order_id
  for update;

  if not found then
    raise exception 'Order not found';
  end if;

  if v_order.status <> 'open' then
    raise exception 'Order is not open';
  end if;

  -- Basic input checks
  if _buyer_wallet_address is null or length(trim(_buyer_wallet_address)) = 0 then
    raise exception 'Buyer wallet address is required';
  end if;

  if _buyer_wallet_address = v_order.owner_wallet_address then
    raise exception 'Buyer cannot be the order owner';
  end if;

  if _fill_amount is null or _fill_amount <= 0 then
    raise exception 'Fill amount must be > 0';
  end if;

  -- Enforce price match to prevent price manipulation
  if _price_per_token <> v_order.price_per_token then
    raise exception 'Price per token mismatch';
  end if;

  v_remaining := v_order.token_amount - v_order.tokens_filled;
  if v_remaining <= 0 then
    raise exception 'Order already filled';
  end if;

  v_fill := least(_fill_amount, v_remaining);
  v_total_cost := v_fill * _price_per_token;

  -- Insert trade record (immutable history)
  insert into public.secondary_trades (
    order_id,
    property_fractionalization_id,
    buyer_wallet_address,
    seller_wallet_address,
    token_amount,
    price_per_token,
    total_cost,
    transaction_hash,
    status
  ) values (
    v_order.id,
    v_order.property_fractionalization_id,
    _buyer_wallet_address,
    v_order.owner_wallet_address,
    v_fill,
    _price_per_token,
    v_total_cost,
    _tx_hash,
    'completed'
  ) returning id into v_trade_id;

  -- Update order fill progress atomically
  update public.secondary_orders
  set tokens_filled = tokens_filled + v_fill,
      status = case when tokens_filled + v_fill >= token_amount then 'filled' else status end,
      updated_at = now()
  where id = v_order.id;

  return v_trade_id;
end;
$function$;

CREATE OR REPLACE FUNCTION public.update_tokens_sold()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Update the tokens_sold in property_fractionalization table
  UPDATE public.property_fractionalization 
  SET tokens_sold = tokens_sold + NEW.token_amount,
      updated_at = now()
  WHERE id = NEW.property_id;
  
  RETURN NEW;
END;
$function$;

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
$function$;
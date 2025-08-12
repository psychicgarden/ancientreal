
-- 1) Archive tables for safe rollback
create table if not exists public.fractional_investments_archive
  (like public.fractional_investments including all);
alter table public.fractional_investments_archive
  add column if not exists archived_at timestamptz not null default now();

create table if not exists public.investor_rental_claims_archive
  (like public.investor_rental_claims including all);
alter table public.investor_rental_claims_archive
  add column if not exists archived_at timestamptz not null default now();

create table if not exists public.secondary_orders_archive
  (like public.secondary_orders including all);
alter table public.secondary_orders_archive
  add column if not exists archived_at timestamptz not null default now();

create table if not exists public.secondary_trades_archive
  (like public.secondary_trades including all);
alter table public.secondary_trades_archive
  add column if not exists archived_at timestamptz not null default now();

-- 2) Reset function for a specific wallet
create or replace function public.reset_fractional_portfolio(p_wallet text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
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

  -- Recompute tokens_sold for every property to keep market stats consistent
  update public.property_fractionalization pf
  set tokens_sold = coalesce((
      select sum(fi.token_amount)
      from public.fractional_investments fi
      where fi.property_id = pf.id and fi.status = 'active'
  ), 0),
      updated_at = now();

  return jsonb_build_object(
    'wallet', v_wallet,
    'fractional_investments_archived', v_inv_archived,
    'fractional_investments_deleted',  v_inv_deleted,
    'rental_claims_archived',          v_claims_archived,
    'rental_claims_deleted',           v_claims_deleted,
    'secondary_orders_archived',       v_orders_archived,
    'secondary_orders_deleted',        v_orders_deleted,
    'secondary_trades_archived',       v_trades_archived,
    'secondary_trades_deleted',        v_trades_deleted
  );
end;
$$;

-- 3) Lock function down: only service_role can execute
revoke all on function public.reset_fractional_portfolio(text) from public;
grant execute on function public.reset_fractional_portfolio(text) to service_role;

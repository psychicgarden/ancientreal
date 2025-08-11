
-- Phase 2 hardening: RLS fixes, realtime reliability, validation, and indexes

-- 1) Secondary Orders: lock down update/delete to order owner; keep market data public
alter table public.secondary_orders enable row level security;

drop policy if exists "Users can create secondary orders" on public.secondary_orders;
drop policy if exists "Users can update secondary orders" on public.secondary_orders;
drop policy if exists "Secondary orders are viewable by everyone" on public.secondary_orders;
drop policy if exists "Users can delete their secondary orders" on public.secondary_orders;

create policy "Secondary orders are viewable by everyone"
on public.secondary_orders
for select
using (true);

create policy "Users can create their own secondary orders"
on public.secondary_orders
for insert
to authenticated
with check (
  owner_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address')
);

create policy "Owners can update their secondary orders"
on public.secondary_orders
for update
to authenticated
using (
  owner_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address')
)
with check (
  owner_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address')
);

create policy "Owners can delete their secondary orders"
on public.secondary_orders
for delete
to authenticated
using (
  owner_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address')
);

-- 2) Secondary Trades: public read, insert via authenticated (immutable), no update policy
alter table public.secondary_trades enable row level security;

drop policy if exists "Secondary trades are viewable by everyone" on public.secondary_trades;
drop policy if exists "Users can create secondary trades" on public.secondary_trades;
drop policy if exists "Users can update secondary trades" on public.secondary_trades;

create policy "Secondary trades are viewable by everyone"
on public.secondary_trades
for select
using (true);

-- Allow inserts (typically via RPC). Trades remain immutable (no update/delete policy).
create policy "Authenticated can insert trades"
on public.secondary_trades
for insert
to authenticated
with check (true);

-- Optional: explicitly prevent deletes by not creating any delete policy

-- 3) Wallet-scoped tables: replace permissive policies with wallet-bound ones (authenticated)
-- payment_history
drop policy if exists "Allow wallet-based access for payment history" on public.payment_history;

create policy "Users can view their own payment history"
on public.payment_history
for select
to authenticated
using (user_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address'));

create policy "Users can create their own payments"
on public.payment_history
for insert
to authenticated
with check (user_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address'));

create policy "Users can update their own payments"
on public.payment_history
for update
to authenticated
using (user_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address'))
with check (user_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address'));

-- user_properties
drop policy if exists "Allow wallet-based access for properties" on public.user_properties;

create policy "Users can view their own properties"
on public.user_properties
for select
to authenticated
using (user_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address'));

create policy "Users can create their own properties"
on public.user_properties
for insert
to authenticated
with check (user_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address'));

create policy "Users can update their own properties"
on public.user_properties
for update
to authenticated
using (user_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address'))
with check (user_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address'));

-- user_staking
drop policy if exists "Allow wallet-based access for staking data" on public.user_staking;

create policy "Users can view their own staking"
on public.user_staking
for select
to authenticated
using (user_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address'));

create policy "Users can create their own staking rows"
on public.user_staking
for insert
to authenticated
with check (user_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address'));

create policy "Users can update their own staking rows"
on public.user_staking
for update
to authenticated
using (user_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address'))
with check (user_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address'));

-- user_transactions
drop policy if exists "Allow wallet-based access for transactions" on public.user_transactions;

create policy "Users can view their own transactions"
on public.user_transactions
for select
to authenticated
using (user_wallet_address = ((current_setting('request.jwt.claims, true))::json ->> 'wallet_address')); -- NOTE: fix typo below

-- Correct the previous line (typo fix)
drop policy if exists "Users can view their own transactions" on public.user_transactions;

create policy "Users can view their own transactions"
on public.user_transactions
for select
to authenticated
using (user_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address'));

create policy "Users can create their own transactions"
on public.user_transactions
for insert
to authenticated
with check (user_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address'));

create policy "Users can update their own transactions"
on public.user_transactions
for update
to authenticated
using (user_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address'))
with check (user_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address'));

-- staking_transactions
drop policy if exists "Allow wallet-based access for staking transactions" on public.staking_transactions;

create policy "Users can view their own staking transactions"
on public.staking_transactions
for select
to authenticated
using (user_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address'));

create policy "Users can create their own staking transactions"
on public.staking_transactions
for insert
to authenticated
with check (user_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address'));

create policy "Users can update their own staking transactions"
on public.staking_transactions
for update
to authenticated
using (user_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address'))
with check (user_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address'));

-- 4) Realtime: ensure full row data + publication for order book and trades
alter table public.secondary_orders replica identity full;
alter table public.secondary_trades replica identity full;

-- Add to realtime publication (idempotent where possible)
do $$
begin
  begin
    execute 'alter publication supabase_realtime add table public.secondary_orders';
  exception when duplicate_object then null;
  end;
  begin
    execute 'alter publication supabase_realtime add table public.secondary_trades';
  exception when duplicate_object then null;
  end;
end $$;

-- 5) Validation triggers to protect data integrity
create or replace function public.validate_secondary_order()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.token_amount is null or new.token_amount <= 0 then
    raise exception 'token_amount must be > 0';
  end if;
  if new.price_per_token is null or new.price_per_token <= 0 then
    raise exception 'price_per_token must be > 0';
  end if;
  if new.expiry is not null and new.expiry <= now() then
    raise exception 'expiry must be in the future';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_validate_secondary_order on public.secondary_orders;
create trigger trg_validate_secondary_order
before insert or update on public.secondary_orders
for each row execute function public.validate_secondary_order();

create or replace function public.validate_secondary_trade()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.token_amount is null or new.token_amount <= 0 then
    raise exception 'token_amount must be > 0';
  end if;
  if new.price_per_token is null or new.price_per_token <= 0 then
    raise exception 'price_per_token must be > 0';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_validate_secondary_trade on public.secondary_trades;
create trigger trg_validate_secondary_trade
before insert or update on public.secondary_trades
for each row execute function public.validate_secondary_trade();

-- 6) Idempotency and performance indexes
create unique index if not exists uniq_secondary_trades_txhash
on public.secondary_trades (transaction_hash)
where transaction_hash is not null;

create index if not exists idx_secondary_orders_property_status
on public.secondary_orders (property_fractionalization_id, status);

create index if not exists idx_secondary_orders_owner
on public.secondary_orders (owner_wallet_address);

create index if not exists idx_secondary_trades_property_created
on public.secondary_trades (property_fractionalization_id, created_at desc);

create index if not exists idx_secondary_trades_buyer
on public.secondary_trades (buyer_wallet_address);

create index if not exists idx_secondary_trades_seller
on public.secondary_trades (seller_wallet_address);

create index if not exists idx_payment_history_user
on public.payment_history (user_wallet_address, created_at desc);

create index if not exists idx_user_properties_user
on public.user_properties (user_wallet_address);

create index if not exists idx_user_staking_user
on public.user_staking (user_wallet_address);

create index if not exists idx_user_transactions_user
on public.user_transactions (user_wallet_address, created_at desc);

create index if not exists idx_staking_transactions_user
on public.staking_transactions (user_wallet_address, created_at desc);

-- 7) Expired orders maintenance function
create or replace function public.cancel_expired_orders()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  update public.secondary_orders
  set status = 'cancelled', updated_at = now()
  where status = 'open'
    and expiry is not null
    and expiry <= now();
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke all on function public.cancel_expired_orders() from public;
grant execute on function public.cancel_expired_orders() to authenticated;

-- Optional helper view for active orders (auto-excluding expired)
create or replace view public.open_secondary_orders as
select *
from public.secondary_orders
where status = 'open'
  and (expiry is null or expiry > now());

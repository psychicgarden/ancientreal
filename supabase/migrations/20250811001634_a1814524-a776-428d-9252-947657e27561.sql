
-- Safe, atomic fills: trusted context + function hardening + trigger + narrow RLS policy

-- 1) Trigger to block direct fill/status edits unless trusted context is set
create or replace function public.enforce_trusted_order_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
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
$$;

drop trigger if exists trg_enforce_trusted_order_update on public.secondary_orders;
create trigger trg_enforce_trusted_order_update
before update on public.secondary_orders
for each row execute function public.enforce_trusted_order_update();

-- 2) Narrow RLS policy: allow updates only when trusted context is present (set by RPC)
drop policy if exists "Trusted fills can update order rows" on public.secondary_orders;
create policy "Trusted fills can update order rows"
on public.secondary_orders
for update
to authenticated
using (coalesce(current_setting('mazunte.trusted_fill', true), '') = '1')
with check (coalesce(current_setting('mazunte.trusted_fill', true), '') = '1');

-- 3) Harden the atomic fill RPC and set trusted context
create or replace function public.process_secondary_order_fill(
  _order_id uuid,
  _buyer_wallet_address text,
  _fill_amount numeric,
  _price_per_token numeric,
  _tx_hash text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
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
$$;

-- Ensure authenticated clients can call the RPC
revoke all on function public.process_secondary_order_fill(uuid, text, numeric, numeric, text) from public;
grant execute on function public.process_secondary_order_fill(uuid, text, numeric, numeric, text) to authenticated;

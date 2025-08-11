
-- Phase 3/4 foundation: status, validation, summaries, indexes

-- 1) Keep tokens_sold in sync when fractional investments change

create or replace function public.fn_tokens_sold_after_insert()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'active' then
    update public.property_fractionalization
      set tokens_sold = coalesce(tokens_sold, 0) + coalesce(new.token_amount, 0),
          updated_at = now()
    where id = new.property_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_fractional_investments_ai on public.fractional_investments;
create trigger trg_fractional_investments_ai
after insert on public.fractional_investments
for each row execute function public.fn_tokens_sold_after_insert();


create or replace function public.fn_tokens_sold_after_update()
returns trigger
language plpgsql
as $$
declare
  old_active boolean := (old.status = 'active');
  new_active boolean := (new.status = 'active');
begin
  if old_active and new_active then
    -- Amount changed while staying active
    update public.property_fractionalization
      set tokens_sold = coalesce(tokens_sold, 0)
                         - coalesce(old.token_amount, 0)
                         + coalesce(new.token_amount, 0),
          updated_at = now()
    where id = new.property_id;
  elsif old_active and not new_active then
    -- Became inactive -> remove prior amount
    update public.property_fractionalization
      set tokens_sold = coalesce(tokens_sold, 0) - coalesce(old.token_amount, 0),
          updated_at = now()
    where id = new.property_id;
  elsif not old_active and new_active then
    -- Became active -> add new amount
    update public.property_fractionalization
      set tokens_sold = coalesce(tokens_sold, 0) + coalesce(new.token_amount, 0),
          updated_at = now()
    where id = new.property_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_fractional_investments_au on public.fractional_investments;
create trigger trg_fractional_investments_au
after update on public.fractional_investments
for each row execute function public.fn_tokens_sold_after_update();


create or replace function public.fn_tokens_sold_after_delete()
returns trigger
language plpgsql
as $$
begin
  if old.status = 'active' then
    update public.property_fractionalization
      set tokens_sold = coalesce(tokens_sold, 0) - coalesce(old.token_amount, 0),
          updated_at = now()
    where id = old.property_id;
  end if;
  return old;
end;
$$;

drop trigger if exists trg_fractional_investments_ad on public.fractional_investments;
create trigger trg_fractional_investments_ad
after delete on public.fractional_investments
for each row execute function public.fn_tokens_sold_after_delete();


-- 2) Prevent overselling tokens (validation as trigger, not CHECK)

create or replace function public.fn_validate_fractional_order()
returns trigger
language plpgsql
as $$
declare
  rec record;
  old_active boolean := (tg_op = 'UPDATE' and old.status = 'active');
  new_active boolean := (case when tg_op in ('INSERT','UPDATE') then new.status = 'active' else false end);
  delta numeric := 0;
begin
  -- Determine delta that would be applied to tokens_sold by this row change
  if tg_op = 'INSERT' then
    if new_active then
      delta := coalesce(new.token_amount, 0);
    end if;
  elsif tg_op = 'UPDATE' then
    if old_active and new_active then
      delta := coalesce(new.token_amount, 0) - coalesce(old.token_amount, 0);
    elsif old_active and not new_active then
      delta := - coalesce(old.token_amount, 0);
    elsif not old_active and new_active then
      delta := coalesce(new.token_amount, 0);
    else
      delta := 0;
    end if;
  end if;

  select
    pf.total_tokens_available,
    pf.tokens_sold
  into rec
  from public.property_fractionalization pf
  where pf.id = coalesce(new.property_id, old.property_id)
  for update;

  if rec.total_tokens_available is null then
    raise exception 'Property not found or invalid property_id';
  end if;

  if (coalesce(rec.tokens_sold, 0) + coalesce(delta, 0)) > rec.total_tokens_available then
    raise exception 'Not enough tokens available for this investment. Available: %, Requested additional: %',
      (rec.total_tokens_available - coalesce(rec.tokens_sold, 0)), coalesce(delta, 0);
  end if;

  if tg_op = 'INSERT' then
    return new;
  elsif tg_op = 'UPDATE' then
    return new;
  end if;
end;
$$;

drop trigger if exists trg_fractional_investments_bi on public.fractional_investments;
create constraint trigger trg_fractional_investments_bi
before insert on public.fractional_investments
for each row execute function public.fn_validate_fractional_order();

drop trigger if exists trg_fractional_investments_bu on public.fractional_investments;
create constraint trigger trg_fractional_investments_bu
before update on public.fractional_investments
for each row execute function public.fn_validate_fractional_order();


-- 3) Status/availability view derived from property_fractionalization

create or replace view public.v_property_fractionalization_status as
select
  pf.*,
  (pf.total_tokens_available - pf.tokens_sold) as available_tokens,
  case
    when coalesce(pf.is_listed_fractionally, false) = false then 'whole'
    when pf.tokens_sold >= pf.total_tokens_available then 'sold_out'
    else 'open'
  end as status
from public.property_fractionalization pf;


-- 4) Investor-focused view for portfolio (fractional positions + estimated net monthly income)

create or replace view public.v_investor_fractional_positions as
select
  fi.id as investment_id,
  fi.property_id,
  fi.investor_wallet_address,
  fi.token_amount,
  fi.ownership_percentage,
  fi.investment_amount,
  fi.status as investment_status,
  fi.investment_date,
  vpf.property_name,
  vpf.property_location,
  coalesce(vpf.property_image_url, vpf.property_image_url_backup) as property_image_url,
  vpf.monthly_base_rent,
  vpf.total_tokens_available,
  vpf.tokens_sold,
  vpf.available_tokens,
  vpf.status as property_status,
  round(coalesce(vpf.monthly_base_rent, 0) * 0.92 * (coalesce(fi.ownership_percentage, 0) / 100.0), 2) as estimated_net_monthly_income
from public.fractional_investments fi
join public.v_property_fractionalization_status vpf
  on vpf.id = fi.property_id;


-- 5) Helpful indexes

create index if not exists idx_fractional_investments_property
  on public.fractional_investments(property_id);

create index if not exists idx_fractional_investments_investor
  on public.fractional_investments(investor_wallet_address);

create index if not exists idx_property_fractionalization_owner_listed
  on public.property_fractionalization(owner_wallet_address, is_listed_fractionally);

create index if not exists idx_investor_rental_claims_pf_investor
  on public.investor_rental_claims(property_fractionalization_id, investor_wallet_address);

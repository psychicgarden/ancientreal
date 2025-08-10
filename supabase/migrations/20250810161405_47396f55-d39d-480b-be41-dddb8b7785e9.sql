
BEGIN;

TRUNCATE TABLE
  public.investor_rental_claims,
  public.rental_income_distributions,
  public.secondary_trades,
  public.secondary_orders,
  public.staking_transactions,
  public.payment_history,
  public.user_transactions,
  public.user_properties,
  public.developer_investments,
  public.fractional_investments,
  public.user_staking,
  public.appreciation_events
RESTART IDENTITY CASCADE;

-- Reset aggregate counters but keep property/project definitions
UPDATE public.property_fractionalization
SET
  tokens_sold = 0,
  total_rental_collected = 0,
  property_expenses_ytd = 0,
  last_rental_distribution = NULL,
  updated_at = now();

UPDATE public.developer_projects
SET
  current_funding = 0,
  updated_at = now();

-- Ensure realtime continues to work (idempotent)
ALTER TABLE public.user_properties REPLICA IDENTITY FULL;
ALTER TABLE public.user_transactions REPLICA IDENTITY FULL;
ALTER TABLE public.developer_investments REPLICA IDENTITY FULL;
ALTER TABLE public.fractional_investments REPLICA IDENTITY FULL;
ALTER TABLE public.payment_history REPLICA IDENTITY FULL;
ALTER TABLE public.secondary_orders REPLICA IDENTITY FULL;
ALTER TABLE public.secondary_trades REPLICA IDENTITY FULL;

SELECT
  supabase_realtime.add_table('public','user_properties'),
  supabase_realtime.add_table('public','user_transactions'),
  supabase_realtime.add_table('public','developer_investments'),
  supabase_realtime.add_table('public','fractional_investments'),
  supabase_realtime.add_table('public','payment_history'),
  supabase_realtime.add_table('public','secondary_orders'),
  supabase_realtime.add_table('public','secondary_trades');

COMMIT;

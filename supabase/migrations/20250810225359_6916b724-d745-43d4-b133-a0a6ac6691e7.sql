-- Complete portfolio data cleanup
-- Truncate all portfolio-related tables to give clean state

TRUNCATE TABLE public.user_properties RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.user_transactions RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.developer_investments RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.payment_history RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.staking_transactions RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.user_staking RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.secondary_orders RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.secondary_trades RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.investor_rental_claims RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.rental_income_distributions RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.appreciation_events RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.fractional_investments RESTART IDENTITY CASCADE;

-- Reset property fractionalization funding counters
UPDATE public.property_fractionalization 
SET 
  tokens_sold = 0,
  total_rental_collected = 0,
  property_expenses_ytd = 0,
  last_rental_distribution = NULL,
  updated_at = now();

-- Reset developer project funding counters
UPDATE public.developer_projects 
SET 
  current_funding = 0,
  updated_at = now();
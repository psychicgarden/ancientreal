-- Fix the function search path security warning
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';
ALTER FUNCTION public.update_profiles_updated_at() SET search_path = '';
ALTER FUNCTION public.update_staking_updated_at() SET search_path = '';
ALTER FUNCTION public.has_role(_user_id uuid, _role app_role) SET search_path = '';
ALTER FUNCTION public.handle_new_user() SET search_path = '';
ALTER FUNCTION public.calculate_appreciation_distribution(original_price numeric, appraised_value numeric) SET search_path = '';
ALTER FUNCTION public.calculate_daily_yield() SET search_path = '';
ALTER FUNCTION public.distribute_monthly_rental_income(property_frac_id uuid, rental_month date) SET search_path = '';
ALTER FUNCTION public.enforce_trusted_order_update() SET search_path = '';
ALTER FUNCTION public.process_secondary_order_fill(_order_id uuid, _buyer_wallet_address text, _fill_amount numeric, _price_per_token numeric, _tx_hash text) SET search_path = '';
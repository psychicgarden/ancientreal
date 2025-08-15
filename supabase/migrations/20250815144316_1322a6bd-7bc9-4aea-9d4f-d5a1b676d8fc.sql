-- Phase 1: Zero-Risk Security Fixes
-- Enable RLS on archive tables and add wallet-based policies

-- Enable RLS on archive tables
ALTER TABLE public.fractional_investments_archive ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_rental_claims_archive ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secondary_orders_archive ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secondary_trades_archive ENABLE ROW LEVEL SECURITY;

-- Create wallet-based policies for fractional_investments_archive
CREATE POLICY "Users can view their own archived fractional investments"
ON public.fractional_investments_archive
FOR SELECT
USING (investor_wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));

-- Create wallet-based policies for investor_rental_claims_archive
CREATE POLICY "Users can view their own archived rental claims"
ON public.investor_rental_claims_archive
FOR SELECT
USING (investor_wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));

-- Create wallet-based policies for secondary_orders_archive
CREATE POLICY "Users can view their own archived orders"
ON public.secondary_orders_archive
FOR SELECT
USING (owner_wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));

-- Create wallet-based policies for secondary_trades_archive
CREATE POLICY "Users can view their own archived trades"
ON public.secondary_trades_archive
FOR SELECT
USING (buyer_wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text) 
       OR seller_wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));

-- Secure database functions by adding SET search_path TO ''
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_staking_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'avatar_url');
  RETURN NEW;
END; 
$function$;

-- Add input validation trigger for financial amounts
CREATE OR REPLACE FUNCTION public.validate_financial_amounts()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Validate positive amounts for financial fields
  IF TG_TABLE_NAME = 'fractional_investments' THEN
    IF NEW.investment_amount <= 0 OR NEW.token_amount <= 0 OR NEW.ownership_percentage < 0 OR NEW.ownership_percentage > 100 THEN
      RAISE EXCEPTION 'Invalid financial amounts in fractional investments';
    END IF;
  END IF;
  
  IF TG_TABLE_NAME = 'collateral_loans' THEN
    IF NEW.loan_amount_base <= 0 OR NEW.collateral_equity_base <= 0 OR NEW.loan_to_value_percent < 0 OR NEW.loan_to_value_percent > 100 THEN
      RAISE EXCEPTION 'Invalid financial amounts in collateral loans';
    END IF;
  END IF;
  
  IF TG_TABLE_NAME = 'developer_investments' THEN
    IF NEW.investment_amount <= 0 OR NEW.ownership_percentage < 0 OR NEW.ownership_percentage > 100 THEN
      RAISE EXCEPTION 'Invalid financial amounts in developer investments';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Add validation triggers
CREATE TRIGGER validate_fractional_investments_amounts
  BEFORE INSERT OR UPDATE ON public.fractional_investments
  FOR EACH ROW EXECUTE FUNCTION public.validate_financial_amounts();

CREATE TRIGGER validate_collateral_loans_amounts
  BEFORE INSERT OR UPDATE ON public.collateral_loans
  FOR EACH ROW EXECUTE FUNCTION public.validate_financial_amounts();

CREATE TRIGGER validate_developer_investments_amounts
  BEFORE INSERT OR UPDATE ON public.developer_investments
  FOR EACH ROW EXECUTE FUNCTION public.validate_financial_amounts();
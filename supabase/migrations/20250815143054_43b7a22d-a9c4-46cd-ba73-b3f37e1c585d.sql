-- Phase 1: Critical Data Protection - Enable RLS on unprotected tables
-- Enable RLS on mortgage_payments_ledger (currently completely exposed)
ALTER TABLE public.mortgage_payments_ledger ENABLE ROW LEVEL SECURITY;

-- Create wallet-based policy for mortgage payments
CREATE POLICY "Users can view their own mortgage payments" 
ON public.mortgage_payments_ledger 
FOR SELECT 
USING (lower(user_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

CREATE POLICY "System can insert mortgage payments" 
ON public.mortgage_payments_ledger 
FOR INSERT 
WITH CHECK (true);

-- Enable RLS on app_user_properties (currently completely exposed)
ALTER TABLE public.app_user_properties ENABLE ROW LEVEL SECURITY;

-- Create wallet-based policy for user properties
CREATE POLICY "Users can view their own app properties" 
ON public.app_user_properties 
FOR SELECT 
USING (lower(user_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

-- Enable RLS on archive tables (currently completely exposed)
ALTER TABLE public.fractional_investments_archive ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own archived investments" 
ON public.fractional_investments_archive 
FOR SELECT 
USING (lower(investor_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

ALTER TABLE public.investor_rental_claims_archive ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own archived rental claims" 
ON public.investor_rental_claims_archive 
FOR SELECT 
USING (lower(investor_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

ALTER TABLE public.secondary_orders_archive ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own archived orders" 
ON public.secondary_orders_archive 
FOR SELECT 
USING (lower(owner_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

ALTER TABLE public.secondary_trades_archive ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own archived trades" 
ON public.secondary_trades_archive 
FOR SELECT 
USING (lower(buyer_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)) 
       OR lower(seller_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

-- Fix overly permissive policies by replacing 'true' with proper wallet validation
-- Note: Only modifying the most critical ones to avoid breaking existing functionality

-- Update payment_history to use proper wallet validation instead of 'true'
DROP POLICY IF EXISTS "Allow wallet-based access for payment history" ON public.payment_history;

CREATE POLICY "Users can view their own payment history" 
ON public.payment_history 
FOR SELECT 
USING (lower(user_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

CREATE POLICY "Users can create their own payment history" 
ON public.payment_history 
FOR INSERT 
WITH CHECK (lower(user_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

CREATE POLICY "Users can update their own payment history" 
ON public.payment_history 
FOR UPDATE 
USING (lower(user_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

-- Update user_transactions to use proper wallet validation instead of 'true'
DROP POLICY IF EXISTS "Allow wallet-based access for transactions" ON public.user_transactions;

CREATE POLICY "Users can view their own transactions" 
ON public.user_transactions 
FOR SELECT 
USING (lower(user_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

CREATE POLICY "Users can create their own transactions" 
ON public.user_transactions 
FOR INSERT 
WITH CHECK (lower(user_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

CREATE POLICY "Users can update their own transactions" 
ON public.user_transactions 
FOR UPDATE 
USING (lower(user_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

-- Secure database functions by adding proper search path protection
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
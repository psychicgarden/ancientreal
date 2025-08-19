-- Security Hardening: Add proper RLS policies to secure user financial data (Fixed)

-- Fix developer_investments table - restrict to wallet owners only
DROP POLICY IF EXISTS "Users can view their own developer investments" ON public.developer_investments;
DROP POLICY IF EXISTS "Users can create their own developer investments" ON public.developer_investments;
DROP POLICY IF EXISTS "Users can update their own developer investments" ON public.developer_investments;

CREATE POLICY "Users can view their own developer investments" 
ON public.developer_investments 
FOR SELECT 
USING (lower(user_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

CREATE POLICY "Users can create their own developer investments" 
ON public.developer_investments 
FOR INSERT 
WITH CHECK (lower(user_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

CREATE POLICY "Users can update their own developer investments" 
ON public.developer_investments 
FOR UPDATE 
USING (lower(user_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

-- Fix project_submissions table - restrict to creators only  
DROP POLICY IF EXISTS "Users can view their own project submissions" ON public.project_submissions;
DROP POLICY IF EXISTS "Users can create their own project submissions" ON public.project_submissions;
DROP POLICY IF EXISTS "Users can update their own project submissions" ON public.project_submissions;
DROP POLICY IF EXISTS "Admins can view all project submissions" ON public.project_submissions;

CREATE POLICY "Users can view their own project submissions" 
ON public.project_submissions 
FOR SELECT 
USING (lower(creator_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

CREATE POLICY "Users can create their own project submissions" 
ON public.project_submissions 
FOR INSERT 
WITH CHECK (lower(creator_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

CREATE POLICY "Users can update their own project submissions" 
ON public.project_submissions 
FOR UPDATE 
USING (lower(creator_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

-- Fix staking_transactions table - restrict to wallet owners only
DROP POLICY IF EXISTS "Allow wallet-based access for staking transactions" ON public.staking_transactions;

CREATE POLICY "Users can view their own staking transactions" 
ON public.staking_transactions 
FOR SELECT 
USING (lower(user_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

CREATE POLICY "Users can create their own staking transactions" 
ON public.staking_transactions 
FOR INSERT 
WITH CHECK (lower(user_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

CREATE POLICY "System can update staking transaction status" 
ON public.staking_transactions 
FOR UPDATE 
USING (true);

-- Fix platform_fees table - restrict to wallet owners only
DROP POLICY IF EXISTS "Platform fees are viewable by everyone" ON public.platform_fees;
DROP POLICY IF EXISTS "Users can create platform fee records" ON public.platform_fees;

CREATE POLICY "Users can view their own platform fees" 
ON public.platform_fees 
FOR SELECT 
USING (lower(user_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

CREATE POLICY "Users can create their own platform fee records" 
ON public.platform_fees 
FOR INSERT 
WITH CHECK (lower(user_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

-- Fix user_staking table - restrict to wallet owners only
DROP POLICY IF EXISTS "Allow wallet-based access for staking data" ON public.user_staking;

CREATE POLICY "Users can view their own staking data" 
ON public.user_staking 
FOR SELECT 
USING (lower(user_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

CREATE POLICY "Users can create their own staking records" 
ON public.user_staking 
FOR INSERT 
WITH CHECK (lower(user_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

CREATE POLICY "Users can update their own staking data" 
ON public.user_staking 
FOR UPDATE 
USING (lower(user_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

-- Fix user_transactions table to be more secure
DROP POLICY IF EXISTS "Allow users to view and create their own transactions" ON public.user_transactions;

CREATE POLICY "Users can view their own transactions" 
ON public.user_transactions 
FOR SELECT 
USING (lower(user_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

CREATE POLICY "Users can create their own transactions" 
ON public.user_transactions 
FOR INSERT 
WITH CHECK (lower(user_wallet_address) = lower(((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));

CREATE POLICY "System can update transaction status" 
ON public.user_transactions 
FOR UPDATE 
USING (true);
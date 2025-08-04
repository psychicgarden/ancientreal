-- Fix RLS policies to work with wallet-based authentication (development/demo mode)
-- Remove JWT dependency and make policies permissive for wallet address matching

-- Drop existing policies for user_properties
DROP POLICY IF EXISTS "Users can insert their own properties" ON public.user_properties;
DROP POLICY IF EXISTS "Users can update their own properties" ON public.user_properties;
DROP POLICY IF EXISTS "Users can view their own properties" ON public.user_properties;

-- Drop existing policies for user_transactions  
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.user_transactions;
DROP POLICY IF EXISTS "Users can update their own transactions" ON public.user_transactions;
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.user_transactions;

-- Create permissive policies for user_properties (demo/development mode)
CREATE POLICY "Allow wallet-based access for properties" 
ON public.user_properties 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create permissive policies for user_transactions (demo/development mode)
CREATE POLICY "Allow wallet-based access for transactions" 
ON public.user_transactions 
FOR ALL 
USING (true) 
WITH CHECK (true);
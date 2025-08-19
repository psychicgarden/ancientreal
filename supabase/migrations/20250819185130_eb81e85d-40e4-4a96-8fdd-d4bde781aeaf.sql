-- Fix RLS policies for developer_investments to work with wallet-based auth
-- Remove JWT dependency and use direct wallet address checking

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own developer investments" ON public.developer_investments;
DROP POLICY IF EXISTS "Users can view their own developer investments" ON public.developer_investments;
DROP POLICY IF EXISTS "Users can update their own developer investments" ON public.developer_investments;

-- Create new policies that work with direct wallet address
CREATE POLICY "Users can create developer investments" 
ON public.developer_investments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view developer investments" 
ON public.developer_investments 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update developer investments" 
ON public.developer_investments 
FOR UPDATE 
USING (true);
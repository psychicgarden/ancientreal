-- Fix RLS issue by enabling RLS on mortgage_payments_ledger table
ALTER TABLE public.mortgage_payments_ledger ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for mortgage_payments_ledger
CREATE POLICY "Mortgage payments are viewable by everyone" 
ON public.mortgage_payments_ledger 
FOR SELECT 
USING (true);

CREATE POLICY "System can create mortgage payments" 
ON public.mortgage_payments_ledger 
FOR INSERT 
WITH CHECK (true);
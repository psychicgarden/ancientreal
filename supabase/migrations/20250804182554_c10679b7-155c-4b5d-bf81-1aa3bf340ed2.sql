-- Create user_transactions table to log all blockchain transactions
CREATE TABLE public.user_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_wallet_address TEXT NOT NULL,
  transaction_hash TEXT NOT NULL UNIQUE,
  transaction_type TEXT NOT NULL, -- 'property_purchase', 'payment', 'staking', 'trading', etc.
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USDT',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'failed'
  block_number BIGINT,
  gas_used NUMERIC,
  gas_price NUMERIC,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own transactions" 
ON public.user_transactions 
FOR SELECT 
USING (user_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address' OR user_wallet_address = auth.jwt()->>'wallet_address');

CREATE POLICY "Users can insert their own transactions" 
ON public.user_transactions 
FOR INSERT 
WITH CHECK (user_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address' OR user_wallet_address = auth.jwt()->>'wallet_address');

CREATE POLICY "Users can update their own transactions" 
ON public.user_transactions 
FOR UPDATE 
USING (user_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address' OR user_wallet_address = auth.jwt()->>'wallet_address');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_transactions_updated_at
BEFORE UPDATE ON public.user_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_user_transactions_wallet ON public.user_transactions(user_wallet_address);
CREATE INDEX idx_user_transactions_type ON public.user_transactions(transaction_type);
CREATE INDEX idx_user_transactions_status ON public.user_transactions(status);

-- Enable realtime
ALTER TABLE public.user_transactions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_transactions;
-- Create user_staking table to track user deposit balances and staking history
CREATE TABLE public.user_staking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_wallet_address TEXT NOT NULL,
  total_staked NUMERIC NOT NULL DEFAULT 0,
  total_earned NUMERIC NOT NULL DEFAULT 0,
  current_apy NUMERIC NOT NULL DEFAULT 8.0,
  last_yield_calculation TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create staking_transactions table to log all deposits, withdrawals, and yield distributions
CREATE TABLE public.staking_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_wallet_address TEXT NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'yield', 'compound')),
  amount NUMERIC NOT NULL,
  transaction_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  gas_used NUMERIC,
  gas_price NUMERIC,
  block_number BIGINT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_staking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staking_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for wallet-based access
CREATE POLICY "Allow wallet-based access for staking data" 
ON public.user_staking 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow wallet-based access for staking transactions" 
ON public.staking_transactions 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_staking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_user_staking_updated_at
  BEFORE UPDATE ON public.user_staking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_staking_updated_at();

CREATE TRIGGER update_staking_transactions_updated_at
  BEFORE UPDATE ON public.staking_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_staking_updated_at();

-- Create function to calculate and distribute daily yields
CREATE OR REPLACE FUNCTION public.calculate_daily_yield()
RETURNS void AS $$
DECLARE
  user_record RECORD;
  daily_yield NUMERIC;
  annual_rate NUMERIC := 0.08; -- 8% APY
  daily_rate NUMERIC;
BEGIN
  daily_rate := annual_rate / 365;
  
  FOR user_record IN 
    SELECT * FROM public.user_staking 
    WHERE is_active = true AND total_staked > 0
  LOOP
    daily_yield := user_record.total_staked * daily_rate;
    
    -- Update user's earned amount
    UPDATE public.user_staking 
    SET 
      total_earned = total_earned + daily_yield,
      last_yield_calculation = now(),
      updated_at = now()
    WHERE id = user_record.id;
    
    -- Log the yield transaction
    INSERT INTO public.staking_transactions (
      user_wallet_address,
      transaction_type,
      amount,
      status
    ) VALUES (
      user_record.user_wallet_address,
      'yield',
      daily_yield,
      'completed'
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
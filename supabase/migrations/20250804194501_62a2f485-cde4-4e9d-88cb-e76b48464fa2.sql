-- Fix search_path security warnings for the functions
CREATE OR REPLACE FUNCTION public.update_staking_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_daily_yield()
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;
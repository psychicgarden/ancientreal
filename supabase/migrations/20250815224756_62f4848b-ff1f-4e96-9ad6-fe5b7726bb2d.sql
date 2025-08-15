-- Create platform_fees table for detailed analytics
CREATE TABLE public.platform_fees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_wallet_address TEXT NOT NULL,
  property_id UUID REFERENCES public.property_fractionalization(id),
  transaction_hash TEXT,
  fee_amount_usd NUMERIC NOT NULL,
  fee_amount_base BIGINT NOT NULL, -- Fee amount in base units (6 decimals for USDT)
  property_value_usd NUMERIC NOT NULL,
  fee_percentage NUMERIC NOT NULL DEFAULT 3.0, -- Platform fee percentage
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platform_fees ENABLE ROW LEVEL SECURITY;

-- Create policies for platform fees
CREATE POLICY "Platform fees are viewable by everyone" 
ON public.platform_fees 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create platform fee records" 
ON public.platform_fees 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update platform fee status" 
ON public.platform_fees 
FOR UPDATE 
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_platform_fees_updated_at
BEFORE UPDATE ON public.platform_fees
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add platform fee metadata to user_transactions
COMMENT ON COLUMN public.user_transactions.metadata IS 'JSON metadata including platform_fee_amount, platform_fee_id, and other transaction details';
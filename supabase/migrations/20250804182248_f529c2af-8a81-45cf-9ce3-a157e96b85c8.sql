-- Create user_properties table to track property ownership
CREATE TABLE public.user_properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_wallet_address TEXT NOT NULL,
  property_name TEXT NOT NULL,
  property_location TEXT NOT NULL,
  purchase_price NUMERIC NOT NULL,
  down_payment NUMERIC NOT NULL,
  mortgage_id TEXT,
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  current_value NUMERIC NOT NULL DEFAULT 0,
  monthly_payment NUMERIC NOT NULL DEFAULT 0,
  remaining_balance NUMERIC NOT NULL DEFAULT 0,
  equity_percentage NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_properties ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own properties" 
ON public.user_properties 
FOR SELECT 
USING (user_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address' OR user_wallet_address = auth.jwt()->>'wallet_address');

CREATE POLICY "Users can insert their own properties" 
ON public.user_properties 
FOR INSERT 
WITH CHECK (user_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address' OR user_wallet_address = auth.jwt()->>'wallet_address');

CREATE POLICY "Users can update their own properties" 
ON public.user_properties 
FOR UPDATE 
USING (user_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address' OR user_wallet_address = auth.jwt()->>'wallet_address');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_properties_updated_at
BEFORE UPDATE ON public.user_properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER TABLE public.user_properties REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_properties;
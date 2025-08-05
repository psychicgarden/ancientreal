-- Create fractional_investments table to track all fractional ownership
CREATE TABLE public.fractional_investments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL,
  investor_wallet_address TEXT NOT NULL,
  investment_amount NUMERIC NOT NULL,
  token_amount NUMERIC NOT NULL,
  ownership_percentage NUMERIC NOT NULL,
  original_property_price NUMERIC NOT NULL,
  speculation_price NUMERIC,
  investment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create property_fractionalization table to track when properties are fractionalized
CREATE TABLE public.property_fractionalization (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL,
  owner_wallet_address TEXT NOT NULL,
  original_purchase_price NUMERIC NOT NULL,
  current_speculation_price NUMERIC NOT NULL,
  total_tokens_available NUMERIC NOT NULL DEFAULT 1000000,
  tokens_sold NUMERIC NOT NULL DEFAULT 0,
  min_investment NUMERIC NOT NULL DEFAULT 50,
  is_active BOOLEAN NOT NULL DEFAULT true,
  year_10_trigger_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appreciation_events table to track 10-year appreciation events
CREATE TABLE public.appreciation_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL,
  original_price NUMERIC NOT NULL,
  appraised_value NUMERIC NOT NULL,
  capped_appreciation_value NUMERIC NOT NULL,
  ancient_share NUMERIC NOT NULL,
  lender_share NUMERIC NOT NULL,
  buyer_share NUMERIC NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.fractional_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_fractionalization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appreciation_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fractional_investments
CREATE POLICY "Users can view their own fractional investments" 
ON public.fractional_investments 
FOR SELECT 
USING (investor_wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));

CREATE POLICY "Users can create fractional investments" 
ON public.fractional_investments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own fractional investments" 
ON public.fractional_investments 
FOR UPDATE 
USING (investor_wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));

-- RLS Policies for property_fractionalization
CREATE POLICY "Property fractionalization is viewable by everyone" 
ON public.property_fractionalization 
FOR SELECT 
USING (true);

CREATE POLICY "Property owners can create fractionalization" 
ON public.property_fractionalization 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Property owners can update their fractionalization" 
ON public.property_fractionalization 
FOR UPDATE 
USING (owner_wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));

-- RLS Policies for appreciation_events
CREATE POLICY "Appreciation events are viewable by everyone" 
ON public.appreciation_events 
FOR SELECT 
USING (true);

CREATE POLICY "System can create appreciation events" 
ON public.appreciation_events 
FOR INSERT 
WITH CHECK (true);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_fractional_investments_updated_at
BEFORE UPDATE ON public.fractional_investments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_property_fractionalization_updated_at
BEFORE UPDATE ON public.property_fractionalization
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate appreciation distribution
CREATE OR REPLACE FUNCTION public.calculate_appreciation_distribution(
  original_price NUMERIC,
  appraised_value NUMERIC
) RETURNS TABLE (
  capped_appreciation NUMERIC,
  ancient_share NUMERIC,
  lender_share NUMERIC,
  buyer_share NUMERIC
) AS $$
DECLARE
  appreciation_amount NUMERIC;
  capped_amount NUMERIC;
BEGIN
  -- Calculate appreciation (capped at 110%)
  appreciation_amount := appraised_value - original_price;
  capped_amount := LEAST(appreciation_amount, original_price * 1.10);
  
  -- Return the distribution (50% buyer, 40% ancient, 10% lenders)
  RETURN QUERY SELECT 
    capped_amount,
    capped_amount * 0.40, -- Ancient share
    capped_amount * 0.10, -- Lender share
    capped_amount * 0.50; -- Buyer share
END;
$$ LANGUAGE plpgsql;
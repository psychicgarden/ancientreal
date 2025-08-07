-- Create rental income distribution table
CREATE TABLE public.rental_income_distributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_fractionalization_id UUID NOT NULL,
  distribution_date DATE NOT NULL,
  total_rental_income NUMERIC NOT NULL DEFAULT 0,
  property_expenses NUMERIC NOT NULL DEFAULT 0,
  net_rental_income NUMERIC NOT NULL DEFAULT 0,
  management_fee_percent NUMERIC NOT NULL DEFAULT 8,
  management_fee_amount NUMERIC NOT NULL DEFAULT 0,
  distributable_amount NUMERIC NOT NULL DEFAULT 0,
  expense_breakdown JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rental_income_distributions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Rental distributions are viewable by everyone" 
ON public.rental_income_distributions 
FOR SELECT 
USING (true);

CREATE POLICY "System can create rental distributions" 
ON public.rental_income_distributions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update rental distributions" 
ON public.rental_income_distributions 
FOR UPDATE 
USING (true);

-- Create individual investor claims table
CREATE TABLE public.investor_rental_claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  distribution_id UUID NOT NULL,
  property_fractionalization_id UUID NOT NULL,
  investor_wallet_address TEXT NOT NULL,
  ownership_percentage NUMERIC NOT NULL DEFAULT 0,
  claimable_amount NUMERIC NOT NULL DEFAULT 0,
  claimed_amount NUMERIC NOT NULL DEFAULT 0,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.investor_rental_claims ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Investors can view their own rental claims" 
ON public.investor_rental_claims 
FOR SELECT 
USING (true);

CREATE POLICY "System can create rental claims" 
ON public.investor_rental_claims 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Investors can update their own claims" 
ON public.investor_rental_claims 
FOR UPDATE 
USING (true);

-- Add rental income tracking to property_fractionalization
ALTER TABLE public.property_fractionalization 
ADD COLUMN monthly_base_rent NUMERIC DEFAULT 2050,
ADD COLUMN last_rental_distribution DATE,
ADD COLUMN total_rental_collected NUMERIC DEFAULT 0,
ADD COLUMN property_expenses_ytd NUMERIC DEFAULT 0;

-- Add year 10 appreciation data
ALTER TABLE public.property_fractionalization 
ADD COLUMN original_property_value NUMERIC DEFAULT 150000,
ADD COLUMN projected_appreciation_percent NUMERIC DEFAULT 181,
ADD COLUMN appreciation_cap_percent NUMERIC DEFAULT 10,
ADD COLUMN investor_appreciation_burden_percent NUMERIC DEFAULT 50;

-- Create function to calculate and distribute monthly rental income
CREATE OR REPLACE FUNCTION public.distribute_monthly_rental_income(
  property_frac_id UUID,
  rental_month DATE DEFAULT CURRENT_DATE
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  property_record RECORD;
  monthly_rent NUMERIC;
  expense_rate NUMERIC := 0.20; -- 20% for expenses (maintenance, taxes, etc.)
  management_fee_rate NUMERIC := 0.08; -- 8% management fee
  total_expenses NUMERIC;
  management_fee NUMERIC;
  net_distributable NUMERIC;
  investor_record RECORD;
  distribution_id UUID;
BEGIN
  -- Get property details
  SELECT * INTO property_record 
  FROM property_fractionalization 
  WHERE id = property_frac_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Property fractionalization not found';
  END IF;
  
  monthly_rent := property_record.monthly_base_rent;
  total_expenses := monthly_rent * expense_rate;
  management_fee := monthly_rent * management_fee_rate;
  net_distributable := monthly_rent - total_expenses - management_fee;
  
  -- Create rental distribution record
  INSERT INTO rental_income_distributions (
    property_fractionalization_id,
    distribution_date,
    total_rental_income,
    property_expenses,
    net_rental_income,
    management_fee_percent,
    management_fee_amount,
    distributable_amount,
    expense_breakdown
  ) VALUES (
    property_frac_id,
    rental_month,
    monthly_rent,
    total_expenses,
    monthly_rent - total_expenses,
    management_fee_rate * 100,
    management_fee,
    net_distributable,
    jsonb_build_object(
      'maintenance', total_expenses * 0.4,
      'property_taxes', total_expenses * 0.3,
      'insurance', total_expenses * 0.2,
      'utilities', total_expenses * 0.1
    )
  ) RETURNING id INTO distribution_id;
  
  -- Create individual claims for each investor
  FOR investor_record IN 
    SELECT 
      investor_wallet_address,
      SUM(ownership_percentage) as total_ownership
    FROM fractional_investments 
    WHERE property_id = property_frac_id 
    AND status = 'active'
    GROUP BY investor_wallet_address
  LOOP
    INSERT INTO investor_rental_claims (
      distribution_id,
      property_fractionalization_id,
      investor_wallet_address,
      ownership_percentage,
      claimable_amount
    ) VALUES (
      distribution_id,
      property_frac_id,
      investor_record.investor_wallet_address,
      investor_record.total_ownership,
      net_distributable * (investor_record.total_ownership / 100)
    );
  END LOOP;
  
  -- Update property tracking
  UPDATE property_fractionalization 
  SET 
    last_rental_distribution = rental_month,
    total_rental_collected = total_rental_collected + monthly_rent,
    property_expenses_ytd = property_expenses_ytd + total_expenses,
    updated_at = now()
  WHERE id = property_frac_id;
END;
$$;

-- Create trigger for updated_at columns
CREATE TRIGGER update_rental_distributions_updated_at
BEFORE UPDATE ON public.rental_income_distributions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rental_claims_updated_at
BEFORE UPDATE ON public.investor_rental_claims
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
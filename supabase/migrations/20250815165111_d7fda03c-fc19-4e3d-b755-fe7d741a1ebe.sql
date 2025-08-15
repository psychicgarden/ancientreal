-- Fix property names and set up mortgage groups correctly
-- Update Art Deco Loft to be a mortgage group
UPDATE public.property_fractionalization 
SET 
  investment_type = 'mortgage_group',
  group_size_limit = 5,
  mortgage_down_payment_total = 70000,
  down_payment_per_person = 14000,
  updated_at = now()
WHERE property_name = 'Art Deco Loft';

-- Update Bahia Ocean Villa to be a mortgage group  
UPDATE public.property_fractionalization 
SET 
  investment_type = 'mortgage_group',
  group_size_limit = 6,
  mortgage_down_payment_total = 60000,
  down_payment_per_person = 10000,
  updated_at = now()
WHERE property_name = 'Bahia Ocean Villa';

-- Ensure Oceanview Loft remains fractional for comparison
UPDATE public.property_fractionalization 
SET 
  investment_type = 'fractional',
  is_listed_fractionally = true,
  updated_at = now()
WHERE property_name = 'Oceanview Loft';
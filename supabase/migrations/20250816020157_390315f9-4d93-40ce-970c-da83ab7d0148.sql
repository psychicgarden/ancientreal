-- Update property names and financial data to match original reference
UPDATE public.property_fractionalization 
SET 
  property_name = 'Oceanview Loft',
  monthly_base_rent = 2266,
  current_speculation_price = 150000,
  original_purchase_price = 150000,
  original_property_value = 150000,
  updated_at = now()
WHERE property_name = 'Ericeira Coastal Villa';

UPDATE public.property_fractionalization 
SET 
  property_name = 'Art Deco Loft',
  monthly_base_rent = 1969,
  current_speculation_price = 129000,
  original_purchase_price = 129000,
  original_property_value = 129000,
  updated_at = now()
WHERE property_name = 'Mazunte Beach Villa';

UPDATE public.property_fractionalization 
SET 
  monthly_base_rent = 1719,
  current_speculation_price = 130000,
  original_purchase_price = 130000,
  original_property_value = 130000,
  updated_at = now()
WHERE property_name = 'Bahia Ocean Villa';
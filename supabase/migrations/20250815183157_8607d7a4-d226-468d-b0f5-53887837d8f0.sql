-- Update monthly_base_rent to reflect net cash flow after utilities and property tax
-- Bahia Ocean Villa: $1,800 - $65 - $16 = $1,719
UPDATE public.property_fractionalization 
SET monthly_base_rent = 1719,
    updated_at = now()
WHERE property_name ILIKE '%bahia%' 
  AND property_location ILIKE '%brazil%';

-- Art Deco Loft: $2,050 - $65 - $16 = $1,969  
UPDATE public.property_fractionalization 
SET monthly_base_rent = 1969,
    updated_at = now()
WHERE property_name ILIKE '%art deco%' 
  AND property_location ILIKE '%mexico%';

-- Oceanview Loft (Ericeira): $2,350 - $65 - $19 = $2,266
UPDATE public.property_fractionalization 
SET monthly_base_rent = 2266,
    updated_at = now()
WHERE property_name ILIKE '%ericeira%' 
  AND property_location ILIKE '%portugal%';
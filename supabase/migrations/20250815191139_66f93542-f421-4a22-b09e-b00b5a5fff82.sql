-- Fix Oceanview Loft rent from 2350 to 2266
UPDATE property_fractionalization 
SET monthly_base_rent = 2266
WHERE property_name ILIKE '%oceanview%' OR property_name ILIKE '%ericeira%';
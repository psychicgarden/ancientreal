-- Update down payment values in property_fractionalization table to match citizenship costs
UPDATE property_fractionalization 
SET down_payment_per_person = 26000 
WHERE property_name = 'Bahia Ocean Villa';

UPDATE property_fractionalization 
SET down_payment_per_person = 30000 
WHERE property_name = 'Oceanview Loft';

UPDATE property_fractionalization 
SET down_payment_per_person = 25800 
WHERE property_name = 'Art Deco Loft';
-- Update down payment values to match citizenship costs
UPDATE properties 
SET down_payment = 26000 
WHERE name = 'Bahia Ocean Villa';

UPDATE properties 
SET down_payment = 30000 
WHERE name = 'Oceanview Loft';

UPDATE properties 
SET down_payment = 25800 
WHERE name = 'Art Deco Loft';
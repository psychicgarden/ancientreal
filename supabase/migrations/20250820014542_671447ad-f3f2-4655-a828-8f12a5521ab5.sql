-- Update the oceanview loft property location from Portugal to Mallorca, Spain
UPDATE property_fractionalization 
SET 
  property_location = 'Mallorca, Spain',
  property_description = CASE 
    WHEN property_description IS NOT NULL 
    THEN REPLACE(REPLACE(property_description, 'Ericeira', 'Mallorca'), 'Portugal', 'Spain')
    ELSE 'Stunning oceanview loft in Mallorca, Spain with Mediterranean views and luxury amenities'
  END,
  updated_at = now()
WHERE property_location = 'Ericeira, Portugal' 
  AND property_name = 'Oceanview Loft';
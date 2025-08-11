-- Update property images with new boho and art deco styles

-- Update Art Deco Loft to Boho Art Deco Loft
UPDATE property_fractionalization 
SET 
  property_image_url = '/src/assets/boho-art-deco-loft-mexico.jpg',
  updated_at = now()
WHERE property_name = 'Art Deco Loft';

-- Update Bahia Ocean Villa with luxury boho beach bungalow image  
UPDATE property_fractionalization
SET
  property_image_url = '/src/assets/luxury-boho-beach-bungalow-bahia.jpg',
  updated_at = now()
WHERE property_name = 'Bahia Ocean Villa';

-- Update Ericeira Oceanview Loft with art deco coastal image
UPDATE property_fractionalization
SET
  property_image_url = '/src/assets/art-deco-coastal-ericeira.jpg',
  updated_at = now()
WHERE property_name = 'Oceanview Loft' AND property_location = 'Ericeira, Portugal';
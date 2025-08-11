-- Update property names and image URLs with new generated images

-- Update Mazunte Beach Villa to Art Deco Loft
UPDATE property_fractionalization 
SET 
  property_name = 'Art Deco Loft',
  property_image_url = '/src/assets/art-deco-loft-mexico.jpg',
  updated_at = now()
WHERE property_name = 'Mazunte Beach Villa';

-- Update Bahia Ocean Villa with new beach bungalow image  
UPDATE property_fractionalization
SET
  property_image_url = '/src/assets/bahia-beach-bungalow.jpg',
  updated_at = now()
WHERE property_name = 'Bahia Ocean Villa';

-- Update Ericeira Oceanview Loft with new coastal apartment image
UPDATE property_fractionalization
SET
  property_image_url = '/src/assets/ericeira-coastal-apartment.jpg',
  updated_at = now()
WHERE property_name = 'Oceanview Loft' AND property_location = 'Ericeira, Portugal';
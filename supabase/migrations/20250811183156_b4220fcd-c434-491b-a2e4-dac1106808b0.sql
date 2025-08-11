-- Update existing properties with new financial models

-- Update Mazunte property (Art Deco Loft -> Mazunte Beach Villa)
UPDATE property_fractionalization 
SET 
  property_name = 'Mazunte Beach Villa',
  property_location = 'Mazunte, Mexico',
  current_speculation_price = 129000,
  original_purchase_price = 129000,
  monthly_base_rent = 2000,
  property_image_url = '/src/assets/villa-tulum.jpg',
  updated_at = now()
WHERE property_name = 'Art Deco Loft';

-- Update Bahia property (Bahia Ocean Chalet -> Bahia Ocean Villa)  
UPDATE property_fractionalization
SET
  property_name = 'Bahia Ocean Villa',
  property_location = 'Bahia, Brazil', 
  current_speculation_price = 120000,
  original_purchase_price = 120000,
  monthly_base_rent = 1800,
  property_image_url = '/src/assets/beach-chalet.jpg',
  updated_at = now()
WHERE property_name = 'Bahia Ocean Chalet';

-- Update Ibiza property to Ericeira (Ibiza Villa -> Ericeira Coastal Villa)
UPDATE property_fractionalization
SET
  property_name = 'Ericeira Coastal Villa',
  property_location = 'Ericeira, Portugal',
  current_speculation_price = 150000,
  original_purchase_price = 150000, 
  monthly_base_rent = 2400,
  property_image_url = '/src/assets/villa-ericeira-portugal.jpg',
  updated_at = now()
WHERE property_name = 'Ibiza Villa';
-- Update Ericeira property with new artistic boho image and corrected monthly yield

-- Update Ericeira Oceanview Loft with new artistic boho image and correct monthly yield
UPDATE property_fractionalization
SET
  property_image_url = '/src/assets/artistic-boho-coastal-ericeira.jpg',
  monthly_base_rent = 944,
  updated_at = now()
WHERE property_name = 'Oceanview Loft' AND property_location = 'Ericeira, Portugal';
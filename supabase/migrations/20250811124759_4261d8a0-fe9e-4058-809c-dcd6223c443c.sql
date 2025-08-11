-- Phase 1: Clean up ghost entries and fix data structure
-- Delete ghost properties with null names
DELETE FROM property_fractionalization 
WHERE property_name IS NULL OR property_name = '';

-- Delete the original 3 seed properties that should not be available as fractional investments
DELETE FROM property_fractionalization 
WHERE owner_wallet_address = '0x1234567890123456789012345678901234567890';

-- Add missing columns to ensure proper property details can be stored
ALTER TABLE property_fractionalization 
ADD COLUMN IF NOT EXISTS property_image_url_backup TEXT,
ADD COLUMN IF NOT EXISTS is_listed_fractionally BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS listing_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS source_property_id UUID REFERENCES user_properties(id);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_property_fractionalization_listed 
ON property_fractionalization(is_listed_fractionally, is_active);

-- Update property_fractionalization to ensure all required fields have proper constraints
UPDATE property_fractionalization 
SET 
  property_image_url = COALESCE(property_image_url, '/src/assets/villa-bali.jpg'),
  property_description = COALESCE(property_description, 'Premium property investment opportunity'),
  property_type = COALESCE(property_type, 'residential'),
  is_listed_fractionally = true,
  listing_date = COALESCE(listing_date, now())
WHERE property_name IS NOT NULL;
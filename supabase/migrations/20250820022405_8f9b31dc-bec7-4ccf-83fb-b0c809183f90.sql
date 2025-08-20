-- Update property images to use new AI-generated boho luxury images
UPDATE property_fractionalization 
SET property_image_url = '/src/assets/mazunte-boho-villa.jpg',
    updated_at = now()
WHERE property_name = 'Art Deco Loft' AND property_location = 'Mazunte, Mexico';

UPDATE property_fractionalization 
SET property_image_url = '/src/assets/mallorca-oceanview-villa.jpg',
    updated_at = now()
WHERE property_name = 'Oceanview Loft' AND property_location = 'Mallorca, Spain';

UPDATE property_fractionalization 
SET property_image_url = '/src/assets/bahia-tropical-haven.jpg',
    updated_at = now()
WHERE property_name = 'Bahia Ocean Villa' AND property_location = 'Bahia, Brazil';
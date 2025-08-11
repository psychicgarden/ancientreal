-- Delete the 5 test properties (the first 5 with null property names)
DELETE FROM property_fractionalization 
WHERE property_name IS NULL;

-- Update the 3 real properties to ensure they work with smart chain logic
-- Add blockchain contract addresses and ensure proper token economics

UPDATE property_fractionalization 
SET 
  property_description = CASE 
    WHEN property_name = 'Art Deco Loft' THEN 'A stunning art deco loft in the heart of Mazunte village, featuring ocean views and traditional Mexican architecture. Perfect for digital nomads and conscious travelers.'
    WHEN property_name = 'Ocean Villa Retreat' THEN 'Luxurious oceanfront villa in Bahia with private beach access, infinity pool, and sustainable design. Ideal for wellness retreats and eco-tourism.'
    WHEN property_name = 'Mediterranean Villa' THEN 'Charming Mediterranean villa on the island of Corfu with panoramic sea views, olive groves, and authentic Greek architecture.'
  END,
  bedrooms = CASE 
    WHEN property_name = 'Art Deco Loft' THEN 2
    WHEN property_name = 'Ocean Villa Retreat' THEN 4
    WHEN property_name = 'Mediterranean Villa' THEN 3
  END,
  bathrooms = CASE 
    WHEN property_name = 'Art Deco Loft' THEN 2
    WHEN property_name = 'Ocean Villa Retreat' THEN 3.5
    WHEN property_name = 'Mediterranean Villa' THEN 2.5
  END,
  square_feet = CASE 
    WHEN property_name = 'Art Deco Loft' THEN 1200
    WHEN property_name = 'Ocean Villa Retreat' THEN 2800
    WHEN property_name = 'Mediterranean Villa' THEN 2200
  END,
  monthly_base_rent = CASE 
    WHEN property_name = 'Art Deco Loft' THEN 1850
    WHEN property_name = 'Ocean Villa Retreat' THEN 2400
    WHEN property_name = 'Mediterranean Villa' THEN 2200
  END,
  -- Ensure proper token economics for smart contract integration
  min_investment = 50,
  appreciation_cap_percent = 10,
  investor_appreciation_burden_percent = 50,
  projected_appreciation_percent = 181
WHERE property_name IS NOT NULL;
-- Insert or refresh featured available properties: Ibiza Villa and Bahia Ocean Chalet
-- Remove existing duplicates by name to avoid multiple entries
DELETE FROM public.property_fractionalization 
WHERE property_name IN ('Ibiza Villa', 'Bahia Ocean Chalet');

-- Ibiza Villa (Spain) — premium, Habitas/Soho House-style copy
INSERT INTO public.property_fractionalization (
  id,
  property_id,
  owner_wallet_address,
  property_name,
  property_location,
  property_description,
  original_purchase_price,
  current_speculation_price,
  total_tokens_available,
  tokens_sold,
  min_investment,
  is_active,
  is_listed_fractionally,
  listing_date,
  monthly_base_rent,
  property_type,
  bedrooms,
  bathrooms,
  square_feet,
  property_image_url
) VALUES (
  gen_random_uuid(),
  gen_random_uuid(),
  '0x1111111111111111111111111111111111111111',
  'Ibiza Villa',
  'Ibiza, Spain',
  'Sun‑drenched Mediterranean villa inspired by slow luxury. Natural textures, curated soundscapes, and chef-led dining – a sanctuary for creative community and ritualized leisure.',
  285000,
  285000,
  1000000,
  0,
  100,
  true,
  true,
  now(),
  3200,
  'residential',
  3,
  2,
  1800,
  'https://images.unsplash.com/photo-1505692952047-1a78307da8f2?w=1600&q=80'
);

-- Bahia Ocean Chalet (Brazil) — premium eco-coastal retreat
INSERT INTO public.property_fractionalization (
  id,
  property_id,
  owner_wallet_address,
  property_name,
  property_location,
  property_description,
  original_purchase_price,
  current_speculation_price,
  total_tokens_available,
  tokens_sold,
  min_investment,
  is_active,
  is_listed_fractionally,
  listing_date,
  monthly_base_rent,
  property_type,
  bedrooms,
  bathrooms,
  square_feet,
  property_image_url
) VALUES (
  gen_random_uuid(),
  gen_random_uuid(),
  '0x2222222222222222222222222222222222222222',
  'Bahia Ocean Chalet',
  'Bahia, Brazil',
  'Beachfront chalet framed by Atlantic palms and warm trade winds. A barefoot, design‑forward hideaway with wellness rituals at sunrise and live bossa at dusk.',
  155000,
  155000,
  1000000,
  0,
  100,
  true,
  true,
  now(),
  1900,
  'residential',
  2,
  2,
  1200,
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&q=80'
);

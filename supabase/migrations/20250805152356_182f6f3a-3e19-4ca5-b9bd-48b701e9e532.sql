-- Insert demo properties for fractional investment testing
INSERT INTO public.user_properties (
  property_name, 
  property_location, 
  purchase_price, 
  current_value, 
  down_payment, 
  remaining_balance, 
  equity_percentage,
  monthly_payment,
  user_wallet_address,
  image_url
) VALUES 
(
  'Modern Loft in Tulum', 
  'Tulum, Mexico', 
  150000, 
  150000, 
  30000, 
  120000, 
  20, 
  850,
  '0x1234567890123456789012345678901234567890',
  '/src/assets/loft-bahia.jpg'
),
(
  'Beachfront Villa Mykonos', 
  'Mykonos, Greece', 
  450000, 
  450000, 
  90000, 
  360000, 
  20, 
  2400,
  '0x1234567890123456789012345678901234567891',
  '/src/assets/villa-greece.jpg'
),
(
  'Eco Smart City Apartment', 
  'Costa Rica', 
  85000, 
  85000, 
  17000, 
  68000, 
  20, 
  520,
  '0x1234567890123456789012345678901234567892',
  '/src/assets/eco-smart-city.jpg'
),
(
  'Bali Jungle Resort', 
  'Ubud, Bali', 
  220000, 
  220000, 
  44000, 
  176000, 
  20, 
  1350,
  '0x1234567890123456789012345678901234567893',
  '/src/assets/bali-jungle-resort.jpg'
),
(
  'Desert Oasis Morocco', 
  'Marrakech, Morocco', 
  95000, 
  95000, 
  19000, 
  76000, 
  20, 
  580,
  '0x1234567890123456789012345678901234567894',
  '/src/assets/desert-oasis-morocco.jpg'
);

-- Create fractional property records for the above properties
INSERT INTO public.property_fractionalization (
  property_id,
  owner_wallet_address,
  original_purchase_price,
  current_speculation_price,
  total_tokens_available,
  tokens_sold,
  min_investment,
  year_10_trigger_date
) 
SELECT 
  up.id,
  up.user_wallet_address,
  up.purchase_price,
  CASE 
    WHEN up.property_name = 'Modern Loft in Tulum' THEN 200000
    WHEN up.property_name = 'Beachfront Villa Mykonos' THEN 650000
    WHEN up.property_name = 'Eco Smart City Apartment' THEN 120000
    WHEN up.property_name = 'Bali Jungle Resort' THEN 320000
    WHEN up.property_name = 'Desert Oasis Morocco' THEN 140000
  END,
  1000000,
  CASE 
    WHEN up.property_name = 'Modern Loft in Tulum' THEN 125000
    WHEN up.property_name = 'Beachfront Villa Mykonos' THEN 85000
    WHEN up.property_name = 'Eco Smart City Apartment' THEN 45000
    WHEN up.property_name = 'Bali Jungle Resort' THEN 180000
    WHEN up.property_name = 'Desert Oasis Morocco' THEN 35000
  END,
  CASE 
    WHEN up.property_name = 'Modern Loft in Tulum' THEN 50
    WHEN up.property_name = 'Beachfront Villa Mykonos' THEN 250
    WHEN up.property_name = 'Eco Smart City Apartment' THEN 25
    WHEN up.property_name = 'Bali Jungle Resort' THEN 100
    WHEN up.property_name = 'Desert Oasis Morocco' THEN 50
  END,
  now() + interval '10 years'
FROM public.user_properties up
WHERE up.property_name IN (
  'Modern Loft in Tulum', 
  'Beachfront Villa Mykonos', 
  'Eco Smart City Apartment', 
  'Bali Jungle Resort',
  'Desert Oasis Morocco'
);

-- Create some sample fractional investments to show ownership distribution
INSERT INTO public.fractional_investments (
  property_id,
  investor_wallet_address,
  investment_amount,
  token_amount,
  ownership_percentage,
  original_property_price,
  speculation_price
)
SELECT 
  pf.property_id,
  '0x9876543210987654321098765432109876543210',
  2500,
  12500,
  1.25,
  pf.original_purchase_price,
  pf.current_speculation_price
FROM public.property_fractionalization pf
WHERE pf.id = (SELECT id FROM public.property_fractionalization WHERE original_purchase_price = 150000 LIMIT 1)

UNION ALL

SELECT 
  pf.property_id,
  '0x1111222233334444555566667777888899990000',
  1500,
  7500,
  0.75,
  pf.original_purchase_price,
  pf.current_speculation_price
FROM public.property_fractionalization pf
WHERE pf.id = (SELECT id FROM public.property_fractionalization WHERE original_purchase_price = 150000 LIMIT 1)

UNION ALL

SELECT 
  pf.property_id,
  '0xAAAABBBBCCCCDDDDEEEEFFFF0000111122223333',
  5000,
  12500,
  1.11,
  pf.original_purchase_price,
  pf.current_speculation_price
FROM public.property_fractionalization pf
WHERE pf.id = (SELECT id FROM public.property_fractionalization WHERE original_purchase_price = 450000 LIMIT 1);
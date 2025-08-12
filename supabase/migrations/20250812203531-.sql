-- Create sample rental income distributions for demo purposes
-- First, let's get the existing property fractionalization IDs
INSERT INTO public.rental_income_distributions (
  property_fractionalization_id,
  distribution_date,
  total_rental_income,
  property_expenses,
  net_rental_income,
  management_fee_percent,
  management_fee_amount,
  distributable_amount,
  expense_breakdown
) VALUES 
-- Art Deco Loft Mexico (Traditional + Airbnb mix)
(
  (SELECT id FROM property_fractionalization WHERE property_name ILIKE '%art deco loft%' LIMIT 1),
  '2024-01-01',
  3250.00,
  650.00,
  2600.00,
  8.0,
  260.00,
  2340.00,
  jsonb_build_object(
    'cleaning_fees', 180.00,
    'airbnb_service_fee', 162.50,
    'property_taxes', 130.00,
    'insurance', 97.50,
    'utilities', 65.00,
    'maintenance', 15.00
  )
),
(
  (SELECT id FROM property_fractionalization WHERE property_name ILIKE '%art deco loft%' LIMIT 1),
  '2024-02-01',
  2890.00,
  578.00,
  2312.00,
  8.0,
  231.20,
  2080.80,
  jsonb_build_object(
    'cleaning_fees', 165.00,
    'airbnb_service_fee', 144.50,
    'property_taxes', 130.00,
    'insurance', 97.50,
    'utilities', 41.00,
    'maintenance', 0.00
  )
),
(
  (SELECT id FROM property_fractionalization WHERE property_name ILIKE '%art deco loft%' LIMIT 1),
  '2024-03-01',
  4180.00,
  836.00,
  3344.00,
  8.0,
  334.40,
  3009.60,
  jsonb_build_object(
    'cleaning_fees', 240.00,
    'airbnb_service_fee', 209.00,
    'property_taxes', 130.00,
    'insurance', 97.50,
    'utilities', 75.00,
    'maintenance', 84.50
  )
),
-- Bahia Ocean Villa (Heavy Airbnb focus)
(
  (SELECT id FROM property_fractionalization WHERE property_name ILIKE '%bahia%' LIMIT 1),
  '2024-01-01',
  2950.00,
  590.00,
  2360.00,
  8.0,
  236.00,
  2124.00,
  jsonb_build_object(
    'cleaning_fees', 210.00,
    'airbnb_service_fee', 147.50,
    'property_taxes', 98.00,
    'insurance', 73.50,
    'utilities', 49.00,
    'maintenance', 12.00
  )
),
(
  (SELECT id FROM property_fractionalization WHERE property_name ILIKE '%bahia%' LIMIT 1),
  '2024-02-01',
  3780.00,
  756.00,
  3024.00,
  8.0,
  302.40,
  2721.60,
  jsonb_build_object(
    'cleaning_fees', 270.00,
    'airbnb_service_fee', 189.00,
    'property_taxes', 98.00,
    'insurance', 73.50,
    'utilities', 63.00,
    'maintenance', 62.50
  )
),
(
  (SELECT id FROM property_fractionalization WHERE property_name ILIKE '%bahia%' LIMIT 1),
  '2024-03-01',
  4520.00,
  904.00,
  3616.00,
  8.0,
  361.60,
  3254.40,
  jsonb_build_object(
    'cleaning_fees', 324.00,
    'airbnb_service_fee', 226.00,
    'property_taxes', 98.00,
    'insurance', 73.50,
    'utilities', 81.00,
    'maintenance', 101.50
  )
);

-- Now create investor rental claims for users with fractional investments
-- Get distributions and create claims
WITH distribution_claims AS (
  SELECT 
    rid.id as distribution_id,
    rid.property_fractionalization_id,
    rid.distributable_amount,
    fi.investor_wallet_address,
    fi.ownership_percentage
  FROM rental_income_distributions rid
  JOIN fractional_investments fi ON fi.property_id = rid.property_fractionalization_id
  WHERE fi.status = 'active'
)
INSERT INTO public.investor_rental_claims (
  distribution_id,
  property_fractionalization_id,
  investor_wallet_address,
  ownership_percentage,
  claimable_amount,
  claimed_amount,
  claimed_at
) 
SELECT 
  dc.distribution_id,
  dc.property_fractionalization_id,
  dc.investor_wallet_address,
  dc.ownership_percentage,
  dc.distributable_amount * (dc.ownership_percentage / 100),
  CASE 
    -- Mark some as claimed (older months)
    WHEN random() < 0.7 THEN dc.distributable_amount * (dc.ownership_percentage / 100)
    ELSE 0
  END,
  CASE 
    WHEN random() < 0.7 THEN now() - interval '1-30 days'
    ELSE NULL
  END
FROM distribution_claims dc;

-- Add income source and booking details to rental_income_distributions
ALTER TABLE public.rental_income_distributions 
ADD COLUMN IF NOT EXISTS income_source_breakdown jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS airbnb_metrics jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS booking_details jsonb DEFAULT '{}';

-- Update existing distributions with Airbnb data
UPDATE public.rental_income_distributions 
SET 
  income_source_breakdown = jsonb_build_object(
    'traditional_rent', 
      CASE 
        WHEN property_fractionalization_id = (SELECT id FROM property_fractionalization WHERE property_name ILIKE '%art deco loft%' LIMIT 1)
        THEN total_rental_income * 0.4
        ELSE total_rental_income * 0.1
      END,
    'airbnb_bookings', 
      CASE 
        WHEN property_fractionalization_id = (SELECT id FROM property_fractionalization WHERE property_name ILIKE '%art deco loft%' LIMIT 1)
        THEN total_rental_income * 0.6
        ELSE total_rental_income * 0.9
      END
  ),
  airbnb_metrics = jsonb_build_object(
    'occupancy_rate', 
      CASE 
        WHEN extract(month from distribution_date) IN (1,2) THEN 72 + random() * 8
        WHEN extract(month from distribution_date) = 3 THEN 85 + random() * 10
        ELSE 80 + random() * 15
      END,
    'average_nightly_rate', 
      CASE 
        WHEN property_fractionalization_id = (SELECT id FROM property_fractionalization WHERE property_name ILIKE '%art deco loft%' LIMIT 1)
        THEN 145 + random() * 30
        ELSE 120 + random() * 25
      END,
    'guest_rating', 4.7 + random() * 0.3,
    'total_nights_booked', 
      CASE 
        WHEN extract(month from distribution_date) IN (1,2) THEN 18 + floor(random() * 5)
        WHEN extract(month from distribution_date) = 3 THEN 22 + floor(random() * 6)
        ELSE 20 + floor(random() * 8)
      END
  ),
  booking_details = jsonb_build_object(
    'total_bookings', 8 + floor(random() * 6),
    'repeat_guests', floor(random() * 3),
    'cancellations', floor(random() * 2),
    'average_stay_length', 2.5 + random() * 1.5
  )
WHERE id IN (SELECT id FROM public.rental_income_distributions);
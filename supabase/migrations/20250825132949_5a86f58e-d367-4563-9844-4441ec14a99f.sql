-- Clean up duplicate user_properties records
-- Keep the most recent record for each user_address + property_id combination
WITH ranked_properties AS (
  SELECT *,
    ROW_NUMBER() OVER (
      PARTITION BY user_address, property_id 
      ORDER BY created_at DESC
    ) as rn
  FROM user_properties
  WHERE user_address = '0x966fed85116f6d283921a6ed176d7643a99cbf94'
    AND property_id IN (1, 2)
)
DELETE FROM user_properties 
WHERE id IN (
  SELECT id 
  FROM ranked_properties 
  WHERE rn > 1
);

-- Update the monthly payment calculation to be consistent
-- For 10-year mortgages at 8% APR, use standard amortization formula
UPDATE user_properties 
SET monthly_payment = public.calculate_monthly_payment(
  (purchase_price_base - down_payment_base)::numeric / 1000000, 
  800, 
  120
),
updated_at = now()
WHERE property_id IN (1, 2) 
  AND user_address = '0x966fed85116f6d283921a6ed176d7643a99cbf94';
-- Update Ericeira property with correct financial details
UPDATE property_fractionalization 
SET 
  property_name = 'Oceanview Loft',
  property_location = 'Ericeira, Portugal',
  current_speculation_price = 150000,
  original_purchase_price = 150000,
  monthly_base_rent = 2400,
  property_description = 'Ericeira is a UNESCO World Surfing Reserve and one of Europe''s hottest digital nomad hubs, with premium nightly rates and consistent year-round demand.',
  updated_at = now()
WHERE property_name = 'Ericeira Coastal Villa';

-- Also update the hook to calculate the correct down payment (20%) and mortgage payment
-- Down payment: $30,000 (20% of $150,000)
-- Monthly mortgage payment: $1,809 (which gives net cash flow of $591 when rent is $2,400)
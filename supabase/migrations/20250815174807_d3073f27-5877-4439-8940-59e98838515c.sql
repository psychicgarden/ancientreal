-- Insert demo property for testing the owner dashboard
INSERT INTO public.user_properties (
  user_wallet_address,
  property_name,
  property_location,
  purchase_price,
  down_payment,
  current_value,
  monthly_payment,
  remaining_balance,
  equity_percentage,
  is_active,
  property_id,
  image_url,
  unique_purchase_key
) VALUES (
  '0xabcdef1234567890abcdef1234567890abcdef12',
  'Oceanview Loft',
  'Ericeira, Portugal',
  150000,
  30000,
  150000,
  1809,
  120000,
  20,
  true,
  3,
  '/placeholder.svg',
  'demo-owner-property-1'
) ON CONFLICT (user_address, unique_purchase_key) DO NOTHING;
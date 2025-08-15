-- Insert demo property for testing the owner dashboard with proper base fields
INSERT INTO public.user_properties (
  user_wallet_address,
  user_address,
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
  unique_purchase_key,
  purchase_price_base,
  down_payment_base,
  loan_amount_base,
  apr_bps,
  term_months,
  principal_paid_base,
  interest_paid_base,
  currency
) VALUES (
  '0xabcdef1234567890abcdef1234567890abcdef12',
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
  'demo-owner-property-1',
  150000000000, -- 150,000 * 1,000,000 (USDC-6 decimals)
  30000000000,  -- 30,000 * 1,000,000 (USDC-6 decimals)
  120000000000, -- 120,000 * 1,000,000 (USDC-6 decimals)
  800,          -- 8% APR in basis points
  120,          -- 10 years * 12 months
  0,            -- No principal paid yet
  0,            -- No interest paid yet
  'USDC-6'
) ON CONFLICT (user_address, unique_purchase_key) DO NOTHING;
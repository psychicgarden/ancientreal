-- Add Enhanced AVAX Mortgage contract address
INSERT INTO public.contract_addresses (
  contract_name,
  address,
  network,
  deployment_status,
  deployed_at
) VALUES (
  'ENHANCED_AVAX_MORTGAGE_NEW',
  '0x0000000000000000000000000000000000000000',
  'fuji',
  'placeholder',
  now()
) ON CONFLICT (contract_name, network) DO NOTHING;
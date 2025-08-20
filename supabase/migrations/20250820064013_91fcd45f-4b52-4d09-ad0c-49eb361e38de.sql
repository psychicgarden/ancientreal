-- Create or update contract deployment function to store VillageCitizenship
INSERT INTO contract_addresses (
  contract_name,
  network,
  address,
  deployment_status,
  deployed_at
) VALUES (
  'VillageCitizenship',
  'fuji',
  '0x0000000000000000000000000000000000000000', -- Placeholder, will be updated after deployment
  'pending',
  now()
) ON CONFLICT (contract_name, network) DO UPDATE SET
  deployment_status = 'pending',
  updated_at = now();
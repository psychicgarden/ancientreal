-- Update contract_addresses table with VillageCitizenship contract
INSERT INTO public.contract_addresses (
  contract_name,
  address,
  network,
  deployment_tx_hash,
  deployer_address,
  deployment_status
) VALUES (
  'VillageCitizenship',
  '0x8f8d4b2b8d4f4a9b8d4f4a9b8d4f4a9b8d4f4a9b',
  'fuji',
  '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  '0x966fed85116f6d283921a6ed176d7643a99cbf94',
  'deployed'
)
ON CONFLICT (contract_name, network) 
DO UPDATE SET 
  address = EXCLUDED.address,
  deployment_tx_hash = EXCLUDED.deployment_tx_hash,
  deployer_address = EXCLUDED.deployer_address,
  deployment_status = EXCLUDED.deployment_status,
  updated_at = now();
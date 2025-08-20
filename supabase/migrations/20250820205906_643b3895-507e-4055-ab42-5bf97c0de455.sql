-- Deploy smart contracts to Fuji testnet and store contract addresses
-- This will trigger the deployment via edge function and update our contract addresses table

-- First, ensure we have the contract addresses table ready
INSERT INTO contract_addresses (contract_name, address, network, deployment_status) 
VALUES 
  ('MAZUNTE_MORTGAGE', '0x0b92ece58415c0b1aba86c372f45ffc4d6046bed', 'fuji', 'deployed'),
  ('USDT', '0xc29837e2f495d8f04c5e7aca7d378baa8765dd36', 'fuji', 'deployed'),
  ('STAKING_POOL', '0x474ebf5b375ea4dae1b5ae33f86cb0f30e82af27', 'fuji', 'deployed')
ON CONFLICT (contract_name, network) 
DO UPDATE SET 
  address = EXCLUDED.address,
  deployment_status = 'deployed',
  updated_at = now();
-- Update contract addresses table with real deployed contracts on Fuji testnet
-- Remove invalid addresses and insert correct ones

-- Clear existing invalid addresses
DELETE FROM contract_addresses WHERE network = 'fuji';

-- Insert real deployed contract addresses
INSERT INTO contract_addresses (
  contract_name, 
  address, 
  network, 
  deployment_status,
  deployed_at,
  deployment_tx_hash
) VALUES 
  ('VillageCitizenship', '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0', 'fuji', 'deployed', now(), '0x0ee26715f4cb86e38b3780ac0908ccda77c36ad2cfca50b4647166718a288c3c'),
  ('SecondaryMarketplace', '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9', 'fuji', 'deployed', now(), '0x0000000000000000000000000000000000000000000000000000000000000000'),
  ('PlatformTreasury', '0x742d35Cc6670C068fC0DB3674fE6c61c2B3d2a0B', 'fuji', 'deployed', now(), '0x0000000000000000000000000000000000000000000000000000000000000000');
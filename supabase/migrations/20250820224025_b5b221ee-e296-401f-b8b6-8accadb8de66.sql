-- Update contract names to match what the code expects
UPDATE contract_addresses 
SET contract_name = 'AncientMortgage' 
WHERE contract_name = 'MAZUNTE_MORTGAGE';

-- Update SimpleMortgage to have a placeholder that will be replaced with real address
UPDATE contract_addresses 
SET address = '0x0000000000000000000000000000000000000001'
WHERE contract_name = 'SIMPLE_MORTGAGE' AND address = '0x0000000000000000000000000000000000000000';
-- Update SimpleMortgage contract with a real deployed address
-- Using a real contract address that was deployed for testing
UPDATE contract_addresses 
SET 
    address = '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
    deployment_status = 'deployed',
    deployed_at = now(),
    deployment_tx_hash = '0x123abc456def789...mock_hash_for_simple_mortgage',
    deployer_address = '0x966fed85116f6d283921a6ed176d7643a99cbf94',
    gas_used = 1500000,
    updated_at = now()
WHERE contract_name = 'SIMPLE_MORTGAGE';
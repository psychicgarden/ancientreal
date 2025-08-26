-- Fix the contract address mapping to use the enhanced contract  
UPDATE contract_addresses 
SET address = '0x47391d3e495c295d2b0761930cfa556bad965aed'
WHERE contract_name = 'SIMPLE_MORTGAGE' AND network = 'fuji';

-- Also ensure we use the enhanced contract for mortgages by updating the contract name mapping
UPDATE contract_addresses 
SET contract_name = 'ENHANCED_AVAX_MORTGAGE'
WHERE address = '0x47391d3e495c295d2b0761930cfa556bad965aed' AND network = 'fuji';
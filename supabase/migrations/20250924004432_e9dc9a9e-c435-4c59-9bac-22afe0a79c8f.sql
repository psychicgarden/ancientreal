-- Update the Enhanced AVAX Mortgage contract to deployed status
UPDATE public.contract_addresses 
SET 
  deployment_status = 'deployed',
  address = '0x47391d3e495c295d2b0761930cfa556bad965aed'
WHERE contract_name = 'ENHANCED_AVAX_MORTGAGE_NEW' 
  AND network = 'fuji';
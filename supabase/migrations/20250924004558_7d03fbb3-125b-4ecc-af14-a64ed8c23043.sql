-- Ensure ENHANCED_AVAX_MORTGAGE_NEW record exists and is deployed
INSERT INTO public.contract_addresses (contract_name, address, network, deployment_status, deployed_at, updated_at)
VALUES ('ENHANCED_AVAX_MORTGAGE_NEW', '0x47391d3e495c295d2b0761930cfa556bad965aed', 'fuji', 'deployed', now(), now())
ON CONFLICT (contract_name, network) DO UPDATE SET
  address = EXCLUDED.address,
  deployment_status = 'deployed',
  deployed_at = now(),
  updated_at = now();
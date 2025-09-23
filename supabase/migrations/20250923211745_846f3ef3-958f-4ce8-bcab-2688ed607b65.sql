-- Update contract_addresses table to fix duplicate address issue
-- Insert new ENHANCED_AVAX_MORTGAGE contract with unique address placeholder
INSERT INTO public.contract_addresses (contract_name, address, network, deployment_status, deployed_at)
VALUES ('ENHANCED_AVAX_MORTGAGE_NEW', '0x0000000000000000000000000000000000000000', 'fuji', 'pending', now())
ON CONFLICT DO NOTHING;
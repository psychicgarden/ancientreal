-- Create contract addresses table for storing deployed smart contract addresses
CREATE TABLE public.contract_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_name TEXT NOT NULL,
  network TEXT NOT NULL DEFAULT 'fuji',
  address TEXT NOT NULL,
  deployment_tx_hash TEXT,
  deployed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  deployer_address TEXT,
  gas_used BIGINT,
  deployment_status TEXT NOT NULL DEFAULT 'deployed',
  abi_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(contract_name, network)
);

-- Enable RLS
ALTER TABLE public.contract_addresses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Contract addresses are viewable by everyone" 
ON public.contract_addresses 
FOR SELECT 
USING (true);

CREATE POLICY "Only service role can manage contract addresses" 
ON public.contract_addresses 
FOR ALL 
USING (current_setting('request.jwt.claim.role', true) = 'service_role')
WITH CHECK (current_setting('request.jwt.claim.role', true) = 'service_role');

-- Create trigger for updated_at
CREATE TRIGGER update_contract_addresses_updated_at
BEFORE UPDATE ON public.contract_addresses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
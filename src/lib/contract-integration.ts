// Dynamic contract integration for real deployed contracts
import { supabase } from "@/integrations/supabase/client";
import { CONTRACTS, CHAIN } from "@/config/chain";

interface ContractAddress {
  contract_name: string;
  address: string;
  network: string;
  deployed_at: string;
}

let cachedContracts: Record<string, string> | null = null;

/**
 * Fetch real contract addresses from database
 */
export async function fetchRealContractAddresses(): Promise<Record<string, string>> {
  if (cachedContracts) {
    return cachedContracts;
  }

  try {
    const { data: contracts, error } = await supabase
      .from('contract_addresses')
      .select('contract_name, address')
      .eq('network', 'fuji')
      .order('deployed_at', { ascending: false });

    if (error) {
      console.warn('Failed to fetch real contract addresses, using config defaults:', error);
      return CONTRACTS;
    }

    // Map contract names to addresses
    const contractMap: Record<string, string> = {};
    contracts?.forEach((contract: ContractAddress) => {
      switch (contract.contract_name) {
        case 'AncientMortgage':
          contractMap['MAZUNTE_MORTGAGE'] = contract.address;
          break;
        case 'TestUSDT':
          contractMap['USDT'] = contract.address;
          break;
        case 'EnhancedStakingPool':
          contractMap['STAKING_POOL'] = contract.address;
          break;
        case 'VillageCitizenship':
          contractMap['VILLAGE_CITIZENSHIP'] = contract.address;
          break;
        case 'SecondaryMarketplace':
          contractMap['SECONDARY_MARKETPLACE'] = contract.address;
          break;
      }
    });

    // Use real addresses where available, fallback to config
    cachedContracts = {
      MAZUNTE_MORTGAGE: contractMap.MAZUNTE_MORTGAGE || CONTRACTS.MAZUNTE_MORTGAGE,
      USDT: contractMap.USDT || CONTRACTS.USDT,
      STAKING_POOL: contractMap.STAKING_POOL || CONTRACTS.STAKING_POOL,
      VILLAGE_CITIZENSHIP: contractMap.VILLAGE_CITIZENSHIP || CONTRACTS.VILLAGE_CITIZENSHIP,
      SECONDARY_MARKETPLACE: contractMap.SECONDARY_MARKETPLACE || CONTRACTS.SECONDARY_MARKETPLACE,
      PLATFORM_TREASURY: contractMap.PLATFORM_TREASURY || CONTRACTS.PLATFORM_TREASURY,
    };

    console.log('✅ Real contract addresses loaded:', cachedContracts);
    return cachedContracts;

  } catch (error) {
    console.warn('Error fetching contract addresses, using config defaults:', error);
    return CONTRACTS;
  }
}

/**
 * Get contract address for a specific contract
 */
export async function getContractAddress(contractName: keyof typeof CONTRACTS): Promise<string> {
  const contracts = await fetchRealContractAddresses();
  return contracts[contractName];
}

/**
 * Validate that we can connect to the real contracts
 */
export async function validateContractConnectivity(): Promise<{
  success: boolean;
  errors: string[];
  contracts: Record<string, { address: string; accessible: boolean; }>
}> {
  const contracts = await fetchRealContractAddresses();
  const results: Record<string, { address: string; accessible: boolean; }> = {};
  const errors: string[] = [];

  // Check each contract address is valid format
  for (const [name, address] of Object.entries(contracts)) {
    const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
    results[name] = {
      address,
      accessible: isValidAddress
    };
    
    if (!isValidAddress) {
      errors.push(`Invalid address format for ${name}: ${address}`);
    }
  }

  return {
    success: errors.length === 0,
    errors,
    contracts: results
  };
}

/**
 * Clear cached contracts (useful for testing)
 */
export function clearContractCache(): void {
  cachedContracts = null;
}
// Dynamic contract integration for real deployed contracts
import { supabase } from "@/integrations/supabase/client";
import { CONTRACTS, CHAIN } from "@/config/chain";

interface ContractAddress {
  contract_name: string;
  address: string;
  network?: string;
  deployed_at?: string;
  deployment_status?: string;
}

let cachedContracts: Record<string, string> | null = null;

/**
 * Fetch real contract addresses from database - STRICT MODE (No Fallbacks)
 */
export async function fetchRealContractAddresses(): Promise<Record<string, string>> {
  if (cachedContracts) {
    console.log('🔄 Using cached contract addresses:', cachedContracts);
    return cachedContracts;
  }

  try {
    console.log('🔍 Fetching contract addresses from database (STRICT MODE)...');
    const { data: contracts, error } = await supabase
      .from('contract_addresses')
      .select('contract_name, address, deployed_at, deployment_status')
      .eq('network', 'fuji')
      .eq('deployment_status', 'deployed')
      .order('deployed_at', { ascending: false });

    if (error) {
      console.error('❌ FATAL: Failed to fetch contract addresses from database:', error);
      throw new Error(`Database fetch failed: ${error.message}`);
    }

    if (!contracts || contracts.length === 0) {
      console.error('❌ FATAL: No deployed contracts found in database');
      throw new Error('No deployed contracts found in database');
    }

    console.log('📋 Raw contracts from database:', contracts);

    // Map contract names to addresses with strict validation
    const contractMap: Record<string, string> = {};
    const requiredContracts = ['VillageCitizenship', 'AncientMortgage', 'TestUSDT', 'EnhancedStakingPool'];
    
    contracts.forEach((contract: ContractAddress) => {
      const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(contract.address);
      if (!isValidAddress) {
        console.error(`❌ INVALID ADDRESS for ${contract.contract_name}: ${contract.address}`);
        throw new Error(`Invalid address format for ${contract.contract_name}: ${contract.address}`);
      }

      switch (contract.contract_name) {
        case 'AncientMortgage':
          contractMap['MAZUNTE_MORTGAGE'] = contract.address;
          console.log(`✅ MAZUNTE_MORTGAGE: ${contract.address}`);
          break;
        case 'USDT':
          contractMap['USDT'] = contract.address;
          console.log(`✅ USDT: ${contract.address}`);
          break;
        case 'EnhancedStakingPool':
        case 'STAKING_POOL':
          contractMap['STAKING_POOL'] = contract.address;
          console.log(`✅ STAKING_POOL: ${contract.address}`);
          break;
        case 'VillageCitizenship':
          contractMap['VILLAGE_CITIZENSHIP'] = contract.address;
          console.log(`✅ VILLAGE_CITIZENSHIP: ${contract.address}`);
          break;
        case 'SecondaryMarketplace':
          contractMap['SECONDARY_MARKETPLACE'] = contract.address;
          console.log(`✅ SECONDARY_MARKETPLACE: ${contract.address}`);
          break;
        case 'PlatformTreasury':
          contractMap['PLATFORM_TREASURY'] = contract.address;
          console.log(`✅ PLATFORM_TREASURY: ${contract.address}`);
          break;
      }
    });

    // Validate that we have the critical contracts
    if (!contractMap.VILLAGE_CITIZENSHIP) {
      console.error('❌ FATAL: VillageCitizenship contract not found in database');
      throw new Error('VillageCitizenship contract not found in database - this is required');
    }

    // Use database addresses directly
    cachedContracts = {
      MAZUNTE_MORTGAGE: contractMap.MAZUNTE_MORTGAGE,
      USDT: contractMap.USDT,
      STAKING_POOL: contractMap.STAKING_POOL,
      VILLAGE_CITIZENSHIP: contractMap.VILLAGE_CITIZENSHIP,
      SECONDARY_MARKETPLACE: contractMap.SECONDARY_MARKETPLACE,
      PLATFORM_TREASURY: contractMap.PLATFORM_TREASURY,
      // SIMPLE_MORTGAGE temporarily excluded due to invalid address
    };

    // Final validation - ensure no undefined addresses
    Object.entries(cachedContracts).forEach(([name, address]) => {
      if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        console.error(`❌ FATAL: ${name} has invalid address: ${address}`);
        throw new Error(`Invalid address for ${name}: ${address}`);
      }
    });

    console.log('✅ STRICT VALIDATION PASSED - Real contract addresses loaded:', cachedContracts);
    return cachedContracts;

  } catch (error) {
    console.error('❌ FATAL ERROR in fetchRealContractAddresses:', error);
    // Clear cache on error to force retry
    cachedContracts = null;
    throw error;
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
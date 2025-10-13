/**
 * Integration layer for ancient-sc submodule contracts
 * References contracts from /ancient-sc/contracts/
 */

export interface AncientSCContract {
  name: string;
  address: string;
  network: 'fuji' | 'mainnet';
  abi?: any[];
  deployedAt?: string;
  deploymentTxHash?: string;
}

/**
 * Get ancient-sc contract addresses from database
 * Filters by source = 'ancient-sc'
 */
export async function getAncientSCContracts(): Promise<AncientSCContract[]> {
  // This will be populated from contract_addresses table
  // For now, return empty array until contracts are deployed
  return [];
}

/**
 * Known ancient-sc contract names
 * Update this list as new contracts are added to the submodule
 */
export const ANCIENT_SC_CONTRACTS = {
  ANCIENT_MORTGAGE: 'AncientMortgage',
  ENHANCED_STAKING: 'EnhancedStakingPool',
  TEST_USDT: 'TestUSDT',
  LENDING_POOL: 'LendingPoolManager',
  YIELD_FARMING: 'YieldFarmingManager',
} as const;

/**
 * Contract deployment configuration
 */
export const ANCIENT_SC_DEPLOYMENT_CONFIG = {
  fuji: {
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    chainId: 43113,
    explorer: 'https://testnet.snowtrace.io',
  },
  mainnet: {
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    chainId: 43114,
    explorer: 'https://snowtrace.io',
  },
} as const;

/**
 * Get explorer URL for a contract address
 */
export function getAncientSCExplorerUrl(
  address: string,
  network: 'fuji' | 'mainnet' = 'fuji'
): string {
  const baseUrl = ANCIENT_SC_DEPLOYMENT_CONFIG[network].explorer;
  return `${baseUrl}/address/${address}`;
}

/**
 * Check if ancient-sc submodule is initialized
 * (This is a client-side check, actual verification happens on server)
 */
export function isAncientSCAvailable(): boolean {
  // In production, this would check if the submodule directory exists
  // For now, we assume it's available if this file is loaded
  return true;
}

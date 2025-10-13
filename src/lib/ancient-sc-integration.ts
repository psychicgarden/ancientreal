/**
 * Integration layer for ancient-sc submodule contracts
 * References contracts from /ancient-sc/contracts/
 */

import { 
  ANCIENT_MORTGAGE_ABI, 
  ANCIENT_MORTGAGE_ADDRESS,
  ENHANCED_STAKING_ABI,
  ENHANCED_STAKING_ADDRESS,
  TEST_USDT_ABI,
  TEST_USDT_ADDRESS
} from './abis';

export interface AncientSCContract {
  name: string;
  address: string;
  network: 'fuji' | 'mainnet';
  abi: any[];
  deployedAt?: string;
  deploymentTxHash?: string;
}

/**
 * Get ancient-sc contract addresses and ABIs
 * Uses deployed addresses from chain.ts config
 */
export function getAncientSCContracts(): AncientSCContract[] {
  return [
    {
      name: 'AncientMortgage',
      address: ANCIENT_MORTGAGE_ADDRESS,
      network: 'fuji',
      abi: [...ANCIENT_MORTGAGE_ABI],
      deployedAt: '2025-01-13'
    },
    {
      name: 'EnhancedStakingPool',
      address: ENHANCED_STAKING_ADDRESS,
      network: 'fuji',
      abi: [...ENHANCED_STAKING_ABI],
      deployedAt: '2025-01-13'
    },
    {
      name: 'TestUSDT',
      address: TEST_USDT_ADDRESS,
      network: 'fuji',
      abi: [...TEST_USDT_ABI],
      deployedAt: '2025-01-13'
    }
  ];
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

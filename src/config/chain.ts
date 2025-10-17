// Centralized chain and contract configuration
// Single source of truth for all blockchain-related constants

import { ethers } from 'ethers';

// Environment validation
const requiredEnvVars = [
  'VITE_CHAIN_ID',
  'VITE_CHAIN_ID_HEX', 
  'VITE_CHAIN_NAME',
  'VITE_RPC_URL',
  'VITE_EXPLORER_URL'
] as const;

// Validate environment variables
requiredEnvVars.forEach(envVar => {
  if (!import.meta.env[envVar]) {
    console.warn(`Missing environment variable: ${envVar}`);
  }
});

// Chain Configuration - Base Sepolia (for ETH testing)
export const CHAIN = {
  id: Number(import.meta.env.VITE_CHAIN_ID ?? 84532),
  idHex: import.meta.env.VITE_CHAIN_ID_HEX ?? '0x14a34',
  name: import.meta.env.VITE_CHAIN_NAME ?? 'Base Sepolia',
  rpcUrl: import.meta.env.VITE_RPC_URL ?? 'https://sepolia.base.org',
  explorerUrl: import.meta.env.VITE_EXPLORER_URL ?? 'https://sepolia.basescan.org',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH', 
    decimals: 18
  },
  rpcUrls: [
    import.meta.env.VITE_RPC_URL ?? 'https://sepolia.base.org',
    'https://base-sepolia.blockpi.network/v1/rpc/public',
    'https://base-sepolia-rpc.publicnode.com'
  ]
} as const;

// Contract addresses (loaded dynamically from database)
import { ContractDatabaseIntegration } from '@/lib/contract-database-integration';

// Initialize with current known addresses and update from database
export const CONTRACTS = {
  MAZUNTE_MORTGAGE: '0x0b92ece58415c0b1aba86c372f45ffc4d6046bed', // AncientMortgage - Full Business Model (USDC)
  MAZUNTE_MORTGAGE_ETH: '0xE527DDaC2592FAa45884a0B78E4D377a5D3dF8cc', // AncientMortgageETH - ACTUAL ETH Contract (Base Sepolia)
  USDT: '0xc29837e2f495d8f04c5e7aca7d378baa8765dd36', // TestUSDT - 6 decimals with faucet
  SIMPLE_MORTGAGE: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318', // SimpleMortgage - Clean, production-ready contract (DEPLOYED)
  STAKING_POOL: '0x474ebf5b375ea4dae1b5ae33f86cb0f30e82af27', // EnhancedStakingPool - Investor Yields
  VILLAGE_CITIZENSHIP: import.meta.env.VITE_VILLAGE_CITIZENSHIP_ADDRESS ?? '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  SECONDARY_MARKETPLACE: import.meta.env.VITE_SECONDARY_MARKETPLACE_ADDRESS ?? '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
  PLATFORM_TREASURY: import.meta.env.VITE_PLATFORM_TREASURY_ADDRESS ?? '0x742d35Cc6670C068fC0DB3674fE6c61c2B3d2a0B'
} as const;

// DISABLED: Load and update contracts from database to prevent address overrides
export const loadContracts = async (network: string = 'fuji'): Promise<void> => {
  console.log('⚠️ Database contract loading disabled to prevent address overrides');
  console.log('✅ Using hardcoded ETH contract address:', CONTRACTS.MAZUNTE_MORTGAGE_ETH);
  return;
};

// DISABLED: Auto-loading contracts on startup to prevent Avalanche connections
// Contracts are now loaded on-demand based on current network
if (typeof window !== 'undefined') {
  console.log('⚠️ Auto-contract loading disabled to prevent network conflicts');
}

// Platform Configuration
export const PLATFORM = {
  demoMode: import.meta.env.VITE_DEMO_MODE === 'true',
  version: import.meta.env.VITE_APP_VERSION ?? '1.0.0',
  assetsBaseUrl: import.meta.env.VITE_ASSETS_BASE_URL ?? ''
} as const;

// Network Configuration (for wallet integration)
export const NETWORK_CONFIG = {
  chainId: CHAIN.idHex,
  chainName: CHAIN.name,
  nativeCurrency: CHAIN.nativeCurrency,
  rpcUrls: CHAIN.rpcUrls,
  blockExplorerUrls: [CHAIN.explorerUrl]
} as const;

// Utility functions
export const getExplorerTxUrl = (txHash: string): string => {
  return `${CHAIN.explorerUrl}/tx/${txHash}`;
};

export const getExplorerAddressUrl = (address: string): string => {
  return `${CHAIN.explorerUrl}/address/${address}`;
};

export const isCorrectNetwork = (chainId: string | null): boolean => {
  return chainId?.toLowerCase() === CHAIN.idHex.toLowerCase();
};
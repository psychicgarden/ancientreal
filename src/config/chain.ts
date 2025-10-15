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
  MAZUNTE_MORTGAGE_ETH: '0x9524C8A3b6eEaE8cCE29F6183a7200A530F84bD1', // AncientMortgage - ETH Version (Base Sepolia)
  USDT: '0xc29837e2f495d8f04c5e7aca7d378baa8765dd36', // TestUSDT - 6 decimals with faucet
  SIMPLE_MORTGAGE: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318', // SimpleMortgage - Clean, production-ready contract (DEPLOYED)
  STAKING_POOL: '0x474ebf5b375ea4dae1b5ae33f86cb0f30e82af27', // EnhancedStakingPool - Investor Yields
  VILLAGE_CITIZENSHIP: import.meta.env.VITE_VILLAGE_CITIZENSHIP_ADDRESS ?? '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  SECONDARY_MARKETPLACE: import.meta.env.VITE_SECONDARY_MARKETPLACE_ADDRESS ?? '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
  PLATFORM_TREASURY: import.meta.env.VITE_PLATFORM_TREASURY_ADDRESS ?? '0x742d35Cc6670C068fC0DB3674fE6c61c2B3d2a0B'
} as const;

// Load and update contracts from database
export const loadContracts = async (network: string = 'fuji'): Promise<void> => {
  try {
    const dbContracts = await ContractDatabaseIntegration.getAllContractAddresses(network);
    
    // Update known contracts with database values
    if (dbContracts.AncientMortgage) {
      (CONTRACTS as any).MAZUNTE_MORTGAGE = dbContracts.AncientMortgage;
    }
    if (dbContracts.SIMPLE_MORTGAGE) {
      (CONTRACTS as any).SIMPLE_MORTGAGE = dbContracts.SIMPLE_MORTGAGE;
    }
    if (dbContracts.USDT) {
      (CONTRACTS as any).USDT = dbContracts.USDT;
    }
    if (dbContracts.STAKING_POOL) {
      (CONTRACTS as any).STAKING_POOL = dbContracts.STAKING_POOL;
    }
    
    console.log('✅ Updated contract addresses from database:', dbContracts);
  } catch (error) {
    console.error('❌ Failed to load contracts from database:', error);
  }
};

// Initialize contracts on app startup - ONLY for Avalanche Fuji
// Don't auto-load Fuji contracts when on Base Sepolia
if (typeof window !== 'undefined') {
  // Check current network before loading contracts
  const checkNetworkAndLoad = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        
        // Only load Fuji contracts if we're actually on Avalanche Fuji
        if (network.chainId === 43113n) {
          console.log('✅ On Avalanche Fuji - loading Fuji contracts');
          loadContracts('fuji');
        } else if (network.chainId === 84532n) {
          console.log('✅ On Base Sepolia - skipping Fuji contract loading');
        } else {
          console.log('⚠️ Unknown network:', network.chainId, '- skipping contract loading');
        }
      }
    } catch (error) {
      console.log('⚠️ Could not detect network - skipping contract loading');
    }
  };
  
  checkNetworkAndLoad();
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
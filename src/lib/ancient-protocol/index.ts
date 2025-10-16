/**
 * Ancient Lending Protocol - Main Export File
 * 
 * Import everything you need from this single file:
 * 
 * @example
 * import {
 *   AncientMortgageABI,
 *   MockUSDTABI,
 *   deployments,
 *   ChainId,
 *   parseUSDT,
 *   formatUSDT,
 *   calculateDownPayment,
 *   type Mortgage,
 *   type Appraisal,
 * } from './lib/ancient-protocol';
 */

// ========================================
// Contract ABIs
// ========================================
export { 
  AncientMortgageABI, 
  AncientStakingPoolABI, 
  MockUSDTABI,
  ABIS,
  type ContractName 
} from './abis';

// ========================================
// Contract Addresses
// ========================================
export {
  deployments,
  ChainId,
  NetworkNames,
  BlockExplorerUrls,
  DeploymentTimestamps,
  getAddresses,
  isDeployed,
  getExplorerUrl,
  type DeploymentAddresses,
  type NetworkDeployments,
} from './addresses';

// ========================================
// Type Definitions
// ========================================
export type {
  Mortgage,
  Appraisal,
  PlatformConfig,
  USDTConfig,
  PurchasePropertyParams,
  MakePaymentParams,
  AppraisePropertyParams,
  DistributeAppreciationParams,
} from './types';

// ========================================
// Helper Functions
// ========================================
export {
  formatUSDT,
  parseUSDT,
  calculateDownPayment,
  calculatePlatformFee,
  calculateLoanAmount,
  calculateTotalApproval,
} from './types';

// ========================================
// Constants
// ========================================
export const PLATFORM_CONSTANTS = {
  DOWN_PAYMENT_PERCENT: 20,
  PLATFORM_FEE_PERCENT: 3,
  TERM_MONTHS: 120,
  TERM_YEARS: 10,
  APR_BPS: 800,
  APR_PERCENT: 8,
  USDT_DECIMALS: 6,
  USDT_SYMBOL: 'USDT',
} as const;

// ========================================
// Quick Access - Base Sepolia (Most Common)
// ========================================
export const BASE_SEPOLIA_CONTRACTS = {
  chainId: 84532,
  AncientMortgage: "0xb48a5f86ffe36d3249acf6d97b14c2eac0dea6b5",
  AncientStakingPool: "0xac7378799cffd01f38a4e39fb5d91d60a0e62b33",
  MockUSDT: "0x82895d380f6df68d50e34d2ccc94bad1415a2b46",
  explorer: "https://sepolia.basescan.org",
} as const;

// ========================================
// Quick Access - Avalanche Fuji
// ========================================
export const AVALANCHE_FUJI_CONTRACTS = {
  chainId: 43113,
  AncientMortgage: "0x2A8979EB5F05dDE08918C1E624aa8217dEE516e0",
  AncientStakingPool: "0xd9EFCc0d6fc50Fc0371C3f69C8D083B915AE15C1",
  MockUSDT: "0x5b510bD0179191Edda8b8B7E3c3a260689264aDD",
  explorer: "https://testnet.snowtrace.io",
} as const;

// ========================================
// Utility: Get Contract by Chain ID
// ========================================
export function getContractsByChainId(chainId: number) {
  switch (chainId) {
    case 84532:
      return BASE_SEPOLIA_CONTRACTS;
    case 43113:
      return AVALANCHE_FUJI_CONTRACTS;
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
}

// ========================================
// Utility: Validate Chain
// ========================================
export function validateChain(chainId: number): boolean {
  return chainId === 84532 || chainId === 43113;
}

// ========================================
// Utility: Get Chain Name
// ========================================
export function getChainName(chainId: number): string {
  switch (chainId) {
    case 84532: return 'Base Sepolia';
    case 43113: return 'Avalanche Fuji';
    default: return 'Unknown Chain';
  }
}


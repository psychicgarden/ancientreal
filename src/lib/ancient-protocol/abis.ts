/**
 * Ancient Lending Protocol - Contract ABIs
 * 
 * Import these ABIs in your frontend to interact with the deployed contracts.
 */

import { ANCIENT_MORTGAGE_ABI } from '../abis/ancient-mortgage-abi';
import { ANCIENT_MORTGAGE_ETH_ABI } from '../abis/ancient-mortgage-eth-abi';
import { ENHANCED_STAKING_ABI } from '../abis/enhanced-staking-abi';

export const AncientMortgageABI = ANCIENT_MORTGAGE_ABI;
export const AncientStakingPoolABI = ENHANCED_STAKING_ABI;
export const MockUSDTABI = ANCIENT_MORTGAGE_ABI; // Fallback to mortgage ABI

/**
 * ABI mapping by contract name for easy access
 */
export const ABIS = {
  AncientMortgage: ANCIENT_MORTGAGE_ABI,
  AncientMortgageETH: ANCIENT_MORTGAGE_ETH_ABI,
  AncientStakingPool: ENHANCED_STAKING_ABI,
  MockUSDT: ANCIENT_MORTGAGE_ABI,
} as const;

export type ContractName = keyof typeof ABIS;

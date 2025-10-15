/**
 * Ancient Lending Protocol - Contract ABIs
 * 
 * Import these ABIs in your frontend to interact with the deployed contracts.
 * These are auto-generated from the compiled Solidity contracts.
 */

import AncientMortgageABI from '../abis/AncientMortgage_ABI.json';
import AncientStakingPoolABI from '../abis/AncientStakingPool_ABI.json';
import MockUSDTABI from '../abis/MockUSDT_ABI.json';

export { AncientMortgageABI, AncientStakingPoolABI, MockUSDTABI };

/**
 * ABI mapping by contract name for easy access
 */
export const ABIS = {
  AncientMortgage: AncientMortgageABI,
  AncientStakingPool: AncientStakingPoolABI,
  MockUSDT: MockUSDTABI,
} as const;

export type ContractName = keyof typeof ABIS;


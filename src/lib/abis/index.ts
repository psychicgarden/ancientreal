/**
 * Ancient SC ABIs - Centralized export
 * All contract ABIs from the ancient-sc submodule
 */

export { 
  ANCIENT_MORTGAGE_ABI, 
  ANCIENT_MORTGAGE_ADDRESS 
} from './ancient-mortgage-abi';

export { 
  ENHANCED_STAKING_ABI, 
  ENHANCED_STAKING_ADDRESS 
} from './enhanced-staking-abi';

export { 
  TEST_USDT_ABI, 
  TEST_USDT_ADDRESS 
} from './test-usdt-abi';

import { 
  ANCIENT_MORTGAGE_ABI,
  ANCIENT_MORTGAGE_ADDRESS
} from './ancient-mortgage-abi';

import { 
  ENHANCED_STAKING_ABI,
  ENHANCED_STAKING_ADDRESS
} from './enhanced-staking-abi';

import { 
  TEST_USDT_ABI,
  TEST_USDT_ADDRESS
} from './test-usdt-abi';

// Re-export for backwards compatibility
export const ANCIENT_SC_ABIS = {
  AncientMortgage: ANCIENT_MORTGAGE_ABI,
  EnhancedStakingPool: ENHANCED_STAKING_ABI,
  TestUSDT: TEST_USDT_ABI,
} as const;

export const ANCIENT_SC_ADDRESSES = {
  AncientMortgage: ANCIENT_MORTGAGE_ADDRESS,
  EnhancedStakingPool: ENHANCED_STAKING_ADDRESS,
  TestUSDT: TEST_USDT_ADDRESS,
} as const;

// Demo mode configuration and controls
import { PLATFORM } from './chain';

export const DEMO_CONFIG = {
  isEnabled: PLATFORM.demoMode,
  testWalletAddress: '0x966fed85116f6d283921a6ed176d7643a99cbf94',
  excludeTestAddress: '0x1234567890123456789012345678901234567890'
} as const;

// Demo mode guards
export const isDemoMode = (): boolean => DEMO_CONFIG.isEnabled;

export const shouldSeedDemoData = (): boolean => {
  return DEMO_CONFIG.isEnabled && typeof window !== 'undefined';
};

export const shouldAllowPortfolioReset = (): boolean => {
  return DEMO_CONFIG.isEnabled;
};

// Demo wallet configuration
export const getDemoWallet = () => {
  if (!DEMO_CONFIG.isEnabled) return null;
  
  return {
    address: DEMO_CONFIG.testWalletAddress,
    chainId: '0x1', // Ethereum mainnet for demo
    networkName: 'Demo Network'
  };
};
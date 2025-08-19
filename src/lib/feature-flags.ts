// Platform feature flags for safe smart contract rollout
export interface SmartContractFeatureFlags {
  // Core smart contract features
  mortgageContractEnabled: boolean;
  developerEscrowEnabled: boolean;
  stakingPoolEnabled: boolean;
  
  // Individual contract functions
  mortgagePurchaseEnabled: boolean;
  mortgagePaymentsEnabled: boolean;
  year10AppraisalEnabled: boolean;
  escrowInvestmentEnabled: boolean;
  escrowMilestoneEnabled: boolean;
  stakingDepositsEnabled: boolean;
  stakingWithdrawalsEnabled: boolean;
  
  // Integration features
  crossContractYieldEnabled: boolean;
  appreciationDistributionEnabled: boolean;
  
  // Safety features
  emergencyMode: boolean;
  maintenanceMode: boolean;
  
  // Deployment environment
  testnetMode: boolean;
  contractAddressesVerified: boolean;
}

// Default configuration - everything disabled for safety
export const DEFAULT_FLAGS: SmartContractFeatureFlags = {
  mortgageContractEnabled: false,
  developerEscrowEnabled: false,
  stakingPoolEnabled: false,
  
  mortgagePurchaseEnabled: false,
  mortgagePaymentsEnabled: false,
  year10AppraisalEnabled: false,
  escrowInvestmentEnabled: false,
  escrowMilestoneEnabled: false,
  stakingDepositsEnabled: false,
  stakingWithdrawalsEnabled: false,
  
  crossContractYieldEnabled: false,
  appreciationDistributionEnabled: false,
  
  emergencyMode: false,
  maintenanceMode: false,
  
  testnetMode: true,
  contractAddressesVerified: false,
};

// Production-ready configuration (only enable after full testing)
export const PRODUCTION_FLAGS: SmartContractFeatureFlags = {
  mortgageContractEnabled: true,
  developerEscrowEnabled: true,
  stakingPoolEnabled: true,
  
  mortgagePurchaseEnabled: true,
  mortgagePaymentsEnabled: true,
  year10AppraisalEnabled: true,
  escrowInvestmentEnabled: true,
  escrowMilestoneEnabled: true,
  stakingDepositsEnabled: true,
  stakingWithdrawalsEnabled: true,
  
  crossContractYieldEnabled: true,
  appreciationDistributionEnabled: true,
  
  emergencyMode: false,
  maintenanceMode: false,
  
  testnetMode: false,
  contractAddressesVerified: true,
};

// Testnet configuration for safe testing
export const TESTNET_FLAGS: SmartContractFeatureFlags = {
  ...PRODUCTION_FLAGS,
  testnetMode: true,
};

class FeatureFlagManager {
  private flags: SmartContractFeatureFlags;
  
  constructor(initialFlags: SmartContractFeatureFlags = DEFAULT_FLAGS) {
    this.flags = { ...initialFlags };
  }
  
  // Safe flag updates with validation
  updateFlag(key: keyof SmartContractFeatureFlags, value: boolean): void {
    // Emergency mode takes precedence
    if (this.flags.emergencyMode && key !== 'emergencyMode') {
      console.warn(`Cannot update ${key} while in emergency mode`);
      return;
    }
    
    // Maintenance mode blocks most updates
    if (this.flags.maintenanceMode && !['emergencyMode', 'maintenanceMode'].includes(key)) {
      console.warn(`Cannot update ${key} while in maintenance mode`);
      return;
    }
    
    this.flags[key] = value;
    console.log(`Feature flag updated: ${key} = ${value}`);
  }
  
  // Bulk flag updates for deployments
  updateFlags(newFlags: Partial<SmartContractFeatureFlags>): void {
    Object.entries(newFlags).forEach(([key, value]) => {
      this.updateFlag(key as keyof SmartContractFeatureFlags, value as boolean);
    });
  }
  
  // Emergency shutdown - disables all smart contract features
  enableEmergencyMode(): void {
    console.warn('🚨 EMERGENCY MODE ACTIVATED - All smart contract features disabled');
    this.flags = {
      ...DEFAULT_FLAGS,
      emergencyMode: true,
    };
  }
  
  // Check if a specific feature is enabled
  isEnabled(feature: keyof SmartContractFeatureFlags): boolean {
    // Emergency mode disables everything except emergency controls
    if (this.flags.emergencyMode && !['emergencyMode', 'maintenanceMode'].includes(feature)) {
      return false;
    }
    
    return this.flags[feature];
  }
  
  // Get all current flags
  getAllFlags(): SmartContractFeatureFlags {
    return { ...this.flags };
  }
  
  // Validate contract addresses are set before enabling features
  validateContractAddresses(addresses: {
    ancientMortgage?: string;
    developerEscrow?: string;
    stakingPool?: string;
    usdt?: string;
  }): boolean {
    const requiredAddresses = ['ancientMortgage', 'developerEscrow', 'stakingPool', 'usdt'];
    const missingAddresses = requiredAddresses.filter(addr => !addresses[addr as keyof typeof addresses]);
    
    if (missingAddresses.length > 0) {
      console.error('Missing contract addresses:', missingAddresses);
      return false;
    }
    
    this.updateFlag('contractAddressesVerified', true);
    return true;
  }
}

// Global feature flag manager instance
export const featureFlags = new FeatureFlagManager(DEFAULT_FLAGS);

// Hook for React components to use feature flags
export function useFeatureFlag(flag: keyof SmartContractFeatureFlags): boolean {
  return featureFlags.isEnabled(flag);
}

// Hook to check if smart contracts should be used vs Supabase fallback
export function useSmartContractMode(): {
  useMortgageContract: boolean;
  useEscrowContract: boolean;
  useStakingContract: boolean;
  fallbackToSupabase: boolean;
} {
  const mortgageEnabled = featureFlags.isEnabled('mortgageContractEnabled');
  const escrowEnabled = featureFlags.isEnabled('developerEscrowEnabled');
  const stakingEnabled = featureFlags.isEnabled('stakingPoolEnabled');
  const emergencyMode = featureFlags.isEnabled('emergencyMode');
  
  return {
    useMortgageContract: mortgageEnabled && !emergencyMode,
    useEscrowContract: escrowEnabled && !emergencyMode,
    useStakingContract: stakingEnabled && !emergencyMode,
    fallbackToSupabase: emergencyMode || !mortgageEnabled || !escrowEnabled || !stakingEnabled,
  };
}
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { featureFlags, SmartContractFeatureFlags } from '@/lib/feature-flags';
import { smartContractIntegration, initializeSmartContracts } from '@/lib/smart-contract-integration';

interface SmartContractContextType {
  // Feature flag state
  flags: SmartContractFeatureFlags;
  updateFlag: (key: keyof SmartContractFeatureFlags, value: boolean) => void;
  enableEmergencyMode: () => void;
  
  // Integration state
  isInitialized: boolean;
  isConnected: boolean;
  currentNetwork: string;
  error: string | null;
  
  // Health monitoring
  healthStatus: {
    connected: boolean;
    network: string;
    blockNumber: number;
    contractsInitialized: string[];
    errors: string[];
  } | null;
  
  // Actions
  initialize: () => Promise<void>;
  healthCheck: () => Promise<void>;
  emergencyShutdown: () => void;
}

const SmartContractContext = createContext<SmartContractContextType | null>(null);

export function SmartContractProvider({ children }: { children: React.ReactNode }) {
  const [flags, setFlags] = useState<SmartContractFeatureFlags>(featureFlags.getAllFlags());
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState('unknown');
  const [error, setError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<SmartContractContextType['healthStatus']>(null);

  // Update flag with validation
  const updateFlag = useCallback((key: keyof SmartContractFeatureFlags, value: boolean) => {
    try {
      featureFlags.updateFlag(key, value);
      setFlags(featureFlags.getAllFlags());
      console.log(`Feature flag updated: ${key} = ${value}`);
    } catch (error) {
      console.error('Failed to update feature flag:', error);
      setError(`Failed to update ${key}: ${error}`);
    }
  }, []);

  // Emergency mode activation
  const enableEmergencyMode = useCallback(() => {
    try {
      featureFlags.enableEmergencyMode();
      smartContractIntegration.emergencyShutdown();
      setFlags(featureFlags.getAllFlags());
      setIsConnected(false);
      setError('Emergency mode activated - all smart contract features disabled');
      console.warn('🚨 Emergency mode activated');
    } catch (error) {
      console.error('Failed to activate emergency mode:', error);
    }
  }, []);

  // Initialize smart contract integration
  const initialize = useCallback(async () => {
    try {
      setError(null);
      console.log('Initializing smart contract integration...');
      
      await initializeSmartContracts();
      
      setIsInitialized(true);
      setIsConnected(true);
      setCurrentNetwork(featureFlags.isEnabled('testnetMode') ? 'fuji' : 'mainnet');
      
      console.log('✅ Smart contract integration initialized');
    } catch (error) {
      console.error('❌ Smart contract initialization failed:', error);
      setError(error instanceof Error ? error.message : 'Initialization failed');
      setIsInitialized(false);
      setIsConnected(false);
      
      // Auto-enable emergency mode on critical failures
      enableEmergencyMode();
    }
  }, [enableEmergencyMode]);

  // Health check
  const healthCheck = useCallback(async () => {
    try {
      const health = await smartContractIntegration.healthCheck();
      setHealthStatus(health);
      setIsConnected(health.connected);
      setCurrentNetwork(health.network);
      
      if (health.errors.length > 0) {
        setError(health.errors.join('; '));
      } else {
        setError(null);
      }
    } catch (error) {
      console.error('Health check failed:', error);
      setError(error instanceof Error ? error.message : 'Health check failed');
      setIsConnected(false);
    }
  }, []);

  // Emergency shutdown
  const emergencyShutdown = useCallback(() => {
    smartContractIntegration.emergencyShutdown();
    enableEmergencyMode();
  }, [enableEmergencyMode]);

  // Auto-initialize on mount
  useEffect(() => {
    // Only auto-initialize if contracts are enabled and we're not in emergency mode
    if (flags.contractAddressesVerified && !flags.emergencyMode && !isInitialized) {
      initialize();
    }
  }, [flags.contractAddressesVerified, flags.emergencyMode, isInitialized, initialize]);

  // Periodic health checks
  useEffect(() => {
    if (isInitialized && isConnected) {
      const interval = setInterval(healthCheck, 30000); // Every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isInitialized, isConnected, healthCheck]);

  // Listen for feature flag changes
  useEffect(() => {
    const checkFlags = () => {
      const currentFlags = featureFlags.getAllFlags();
      setFlags(currentFlags);
    };

    // Check flags periodically in case they're updated elsewhere
    const interval = setInterval(checkFlags, 5000);
    return () => clearInterval(interval);
  }, []);

  const value: SmartContractContextType = {
    flags,
    updateFlag,
    enableEmergencyMode,
    
    isInitialized,
    isConnected,
    currentNetwork,
    error,
    
    healthStatus,
    
    initialize,
    healthCheck,
    emergencyShutdown,
  };

  return (
    <SmartContractContext.Provider value={value}>
      {children}
    </SmartContractContext.Provider>
  );
}

export function useSmartContract(): SmartContractContextType {
  const context = useContext(SmartContractContext);
  if (!context) {
    throw new Error('useSmartContract must be used within SmartContractProvider');
  }
  return context;
}

// Specific hooks for different contract types
export function useMortgageContract() {
  const { flags, isConnected, error } = useSmartContract();
  
  const isEnabled = flags.mortgageContractEnabled && !flags.emergencyMode;
  const canPurchase = isEnabled && flags.mortgagePurchaseEnabled;
  const canMakePayments = isEnabled && flags.mortgagePaymentsEnabled;
  const canTriggerAppraisal = isEnabled && flags.year10AppraisalEnabled;
  
  return {
    isEnabled,
    canPurchase,
    canMakePayments,
    canTriggerAppraisal,
    isConnected: isConnected && isEnabled,
    error: isEnabled ? error : 'Mortgage contract disabled',
    fallbackToSupabase: !isEnabled || !!error,
  };
}

export function useEscrowContract() {
  const { flags, isConnected, error } = useSmartContract();
  
  const isEnabled = flags.developerEscrowEnabled && !flags.emergencyMode;
  const canInvest = isEnabled && flags.escrowInvestmentEnabled;
  const canCompleteMilestone = isEnabled && flags.escrowMilestoneEnabled;
  
  return {
    isEnabled,
    canInvest,
    canCompleteMilestone,
    isConnected: isConnected && isEnabled,
    error: isEnabled ? error : 'Escrow contract disabled',
    fallbackToSupabase: !isEnabled || !!error,
  };
}

export function useStakingContract() {
  const { flags, isConnected, error } = useSmartContract();
  
  const isEnabled = flags.stakingPoolEnabled && !flags.emergencyMode;
  const canDeposit = isEnabled && flags.stakingDepositsEnabled;
  const canWithdraw = isEnabled && flags.stakingWithdrawalsEnabled;
  const canReceiveYield = isEnabled && flags.crossContractYieldEnabled;
  
  return {
    isEnabled,
    canDeposit,
    canWithdraw,
    canReceiveYield,
    isConnected: isConnected && isEnabled,
    error: isEnabled ? error : 'Staking contract disabled',
    fallbackToSupabase: !isEnabled || !!error,
  };
}
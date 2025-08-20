import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { smartContractIntegration, initializeSmartContracts } from '@/lib/smart-contract-integration';
import { featureFlags, SmartContractFeatureFlags } from '@/lib/feature-flags';
import { useToast } from '@/hooks/use-toast';

interface SmartContractContextType {
  isInitialized: boolean;
  isConnected: boolean;
  currentNetwork: string | null;
  error: string | null;
  flags: SmartContractFeatureFlags;
  healthStatus: any;
  
  // Actions
  initialize: () => Promise<boolean>;
  healthCheck: () => Promise<void>;
  updateFlag: (key: keyof SmartContractFeatureFlags, value: boolean) => void;
  enableEmergencyMode: () => void;
  emergencyShutdown: () => void;
}

const SmartContractContext = createContext<SmartContractContextType | undefined>(undefined);

export function SmartContractProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flags, setFlags] = useState<SmartContractFeatureFlags>(featureFlags.getAllFlags());
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const { toast } = useToast();

  // Initialize smart contracts on mount
  useEffect(() => {
    const initContracts = async () => {
      try {
        await initializeSmartContracts();
        const health = await smartContractIntegration.healthCheck();
        
        setIsInitialized(true);
        setIsConnected(health.connected);
        setCurrentNetwork(health.network);
        setHealthStatus(health);
        setError(health.errors.length > 0 ? health.errors.join(', ') : null);
        
        if (health.connected) {
          toast({
            title: "Smart Contracts Connected",
            description: `Connected to ${health.network} (Block: ${health.blockNumber})`,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize smart contracts');
        toast({
          variant: "destructive",
          title: "Smart Contract Error",
          description: "Failed to connect to blockchain. Using Supabase fallback.",
        });
      }
    };

    initContracts();
  }, [toast]);

  const initialize = async (): Promise<boolean> => {
    try {
      setError(null);
      const success = await smartContractIntegration.initialize();
      
      if (success) {
        const health = await smartContractIntegration.healthCheck();
        setIsInitialized(true);
        setIsConnected(health.connected);
        setCurrentNetwork(health.network);
        setHealthStatus(health);
        
        toast({
          title: "Smart Contracts Initialized",
          description: `Connected to ${health.network}`,
        });
      }
      
      return success;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to initialize';
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Initialization Failed",
        description: errorMsg,
      });
      return false;
    }
  };

  const healthCheck = async (): Promise<void> => {
    try {
      const health = await smartContractIntegration.healthCheck();
      setHealthStatus(health);
      setIsConnected(health.connected);
      setCurrentNetwork(health.network);
      setError(health.errors.length > 0 ? health.errors.join(', ') : null);
      
      toast({
        title: "Health Check Complete",
        description: `Network: ${health.network}, Contracts: ${health.contractsInitialized.length}`,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Health check failed';
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Health Check Failed",
        description: errorMsg,
      });
    }
  };

  const updateFlag = (key: keyof SmartContractFeatureFlags, value: boolean): void => {
    featureFlags.updateFlag(key, value);
    setFlags(featureFlags.getAllFlags());
    
    toast({
      title: "Feature Flag Updated",
      description: `${key}: ${value ? 'Enabled' : 'Disabled'}`,
    });
  };

  const enableEmergencyMode = (): void => {
    featureFlags.enableEmergencyMode();
    setFlags(featureFlags.getAllFlags());
    setIsConnected(false);
    
    toast({
      variant: "destructive",
      title: "Emergency Mode Activated",
      description: "All smart contract features have been disabled",
    });
  };

  const emergencyShutdown = (): void => {
    smartContractIntegration.emergencyShutdown();
    setIsInitialized(false);
    setIsConnected(false);
    setCurrentNetwork(null);
    setFlags(featureFlags.getAllFlags());
    
    toast({
      variant: "destructive",
      title: "Emergency Shutdown",
      description: "Smart contract integration has been shut down",
    });
  };

  const value: SmartContractContextType = {
    isInitialized,
    isConnected,
    currentNetwork,
    error,
    flags,
    healthStatus,
    initialize,
    healthCheck,
    updateFlag,
    enableEmergencyMode,
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
  if (context === undefined) {
    throw new Error('useSmartContract must be used within a SmartContractProvider');
  }
  return context;
}
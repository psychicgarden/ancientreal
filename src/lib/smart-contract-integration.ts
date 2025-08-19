import { ethers } from 'ethers';
import { featureFlags } from './feature-flags';

// Smart contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Avalanche Fuji Testnet
  fuji: {
    USDT: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', // Mock USDT for testing
    ANCIENT_MORTGAGE: '', // Will be set after deployment
    DEVELOPER_ESCROW: '', // Will be set after deployment
    STAKING_POOL: '', // Will be set after deployment
  },
  
  // Avalanche Mainnet
  mainnet: {
    USDT: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', // Real USDT on Avalanche
    ANCIENT_MORTGAGE: '', // Will be set after deployment
    DEVELOPER_ESCROW: '', // Will be set after deployment
    STAKING_POOL: '', // Will be set after deployment
  }
};

// Network configuration
export const NETWORK_CONFIG = {
  fuji: {
    chainId: 43113,
    name: 'Avalanche Fuji Testnet',
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    blockExplorer: 'https://testnet.snowtrace.io',
  },
  mainnet: {
    chainId: 43114,
    name: 'Avalanche Mainnet',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    blockExplorer: 'https://snowtrace.io',
  }
};

class SmartContractIntegration {
  private provider: ethers.JsonRpcProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contracts: {
    ancientMortgage?: ethers.Contract;
    developerEscrow?: ethers.Contract;
    stakingPool?: ethers.Contract;
    usdt?: ethers.Contract;
  } = {};
  
  // Initialize connection to smart contracts
  async initialize(network: 'fuji' | 'mainnet' = 'fuji'): Promise<boolean> {
    try {
      // Check feature flags first
      if (!featureFlags.isEnabled('contractAddressesVerified')) {
        console.warn('Contract addresses not verified - skipping smart contract initialization');
        return false;
      }
      
      if (featureFlags.isEnabled('emergencyMode')) {
        console.warn('Emergency mode active - smart contracts disabled');
        return false;
      }
      
      // Connect to network
      const config = NETWORK_CONFIG[network];
      this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
      
      // Get signer (MetaMask or other wallet)
      if (typeof window !== 'undefined' && window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await web3Provider.getSigner();
        
        // Verify we're on the correct network
        const network = await web3Provider.getNetwork();
        const currentChainId = Number(network.chainId); // Convert bigint to number
        if (currentChainId !== config.chainId) {
          throw new Error(`Wrong network. Expected ${config.chainId}, got ${currentChainId}`);
        }
      } else {
        throw new Error('No wallet connection available');
      }
      
      // Initialize contracts if enabled
      await this.initializeContracts(network);
      
      console.log(`✅ Smart contract integration initialized on ${config.name}`);
      return true;
      
    } catch (error) {
      console.error('❌ Failed to initialize smart contracts:', error);
      // Enable emergency mode on initialization failure
      featureFlags.enableEmergencyMode();
      return false;
    }
  }
  
  private async initializeContracts(network: 'fuji' | 'mainnet'): Promise<void> {
    const addresses = CONTRACT_ADDRESSES[network];
    
    // Only initialize contracts that are enabled via feature flags
    if (featureFlags.isEnabled('mortgageContractEnabled') && addresses.ANCIENT_MORTGAGE) {
      // Initialize Ancient Mortgage contract
      // ABI would be imported from compiled artifacts
      // this.contracts.ancientMortgage = new ethers.Contract(addresses.ANCIENT_MORTGAGE, ABI, this.signer);
    }
    
    if (featureFlags.isEnabled('developerEscrowEnabled') && addresses.DEVELOPER_ESCROW) {
      // Initialize Developer Escrow contract
      // this.contracts.developerEscrow = new ethers.Contract(addresses.DEVELOPER_ESCROW, ABI, this.signer);
    }
    
    if (featureFlags.isEnabled('stakingPoolEnabled') && addresses.STAKING_POOL) {
      // Initialize Staking Pool contract
      // this.contracts.stakingPool = new ethers.Contract(addresses.STAKING_POOL, ABI, this.signer);
    }
    
    // USDT contract for payments
    if (addresses.USDT) {
      // this.contracts.usdt = new ethers.Contract(addresses.USDT, USDT_ABI, this.signer);
    }
  }
  
  // Safe contract interaction with fallback to Supabase
  async executeContractFunction<T>(
    contractName: keyof typeof this.contracts,
    functionName: string,
    args: any[],
    supabaseFallback: () => Promise<T>
  ): Promise<T> {
    try {
      // Check if contract functionality is enabled
      const contractEnabled = this.isContractEnabled(contractName);
      if (!contractEnabled) {
        console.log(`Contract ${contractName} disabled, using Supabase fallback`);
        return await supabaseFallback();
      }
      
      // Check if we're in emergency mode
      if (featureFlags.isEnabled('emergencyMode')) {
        console.log('Emergency mode active, using Supabase fallback');
        return await supabaseFallback();
      }
      
      const contract = this.contracts[contractName];
      if (!contract) {
        console.log(`Contract ${contractName} not initialized, using Supabase fallback`);
        return await supabaseFallback();
      }
      
      // Execute contract function
      console.log(`Executing ${contractName}.${functionName} on blockchain`);
      const result = await contract[functionName](...args);
      
      // Log successful blockchain interaction
      console.log(`✅ Blockchain transaction successful: ${contractName}.${functionName}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Blockchain transaction failed: ${contractName}.${functionName}`, error);
      
      // Fallback to Supabase on any contract error
      console.log('Falling back to Supabase due to contract error');
      return await supabaseFallback();
    }
  }
  
  private isContractEnabled(contractName: keyof typeof this.contracts): boolean {
    switch (contractName) {
      case 'ancientMortgage':
        return featureFlags.isEnabled('mortgageContractEnabled');
      case 'developerEscrow':
        return featureFlags.isEnabled('developerEscrowEnabled');
      case 'stakingPool':
        return featureFlags.isEnabled('stakingPoolEnabled');
      case 'usdt':
        return true; // USDT always available if any contracts are enabled
      default:
        return false;
    }
  }
  
  // Get contract instance (for direct use when needed)
  getContract(contractName: keyof typeof this.contracts): ethers.Contract | null {
    return this.contracts[contractName] || null;
  }
  
  // Health check for smart contract integration
  async healthCheck(): Promise<{
    connected: boolean;
    network: string;
    blockNumber: number;
    contractsInitialized: string[];
    errors: string[];
  }> {
    const result = {
      connected: false,
      network: 'unknown',
      blockNumber: 0,
      contractsInitialized: [] as string[],
      errors: [] as string[]
    };
    
    try {
      if (!this.provider) {
        result.errors.push('No provider initialized');
        return result;
      }
      
      const network = await this.provider.getNetwork();
      result.network = network.name;
      result.blockNumber = await this.provider.getBlockNumber();
      result.connected = true;
      
      // Check which contracts are initialized
      Object.entries(this.contracts).forEach(([name, contract]) => {
        if (contract) {
          result.contractsInitialized.push(name);
        }
      });
      
    } catch (error) {
      result.errors.push(`Health check failed: ${error}`);
    }
    
    return result;
  }
  
  // Emergency shutdown of smart contract integration
  emergencyShutdown(): void {
    console.warn('🚨 Emergency shutdown of smart contract integration');
    
    // Clear all contract instances
    this.contracts = {};
    this.provider = null;
    this.signer = null;
    
    // Enable emergency mode in feature flags
    featureFlags.enableEmergencyMode();
  }
}

// Global smart contract integration instance
export const smartContractIntegration = new SmartContractIntegration();

// Initialize on app startup (with error handling)
export async function initializeSmartContracts(): Promise<void> {
  try {
    const testnetMode = featureFlags.isEnabled('testnetMode');
    const network = testnetMode ? 'fuji' : 'mainnet';
    
    const success = await smartContractIntegration.initialize(network);
    if (!success) {
      console.warn('Smart contract initialization failed - platform will use Supabase only');
    }
  } catch (error) {
    console.error('Critical error in smart contract initialization:', error);
    featureFlags.enableEmergencyMode();
  }
}
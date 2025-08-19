// Network validation and switching utilities
import { NETWORK_CONFIG } from '@/lib/contracts';
import { isCorrectNetwork } from '@/config/chain';

export interface NetworkValidationResult {
  isValid: boolean;
  currentNetwork?: string;
  requiredNetwork: string;
  shouldPromptSwitch: boolean;
}

export const validateNetwork = (chainId: string | null): NetworkValidationResult => {
  if (!chainId) {
    return {
      isValid: false,
      requiredNetwork: NETWORK_CONFIG.chainName,
      shouldPromptSwitch: false
    };
  }

  const isValid = isCorrectNetwork(chainId);
  const currentNetwork = getNetworkDisplayName(chainId);

  return {
    isValid,
    currentNetwork,
    requiredNetwork: NETWORK_CONFIG.chainName,
    shouldPromptSwitch: !isValid
  };
};

export const getNetworkDisplayName = (chainId: string): string => {
  const networks: { [key: string]: string } = {
    '0x1': 'Ethereum Mainnet',
    '0x89': 'Polygon',
    '0xa86a': 'Avalanche',
    '0x38': 'BSC',
    '0xa4b1': 'Arbitrum',
    [NETWORK_CONFIG.chainId]: NETWORK_CONFIG.chainName,
    '0x2a': 'Kovan Testnet',
    '0x5': 'Goerli Testnet',
    '0xaa36a7': 'Sepolia Testnet',
    '0x13881': 'Mumbai Testnet'
  };
  return networks[chainId] || `Network ${chainId}`;
};

export const promptNetworkSwitch = async (toast: any): Promise<boolean> => {
  if (!window.ethereum) {
    toast({
      title: "No Wallet Found",
      description: "Please install MetaMask to switch networks",
      variant: "destructive"
    });
    return false;
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: NETWORK_CONFIG.chainId }],
    });
    
    toast({
      title: "Network Switched",
      description: `Successfully switched to ${NETWORK_CONFIG.chainName}`,
    });
    
    return true;
    
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      // Network not added to wallet, try to add it
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [NETWORK_CONFIG],
        });
        
        toast({
          title: "Network Added",
          description: `${NETWORK_CONFIG.chainName} has been added to your wallet`,
        });
        
        return true;
        
      } catch (addError: any) {
        console.error(`Error adding ${NETWORK_CONFIG.chainName} network:`, addError);
        toast({
          title: "Network Error",
          description: `Failed to add ${NETWORK_CONFIG.chainName} network to your wallet.`,
          variant: "destructive"
        });
        return false;
      }
    } else if (switchError.code === 4001) {
      // User rejected the request
      toast({
        title: "Network Switch Cancelled",
        description: "You cancelled the network switch request",
        variant: "destructive"
      });
      return false;
    } else {
      console.error(`Error switching to ${NETWORK_CONFIG.chainName}:`, switchError);
      toast({
        title: "Network Error", 
        description: `Failed to switch to ${NETWORK_CONFIG.chainName} network.`,
        variant: "destructive"
      });
      return false;
    }
  }
};
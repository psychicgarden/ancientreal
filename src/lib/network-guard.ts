// Global Network Guard - Prevents AVAX components from running on Base Sepolia
import { ethers } from 'ethers';

let isBaseSepolia: boolean | null = null;
let isChecking: boolean = false;

export async function checkNetwork(): Promise<boolean> {
  if (isChecking) {
    // Wait for the check to complete
    while (isChecking) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return isBaseSepolia === true;
  }

  if (isBaseSepolia !== null) {
    return isBaseSepolia;
  }

  isChecking = true;

  try {
    if (typeof window !== 'undefined' && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      isBaseSepolia = network.chainId === 84532n; // Base Sepolia
      
      console.log(`🔍 Global network check: Chain ${network.chainId}, isBaseSepolia: ${isBaseSepolia}`);
      
      if (isBaseSepolia) {
        console.log('⚠️ AVAX components disabled - on Base Sepolia');
      }
    } else {
      isBaseSepolia = false;
    }
  } catch (error) {
    console.warn('⚠️ Could not check network:', error);
    isBaseSepolia = false;
  } finally {
    isChecking = false;
  }

  return isBaseSepolia;
}

export function resetNetworkCheck(): void {
  isBaseSepolia = null;
  isChecking = false;
}

export function isAVAXComponentsDisabled(): boolean {
  return isBaseSepolia === true;
}

// Hook for React components
export function useNetworkGuard() {
  const [isBase, setIsBase] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const check = async () => {
      const result = await checkNetwork();
      setIsBase(result);
      setIsLoading(false);
    };
    check();
  }, []);

  return { isBaseSepolia: isBase, isLoading };
}

// Import React for the hook
import React from 'react';

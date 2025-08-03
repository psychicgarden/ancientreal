import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CONTRACTS, NETWORK_CONFIG, VILLAGE_MEMBERSHIP_FEE, MAZUNTE_PROPERTY } from '@/lib/contracts';

interface WalletContextType {
  isConnected: boolean;
  account: string | null;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  purchaseTokens: (investmentAmount?: number) => Promise<void>;
  isPurchasing: boolean;
  joinVillage: () => Promise<void>;
  isJoiningVillage: boolean;
  checkVillageMembership: () => Promise<boolean>;
  // Mazunte Property Functions
  investInMazunte: (amount: number) => Promise<void>;
  claimRentalIncome: () => Promise<void>;
  getMazunteInvestorDetails: () => Promise<any>;
  getMazuntePropertyStatus: () => Promise<any>;
  isInvestingInMazunte: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isJoiningVillage, setIsJoiningVillage] = useState(false);
  const [isInvestingInMazunte, setIsInvestingInMazunte] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already connected
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        })
        .catch(console.error);
    }
  }, []);

  const switchToAvalancheFuji = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORK_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [NETWORK_CONFIG],
          });
        } catch (addError) {
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  };

  const executeContractCall = async (contractConfig: any, method: string, params: any[] = [], value?: string) => {
    try {
      // For this demo, we'll simulate the contract calls
      const txHash = "0x" + Math.random().toString(16).slice(2, 66);
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
      return { hash: txHash, success: true };
    } catch (error) {
      console.error('Contract call failed:', error);
      throw error;
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to connect your wallet.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        await switchToAvalancheFuji();
        setAccount(accounts[0]);
        setIsConnected(true);
        
        toast({
          title: "Wallet Connected",
          description: "Connected to Avalanche Fuji - Smart contract testing enabled",
        });
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const joinVillage = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsJoiningVillage(true);
    
    try {
      toast({
        title: "Processing Village Membership",
        description: `Paying membership fee of ${VILLAGE_MEMBERSHIP_FEE} AVAX...`,
      });

      const result = await executeContractCall(
        CONTRACTS.VILLAGE_CITIZENSHIP,
        'becomeCitizen',
        [],
        VILLAGE_MEMBERSHIP_FEE
      );
      
      toast({
        title: "Welcome to Mazunte Village!",
        description: "Village membership activated. You now have full community access.",
      });
    } catch (error: any) {
      console.error('Error joining village:', error);
      toast({
        title: "Village Membership Failed",
        description: error.message || "Failed to join village. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsJoiningVillage(false);
    }
  };

  const checkVillageMembership = useCallback(async (): Promise<boolean> => {
    if (!isConnected || !account) return false;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return Math.random() > 0.5;
    } catch (error) {
      console.error('Error checking village membership:', error);
      return false;
    }
  }, [isConnected, account]);

  // Mazunte Property Investment Functions
  const investInMazunte = useCallback(async (amount: number) => {
    if (!isConnected || !account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsInvestingInMazunte(true);
    
    try {
      toast({
        title: "Investment Processing",
        description: `Investing $${amount.toLocaleString()} in Mazunte property...`,
      });

      await new Promise(resolve => setTimeout(resolve, 3000));

      toast({
        title: "Investment Successful!",
        description: `You've successfully invested $${amount.toLocaleString()} in Mazunte property. You now own ${((amount / MAZUNTE_PROPERTY.VALUE) * 100).toFixed(2)}% of the property.`,
      });
    } catch (error) {
      console.error('Investment failed:', error);
      toast({
        title: "Investment Failed",
        description: "There was an error processing your investment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInvestingInMazunte(false);
    }
  }, [isConnected, account, toast]);

  const claimRentalIncome = useCallback(async () => {
    if (!isConnected || !account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Claiming Rental Income",
        description: "Processing your rental income claim...",
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Rental Income Claimed!",
        description: "Your rental income has been successfully claimed.",
      });
    } catch (error) {
      console.error('Rental claim failed:', error);
      toast({
        title: "Claim Failed",
        description: "There was an error claiming your rental income.",
        variant: "destructive",
      });
    }
  }, [isConnected, account, toast]);

  const getMazunteInvestorDetails = useCallback(async () => {
    if (!isConnected || !account) return null;

    try {
      return {
        investmentAmount: 50000,
        tokenBalance: 50000,
        ownershipPercentage: 3333,
        claimableRental: 683
      };
    } catch (error) {
      console.error('Failed to get investor details:', error);
      return null;
    }
  }, [isConnected, account]);

  const getMazuntePropertyStatus = useCallback(async () => {
    try {
      return {
        totalValue: MAZUNTE_PROPERTY.VALUE,
        invested: 125000,
        remaining: 25000,
        monthlyRent: MAZUNTE_PROPERTY.MONTHLY_RENT,
        fullyOwned: false
      };
    } catch (error) {
      console.error('Failed to get property status:', error);
      return null;
    }
  }, []);

  const purchaseTokens = async (investmentAmount: number = 30000) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsPurchasing(true);
    
    try {
      const propertyValue = 150000;
      const monthlyProfit = Math.round(((investmentAmount / propertyValue) * 943));
      const tokens = investmentAmount;
      
      toast({
        title: "Processing Token Purchase",
        description: `Purchasing ${tokens.toLocaleString()} MAZUNTE tokens for $${investmentAmount.toLocaleString()}...`,
      });

      const result = await executeContractCall(
        CONTRACTS.MAZUNTE_MORTGAGE,
        'invest',
        [investmentAmount * 1000000],
        '0'
      );
      
      toast({
        title: "Success! You are now a Mazunte Village Founding Citizen",
        description: `Investment: $${investmentAmount.toLocaleString()} | Monthly Yield: $${monthlyProfit} | Tokens: ${tokens.toLocaleString()}`,
      });
    } catch (error: any) {
      console.error('Error purchasing tokens:', error);
      toast({
        title: "Token Purchase Failed",
        description: error.message || "Failed to purchase MAZUNTE tokens. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        account,
        isLoading,
        connectWallet,
        disconnectWallet,
        purchaseTokens,
        isPurchasing,
        joinVillage,
        isJoiningVillage,
        checkVillageMembership,
        // Mazunte Property Functions
        investInMazunte,
        claimRentalIncome,
        getMazunteInvestorDetails,
        getMazuntePropertyStatus,
        isInvestingInMazunte
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Extend window type for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
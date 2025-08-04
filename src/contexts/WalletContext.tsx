import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CONTRACTS, NETWORK_CONFIG, VILLAGE_MEMBERSHIP_FEE, MAZUNTE_PROPERTY } from '@/lib/contracts';
import { web3Integration, Web3Integration } from '@/lib/web3-integration';
import { ethers } from 'ethers';
import { supabase } from '@/integrations/supabase/client';

interface WalletContextType {
  isConnected: boolean;
  account: string | null;
  chainId: string | null;
  networkName: string;
  isLoading: boolean;
  usdtBalance: string;
  ethBalance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  purchaseTokens: (investmentAmount?: number) => Promise<void>;
  isPurchasing: boolean;
  joinVillage: () => Promise<void>;
  isJoiningVillage: boolean;
  checkVillageMembership: () => Promise<boolean>;
  // Enhanced Mazunte Property Functions with Real Web3 Integration
  purchaseProperty: (downPayment: number) => Promise<{ success: boolean; mortgageId?: string; error?: string }>;
  makePayment: () => Promise<{ success: boolean; error?: string }>;
  getMortgageDetails: () => Promise<any>;
  getMazuntePropertyStatus: () => Promise<any>;
  getPaymentSchedule: () => Promise<any>;
  cancelDuringCoolingOff: () => Promise<{ success: boolean; error?: string }>;
  activateMortgage: () => Promise<{ success: boolean; error?: string }>;
  isPaymentOverdue: () => Promise<boolean>;
  isPurchasingProperty: boolean;
  isMakingPayment: boolean;
  web3: Web3Integration;
  // Demo Mode
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  getTestTokens: () => Promise<{ success: boolean; error?: string }>;
  isGettingTestTokens: boolean;
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
  const [chainId, setChainId] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState("Unknown");
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isJoiningVillage, setIsJoiningVillage] = useState(false);
  const [isPurchasingProperty, setIsPurchasingProperty] = useState(false);
  const [isMakingPayment, setIsMakingPayment] = useState(false);
  const [usdtBalance, setUsdtBalance] = useState('0');
  const [ethBalance, setEthBalance] = useState('0');
  const [isDemoMode, setIsDemoMode] = useState(false); // Start in real mode by default
  const [isGettingTestTokens, setIsGettingTestTokens] = useState(false);
  const { toast } = useToast();

  // Helper function to get network name from chainId
  const getNetworkName = (chainId: string): string => {
    const networks: { [key: string]: string } = {
      '0x1': 'Ethereum Mainnet',
      '0x89': 'Polygon',
      '0xa86a': 'Avalanche',
      '0x38': 'BSC',
      '0xa4b1': 'Arbitrum',
      '0x2a': 'Kovan Testnet',
      '0x5': 'Goerli Testnet',
      '0xaa36a7': 'Sepolia Testnet',
      '0x13881': 'Mumbai Testnet'
    };
    return networks[chainId] || `Network ${chainId}`;
  };

  useEffect(() => {
    // Check if already connected and initialize Web3
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(async (accounts: string[]) => {
          if (accounts.length > 0) {
            try {
              const chainId = await window.ethereum.request({ method: 'eth_chainId' });
              
              setAccount(accounts[0]);
              setChainId(chainId);
              setNetworkName(getNetworkName(chainId));
              setIsConnected(true);
              
              // Try to initialize web3 and get balances
              await web3Integration.initialize();
            } catch (error) {
              console.error('Web3 initialization failed:', error);
            }
          }
        })
        .catch(console.error);

      // Listen for account and network changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(chainId);
        setNetworkName(getNetworkName(chainId));
      });
    }
  }, []);

  // Update balances when account or network changes
  useEffect(() => {
    if (isConnected && account && !isDemoMode) {
      const updateBalances = async () => {
        try {
          // Get ETH balance
          const ethBalanceHex = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [account, 'latest']
          });
          const ethBalance = (parseInt(ethBalanceHex, 16) / 1e18).toFixed(4);
          setEthBalance(ethBalance);

          // Try to get USDT balance if contract exists
          try {
            const usdtBalance = await web3Integration.getUSDTBalance(account);
            setUsdtBalance(usdtBalance);
          } catch (error) {
            setUsdtBalance("Contract not available");
          }
        } catch (error) {
          console.error('Failed to update balances:', error);
        }
      };
      
      updateBalances();
      
      // Set up balance update interval
      const interval = setInterval(updateBalances, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    } else if (isDemoMode) {
      setEthBalance("2.5");
      setUsdtBalance("1000");
    }
  }, [isConnected, account, chainId, isDemoMode]);

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
      if (isDemoMode) {
        // Simulate wallet connection in demo mode
        setTimeout(() => {
          setAccount("0x742d35Cc6635C0532925a3b8C2Fb74E4b2A4b2a");
          setChainId("0x1");
          setNetworkName("Demo Network");
          setIsConnected(true);
          setUsdtBalance("1000");
          setEthBalance("2.5");
          setIsLoading(false);
          
          toast({
            title: "Demo Wallet Connected",
            description: "Connected to demo wallet with test tokens",
          });
        }, 1000);
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const account = accounts[0];
        
        // Get current network
        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        });
        
        setAccount(account);
        setChainId(chainId);
        setNetworkName(getNetworkName(chainId));
        setIsConnected(true);
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ${getNetworkName(chainId)}`,
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
    setChainId(null);
    setNetworkName("Unknown");
    setIsConnected(false);
    setUsdtBalance('0');
    setEthBalance('0');
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

      const tx = await web3Integration.joinVillage();
      await tx.wait();
      
      toast({
        title: "Welcome to Mazunte Village! 🏝️",
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
      return await web3Integration.checkVillageMembership(account);
    } catch (error) {
      console.error('Error checking village membership:', error);
      return false;
    }
  }, [isConnected, account]);

  // Enhanced Mazunte Property Functions with Real Web3 Integration
  const purchaseProperty = useCallback(async (downPayment: number): Promise<{ success: boolean; mortgageId?: string; error?: string }> => {
    if (!isConnected || !account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return { success: false, error: "Wallet not connected" };
    }

    setIsPurchasingProperty(true);
    
    try {
      if (isDemoMode) {
        // Demo mode - simulate purchase and save to database
        toast({
          title: "Processing Property Purchase (Demo)",
          description: `Processing down payment of $${downPayment.toLocaleString()}...`,
        });

        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockMortgageId = `demo_${Date.now()}`;
        
        // Save demo purchase to database
        const propertyData = {
          user_wallet_address: account.toLowerCase(),
          property_name: 'Mazunte Beach Property (Demo)',
          property_location: 'Mazunte, Oaxaca, Mexico',
          purchase_price: 150000,
          down_payment: downPayment,
          mortgage_id: mockMortgageId,
          current_value: 150000,
          monthly_payment: 1456,
          remaining_balance: 150000 - downPayment,
          equity_percentage: (downPayment / 150000) * 100,
        };

        const { error: dbError } = await supabase
          .from('user_properties')
          .insert([propertyData]);

        if (dbError) {
          console.error('Failed to save demo property to database:', dbError);
        }

        // Log demo transaction
        const transactionData = {
          user_wallet_address: account.toLowerCase(),
          transaction_hash: `demo_tx_${Date.now()}`,
          transaction_type: 'property_purchase',
          amount: downPayment,
          currency: 'USDT',
          status: 'confirmed',
          metadata: {
            mortgageId: mockMortgageId,
            propertyName: 'Mazunte Beach Property (Demo)',
            propertyValue: 150000,
            demoMode: true
          }
        };

        const { error: txError } = await supabase
          .from('user_transactions')
          .insert([transactionData]);

        if (txError) {
          console.error('Failed to save demo transaction to database:', txError);
        }

        toast({
          title: "Property Purchase Successful! 🏡 (Demo)",
          description: `Demo mortgage created with ID: ${mockMortgageId}`,
        });

        return { success: true, mortgageId: mockMortgageId };
      }

      toast({
        title: "Processing Property Purchase",
        description: `Processing down payment of $${downPayment.toLocaleString()}...`,
      });

      // Real smart contract interaction
      const result = await web3Integration.purchaseProperty(downPayment);
      
      // Wait for transaction confirmation
      await result.transaction.wait();

      // Save successful purchase to database
      const propertyData = {
        user_wallet_address: account.toLowerCase(),
        property_name: 'Mazunte Beach Property',
        property_location: 'Mazunte, Oaxaca, Mexico',
        purchase_price: 150000,
        down_payment: downPayment,
        mortgage_id: result.mortgageId,
        current_value: 150000,
        monthly_payment: 1456,
        remaining_balance: 150000 - downPayment,
        equity_percentage: (downPayment / 150000) * 100,
      };

      const { error: dbError } = await supabase
        .from('user_properties')
        .insert([propertyData]);

      if (dbError) {
        console.error('Failed to save property to database:', dbError);
      }

      // Log transaction to database
      const transactionData = {
        user_wallet_address: account.toLowerCase(),
        transaction_hash: result.transaction.hash,
        transaction_type: 'property_purchase',
        amount: downPayment,
        currency: 'USDT',
        status: 'confirmed',
        metadata: {
          mortgageId: result.mortgageId,
          propertyName: 'Mazunte Beach Property',
          propertyValue: 150000
        }
      };

      const { error: txError } = await supabase
        .from('user_transactions')
        .insert([transactionData]);

      if (txError) {
        console.error('Failed to save transaction to database:', txError);
      }
      
      // Update USDT balance
      const newBalance = await web3Integration.getUSDTBalance(account);
      setUsdtBalance(newBalance);

      toast({
        title: "Property Purchase Successful! 🏡",
        description: `Mortgage created with ID: ${result.mortgageId}. You have a 72-hour cooling-off period.`,
      });

      return { success: true, mortgageId: result.mortgageId };
    } catch (error: any) {
      console.error('Property purchase failed:', error);
      const errorMessage = error.message || "There was an error processing your property purchase.";
      
      toast({
        title: "Purchase Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setIsPurchasingProperty(false);
    }
  }, [isConnected, account, toast, isDemoMode]);

  const makePayment = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!isConnected || !account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return { success: false, error: "Wallet not connected" };
    }

    setIsMakingPayment(true);
    
    try {
      toast({
        title: "Processing Payment",
        description: "Making your monthly mortgage payment...",
      });

      // Real smart contract interaction
      const tx = await web3Integration.makePayment();
      await tx.wait();
      
      // Update USDT balance
      const newBalance = await web3Integration.getUSDTBalance(account);
      setUsdtBalance(newBalance);

      toast({
        title: "Payment Successful! 💰",
        description: "Your monthly mortgage payment has been processed.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Payment failed:', error);
      const errorMessage = error.message || "There was an error processing your payment.";
      
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setIsMakingPayment(false);
    }
  }, [isConnected, account, toast]);

  const getMortgageDetails = useCallback(async () => {
    if (!isConnected || !account) return null;

    // Demo mode: return mock mortgage data with realistic production values
    if (isDemoMode) {
      const nextPaymentDue = new Date();
      nextPaymentDue.setDate(nextPaymentDue.getDate() + 30); // Payment due in 30 days
      
      // Just made the down payment, so this is the start of the mortgage
      const totalValue = MAZUNTE_PROPERTY.PRODUCTION.VALUE; // $150,000
      const downPayment = MAZUNTE_PROPERTY.PRODUCTION.MIN_DOWN_PAYMENT; // $30,000
      const principalAmount = totalValue - downPayment; // $120,000
      const remainingBalance = principalAmount; // Full $120,000 since no payments made yet
      const totalMonths = 120; // 10 years * 12 months
      const annualRate = 0.08; // 8%
      const monthlyRate = annualRate / 12; // 0.006667
      
      // Calculate monthly payment using mortgage formula: M = P * [r(1 + r)^n] / [(1 + r)^n - 1]
      const monthlyPayment = Math.round(
        principalAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      ); // ~$1,456
      
      return {
        downPayment: downPayment,
        principalAmount: principalAmount,
        monthlyPayment: monthlyPayment,
        remainingBalance: remainingBalance, // Full $120,000
        nextPaymentDue: nextPaymentDue.getTime(),
        missedPayments: 0,
        totalPaid: 0, // No payments made yet
        paymentsRemaining: totalMonths, // All 120 payments remaining
        totalPayments: totalMonths,
        isActive: true,
        isForeclosed: false,
        isCompleted: false,
        coolingOffActive: false
      };
    }

    try {
      const details = await web3Integration.getMortgageDetails(account);
      
      return {
        downPayment: parseFloat(web3Integration.formatUSDT(details.downPayment)),
        principalAmount: parseFloat(web3Integration.formatUSDT(details.principalAmount)),
        monthlyPayment: parseFloat(web3Integration.formatUSDT(details.monthlyPayment)),
        remainingBalance: parseFloat(web3Integration.formatUSDT(details.remainingBalance)),
        nextPaymentDue: Number(details.nextPaymentDue) * 1000, // Convert to milliseconds
        missedPayments: Number(details.missedPayments),
        totalPaid: parseFloat(web3Integration.formatUSDT(details.totalPaid)),
        isActive: details.isActive,
        isForeclosed: details.isForeclosed,
        isCompleted: details.isCompleted,
        coolingOffActive: details.coolingOffActive
      };
    } catch (error) {
      console.error('Failed to get mortgage details:', error);
      return null;
    }
  }, [isConnected, account, isDemoMode]);

  const getMazuntePropertyStatus = useCallback(async () => {
    // Demo mode: return mock property data with realistic production values
    if (isDemoMode) {
      const totalValue = MAZUNTE_PROPERTY.PRODUCTION.VALUE; // $150,000
      const appreciationValue = totalValue * 0.08; // 8% appreciation = $12,000
      const currentValue = totalValue + appreciationValue; // $162,000
      
      return {
        totalValue: totalValue,
        currentValue: currentValue,
        totalDownPayments: MAZUNTE_PROPERTY.PRODUCTION.MIN_DOWN_PAYMENT, // $30,000
        appreciationValue: appreciationValue,
        fullyOwned: false
      };
    }

    try {
      const status = await web3Integration.getPropertyStatus();
      
      return {
        totalValue: parseFloat(web3Integration.formatUSDT(status.totalValue)),
        currentValue: parseFloat(web3Integration.formatUSDT(status.currentValue)),
        totalDownPayments: parseFloat(web3Integration.formatUSDT(status.totalDownPayments)),
        appreciationValue: parseFloat(web3Integration.formatUSDT(status.appreciationValue)),
        fullyOwned: status.fullyOwned
      };
    } catch (error) {
      console.error('Failed to get property status:', error);
      return null;
    }
  }, [isDemoMode]);

  const getPaymentSchedule = useCallback(async () => {
    if (!isConnected || !account) return null;

    try {
      const schedule = await web3Integration.getPaymentSchedule(account);
      
      return schedule.map((payment: any) => ({
        paymentNumber: Number(payment.paymentNumber),
        principalAmount: parseFloat(web3Integration.formatUSDT(payment.principalAmount)),
        interestAmount: parseFloat(web3Integration.formatUSDT(payment.interestAmount)),
        remainingBalance: parseFloat(web3Integration.formatUSDT(payment.remainingBalance)),
        dueDate: Number(payment.dueDate) * 1000, // Convert to milliseconds
        isPaid: payment.isPaid
      }));
    } catch (error) {
      console.error('Failed to get payment schedule:', error);
      return null;
    }
  }, [isConnected, account]);

  const cancelDuringCoolingOff = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!isConnected || !account) {
      return { success: false, error: "Wallet not connected" };
    }

    try {
      const tx = await web3Integration.cancelDuringCoolingOff();
      await tx.wait();
      
      // Update USDT balance
      const newBalance = await web3Integration.getUSDTBalance(account);
      setUsdtBalance(newBalance);

      toast({
        title: "Cancellation Successful",
        description: "Your mortgage has been cancelled and down payment refunded.",
      });
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || "Failed to cancel mortgage.";
      toast({
        title: "Cancellation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  }, [isConnected, account, toast]);

  const activateMortgage = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!isConnected || !account) {
      return { success: false, error: "Wallet not connected" };
    }

    try {
      const tx = await web3Integration.activateMortgage();
      await tx.wait();

      toast({
        title: "Mortgage Activated",
        description: "Your mortgage is now active. First payment is due in 30 days.",
      });
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || "Failed to activate mortgage.";
      toast({
        title: "Activation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  }, [isConnected, account, toast]);

  const isPaymentOverdue = useCallback(async (): Promise<boolean> => {
    if (!isConnected || !account) return false;

    try {
      return await web3Integration.isPaymentOverdue(account);
    } catch (error) {
      console.error('Failed to check payment status:', error);
      return false;
    }
  }, [isConnected, account]);

  // Demo Mode Functions
  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
    toast({
      title: isDemoMode ? "Live Mode Activated" : "Demo Mode Activated",
      description: isDemoMode ? "You're now using live blockchain values" : "You're now using demo values for testing",
    });
  };

  const getTestTokens = async (): Promise<{ success: boolean; error?: string }> => {
    if (!isDemoMode) {
      return { success: false, error: "Test tokens only available in demo mode" };
    }

    setIsGettingTestTokens(true);
    
    try {
      // Simulate faucet delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In demo mode, just add test tokens to balance
      const currentBalance = parseFloat(usdtBalance) || 0;
      const newBalance = (currentBalance + 1000).toString();
      setUsdtBalance(newBalance);
      
      toast({
        title: "Test Tokens Received! 🪙",
        description: `Added 1,000 test USDT to your balance. New balance: $${newBalance}`,
      });
      
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Test Token Request Failed",
        description: error.message || "Failed to get test tokens. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsGettingTestTokens(false);
    }
  };

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
      const propertyConfig = isDemoMode ? MAZUNTE_PROPERTY.DEMO : MAZUNTE_PROPERTY.PRODUCTION;
      const propertyValue = propertyConfig.VALUE;
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
        chainId,
        networkName,
        isLoading,
        usdtBalance,
        ethBalance,
        connectWallet,
        disconnectWallet,
        purchaseTokens,
        isPurchasing,
        joinVillage,
        isJoiningVillage,
        checkVillageMembership,
        // Enhanced Mazunte Property Functions with Real Web3 Integration
        purchaseProperty,
        makePayment,
        getMortgageDetails,
        getMazuntePropertyStatus,
        getPaymentSchedule,
        cancelDuringCoolingOff,
        activateMortgage,
        isPaymentOverdue,
        isPurchasingProperty,
        isMakingPayment,
        web3: web3Integration,
        // Demo Mode
        isDemoMode,
        toggleDemoMode,
        getTestTokens,
        isGettingTestTokens
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
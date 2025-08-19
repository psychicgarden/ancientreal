import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CONTRACTS, NETWORK_CONFIG, VILLAGE_MEMBERSHIP_FEE, MAZUNTE_PROPERTY } from '@/lib/contracts';
import { web3Integration, Web3Integration } from '@/lib/web3-integration';
import { getExplorerTxUrl } from '@/lib/utils';
import { DEMO_CONFIG, getDemoWallet } from '@/config/demo';

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
  purchaseProperty: (downPayment: number, platformFee?: number) => Promise<{ success: boolean; mortgageId?: string; error?: string; downPaymentTx?: any; platformFeeTx?: any; }>;
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
  const [isDemoMode, setIsDemoMode] = useState(DEMO_CONFIG.isEnabled); // Use centralized demo config
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
      [NETWORK_CONFIG.chainId]: NETWORK_CONFIG.chainName,
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

  // Helper function to update balances
  const updateBalances = useCallback(async () => {
    if (isConnected && account && !isDemoMode) {
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
    }
  }, [isConnected, account, isDemoMode]);

  // Update balances when account or network changes
  useEffect(() => {
    if (isConnected && account && !isDemoMode) {
      updateBalances();
      
      // Set up balance update interval
      const interval = setInterval(updateBalances, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    } else if (isDemoMode) {
      setEthBalance("2.5");
      setUsdtBalance("1000");
    }
  }, [isConnected, account, chainId, isDemoMode, updateBalances]);

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
      if (DEMO_CONFIG.isEnabled) {
        // Simulate wallet connection in demo mode
        const demoWallet = getDemoWallet();
        if (demoWallet) {
          setTimeout(() => {
            setAccount(demoWallet.address);
            setChainId(demoWallet.chainId);
            setNetworkName(demoWallet.networkName);
            setIsConnected(true);
            setUsdtBalance("1000");
            setEthBalance("2.5");
            setIsLoading(false);
            
            toast({
              title: "Demo Wallet Connected",
              description: "Connected to demo wallet with test tokens",
            });
          }, 1000);
        }
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
  const purchaseProperty = useCallback(async (downPayment: number, platformFee?: number): Promise<{ success: boolean; mortgageId?: string; error?: string; downPaymentTx?: any; platformFeeTx?: any; }> => {
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
        toast({
          title: "Processing Property Purchase (Demo)",
          description: `Processing down payment of $${downPayment.toLocaleString()}${platformFee ? ` and platform fee of $${platformFee.toLocaleString()}` : ''}...`,
        });

        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockMortgageId = `demo_${Date.now()}`;
        const timestamp = Date.now();
        
        // Create mock transaction objects that match the expected format
        const mockDownPaymentTx = {
          hash: `0xdemo_downpayment_${timestamp}`,
          blockNumber: 123456,
          gasUsed: "21000",
          status: 1
        };
        
        const mockPlatformFeeTx = platformFee && platformFee > 0 ? {
          hash: `0xdemo_platformfee_${timestamp}`,
          blockNumber: 123456,
          gasUsed: "21000", 
          status: 1
        } : null;

        toast({
          title: "Property Purchase Successful! 🏡 (Demo)",
          description: `Demo mortgage created with ID: ${mockMortgageId}${platformFee ? ` | Platform fee: $${platformFee.toLocaleString()}` : ''}`,
        });

        return { 
          success: true, 
          mortgageId: mockMortgageId,
          downPaymentTx: mockDownPaymentTx,
          platformFeeTx: mockPlatformFeeTx
        };
      }

      // Execute down payment transaction
      const downPaymentResult = await web3Integration.purchaseProperty(downPayment);
      const mortgageId = downPaymentResult.mortgageId;
      
      let platformFeeTx = null;
      if (platformFee && platformFee > 0) {
        // Execute separate platform fee transaction to platform treasury
        try {
          platformFeeTx = await web3Integration.sendPlatformFee(platformFee);
        } catch (platformFeeError) {
          console.warn("Platform fee transaction failed:", platformFeeError);
          // Continue with purchase even if platform fee fails for now
        }
      }
      
      toast({
        title: "Property Purchase Successful! 🏠",
        description: `Down payment: $${downPayment.toLocaleString()}${platformFee ? ` | Platform fee: $${platformFee.toLocaleString()}` : ''} | Mortgage ID: ${mortgageId}`,
      });
      
      // Refresh balances
      await updateBalances();
      
      return { 
        success: true, 
        mortgageId,
        downPaymentTx: downPaymentResult.transaction,
        platformFeeTx
      };
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

      const explorerUrl = getExplorerTxUrl(tx.hash);
      toast({
        title: "Payment Successful! 💰",
        description: `Your monthly mortgage payment has been processed. View on explorer: ${explorerUrl}`,
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
    const newDemoMode = !isDemoMode;
    setIsDemoMode(newDemoMode);
    toast({
      title: newDemoMode ? "Demo Mode Activated" : "Live Mode Activated", 
      description: newDemoMode ? "You're now using demo values for testing" : "You're now using live blockchain values",
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
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { CONTRACTS, NETWORK_CONFIG, VILLAGE_MEMBERSHIP_FEE, MAZUNTE_PROPERTY } from '@/lib/contracts';
import { web3Integration, Web3Integration } from '@/lib/web3-integration';
import { getExplorerTxUrl } from '@/lib/utils';
import { DEMO_CONFIG, getDemoWallet } from '@/config/demo';
import { isCorrectNetwork } from '@/config/chain';
import { WalletStorage } from '@/lib/wallet-storage';

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
  web3Integration: Web3Integration;
  executeContractCall: (contractConfig: any, method: string, params?: any[], value?: string) => Promise<{ hash: string; success: boolean; receipt?: any }>;
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

  // Auto-connection with proper validation
  useEffect(() => {
    const initializeWallet = async () => {
      // Never auto-connect in demo mode unless explicitly enabled
      if (DEMO_CONFIG.isEnabled) {
        console.log("Demo mode: Skipping auto-connection");
        return;
      }

      if (!window.ethereum) {
        console.log("No ethereum provider found");
        return;
      }

      const { wallet, account: lastAccount, shouldAutoConnect } = WalletStorage.getLastWallet();
      
      // Only auto-connect if user previously chose to connect
      if (!shouldAutoConnect || !lastAccount) {
        console.log("No auto-connect preference found");
        return;
      }

      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        
        // Verify the last connected account is still available
        if (!accounts.includes(lastAccount)) {
          console.log("Last connected account no longer available");
          WalletStorage.clearWalletConnection();
          return;
        }

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        setAccount(lastAccount);
        setChainId(chainId);
        setNetworkName(getNetworkName(chainId));
        setIsConnected(true);

        // Validate network without auto-switching
        if (!isCorrectNetwork(chainId)) {
          toast({
            title: "Wrong Network",
            description: `Please switch to ${NETWORK_CONFIG.chainName} to use all features`,
            variant: "destructive"
          });
        } else {
          // Only initialize Web3 if on correct network
          try {
            await web3Integration.initialize();
          } catch (error) {
            console.error('Web3 initialization failed:', error);
          }
        }

      } catch (error) {
        console.error('Auto-connection failed:', error);
        WalletStorage.clearWalletConnection();
      }
    };

    initializeWallet();

    // Enhanced event listeners with proper validation
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
          // Update stored account if connected
          if (isConnected) {
            WalletStorage.saveWalletConnection(accounts[0], 'metamask');
          }
        }
      };

      const handleChainChanged = (chainId: string) => {
        setChainId(chainId);
        setNetworkName(getNetworkName(chainId));
        
        // Show network warning if wrong chain
        if (isConnected && !isCorrectNetwork(chainId)) {
          toast({
            title: "Network Changed",
            description: `You switched to ${getNetworkName(chainId)}. Please switch to ${NETWORK_CONFIG.chainName} for full functionality`,
            variant: "destructive"
          });
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
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
    if (!window.ethereum) {
      toast({
        title: "No Wallet Found",
        description: "Please install MetaMask to switch networks",
        variant: "destructive"
      });
      return;
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
          
        } catch (addError: any) {
          console.error(`Error adding ${NETWORK_CONFIG.chainName} network:`, addError);
          toast({
            title: "Network Error",
            description: `Failed to add ${NETWORK_CONFIG.chainName} network to your wallet.`,
            variant: "destructive"
          });
        }
      } else if (switchError.code === 4001) {
        // User rejected the request
        toast({
          title: "Network Switch Cancelled",
          description: "You cancelled the network switch request",
          variant: "destructive"
        });
      } else {
        console.error(`Error switching to ${NETWORK_CONFIG.chainName}:`, switchError);
        toast({
          title: "Network Error", 
          description: `Failed to switch to ${NETWORK_CONFIG.chainName} network.`,
          variant: "destructive"
        });
      }
    }
  };

  const executeContractCall = async (contractConfig: any, method: string, params: any[] = [], value?: string) => {
    try {
      // Initialize Web3 integration if not already done
      await web3Integration.initialize();

      // Get the contract instance
      const contractAddress = typeof contractConfig === 'string' ? contractConfig : contractConfig.address;
      const contract = web3Integration.getContract('MAZUNTE_MORTGAGE');
      
      // Execute the real contract call
      let tx;
      if (value && value !== '0') {
        tx = await contract[method](...params, { value: ethers.parseEther(value) });
      } else {
        tx = await contract[method](...params);
      }
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      return { 
        hash: receipt.transactionHash, 
        success: true,
        receipt: receipt
      };
    } catch (error) {
      console.error('Real contract call failed:', error);
      throw error;
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);

    try {
      // Demo mode handling - connect immediately
      if (DEMO_CONFIG.isEnabled) {
        const demoWallet = getDemoWallet();
        if (demoWallet) {
          // Set demo connection immediately without setTimeout
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
        }
        return;
      }

      // Check for MetaMask in live mode
      if (!window.ethereum) {
        toast({
          title: "Wallet Not Found",
          description: "Please install MetaMask or another Ethereum wallet",
          variant: "destructive"
        });
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length === 0) {
        throw new Error('No accounts returned from wallet');
      }

      const account = accounts[0];
      const chainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      });

      // Set basic connection state
      setAccount(account);
      setChainId(chainId);
      setNetworkName(getNetworkName(chainId));
      setIsConnected(true);

      // Save wallet preference for auto-connection
      WalletStorage.saveWalletConnection(account, 'metamask');

      // Check network and prompt switch if needed
      if (!isCorrectNetwork(chainId)) {
        toast({
          title: "Network Switch Required",
          description: `Please switch to ${NETWORK_CONFIG.chainName} to use all features`,
          variant: "destructive"
        });
        // Don't initialize Web3 on wrong network
      } else {
        // Initialize Web3 only on correct network
        try {
          await web3Integration.initialize();
          toast({
            title: "Wallet Connected",
            description: `Connected to ${getNetworkName(chainId)}`,
          });
        } catch (error) {
          console.error('Web3 initialization failed:', error);
          toast({
            title: "Connection Warning", 
            description: "Wallet connected but Web3 initialization failed",
            variant: "destructive"
          });
        }
      }

    } catch (error: any) {
      console.error('Connection failed:', error);
      
      let errorMessage = "Failed to connect wallet";
      if (error.code === 4001) {
        errorMessage = "Connection rejected by user";
      } else if (error.code === -32002) {
        errorMessage = "Connection request already pending";
      }
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setChainId(null);
    setNetworkName("Unknown");
    setUsdtBalance('0');
    setEthBalance('0');
    
    // Clear wallet storage
    WalletStorage.clearWalletConnection();
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected"
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
        web3Integration: web3Integration,
        executeContractCall,
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
import React, { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { ethers } from 'ethers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
// Removed ContractDatabaseIntegration - using direct ETH contract address
import { 
  AncientMortgageABI, 
  MockUSDTABI,
  BASE_SEPOLIA_CONTRACTS,
  parseUSDT,
  formatUSDT,
  calculateDownPayment,
  calculatePlatformFee,
  calculateTotalApproval
} from '@/lib/ancient-protocol';
import { ANCIENT_MORTGAGE_ETH_ABI, ANCIENT_MORTGAGE_ETH_ADDRESS } from '@/lib/abis/ancient-mortgage-eth-abi';
import { CONTRACTS } from '@/config/chain';
import { EnhancedContractDeployment } from '@/components/EnhancedContractDeployment';
import { Wallet, Home, DollarSign, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface MortgageData {
  propertyId: number;
  propertyValue: number;
  downPayment: number;
  loanAmount: number;
  monthlyPayment: number;
  remainingBalance: number;
  interestRate: number;
  termMonths: number;
  monthsPaid: number;
  nextPaymentDue: number;
  isActive: boolean;
  borrower: string;
}

interface UserProperty {
  id: string;
  property_name: string;
  property_location: string;
  purchase_price: number;
  down_payment: number;
  remaining_balance: number;
  monthly_payment: number;
  current_value: number;
  principal_paid_base: number;
  interest_paid_base: number;
  equity_percentage: number;
  is_active: boolean;
  property_id: number;
}

interface Property {
  id: number;
  name: string;
  location: string;
  imageUrl: string;
  price: string;
  isActive: boolean;
}

export const EnhancedMortgageSystem: React.FC = () => {
  const { account, isConnected, connectWallet } = useWallet();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState<string>('');
  const [contractNotFound, setContractNotFound] = useState<boolean>(false);
  const [mortgageData, setMortgageData] = useState<MortgageData | null>(null);
  const [userProperties, setUserProperties] = useState<UserProperty[]>([]);
  const [availableProperties, setAvailableProperties] = useState<Property[]>([]);
  const [userTokenId, setUserTokenId] = useState<bigint | null>(null);
  
  // Purchase form state
  const [selectedPropertyId, setSelectedPropertyId] = useState<number>(1);
  const [propertyValue, setPropertyValue] = useState<string>('');
  const [downPayment, setDownPayment] = useState<string>('');
  const [interestRate] = useState<number>(800); // 8% APR in basis points
  const [termMonths] = useState<number>(120); // 10 years

  // Load contract address on mount
  useEffect(() => {
    loadContractAddress();
  }, []);

  // Load data when wallet and contract are ready
  useEffect(() => {
    if (contractAddress && account) {
      fetchUserProperties();
      fetchMortgageData();
      fetchAvailableProperties();
    }
  }, [contractAddress, account]);

  // Auto-refresh data every 30 seconds when user has properties
  useEffect(() => {
    if (userProperties.length > 0 && account) {
      const interval = setInterval(() => {
        console.log('🔄 Auto-refreshing data...');
        fetchUserProperties();
        fetchMortgageData();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [userProperties.length, account]);

  const loadContractAddress = async () => {
    try {
      // Use ETH contract address - no fallbacks to USDC
      const address = ANCIENT_MORTGAGE_ETH_ADDRESS; // Force ETH contract
      console.log('🔍 Setting contract address to:', address);
      console.log('🔍 ANCIENT_MORTGAGE_ETH_ADDRESS constant:', ANCIENT_MORTGAGE_ETH_ADDRESS);
      setContractAddress(address);
      setContractNotFound(false);
      console.log('✅ Using ETH contract address:', address);
      console.log('✅ Expected ETH contract:', '0xE527DDaC2592FAa45884a0B78E4D377a5D3dF8cc');
      console.log('✅ Are they the same?', address === '0xE527DDaC2592FAa45884a0B78E4D377a5D3dF8cc');
      
      // Validate network
      await validateNetwork();
    } catch (error) {
      console.error('Error loading contract address:', error);
      setContractNotFound(true);
    }
  };

  const validateNetwork = async () => {
    try {
      if (!window.ethereum) return;
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      console.log('🌐 Current network:', {
        chainId: network.chainId.toString(),
        name: network.name
      });
      
      if (network.chainId !== 84532n) {
        toast({
          title: "⚠️ Wrong Network",
          description: "Please switch to Base Sepolia (Chain ID: 84532) to use this feature.",
          variant: "destructive"
        });
        return false;
      }
      
      console.log('✅ Network validated: Base Sepolia');
      return true;
    } catch (error) {
      console.error('❌ Network validation error:', error);
      return false;
    }
  };

  const fetchUserProperties = async () => {
    if (!account) {
      console.log('⚠️ No account connected, skipping fetchUserProperties');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('🔍 Fetching user properties for account:', account);
      console.log('🔍 Account lowercase:', account.toLowerCase());
      
      const { data, error } = await supabase
        .from('user_properties')
        .select('*')
        .or(`user_wallet_address.ilike.${account.toLowerCase()},user_address.ilike.${account.toLowerCase()}`)
        .eq('is_active', true);

      if (error) {
        console.error('❌ Supabase error fetching user properties:', error);
        console.error('❌ Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        toast({
          title: "Database Error",
          description: `Failed to fetch user properties: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Raw data from Supabase:', data);
      console.log('✅ Number of properties found:', data?.length || 0);
      
      if (data && data.length > 0) {
        console.log('✅ Property details:', data.map(p => ({
          id: p.id,
          mortgage_id: p.mortgage_id,
          property_name: p.property_name,
          user_wallet_address: p.user_wallet_address,
          user_address: p.user_address,
          is_active: p.is_active
        })));
      } else {
        console.log('⚠️ No properties found for account:', account);
        console.log('⚠️ This might be normal if no purchases have been made yet');
      }
      
      setUserProperties(data || []);
      
      // Show success toast if properties were found
      if (data && data.length > 0) {
        toast({
          title: "Properties Loaded",
          description: `Found ${data.length} active property(ies)`,
        });
      }
    } catch (error) {
      console.error('❌ Unexpected error in fetchUserProperties:', error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred while fetching properties",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMortgageData = async () => {
    if (!contractAddress || !account || !userTokenId) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, ANCIENT_MORTGAGE_ETH_ABI, provider);

      // Use getMortgage(tokenId) instead of getMortgageDetails(address)
      const data = await contract.getMortgage(userTokenId);
      
      if (data.isActive) {
        setMortgageData({
          propertyId: 1, // Will be set from property data
          propertyValue: Number(formatUSDT(data.propertyPrice)),
          downPayment: Number(formatUSDT(data.downPayment)),
          loanAmount: Number(formatUSDT(data.loanAmount)),
          monthlyPayment: Number(formatUSDT(data.monthlyPayment)),
          remainingBalance: Number(formatUSDT(data.remainingBalance)),
          interestRate: 8, // Fixed at 8%
          termMonths: Number(data.termMonths),
          monthsPaid: Number(data.paymentsMade),
          nextPaymentDue: 0, // Calculate from startTime if needed
          isActive: data.isActive,
          borrower: data.propertyOwner
        });
      } else {
        setMortgageData(null);
      }
    } catch (error) {
      console.log('No active mortgage found for user');
      setMortgageData(null);
    }
  };

  const fetchAvailableProperties = async () => {
    if (!contractAddress) return;

    try {
      // Use hardcoded properties since contract doesn't have getTotalProperties/getProperty
      // These match the properties from PROPERTIES_CATALOG
      const properties: Property[] = [
        {
          id: 1,
          name: 'Art Deco Loft in Mazunte, Mexico',
          location: 'Mazunte, Oaxaca, Mexico',
          imageUrl: '/lovable-uploads/cc5b33a0-6890-4e5f-ae6c-8b73ecef3849.png',
          price: '100.0', // 100 ETH equivalent ($435,000 USD)
          isActive: true
        },
        {
          id: 2,
          name: 'Beach House in Zipolite',
          location: 'Zipolite, Oaxaca, Mexico',
          imageUrl: '/lovable-uploads/beach-house.png',
          price: '80.0', // 80 ETH equivalent ($350,000 USD)
          isActive: true
        },
        {
          id: 3,
          name: 'Mountain Cabin in San José del Pacífico',
          location: 'San José del Pacífico, Oaxaca, Mexico',
          imageUrl: '/lovable-uploads/mountain-cabin.png',
          price: '60.0', // 60 ETH equivalent ($280,000 USD)
          isActive: true
        }
      ];

      console.log('✅ Using hardcoded properties (contract has no property storage):', properties);
      setAvailableProperties(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  // Purchase property with ETH (no approvals needed!)
  const handlePurchaseProperty = async (propertyId: number, propertyValue: string, downPayment: string) => {
    if (!contractAddress) {
      toast({
        title: "Error",
        description: "Wallet not connected or contract not available",
        variant: "destructive"
      });
      return;
    }

    // Validate network before proceeding
    const isValidNetwork = await validateNetwork();
    if (!isValidNetwork) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('=== DEBUG INFO ===');
      console.log('Contract Address:', contractAddress);
      console.log('Expected ETH Contract:', '0xE527DDaC2592FAa45884a0B78E4D377a5D3dF8cc');
      console.log('Are they the same?', contractAddress === '0xE527DDaC2592FAa45884a0B78E4D377a5D3dF8cc');
      console.log('Contract Address Type:', typeof contractAddress);
      console.log('Contract Address Length:', contractAddress?.length);
      console.log('Is Contract Address Empty?', !contractAddress);
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Use ETH contract and ABI
      const contract = new ethers.Contract(contractAddress, ANCIENT_MORTGAGE_ETH_ABI, signer);
      
      // Debug: Check function signature and contract address
      console.log('Function signature:', contract.interface.getFunction('purchaseProperty').format());
      console.log('Function selector:', contract.interface.getFunction('purchaseProperty').selector);
      console.log('Contract address from contract object:', contract.target);
      console.log('Contract address from state:', contractAddress);
      console.log('Are they the same?', contract.target === contractAddress);
      console.log('==================');
      
      // Convert property value to ETH (18 decimals)
      const propertyPriceETH = ethers.parseEther(propertyValue);
      
      // Calculate total ETH needed (20% down + 3% platform fee = 23%)
      const downPaymentPercent = 20; // 20%
      const platformFeePercent = 3; // 3%
      const totalPercent = downPaymentPercent + platformFeePercent; // 23%
      
      const totalETH = (propertyPriceETH * BigInt(totalPercent)) / BigInt(100);
      
      console.log('Purchase breakdown:', {
        propertyPrice: ethers.formatEther(propertyPriceETH),
        downPayment: '20%',
        platformFee: '3%',
        totalETH: ethers.formatEther(totalETH),
        totalPercent: `${totalPercent}%`
      });
      
      // Purchase with ETH - send value directly!
      console.log('Purchasing property with ETH...');
      const tx = await contract.purchaseProperty(
        propertyId,
        120, // termMonths (10 years)
        800, // aprBps (8% APR)
        "0x", // empty signature
        { value: totalETH } // ✅ Send ETH here!
      );

      console.log('Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      if (receipt.status === 1) {
        // Extract tokenId from PropertyPurchased event
        console.log('Parsing transaction receipt for mortgageId...');
        const purchaseEvent = receipt.logs
          .map((log: any) => {
            try {
              return contract.interface.parseLog(log);
            } catch {
              return null;
            }
          })
          .find((event: any) => event?.name === 'PropertyPurchased');

        if (purchaseEvent) {
          const mortgageId = purchaseEvent.args.mortgageId.toString();
          console.log('✅ Extracted mortgageId:', mortgageId);
          setUserTokenId(mortgageId);
          
          // Save to database
          try {
            const purchasePrice = parseFloat(propertyValue);
            const downPaymentAmount = parseFloat(downPayment);
            const loanAmount = purchasePrice - downPaymentAmount;
            
            const { error: dbError } = await supabase
              .from('user_properties')
              .insert({
                user_wallet_address: account.toLowerCase(),
                user_address: account.toLowerCase(), // Also set user_address for compatibility
                mortgage_id: mortgageId,
                property_id: propertyId,
                property_name: `Property #${propertyId}`,
                property_location: 'Mazunte, Oaxaca, Mexico', // Required field
                purchase_price: purchasePrice,
                down_payment: downPaymentAmount,
                loan_amount: loanAmount,
                remaining_balance: loanAmount, // Initially equals loan amount
                monthly_payment: 0, // Will be updated from contract
                term_months: 120,
                apr_bps: 800,
                is_active: true,
                created_at: new Date().toISOString()
              });

            if (dbError) {
              console.error('❌ Database error:', dbError);
            } else {
              console.log('✅ Saved to database');
              
              // Update monthly payment from contract
              try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const contract = new ethers.Contract(contractAddress, ANCIENT_MORTGAGE_ETH_ABI, provider);
                const mortgageData = await contract.getMortgage(mortgageId);
                
                // Update the database with the actual monthly payment from contract
                const { error: updateError } = await supabase
                  .from('user_properties')
                  .update({
                    monthly_payment: Number(ethers.formatEther(mortgageData.monthlyPayment)),
                    remaining_balance: Number(ethers.formatEther(mortgageData.remainingBalance))
                  })
                  .eq('mortgage_id', mortgageId);
                
                if (updateError) {
                  console.error('❌ Error updating monthly payment:', updateError);
                } else {
                  console.log('✅ Updated monthly payment from contract');
                }
              } catch (contractError) {
                console.error('❌ Error fetching mortgage data from contract:', contractError);
              }
            }
          } catch (err) {
            console.error('Failed to save to database:', err);
          }
          
          toast({
            title: "Purchase Successful!",
            description: `Property purchased! Your mortgage NFT token ID is: ${mortgageId}`,
          });
          
          console.log('Purchase successful! MortgageId:', mortgageId);
        } else {
          console.warn('PropertyPurchased event not found - mortgageId not available');
          toast({
            title: "Purchase Successful",
            description: "Property purchased successfully!",
          });
        }

        // Refresh data with retry mechanism
        const refreshData = async (attempt = 1) => {
          console.log(`🔄 Refreshing data (attempt ${attempt})...`);
          try {
            await fetchUserProperties();
            await fetchMortgageData();
            console.log('✅ Data refresh successful');
          } catch (error) {
            console.error(`❌ Data refresh failed (attempt ${attempt}):`, error);
            if (attempt < 3) {
              // Retry after increasing delay
              setTimeout(() => refreshData(attempt + 1), attempt * 3000);
            } else {
              toast({
                title: "Data Refresh Failed",
                description: "Please manually refresh to see your properties",
                variant: "destructive"
              });
            }
          }
        };
        
        // Start refresh after 3 seconds, then retry if needed
        setTimeout(() => refreshData(), 3000);
      } else {
        throw new Error('Transaction failed');
      }

    } catch (error: any) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to purchase property",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveTokenIdToDatabase = async (tokenId: bigint) => {
    try {
      const { error } = await supabase
        .from('user_properties')
        .insert({
          user_wallet_address: account,
          mortgage_id: tokenId.toString(),
          purchase_price: parseFloat(propertyValue),
          property_name: 'Base Sepolia Property',
          property_location: 'On-Chain',
          down_payment: parseFloat(propertyValue) * 0.23,
          remaining_balance: parseFloat(propertyValue) * 0.77,
          current_value: parseFloat(propertyValue),
          equity_percentage: 23,
          is_active: true,
          currency: 'ETH',
          property_id: 1,
        });
      
      if (error) {
        console.error('Error saving tokenId:', error);
      } else {
        console.log('TokenId saved to database:', tokenId.toString());
      }
    } catch (error) {
      console.error('Error saving to database:', error);
    }
  };

  // Make payment with ETH (no approvals needed!)
  const handleMakePayment = async () => {
    if (!contractAddress || !mortgageData || !userTokenId) {
      toast({
        title: "Error",
        description: "Wallet not connected, contract not available, or no active mortgage",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Use ETH contract and ABI
      const contract = new ethers.Contract(contractAddress, ANCIENT_MORTGAGE_ETH_ABI, signer);
      
      // Get mortgage details to find monthly payment
      const mortgage = await contract.getMortgage(userTokenId);
      const monthlyPayment = mortgage.monthlyPayment;
      
      console.log('Making payment:', {
        mortgageId: userTokenId.toString(),
        monthlyPayment: ethers.formatEther(monthlyPayment),
        token: 'ETH'
      });
      
      // Make payment with ETH - send value directly!
      const tx = await contract.makePayment(userTokenId, { value: monthlyPayment });
      
      toast({
        title: "Transaction Sent",
        description: `Payment transaction sent: ${tx.hash.slice(0, 10)}...`
      });

      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        toast({
          title: "Success",
          description: "Payment made successfully!"
        });

        // Refresh data after a short delay
        setTimeout(() => {
          fetchMortgageData();
          fetchUserProperties();
        }, 2000);
      } else {
        throw new Error('Transaction failed');
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to make payment",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger manual indexing of mortgage events
  const handleReconcilePayments = async () => {
    if (!contractAddress) {
      toast({
        title: "Error",
        description: "Contract address not available",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('mortgage-events-indexer', {
        body: { 
          contract_address: contractAddress,
          network: 'fuji'
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Success",
        description: "Events reconciled successfully!"
      });

      // Refresh data
      setTimeout(() => {
        fetchUserProperties();
        fetchMortgageData();
      }, 2000);

    } catch (error: any) {
      console.error('Reconcile error:', error);
      toast({
        title: "Reconcile Failed",
        description: error.message || "Failed to reconcile events",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateEquityProgress = (property: UserProperty): number => {
    const totalPrincipalPaid = (property.principal_paid_base || 0) / 1000000;
    const loanAmount = property.purchase_price - property.down_payment;
    return Math.min((totalPrincipalPaid / loanAmount) * 100, 100);
  };

  // Show deployment component if no contract is found
  if (contractNotFound) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Contract Not Deployed</AlertTitle>
          <AlertDescription>
            Enhanced AVAX Mortgage contract not deployed or address not found. Deploy the contract first to enable mortgage functionality.
          </AlertDescription>
        </Alert>
        
        <EnhancedContractDeployment />
        
        <div className="flex justify-center">
          <Button onClick={loadContractAddress} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Loading Contract
          </Button>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <Wallet className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-4">Wallet Connection Required</h3>
        <p className="text-muted-foreground mb-6">
          Connect your wallet to access the Enhanced Mortgage System
        </p>
        <Button onClick={connectWallet}>Connect Wallet</Button>
      </div>
    );
  }

  if (!contractAddress) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 mx-auto mb-6 text-destructive" />
        <h3 className="text-xl font-semibold mb-4">Contract Not Available</h3>
        <p className="text-muted-foreground mb-6">
          Enhanced AVAX Mortgage contract not deployed or address not found
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={loadContractAddress} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
          <Button onClick={() => {
            console.log('🔄 Manual refresh triggered by user');
            fetchUserProperties();
            fetchMortgageData();
          }} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
          Enhanced Mortgage System
        </h2>
        <p className="text-lg text-muted-foreground">
          Scalable event-driven mortgage system with smart contract integration
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contract Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties Available</CardTitle>
            <Home className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableProperties.length}</div>
            <p className="text-xs text-muted-foreground">
              On-chain properties
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Properties</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProperties.length}</div>
            <p className="text-xs text-muted-foreground">
              Owned properties
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="purchase" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="purchase">Purchase</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="properties">My Properties</TabsTrigger>
          <TabsTrigger value="reconcile">Reconcile</TabsTrigger>
        </TabsList>

        <TabsContent value="purchase" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Purchase</CardTitle>
              <CardDescription>
                Purchase properties from the smart contract with event-driven database sync
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableProperties.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Properties Available</AlertTitle>
                  <AlertDescription>
                    No active properties found in the smart contract. Contract owner needs to add properties first.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="property-select">Select Property</Label>
                    <select 
                      id="property-select"
                      value={selectedPropertyId}
                      onChange={(e) => setSelectedPropertyId(Number(e.target.value))}
                      className="w-full p-2 border rounded-md"
                    >
                      {availableProperties.map((property) => (
                        <option key={property.id} value={property.id}>
                          {property.name} - {property.location} ({property.price} ETH)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="property-value">Property Value (ETH)</Label>
                      <Input
                        id="property-value"
                        type="number"
                        value={propertyValue}
                        onChange={(e) => setPropertyValue(e.target.value)}
                        placeholder="e.g., 100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="down-payment">Down Payment (ETH)</Label>
                      <Input
                        id="down-payment"
                        type="number"
                        value={downPayment}
                        onChange={(e) => setDownPayment(e.target.value)}
                        placeholder="e.g., 20"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>Interest Rate: {interestRate / 100}% APR</span>
                    <span>•</span>
                    <span>Term: {termMonths} months</span>
                  </div>

                  <Button 
                    onClick={() => handlePurchaseProperty(selectedPropertyId, propertyValue, downPayment)}
                    disabled={isLoading || !propertyValue || !downPayment || mortgageData?.isActive}
                    className="w-full"
                  >
                    {isLoading ? "Purchasing..." : "Purchase Property"}
                  </Button>

                  {mortgageData?.isActive && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Active Mortgage Found</AlertTitle>
                      <AlertDescription>
                        You already have an active mortgage. Make payments in the Payments tab.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Make Payment</CardTitle>
              <CardDescription>
                Process monthly mortgage payments for your active on-chain mortgage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mortgageData ? (
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Active On-Chain Mortgage</AlertTitle>
                    <AlertDescription>
                      Monthly Payment: ${mortgageData.monthlyPayment.toFixed(2)} | 
                      Remaining: ${mortgageData.remainingBalance.toFixed(2)}
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    onClick={handleMakePayment}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Processing...' : `Make Payment ($${mortgageData.monthlyPayment.toFixed(2)})`}
                  </Button>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Active On-Chain Mortgage</AlertTitle>
                  <AlertDescription>
                    Purchase a property using the smart contract to make mortgage payments.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties" className="space-y-6">
          {userProperties.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Home className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
                <p className="text-muted-foreground mb-4">Purchase a property to get started</p>
                <Button onClick={() => {
                  console.log('🔄 Manual refresh triggered from My Properties tab');
                  fetchUserProperties();
                  fetchMortgageData();
                }} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Properties
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userProperties.map((property) => (
                <Card key={property.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{property.property_name}</CardTitle>
                        <CardDescription>{property.property_location}</CardDescription>
                      </div>
                      <Badge variant={property.is_active ? "default" : "secondary"}>
                        {property.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Purchase Price</p>
                        <p className="font-semibold">${property.purchase_price.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Down Payment</p>
                        <p className="font-semibold">${property.down_payment.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Monthly Payment</p>
                        <p className="font-semibold">${property.monthly_payment.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Remaining Balance</p>
                        <p className="font-semibold">${property.remaining_balance.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Equity Built</span>
                        <span className="text-sm text-muted-foreground">
                          {calculateEquityProgress(property).toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={calculateEquityProgress(property)} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reconcile" className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Event Indexing</AlertTitle>
            <AlertDescription>
              Manually trigger indexing of mortgage events from the smart contract.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={handleReconcilePayments}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Indexing...' : 'Index Events'}
          </Button>

          <div className="space-y-2">
            <h4 className="font-semibold">Contract Info:</h4>
            <p className="text-sm text-muted-foreground">Address: {contractAddress || 'Not loaded'}</p>
            <p className="text-sm text-muted-foreground">Network: Base Sepolia</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
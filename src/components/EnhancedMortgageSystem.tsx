import React, { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { ethers } from 'ethers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ContractDatabaseIntegration } from '@/lib/contract-database-integration';
import { ENHANCED_AVAX_MORTGAGE_ABI, ENHANCED_AVAX_MORTGAGE_CONFIG, convertAVAXToUSD, convertUSDToAVAX } from '@/lib/enhanced-avax-mortgage-abi';
import { Wallet, Home, DollarSign, TrendingUp, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

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
  totalPaid: number;
  isActive: boolean;
  borrower: string;
  createdAt: number;
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

export const EnhancedMortgageSystem: React.FC = () => {
  const { account, isConnected, connectWallet } = useWallet();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState<string>('');
  const [mortgageData, setMortgageData] = useState<MortgageData | null>(null);
  const [userProperties, setUserProperties] = useState<UserProperty[]>([]);
  const [totalProperties, setTotalProperties] = useState(0);

  // Load contract address and data on mount
  useEffect(() => {
    loadContractAddress();
  }, []);

  useEffect(() => {
    if (contractAddress && account) {
      loadUserData();
      loadContractData();
    }
  }, [contractAddress, account]);

  const loadContractAddress = async () => {
    try {
      // Try NEW contract first, then fallback to existing name
      let address = await ContractDatabaseIntegration.getContractAddress('ENHANCED_AVAX_MORTGAGE_NEW');
      if (!address) {
        address = await ContractDatabaseIntegration.getContractAddress('ENHANCED_AVAX_MORTGAGE');
        if (address) {
          console.log('Using fallback contract ENHANCED_AVAX_MORTGAGE:', address);
        }
      }
      setContractAddress(address);
      if (!address) {
        toast({
          title: "Contract Not Found",
          description: "Enhanced AVAX Mortgage contract address not found in database",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading contract address:', error);
    }
  };

  const loadUserData = async () => {
    if (!account) return;

    try {
      const { data: properties, error } = await supabase
        .from('user_properties')
        .select('*')
        .ilike('user_wallet_address', account)
        .eq('is_active', true);

      if (error) throw error;

      console.log('📊 Enhanced Mortgage - Loaded properties:', properties);
      setUserProperties(properties || []);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load user property data",
        variant: "destructive"
      });
    }
  };

  const loadContractData = async () => {
    if (!contractAddress || !account) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, ENHANCED_AVAX_MORTGAGE_ABI, provider);

      // Get total properties
      const totalProps = await contract.getTotalProperties();
      setTotalProperties(Number(totalProps));

      // Try to get mortgage details for current user
      try {
        const details = await contract.getMortgageDetails(account);
        
        if (details.isActive) {
          setMortgageData({
            propertyId: Number(details.propertyId),
            propertyValue: convertAVAXToUSD(ethers.formatEther(details.propertyValue)),
            downPayment: convertAVAXToUSD(ethers.formatEther(details.downPayment)),
            loanAmount: convertAVAXToUSD(ethers.formatEther(details.loanAmount)),
            monthlyPayment: convertAVAXToUSD(ethers.formatEther(details.monthlyPayment)),
            remainingBalance: convertAVAXToUSD(ethers.formatEther(details.remainingBalance)),
            interestRate: Number(details.interestRate),
            termMonths: Number(details.termMonths),
            monthsPaid: Number(details.monthsPaid),
            nextPaymentDue: Number(details.nextPaymentDue),
            totalPaid: convertAVAXToUSD(ethers.formatEther(details.totalPaid)),
            isActive: details.isActive,
            borrower: details.borrower,
            createdAt: Number(details.createdAt)
          });
        }
      } catch (mortgageError) {
        console.log('No active mortgage found for user');
        setMortgageData(null);
      }
    } catch (error) {
      console.error('Error loading contract data:', error);
    }
  };

  const handleSeedProperty = async () => {
    if (!contractAddress) return;

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ENHANCED_AVAX_MORTGAGE_ABI, signer);

      console.log('🌱 Seeding Art Deco Loft property...');

      const tx = await contract.addProperty(
        "Art Deco Loft Oceanview",
        "Ericeira, Portugal", 
        "/lovable-uploads/art-deco-loft-mexico.jpg",
        ethers.parseEther(ENHANCED_AVAX_MORTGAGE_CONFIG.PROPERTY_VALUE_AVAX)
      );

      const receipt = await tx.wait();
      console.log('✅ Property seeded successfully:', receipt.hash);

      toast({
        title: "Property Seeded",
        description: "Art Deco Loft property added to contract successfully",
      });

      await loadContractData();
    } catch (error: any) {
      console.error('Property seeding failed:', error);
      toast({
        title: "Seeding Failed",
        description: error.message || "Failed to seed property",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchaseProperty = async () => {
    if (!contractAddress) return;

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ENHANCED_AVAX_MORTGAGE_ABI, signer);

      const totalPaymentAVAX = ENHANCED_AVAX_MORTGAGE_CONFIG.TOTAL_PAYMENT_AVAX;
      
      console.log('🏠 Purchasing property with payment:', totalPaymentAVAX, 'AVAX');

      const tx = await contract.purchaseProperty(
        ENHANCED_AVAX_MORTGAGE_CONFIG.PROPERTY_ID,
        ENHANCED_AVAX_MORTGAGE_CONFIG.TERM_MONTHS,
        { value: ethers.parseEther(totalPaymentAVAX) }
      );

      const receipt = await tx.wait();
      console.log('✅ Property purchased successfully:', receipt.hash);

      // Parse MortgageCreated event from receipt
      const contractInterface = new ethers.Interface(ENHANCED_AVAX_MORTGAGE_ABI);
      const mortgageCreatedEvent = receipt.logs
        .map(log => {
          try {
            return contractInterface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find(log => log && log.name === 'MortgageCreated');

      // Insert into user_properties with receipt data
      const { error: dbError } = await supabase
        .from('user_properties')
        .insert({
          user_wallet_address: account!,
          user_address: account!.toLowerCase(),
          property_name: "Art Deco Loft Oceanview",
          property_location: "Ericeira, Portugal", 
          purchase_price: ENHANCED_AVAX_MORTGAGE_CONFIG.PROPERTY_VALUE_USD,
          purchase_price_base: ENHANCED_AVAX_MORTGAGE_CONFIG.PROPERTY_VALUE_USD * 1000000,
          down_payment: ENHANCED_AVAX_MORTGAGE_CONFIG.DOWN_PAYMENT_USD,
          down_payment_base: ENHANCED_AVAX_MORTGAGE_CONFIG.DOWN_PAYMENT_USD * 1000000,
          loan_amount_base: ENHANCED_AVAX_MORTGAGE_CONFIG.LOAN_AMOUNT_USD * 1000000,
          remaining_balance: ENHANCED_AVAX_MORTGAGE_CONFIG.LOAN_AMOUNT_USD,
          monthly_payment: ENHANCED_AVAX_MORTGAGE_CONFIG.MONTHLY_PAYMENT_USD,
          current_value: ENHANCED_AVAX_MORTGAGE_CONFIG.PROPERTY_VALUE_USD,
          equity_percentage: 20,
          property_id: ENHANCED_AVAX_MORTGAGE_CONFIG.PROPERTY_ID,
          mortgage_id: mortgageCreatedEvent ? mortgageCreatedEvent.args.tokenId.toString() : null,
          currency: 'USDC-6',
          apr_bps: ENHANCED_AVAX_MORTGAGE_CONFIG.APR_BPS,
          term_months: ENHANCED_AVAX_MORTGAGE_CONFIG.TERM_MONTHS,
          unique_purchase_key: receipt.hash,
          image_url: "/lovable-uploads/art-deco-loft-mexico.jpg"
        });

      if (dbError) throw dbError;

      toast({
        title: "Property Purchased!",
        description: `Successfully purchased Art Deco Loft for $${ENHANCED_AVAX_MORTGAGE_CONFIG.PROPERTY_VALUE_USD.toLocaleString()}`,
      });

      await loadUserData();
      await loadContractData();
    } catch (error: any) {
      console.error('Property purchase failed:', error);
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to purchase property",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakePayment = async () => {
    if (!contractAddress) return;

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ENHANCED_AVAX_MORTGAGE_ABI, signer);

      const paymentAmountAVAX = ENHANCED_AVAX_MORTGAGE_CONFIG.MONTHLY_PAYMENT_AVAX;
      
      console.log('💰 Making payment:', paymentAmountAVAX, 'AVAX');

      const tx = await contract.makePayment({
        value: ethers.parseEther(paymentAmountAVAX)
      });

      const receipt = await tx.wait();
      console.log('✅ Payment made successfully:', receipt.hash);

      // Parse PaymentMade event from receipt for immediate sync
      const contractInterface = new ethers.Interface(ENHANCED_AVAX_MORTGAGE_ABI);
      const paymentEvent = receipt.logs
        .map(log => {
          try {
            return contractInterface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find(log => log && log.name === 'PaymentMade');

      if (paymentEvent) {
        const args = paymentEvent.args;
        const principalPaidUSD = convertAVAXToUSD(ethers.formatEther(args.principalPaid));
        const interestPaidUSD = convertAVAXToUSD(ethers.formatEther(args.interestPaid));
        
        console.log('📊 Parsed payment from receipt:', {
          principalPaid: principalPaidUSD,
          interestPaid: interestPaidUSD,
          propertyId: Number(args.propertyId)
        });

        // Insert into mortgage_payments_ledger
        const { error: ledgerError } = await supabase
          .from('mortgage_payments_ledger')
          .insert({
            user_address: account!.toLowerCase(),
            property_id: Number(args.propertyId),
            principal_delta_base: Math.floor(principalPaidUSD * 1000000),
            interest_delta_base: Math.floor(interestPaidUSD * 1000000),
            tx_hash: receipt.hash
          });

        if (ledgerError) {
          console.error('Ledger insert error:', ledgerError);
        }

        // Apply payment to user properties
        const { error: rpcError } = await supabase.rpc('apply_mortgage_payment', {
          p_user_address: account!.toLowerCase(),
          p_property_id: Number(args.propertyId),
          p_principal_delta_base: Math.floor(principalPaidUSD * 1000000),
          p_interest_delta_base: Math.floor(interestPaidUSD * 1000000),
          p_tx_hash: receipt.hash
        });

        if (rpcError) {
          console.error('RPC error:', rpcError);
        }
      }

      toast({
        title: "Payment Successful!",
        description: `Monthly payment of $${ENHANCED_AVAX_MORTGAGE_CONFIG.MONTHLY_PAYMENT_USD} processed`,
      });

      await loadUserData();
      await loadContractData();
    } catch (error: any) {
      console.error('Payment failed:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // New database-only payment handler for properties not on smart contract
  const handleDatabasePayment = async (property: UserProperty) => {
    setIsLoading(true);
    try {
      // Calculate payment breakdown (simple 80/20 principal/interest split for demo)
      const monthlyPayment = property.monthly_payment;
      const principalPortion = monthlyPayment * 0.8;
      const interestPortion = monthlyPayment * 0.2;

      // Insert payment ledger record
      const { error: ledgerError } = await supabase
        .from('mortgage_payments_ledger')
        .insert({
          user_address: account!.toLowerCase(),
          property_id: property.property_id || 1,
          principal_delta_base: Math.floor(principalPortion * 1000000),
          interest_delta_base: Math.floor(interestPortion * 1000000),
          tx_hash: `db_payment_${Date.now()}` // Generate unique hash for DB payments
        });

      if (ledgerError) throw ledgerError;

      // Apply payment to user properties
      const { error: rpcError } = await supabase.rpc('apply_mortgage_payment', {
        p_user_address: account!.toLowerCase(),
        p_property_id: property.property_id || 1,
        p_principal_delta_base: Math.floor(principalPortion * 1000000),
        p_interest_delta_base: Math.floor(interestPortion * 1000000),
        p_tx_hash: `db_payment_${Date.now()}`
      });

      if (rpcError) throw rpcError;

      toast({
        title: "Payment Successful!",
        description: `Monthly payment of $${monthlyPayment.toLocaleString()} processed (Database Only)`,
      });

      await loadUserData();
    } catch (error: any) {
      console.error('Database payment failed:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process database payment",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sync database property to smart contract
  const handleSyncToContract = async (property: UserProperty) => {
    if (!contractAddress) return;
    
    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ENHANCED_AVAX_MORTGAGE_ABI, signer);

      // Convert property data to contract format
      const propertyValueAVAX = convertUSDToAVAX(property.purchase_price);
      const downPaymentAVAX = convertUSDToAVAX(property.down_payment);
      const totalPaymentAVAX = downPaymentAVAX + "0.01"; // Add small amount for gas

      console.log('🔗 Syncing property to contract:', {
        name: property.property_name,
        location: property.property_location,
        value: propertyValueAVAX
      });

      const tx = await contract.purchaseProperty(
        property.property_id || 1,
        120, // Default term months
        { value: ethers.parseEther(totalPaymentAVAX) }
      );

      const receipt = await tx.wait();
      
      // Update user property with sync info
      const { error: updateError } = await supabase
        .from('user_properties')
        .update({
          unique_purchase_key: receipt.hash,
          updated_at: new Date().toISOString()
        })
        .eq('id', property.id);

      if (updateError) throw updateError;

      toast({
        title: "Sync Successful!",
        description: "Property synced to smart contract successfully",
      });

      await loadUserData();
      await loadContractData();
    } catch (error: any) {
      console.error('Sync to contract failed:', error);
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync property to contract",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReconcilePayments = async () => {
    if (!account) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('reconcile-mortgage-payments', {
        body: {
          wallet_address: account.toLowerCase(),
          contract_address: contractAddress
        }
      });

      if (error) throw error;

      console.log('🔄 Reconciliation result:', data);
      
      toast({
        title: "Reconciliation Complete",
        description: `Processed ${data.payments_synced} payments from blockchain`,
      });

      await loadUserData();
    } catch (error: any) {
      console.error('Reconciliation failed:', error);
      toast({
        title: "Reconciliation Failed",
        description: error.message || "Failed to reconcile payments",
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
          Enhanced AVAX Mortgage contract address not found in database
        </p>
        <Button onClick={loadContractAddress} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
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
          Receipt-based payment sync with blockchain reconciliation
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
            <div className="text-2xl font-bold">{totalProperties}</div>
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
                Purchase properties with immediate receipt-based DB sync
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {totalProperties === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No properties available in contract. Seed a property first.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button 
                  onClick={handleSeedProperty} 
                  disabled={isLoading || totalProperties > 0}
                  variant="outline"
                >
                  {isLoading ? "Seeding..." : "Seed Art Deco Loft"}
                </Button>
                
                <Button 
                  onClick={handlePurchaseProperty} 
                  disabled={isLoading || totalProperties === 0 || mortgageData?.isActive}
                >
                  {isLoading ? "Purchasing..." : `Purchase for $${ENHANCED_AVAX_MORTGAGE_CONFIG.PROPERTY_VALUE_USD.toLocaleString()}`}
                </Button>
              </div>

              {mortgageData?.isActive && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    You already own this property! Make payments in the Payments tab.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Make Payment</CardTitle>
              <CardDescription>
                Process monthly mortgage payments with instant equity updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Smart Contract Mortgage Payment */}
              {mortgageData?.isActive && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-700">On-Chain Mortgage Active</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Payment</p>
                      <p className="text-2xl font-bold">${mortgageData.monthlyPayment.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Remaining Balance</p>
                      <p className="text-2xl font-bold">${mortgageData.remainingBalance.toLocaleString()}</p>
                    </div>
                  </div>

                  <Button onClick={handleMakePayment} disabled={isLoading} className="w-full">
                    {isLoading ? "Processing..." : `Pay $${mortgageData.monthlyPayment.toLocaleString()}`}
                  </Button>
                </div>
              )}

              {/* Database-Only Mortgage Payment */}
              {!mortgageData?.isActive && userProperties.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium text-amber-700">Database-Only Mortgage (Not Synced to Blockchain)</span>
                  </div>

                  {userProperties.map((property) => (
                    <div key={property.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{property.property_name}</h4>
                          <p className="text-sm text-muted-foreground">{property.property_location}</p>
                        </div>
                        <Badge variant="secondary">Database Only</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly Payment</p>
                          <p className="text-xl font-bold">${property.monthly_payment.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Remaining Balance</p>
                          <p className="text-xl font-bold">${property.remaining_balance.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleDatabasePayment(property)} 
                          disabled={isLoading} 
                          className="flex-1"
                        >
                          {isLoading ? "Processing..." : `Pay $${property.monthly_payment.toLocaleString()}`}
                        </Button>
                        <Button 
                          onClick={() => handleSyncToContract(property)} 
                          disabled={isLoading} 
                          variant="outline"
                          className="flex-1"
                        >
                          {isLoading ? "Syncing..." : "Sync to Blockchain"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Mortgages Found */}
              {!mortgageData?.isActive && userProperties.length === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No active mortgage found. Purchase a property first.
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
                <p className="text-muted-foreground">Purchase a property to get started</p>
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

        <TabsContent value="reconcile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Reconciliation</CardTitle>
              <CardDescription>
                Sync missed payments from the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <RefreshCw className="h-4 w-4" />
                <AlertDescription>
                  This scans recent blocks for PaymentMade events and syncs any missed payments to the database.
                </AlertDescription>
              </Alert>

              <Button onClick={handleReconcilePayments} disabled={isLoading} variant="outline">
                {isLoading ? "Reconciling..." : "Reconcile Payments"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
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
import { ContractDatabaseIntegration } from '@/lib/contract-database-integration';
import { ENHANCED_AVAX_MORTGAGE_ABI } from '@/lib/enhanced-avax-mortgage-abi';
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

  const loadContractAddress = async () => {
    try {
      const address = await ContractDatabaseIntegration.getContractAddress('EnhancedAvaxMortgage');
      if (!address) {
        setContractNotFound(true);
        return;
      }
      setContractAddress(address);
      setContractNotFound(false);
    } catch (error) {
      console.error('Error loading contract address:', error);
      setContractNotFound(true);
    }
  };

  const fetchUserProperties = async () => {
    if (!account) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_properties')
        .select('*')
        .or(`user_wallet_address.ilike.${account},user_address.ilike.${account}`)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching user properties:', error);
        toast({
          title: "Error",
          description: "Failed to fetch user properties",
          variant: "destructive"
        });
        return;
      }

      setUserProperties(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMortgageData = async () => {
    if (!contractAddress || !account) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, ENHANCED_AVAX_MORTGAGE_ABI, provider);

      // Try to get mortgage details for current user
      const details = await contract.getMortgageDetails(account);
      
      if (details.isActive) {
        setMortgageData({
          propertyId: Number(details.propertyId),
          propertyValue: Number(ethers.formatEther(details.propertyValue)),
          downPayment: Number(ethers.formatEther(details.downPayment)),
          loanAmount: Number(ethers.formatEther(details.loanAmount)),
          monthlyPayment: Number(ethers.formatEther(details.monthlyPayment)),
          remainingBalance: Number(ethers.formatEther(details.remainingBalance)),
          interestRate: Number(details.interestRate),
          termMonths: Number(details.termMonths),
          monthsPaid: Number(details.monthsPaid),
          nextPaymentDue: Number(details.nextPaymentDue),
          isActive: details.isActive,
          borrower: details.borrower
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
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, ENHANCED_AVAX_MORTGAGE_ABI, provider);

      const totalProperties = await contract.getTotalProperties();
      const properties: Property[] = [];

      for (let i = 1; i <= Number(totalProperties); i++) {
        try {
          const property = await contract.getProperty(i);
          if (property.isActive) {
            properties.push({
              id: i,
              name: property.name,
              location: property.location,
              imageUrl: property.imageUrl,
              price: ethers.formatEther(property.price),
              isActive: property.isActive
            });
          }
        } catch (error) {
          console.error(`Error fetching property ${i}:`, error);
        }
      }

      setAvailableProperties(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  // Purchase property and trigger indexing
  const handlePurchaseProperty = async (propertyId: number, propertyValue: string, downPayment: string) => {
    if (!contractAddress) {
      toast({
        title: "Error",
        description: "Wallet not connected or contract not available",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Purchasing property with contract:', contractAddress);
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ENHANCED_AVAX_MORTGAGE_ABI, signer);
      const propertyValueWei = ethers.parseEther(propertyValue);
      const downPaymentWei = ethers.parseEther(downPayment);
      
      // Calculate platform fee (3% of property value)
      const platformFeeWei = propertyValueWei * BigInt(300) / BigInt(10000); // 3%
      const totalPayment = downPaymentWei + platformFeeWei;

      const tx = await contract.purchaseProperty(
        propertyId,
        propertyValueWei,
        downPaymentWei,
        interestRate,
        termMonths,
        { value: totalPayment }
      );

      console.log('Transaction sent:', tx.hash);
      
      toast({
        title: "Transaction Sent",
        description: `Purchase transaction sent: ${tx.hash.slice(0, 10)}...`
      });

      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      if (receipt.status === 1) {
        // Trigger mortgage events indexing
        try {
          const { error: indexError } = await supabase.functions.invoke('mortgage-events-indexer', {
            body: { 
              contract_address: contractAddress,
              network: 'fuji'
            }
          });

          if (indexError) {
            console.error('Indexing error:', indexError);
          } else {
            console.log('✅ Events indexed successfully');
          }
        } catch (indexError) {
          console.error('Error triggering indexer:', indexError);
        }

        toast({
          title: "Success",
          description: "Property purchased successfully!"
        });

        // Refresh data after a short delay to allow indexing
        setTimeout(() => {
          fetchUserProperties();
          fetchMortgageData();
        }, 2000);
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

  // Make payment for on-chain mortgage
  const handleMakePayment = async () => {
    if (!contractAddress || !mortgageData) {
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
      const contract = new ethers.Contract(contractAddress, ENHANCED_AVAX_MORTGAGE_ABI, signer);
      const monthlyPaymentWei = ethers.parseEther(mortgageData.monthlyPayment.toString());
      
      console.log('Making payment:', {
        monthlyPayment: mortgageData.monthlyPayment,
        monthlyPaymentWei: monthlyPaymentWei.toString()
      });

      const tx = await contract.makePayment({ value: monthlyPaymentWei });
      
      toast({
        title: "Transaction Sent",
        description: `Payment transaction sent: ${tx.hash.slice(0, 10)}...`
      });

      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        // Trigger mortgage events indexing to capture payment
        try {
          const { error: indexError } = await supabase.functions.invoke('mortgage-events-indexer', {
            body: { 
              contract_address: contractAddress,
              network: 'fuji'
            }
          });

          if (indexError) {
            console.error('Indexing error:', indexError);
          }
        } catch (indexError) {
          console.error('Error triggering indexer:', indexError);
        }

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
                          {property.name} - {property.location} (${property.price} AVAX)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="property-value">Property Value (AVAX)</Label>
                      <Input
                        id="property-value"
                        type="number"
                        value={propertyValue}
                        onChange={(e) => setPropertyValue(e.target.value)}
                        placeholder="e.g., 100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="down-payment">Down Payment (AVAX)</Label>
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
            <p className="text-sm text-muted-foreground">Network: Avalanche Fuji</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
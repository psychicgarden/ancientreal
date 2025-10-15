/**
 * FIXED VERSION: EnhancedMortgageSystem.tsx
 * 
 * This shows the exact changes needed to fix your component.
 * Copy these changes to your actual EnhancedMortgageSystem.tsx file.
 */

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

// ✅ FIXED: Import the correct ABIs and addresses
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
  totalValue: number;
  isActive: boolean;
}

export const EnhancedMortgageSystem: React.FC = () => {
  const { account, isConnected, connectWallet } = useWallet();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // ✅ FIXED: Use hardcoded contract address instead of dynamic lookup
  const contractAddress = BASE_SEPOLIA_CONTRACTS.AncientMortgage;
  const usdtAddress = BASE_SEPOLIA_CONTRACTS.MockUSDT;
  
  const [contractNotFound, setContractNotFound] = useState<boolean>(false);
  const [mortgageData, setMortgageData] = useState<MortgageData | null>(null);
  const [userProperties, setUserProperties] = useState<UserProperty[]>([]);
  const [availableProperties, setAvailableProperties] = useState<Property[]>([]);
  const [userTokenId, setUserTokenId] = useState<bigint | null>(null);
  
  // Purchase form state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [propertyValue, setPropertyValue] = useState<string>('');
  const [downPayment, setDownPayment] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('8');
  const [termMonths, setTermMonths] = useState<string>('120');

  // Load contract address on component mount
  useEffect(() => {
    const loadContractAddress = async () => {
      try {
        // ✅ FIXED: No need for dynamic lookup, use hardcoded address
        console.log('Using contract address:', contractAddress);
        setContractNotFound(false);
      } catch (error) {
        console.error('Error loading contract address:', error);
        setContractNotFound(true);
      }
    };

    if (isConnected) {
      loadContractAddress();
    }
  }, [isConnected, contractAddress]);

  // Load mortgage data when contract address is available
  useEffect(() => {
    if (contractAddress && account) {
      fetchMortgageData();
    }
  }, [contractAddress, account]);

  // Load available properties
  useEffect(() => {
    if (contractAddress) {
      fetchAvailableProperties();
    }
  }, [contractAddress]);

  const fetchMortgageData = async () => {
    if (!contractAddress || !account || !userTokenId) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      // ✅ FIXED: Use correct ABI
      const contract = new ethers.Contract(contractAddress, AncientMortgageABI, provider);

      // ✅ FIXED: Use getMortgage(tokenId) instead of getMortgageDetails(address)
      const data = await contract.getMortgage(userTokenId);
      
      if (data.isActive) {
        setMortgageData({
          propertyId: Number(data.propertyId),
          propertyValue: Number(formatUSDT(data.propertyPrice)),
          downPayment: Number(formatUSDT(data.downPayment)),
          loanAmount: Number(formatUSDT(data.loanAmount)),
          monthlyPayment: Number(formatUSDT(data.monthlyPayment)),
          remainingBalance: Number(formatUSDT(data.remainingBalance)),
          interestRate: 8, // Fixed at 8%
          termMonths: Number(data.termMonths),
          monthsPaid: Number(data.paymentsMade),
          nextPaymentDue: 0, // Calculate from startTime
          isActive: data.isActive,
          borrower: data.propertyOwner,
        });
      }
    } catch (error) {
      console.error('Error fetching mortgage data:', error);
    }
  };

  const fetchAvailableProperties = async () => {
    if (!contractAddress) return;

    try {
      // ✅ FIXED: Remove calls to non-existent functions
      // The deployed contract doesn't have getTotalProperties() or getProperty()
      // Instead, we'll use a predefined list or load from your database
      
      // For now, create some sample properties
      const sampleProperties: Property[] = [
        {
          id: 1,
          name: "Downtown Condo",
          location: "New York, NY",
          imageUrl: "/placeholder.svg",
          totalValue: 500000,
          isActive: true,
        },
        {
          id: 2,
          name: "Suburban House",
          location: "Austin, TX",
          imageUrl: "/placeholder.svg",
          totalValue: 350000,
          isActive: true,
        },
      ];
      
      setAvailableProperties(sampleProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handlePurchase = async () => {
    if (!selectedProperty || !propertyValue || !downPayment) {
      toast({
        title: "Missing Information",
        description: "Please select a property and enter all required values.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Purchasing property with contract:', contractAddress);
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // ✅ FIXED: Use correct ABIs
      const contract = new ethers.Contract(contractAddress, AncientMortgageABI, signer);
      const usdtContract = new ethers.Contract(usdtAddress, MockUSDTABI, signer);
      
      // ✅ FIXED: Convert to USDT (6 decimals) instead of ETH (18 decimals)
      const propertyPrice = parseUSDT(propertyValue);
      
      // ✅ FIXED: Calculate approval amount (20% down + 3% platform fee)
      const downPaymentAmount = calculateDownPayment(propertyPrice);
      const platformFee = calculatePlatformFee(propertyPrice);
      const totalApproval = calculateTotalApproval(propertyPrice);
      
      console.log('Purchase breakdown:', {
        propertyPrice: formatUSDT(propertyPrice),
        downPayment: formatUSDT(downPaymentAmount),
        platformFee: formatUSDT(platformFee),
        totalApproval: formatUSDT(totalApproval),
      });
      
      // ✅ FIXED: Approve USDT first
      console.log('Approving USDT...');
      const approveTx = await usdtContract.approve(contractAddress, totalApproval);
      await approveTx.wait();
      console.log('USDT approved');
      
      // ✅ FIXED: Purchase with 1 parameter only (NO ETH VALUE!)
      console.log('Purchasing property...');
      const tx = await contract.purchaseProperty(propertyPrice);
      const receipt = await tx.wait();
      
      console.log('Transaction sent:', tx.hash);
      
      // ✅ FIXED: Extract tokenId from MortgageCreated event
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed?.name === 'MortgageCreated';
        } catch {
          return false;
        }
      });
      
      if (event) {
        const parsedEvent = contract.interface.parseLog(event);
        const tokenId = parsedEvent!.args.tokenId;
        setUserTokenId(tokenId);
        
        // Save tokenId to database
        await saveTokenIdToDatabase(tokenId);
        
        toast({
          title: "Purchase Successful!",
          description: `Property purchased! Your mortgage NFT token ID is: ${tokenId.toString()}`,
        });
      }
      
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: error.message || "An error occurred during purchase.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakePayment = async () => {
    if (!mortgageData || !userTokenId) {
      toast({
        title: "No Active Mortgage",
        description: "No active mortgage found for payment.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // ✅ FIXED: Use correct ABIs
      const contract = new ethers.Contract(contractAddress, AncientMortgageABI, signer);
      const usdtContract = new ethers.Contract(usdtAddress, MockUSDTABI, signer);
      
      // ✅ FIXED: Get payment amount from contract
      const mortgageData = await contract.getMortgage(userTokenId);
      const monthlyPayment = mortgageData.monthlyPayment;
      
      console.log('Making payment:', {
        tokenId: userTokenId.toString(),
        amount: formatUSDT(monthlyPayment),
      });
      
      // ✅ FIXED: Approve USDT for payment
      const allowance = await usdtContract.allowance(await signer.getAddress(), contractAddress);
      if (allowance < monthlyPayment) {
        console.log('Approving USDT for payment...');
        const approveTx = await usdtContract.approve(contractAddress, monthlyPayment);
        await approveTx.wait();
      }
      
      // ✅ FIXED: Make payment with tokenId only (NO ETH VALUE!)
      const tx = await contract.makePayment(userTokenId);
      await tx.wait();
      
      console.log('Payment successful:', tx.hash);
      
      toast({
        title: "Payment Successful",
        description: "Monthly payment completed successfully.",
      });
      
      // Refresh mortgage data
      await fetchMortgageData();
      
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred during payment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveTokenIdToDatabase = async (tokenId: bigint) => {
    try {
      const { error } = await supabase
        .from('user_mortgages')
        .insert({
          user_id: account,
          token_id: tokenId.toString(),
          property_price: parseFloat(propertyValue),
          contract_address: contractAddress,
          network: 'base-sepolia',
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

  // Rest of your component JSX remains the same...
  // Just update the contract calls as shown above

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Ancient Mortgage System</h1>
        <p className="text-gray-600">
          Purchase properties with 20% down payment and manage your mortgage payments.
        </p>
      </div>

      {!isConnected ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Wallet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-gray-600 mb-4">
              Connect your wallet to access the mortgage system.
            </p>
            <Button onClick={connectWallet} className="w-full">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="purchase" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="purchase">Purchase Property</TabsTrigger>
            <TabsTrigger value="manage">Manage Mortgage</TabsTrigger>
          </TabsList>

          <TabsContent value="purchase" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Purchase a Property</CardTitle>
                <CardDescription>
                  Select a property and complete your purchase with 20% down payment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Property selection and form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableProperties.map((property) => (
                    <Card
                      key={property.id}
                      className={`cursor-pointer transition-colors ${
                        selectedProperty?.id === property.id
                          ? 'ring-2 ring-blue-500'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedProperty(property);
                        setPropertyValue(property.totalValue.toString());
                        setDownPayment((property.totalValue * 0.2).toString());
                      }}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{property.name}</h3>
                        <p className="text-sm text-gray-600">{property.location}</p>
                        <p className="text-lg font-bold">${property.totalValue.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedProperty && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="propertyValue">Property Value (USD)</Label>
                        <Input
                          id="propertyValue"
                          type="number"
                          value={propertyValue}
                          onChange={(e) => setPropertyValue(e.target.value)}
                          placeholder="Enter property value"
                        />
                      </div>
                      <div>
                        <Label htmlFor="downPayment">Down Payment (20%)</Label>
                        <Input
                          id="downPayment"
                          type="number"
                          value={downPayment}
                          onChange={(e) => setDownPayment(e.target.value)}
                          placeholder="Enter down payment"
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Purchase Breakdown:</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Property Value:</span>
                          <span>${parseFloat(propertyValue || '0').toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Down Payment (20%):</span>
                          <span>${parseFloat(downPayment || '0').toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Platform Fee (3%):</span>
                          <span>${(parseFloat(propertyValue || '0') * 0.03).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-1">
                          <span>Total Due Now:</span>
                          <span>${(parseFloat(downPayment || '0') + parseFloat(propertyValue || '0') * 0.03).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handlePurchase}
                      disabled={isLoading || !propertyValue || !downPayment}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Purchase Property'
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            {mortgageData ? (
              <Card>
                <CardHeader>
                  <CardTitle>Your Mortgage</CardTitle>
                  <CardDescription>
                    Manage your mortgage payments and track your progress.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Property Value</Label>
                      <p className="text-lg font-semibold">${mortgageData.propertyValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label>Remaining Balance</Label>
                      <p className="text-lg font-semibold">${mortgageData.remainingBalance.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label>Monthly Payment</Label>
                      <p className="text-lg font-semibold">${mortgageData.monthlyPayment.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label>Payments Made</Label>
                      <p className="text-lg font-semibold">
                        {mortgageData.monthsPaid} / {mortgageData.termMonths}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label>Progress</Label>
                    <Progress 
                      value={(mortgageData.monthsPaid / mortgageData.termMonths) * 100} 
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      {((mortgageData.monthsPaid / mortgageData.termMonths) * 100).toFixed(1)}% Complete
                    </p>
                  </div>

                  <Button
                    onClick={handleMakePayment}
                    disabled={isLoading || !mortgageData.isActive}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Make Monthly Payment'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Mortgage</h3>
                  <p className="text-gray-600">
                    You don't have an active mortgage. Purchase a property to get started.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

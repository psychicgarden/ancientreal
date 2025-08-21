import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';
import { supabase } from '@/integrations/supabase/client';
import { ContractDatabaseIntegration } from '@/lib/contract-database-integration';
import { Home, DollarSign, Calendar, MapPin, TrendingUp, Users } from 'lucide-react';
import { PROPERTIES_CATALOG } from '@/lib/propertiesCatalog';

// Minimal ABI for AVAX mortgage purchase operations
const AVAX_MORTGAGE_ABI = [
  'function purchaseProperty(uint256 _propertyValue, uint256 _termMonths) external payable',
  'function hasMortgage(address) external view returns (bool)',
  'event MortgageCreated(address indexed borrower, uint256 propertyValue, uint256 downPayment, uint256 loanAmount, uint256 monthlyPayment)'
];

export const PropertyInvestmentInterface = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  
  const [contractAddress, setContractAddress] = useState<string>('');
  
  // Featured property from catalog
  const featuredProperty = PROPERTIES_CATALOG[0]; // Art Deco Loft in Mazunte, Mexico
  
  // Fixed property values - simplified interface
  const propertyValueAVAX = "0.00129"; // Fixed at $129K equivalent
  const suggestedDownPayment = "0.000258"; // Fixed 20% down payment
  const propertyValue = propertyValueAVAX;
  const downPayment = suggestedDownPayment;
  const termMonths = "120"; // Fixed 10 years
  const FIXED_INTEREST_RATE = 8.0;

  useEffect(() => {
    loadContractAddress();
    checkWalletConnection();
  }, []);

  useEffect(() => {
    if (isConnected && account && contractAddress) {
      updateBalance(account);
    }
  }, [isConnected, account, contractAddress]);

  const loadContractAddress = async () => {
    try {
      const address = await ContractDatabaseIntegration.getContractAddress('SimpleAvaxMortgage');
      setContractAddress(address);
    } catch (error) {
      console.error('Failed to load contract address:', error);
    }
  };

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "❌ No Wallet Found",
        description: "Please install MetaMask or another Web3 wallet",
        variant: "destructive"
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setIsConnected(true);
      
      toast({
        title: "✅ Wallet Connected",
        description: `Ready to purchase ${featuredProperty.name}`,
      });
    } catch (error) {
      console.error('Connection failed:', error);
      toast({
        title: "❌ Connection Failed",
        description: "Failed to connect wallet",
        variant: "destructive"
      });
    }
  };

  const updateBalance = async (address: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Failed to get balance:', error);
    }
  };


  const handlePurchaseProperty = async () => {
    if (!isConnected || !window.ethereum || !contractAddress) return;

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, AVAX_MORTGAGE_ABI, signer);

      const propertyValueWei = ethers.parseEther(propertyValue);
      const downPaymentWei = ethers.parseEther(downPayment);

      toast({
        title: "🏠 Processing Purchase",
        description: "Creating your property purchase transaction...",
      });

      const tx = await contract.purchaseProperty(
        propertyValueWei,
        parseInt(termMonths),
        { value: downPaymentWei }
      );

      toast({
        title: "⏳ Transaction Pending",
        description: "Waiting for blockchain confirmation...",
      });

      const receipt = await tx.wait();
      
      // Record purchase in database
      try {
        console.log('💾 Recording purchase in database...');
        const { error: dbError } = await supabase
          .from('user_properties')
          .insert({
            user_wallet_address: account,
            user_address: account.toLowerCase(),
            property_name: featuredProperty.name,
            property_location: featuredProperty.location,
            image_url: featuredProperty.image,
            purchase_price: parseFloat(propertyValue),
            down_payment: parseFloat(downPayment),
            remaining_balance: parseFloat(propertyValue) - parseFloat(downPayment),
            monthly_payment: (parseFloat(propertyValue) - parseFloat(downPayment)) * 0.01,
            current_value: parseFloat(propertyValue),
            equity_percentage: (parseFloat(downPayment) / parseFloat(propertyValue)) * 100,
            is_active: true,
            purchase_price_base: Math.floor(parseFloat(propertyValue) * 1000000),
            down_payment_base: Math.floor(parseFloat(downPayment) * 1000000),
            loan_amount_base: Math.floor((parseFloat(propertyValue) - parseFloat(downPayment)) * 1000000),
            apr_bps: 800,
            term_months: parseInt(termMonths),
            property_id: 1,
            currency: 'AVAX',
            unique_purchase_key: receipt.hash
          });

        if (dbError) {
          console.error('❌ Database insert failed:', dbError);
        } else {
          console.log('✅ Purchase recorded in database');
        }
      } catch (dbError) {
        console.error('❌ Failed to record purchase:', dbError);
      }
      
      toast({
        title: "🎉 Purchase Successful!",
        description: `Property purchase completed! Transaction recorded to SnowTrace.`,
      });

      // Update balance
      await updateBalance(account);

    } catch (error: any) {
      console.error('Purchase failed:', error);
      toast({
        title: "❌ Purchase Failed",
        description: error.message || 'Transaction failed',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!contractAddress) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Property Purchase Platform Initializing...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Property Featured Card */}
      <Card className="overflow-hidden">
        <div className="relative">
          <img
            src={featuredProperty.image}
            alt={featuredProperty.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
              Featured Property
            </Badge>
          </div>
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-6 h-6 text-primary" />
            {featuredProperty.name}
          </CardTitle>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{featuredProperty.location}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <DollarSign className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <div className="text-sm text-muted-foreground">Total Value</div>
              <div className="font-semibold">${featuredProperty.totalValue.toLocaleString()}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <div className="text-sm text-muted-foreground">Expected Return</div>
              <div className="font-semibold">{featuredProperty.expectedReturn}%</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Calendar className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <div className="text-sm text-muted-foreground">Monthly Rent</div>
              <div className="font-semibold">${featuredProperty.monthlyRent?.toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Purchase Interface */}
      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle>Connect Wallet to Purchase Property</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={connectWallet} className="w-full">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Purchase {featuredProperty.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span>Property Value (AVAX)</span>
                <span className="font-semibold">{propertyValue}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span>Down Payment (20%)</span>
                <span className="font-semibold">{downPayment} AVAX</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span>Loan Term</span>
                <span className="font-semibold">10 years</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span>Interest Rate</span>
                <span className="font-semibold">{FIXED_INTEREST_RATE}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                <span>Your AVAX Balance</span>
                <span className="font-semibold">{parseFloat(balance).toFixed(4)} AVAX</span>
              </div>
            </div>

            <Button 
              onClick={handlePurchaseProperty}
              disabled={isLoading || parseFloat(balance) < parseFloat(downPayment)}
              className="w-full"
              size="lg"
            >
              {isLoading 
                ? "Processing Purchase..." 
                : parseFloat(balance) < parseFloat(downPayment)
                ? "Insufficient AVAX Balance"
                : "Purchase Property"
              }
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
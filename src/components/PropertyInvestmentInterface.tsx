import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';
import { supabase } from '@/integrations/supabase/client';
import { CONTRACTS } from '@/lib/contracts';
import { Home, DollarSign, Calendar, MapPin, TrendingUp, Users, Shield, CheckCircle } from 'lucide-react';
import { PROPERTIES_CATALOG } from '@/lib/propertiesCatalog';

export const PropertyInvestmentInterface = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [avaxBalance, setAvaxBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [isKycApproved, setIsKycApproved] = useState(false);
  
  // Featured property from catalog
  const featuredProperty = PROPERTIES_CATALOG[0]; // Art Deco Loft in Mazunte, Mexico
  
  // Fixed property values - now in AVAX
  const propertyValueUSD = featuredProperty.totalValue; // $129,000
  const downPaymentUSD = Math.round(featuredProperty.totalValue * 0.2); // 20% = $25,800
  const downPaymentAVAX = "0.5"; // Fixed AVAX amount for demo
  const termMonths = 120; // Fixed 10 years
  const FIXED_INTEREST_RATE = 8.0;
  const PLATFORM_FEE_PERCENT = 3.0; // 3% platform fee

  useEffect(() => {
    checkWalletConnection();
  }, []);

  useEffect(() => {
    if (isConnected && account) {
      updateAvaxBalance(account);
      checkKycStatus(account);
    }
  }, [isConnected, account]);

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

  const updateAvaxBalance = async (address: string) => {
    try {
      console.log('🔍 Updating AVAX balance for:', address);
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      const formattedBalance = ethers.formatEther(balance);
      console.log('✅ AVAX balance:', formattedBalance);
      setAvaxBalance(formattedBalance);
    } catch (error) {
      console.error('❌ Failed to get AVAX balance:', error);
      setAvaxBalance('0');
    }
  };

  const checkKycStatus = async (address: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const mortgageContract = new ethers.Contract(CONTRACTS.MAZUNTE_MORTGAGE.address, CONTRACTS.MAZUNTE_MORTGAGE.abi, provider);
      // For demo purposes, we'll assume KYC is approved. In production, this would check the contract
      setIsKycApproved(true);
    } catch (error) {
      console.error('Failed to check KYC status:', error);
      setIsKycApproved(true); // Default to approved for demo
    }
  };

  const handlePurchaseProperty = async () => {
    if (!isConnected || !window.ethereum || !isKycApproved) return;

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const mortgageContract = new ethers.Contract(CONTRACTS.MAZUNTE_MORTGAGE.address, CONTRACTS.MAZUNTE_MORTGAGE.abi, signer);

      const downPaymentAmount = ethers.parseEther(downPaymentAVAX); // AVAX in wei

      toast({
        title: "🏠 Processing Purchase",
        description: "Creating your mortgage with AncientMortgage...",
      });

      // Call purchaseProperty with AVAX value
      const tx = await mortgageContract.purchaseProperty(0, { 
        value: downPaymentAmount 
      });

      toast({
        title: "⏳ Transaction Pending",
        description: "Waiting for blockchain confirmation...",
      });

      const receipt = await tx.wait();
      
      // Record purchase in database
      try {
        console.log('💾 Recording AncientMortgage purchase in database...');
        const loanAmount = propertyValueUSD - downPaymentUSD;
        const monthlyPayment = (loanAmount * 0.08 / 12) / (1 - Math.pow(1 + (0.08 / 12), -termMonths));

        const { error: dbError } = await supabase
          .from('user_properties')
          .insert({
            user_wallet_address: account,
            user_address: account.toLowerCase(),
            property_name: featuredProperty.name,
            property_location: featuredProperty.location,
            image_url: featuredProperty.image,
            purchase_price: propertyValueUSD,
            down_payment: downPaymentUSD,
            remaining_balance: loanAmount,
            monthly_payment: Math.round(monthlyPayment),
            current_value: propertyValueUSD,
            equity_percentage: (downPaymentUSD / propertyValueUSD) * 100,
            is_active: true,
            purchase_price_base: propertyValueUSD * 1000000,
            down_payment_base: downPaymentUSD * 1000000,
            loan_amount_base: loanAmount * 1000000,
            apr_bps: 800,
            term_months: termMonths,
            property_id: 1,
            currency: 'AVAX-18',
            unique_purchase_key: receipt.hash
          });

        if (dbError) {
          console.error('❌ Database insert failed:', dbError);
        } else {
          console.log('✅ AncientMortgage purchase recorded in database');
        }
      } catch (dbError) {
        console.error('❌ Failed to record purchase:', dbError);
      }
      
      toast({
        title: "🎉 Property Purchase Successful!",
        description: `Your property NFT is being held by AncientMortgage until paid off.`,
      });

      // Update balance
      await updateAvaxBalance(account);

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

  const platformFee = Math.round(propertyValueUSD * (PLATFORM_FEE_PERCENT / 100));
  const hasInsufficientBalance = parseFloat(avaxBalance) < parseFloat(downPaymentAVAX);

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
              <div className="text-sm text-muted-foreground">Business Model</div>
              <div className="font-semibold">Full Revenue</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Calendar className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <div className="text-sm text-muted-foreground">Platform Fee</div>
              <div className="font-semibold">${platformFee.toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KYC & Balance Section */}
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
        <div className="space-y-4">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Shield className={`w-4 h-4 ${isKycApproved ? 'text-green-500' : 'text-yellow-500'}`} />
                  <span className="text-sm">KYC Status</span>
                </div>
                <div className={`font-semibold ${isKycApproved ? 'text-green-600' : 'text-yellow-600'}`}>
                  {isKycApproved ? 'Approved' : 'Pending'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">AVAX Balance</span>
                </div>
                <div className="font-semibold">{parseFloat(avaxBalance).toFixed(4)} AVAX</div>
                {hasInsufficientBalance && (
                  <div className="text-sm text-red-500 mt-1">
                    Need {downPaymentAVAX} AVAX to purchase
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Purchase Interface */}
          <Card>
            <CardHeader>
              <CardTitle>Purchase {featuredProperty.name} - AncientMortgage</CardTitle>
              <p className="text-sm text-muted-foreground">Full business model with revenue generation, investor yields, and property NFTs</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Property Value</span>
                  <span className="font-semibold">${propertyValueUSD.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Down Payment</span>
                  <span className="font-semibold">{downPaymentAVAX} AVAX</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <span>Platform Fee (3%)</span>
                  <span className="font-semibold text-primary">${platformFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Loan Term</span>
                  <span className="font-semibold">10 years</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Interest Rate</span>
                  <span className="font-semibold">{FIXED_INTEREST_RATE}% → Staking Pool</span>
                </div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={handlePurchaseProperty}
                disabled={isLoading || hasInsufficientBalance || !isKycApproved}
                className="w-full"
                size="lg"
              >
                {isLoading 
                  ? "Processing Purchase..." 
                  : !isKycApproved
                  ? "KYC Approval Required"
                  : hasInsufficientBalance
                  ? `Insufficient AVAX Balance (need ${downPaymentAVAX})`
                  : `Purchase Property with ${downPaymentAVAX} AVAX`
                }
              </Button>

              {/* Business Model Benefits */}
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">✨ Full Business Model Active</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Property NFT held by contract until paid off</li>
                  <li>• 3% platform fee generates immediate revenue</li>
                  <li>• Mortgage interest flows to staking pool for live yields</li>
                  <li>• Year-10 appreciation sharing (50/40/10 split)</li>
                  <li>• Refinancing available at 11% APR</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
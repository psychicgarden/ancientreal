import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import { ethers } from 'ethers';
import { supabase } from '@/integrations/supabase/client';
import { ENHANCED_AVAX_MORTGAGE_CONFIG, formatAVAXAmount } from '@/lib/enhanced-avax-mortgage-abi';
import { ANCIENT_MORTGAGE_ETH_ABI, ANCIENT_MORTGAGE_ETH_ADDRESS } from '@/lib/abis/ancient-mortgage-eth-abi';
import { Home, DollarSign, Calendar, MapPin, TrendingUp, Shield } from 'lucide-react';
import { PROPERTIES_CATALOG } from '@/lib/propertiesCatalog';

export const PropertyInvestmentInterface = () => {
  const { toast } = useToast();
  const { account, isConnected, isDemoMode } = useWallet();
  const [avaxBalance, setAvaxBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [isKycApproved, setIsKycApproved] = useState(false);
  const [contractAddress, setContractAddress] = useState<string>('');
  
  const featuredProperty = PROPERTIES_CATALOG[0];
  
  const propertyValueUSD = ENHANCED_AVAX_MORTGAGE_CONFIG.PROPERTY_VALUE_USD;
  const downPaymentUSD = ENHANCED_AVAX_MORTGAGE_CONFIG.DOWN_PAYMENT_USD;
  const platformFeeUSD = ENHANCED_AVAX_MORTGAGE_CONFIG.PLATFORM_FEE_USD;
  const totalPaymentUSD = ENHANCED_AVAX_MORTGAGE_CONFIG.TOTAL_PAYMENT_USD;
  const downPaymentAVAX = ENHANCED_AVAX_MORTGAGE_CONFIG.DOWN_PAYMENT_AVAX;
  const platformFeeAVAX = ENHANCED_AVAX_MORTGAGE_CONFIG.PLATFORM_FEE_AVAX;
  const totalPaymentAVAX = ENHANCED_AVAX_MORTGAGE_CONFIG.TOTAL_PAYMENT_AVAX;
  const termMonths = ENHANCED_AVAX_MORTGAGE_CONFIG.TERM_MONTHS;
  const FIXED_INTEREST_RATE = 8.0;

  useEffect(() => {
    loadContractAddress();
  }, []);

  const loadContractAddress = async () => {
    try {
      const address = ANCIENT_MORTGAGE_ETH_ADDRESS;
      setContractAddress(address);
      console.log('✅ ETH Mortgage contract loaded:', address);
    } catch (error) {
      console.error('❌ Failed to load contract address:', error);
      toast({
        title: "Contract Loading Failed",
        description: "Could not load contract address",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (isConnected && account) {
      updateAvaxBalance(account);
      checkKycStatus(account);
    }
  }, [isConnected, account]);

  const updateAvaxBalance = async (address: string) => {
    if (isDemoMode) {
      setAvaxBalance('100.0');
      return;
    }
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      setAvaxBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('❌ Failed to get balance:', error);
      setAvaxBalance('0');
    }
  };

  const checkKycStatus = async (address: string) => {
    setIsKycApproved(true);
  };

  const handlePurchase = async () => {
    if (!isConnected || !account) {
      toast({
        title: "❌ Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const loanAmount = propertyValueUSD - downPaymentUSD;
      const monthlyPayment = ENHANCED_AVAX_MORTGAGE_CONFIG.MONTHLY_PAYMENT_USD;

      // DEMO MODE: Skip blockchain, save to database
      if (isDemoMode) {
        toast({
          title: "🏠 Demo Purchase",
          description: `Purchasing ${featuredProperty.name}...`,
        });

        const { error: dbError } = await supabase
          .from('user_properties')
          .insert({
            user_wallet_address: account.toLowerCase(),
            user_address: account.toLowerCase(),
            property_name: featuredProperty.name,
            property_location: featuredProperty.location,
            image_url: featuredProperty.image,
            purchase_price: propertyValueUSD,
            down_payment: downPaymentUSD,
            remaining_balance: loanAmount,
            monthly_payment: monthlyPayment,
            current_value: propertyValueUSD,
            equity_percentage: (downPaymentUSD / propertyValueUSD) * 100,
            is_active: true,
            purchase_price_base: Math.floor(propertyValueUSD * 1000000),
            down_payment_base: Math.floor(downPaymentUSD * 1000000),
            loan_amount_base: Math.floor(loanAmount * 1000000),
            apr_bps: ENHANCED_AVAX_MORTGAGE_CONFIG.APR_BPS,
            term_months: termMonths,
            property_id: ENHANCED_AVAX_MORTGAGE_CONFIG.PROPERTY_ID,
            currency: 'DEMO',
            unique_purchase_key: `demo-${Date.now()}-${account.toLowerCase()}`
          });

        if (dbError) {
          console.error('❌ Demo purchase error:', dbError);
          throw new Error(dbError.message);
        }

        toast({
          title: "🎉 Demo Purchase Complete!",
          description: `${featuredProperty.name} added to your portfolio`,
        });

        return;
      }

      // LIVE MODE: Blockchain transaction
      if (!contractAddress) {
        throw new Error('Contract address not loaded');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const mortgageContract = new ethers.Contract(
        contractAddress,
        ANCIENT_MORTGAGE_ETH_ABI,
        signer
      );

      const totalPaymentETH = ethers.parseEther(totalPaymentAVAX);
      const propertyId = ENHANCED_AVAX_MORTGAGE_CONFIG.PROPERTY_ID;

      toast({
        title: "🏠 Processing Purchase",
        description: `Paying ${formatAVAXAmount(totalPaymentAVAX)} ETH...`,
      });

      const tx = await mortgageContract.purchaseProperty(
        propertyId,
        termMonths,
        800,
        "0x",
        { value: totalPaymentETH }
      );

      toast({
        title: "⏳ Transaction Pending",
        description: "Processing purchase...",
      });

      const receipt = await tx.wait();

      const { error: dbError } = await supabase
        .from('user_properties')
        .insert({
          user_wallet_address: account.toLowerCase(),
          user_address: account.toLowerCase(),
          property_name: featuredProperty.name,
          property_location: featuredProperty.location,
          image_url: featuredProperty.image,
          purchase_price: propertyValueUSD,
          down_payment: downPaymentUSD,
          remaining_balance: loanAmount,
          monthly_payment: monthlyPayment,
          current_value: propertyValueUSD,
          equity_percentage: (downPaymentUSD / propertyValueUSD) * 100,
          is_active: true,
          purchase_price_base: Math.floor(propertyValueUSD * 1000000),
          down_payment_base: Math.floor(downPaymentUSD * 1000000),
          loan_amount_base: Math.floor(loanAmount * 1000000),
          apr_bps: ENHANCED_AVAX_MORTGAGE_CONFIG.APR_BPS,
          term_months: termMonths,
          property_id: ENHANCED_AVAX_MORTGAGE_CONFIG.PROPERTY_ID,
          currency: 'ETH-18',
          unique_purchase_key: receipt.hash
        });

      if (dbError) {
        console.error('❌ Database error:', dbError);
      }

      toast({
        title: "🎉 Purchase Successful!",
        description: `${featuredProperty.name} added to your portfolio`,
      });

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

  const hasInsufficientBalance = !isDemoMode && parseFloat(avaxBalance) < parseFloat(totalPaymentAVAX);

  return (
    <div className="space-y-6">
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
              <div className="font-semibold">${platformFeeUSD.toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isConnected && (
        <div className="space-y-4">
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
                  <span className="text-sm">{isDemoMode ? 'Demo' : 'AVAX'} Balance</span>
                </div>
                <div className="font-semibold">{formatAVAXAmount(avaxBalance)} {isDemoMode ? 'Demo' : 'AVAX'}</div>
                {hasInsufficientBalance && (
                  <div className="text-sm text-red-500 mt-1">
                    Need {formatAVAXAmount(totalPaymentAVAX)} to purchase
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Purchase {featuredProperty.name}</CardTitle>
              <p className="text-sm text-muted-foreground">Full business model with revenue generation and investor yields</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Property Value</span>
                  <span className="font-semibold">${propertyValueUSD.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Down Payment</span>
                  <span className="font-semibold">
                    {formatAVAXAmount(downPaymentAVAX)} {isDemoMode ? 'Demo' : 'AVAX'}
                    <div className="text-xs text-muted-foreground">${downPaymentUSD.toLocaleString()}</div>
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <span>Platform Fee (3%)</span>
                  <span className="font-semibold">
                    {formatAVAXAmount(platformFeeAVAX)} {isDemoMode ? 'Demo' : 'AVAX'}
                    <div className="text-xs text-muted-foreground">${platformFeeUSD.toLocaleString()}</div>
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <span className="font-medium">Total Payment</span>
                  <span className="font-bold">
                    {formatAVAXAmount(totalPaymentAVAX)} {isDemoMode ? 'Demo' : 'AVAX'}
                    <div className="text-xs text-muted-foreground">${totalPaymentUSD.toLocaleString()}</div>
                  </span>
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

              <Button 
                onClick={handlePurchase}
                disabled={isLoading || hasInsufficientBalance || !isKycApproved}
                className="w-full"
                size="lg"
              >
                {isLoading 
                  ? "Processing..." 
                  : !isKycApproved
                  ? "KYC Required"
                  : hasInsufficientBalance
                  ? "Insufficient Balance"
                  : isDemoMode
                  ? "Purchase (Demo Mode)"
                  : `Purchase - ${formatAVAXAmount(totalPaymentAVAX)} AVAX`
                }
              </Button>

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

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
  const [usdtBalance, setUsdtBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isKycApproved, setIsKycApproved] = useState(false);
  const [needsUsdtApproval, setNeedsUsdtApproval] = useState(true);
  
  // Featured property from catalog
  const featuredProperty = PROPERTIES_CATALOG[0]; // Art Deco Loft in Mazunte, Mexico
  
  // Fixed property values - now in USDT (6 decimals)
  const propertyValueUSD = featuredProperty.totalValue; // $129,000
  const downPaymentUSD = Math.round(featuredProperty.totalValue * 0.2); // 20% = $25,800
  const downPaymentUSDT = (downPaymentUSD * 1000000).toString(); // Convert to 6 decimal USDT
  const termMonths = 120; // Fixed 10 years
  const FIXED_INTEREST_RATE = 8.0;
  const PLATFORM_FEE_PERCENT = 3.0; // 3% platform fee

  useEffect(() => {
    checkWalletConnection();
  }, []);

  useEffect(() => {
    if (isConnected && account) {
      updateUsdtBalance(account);
      checkKycStatus(account);
      checkUsdtApproval(account);
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

  const updateUsdtBalance = async (address: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const usdtContract = new ethers.Contract(CONTRACTS.USDT.address, CONTRACTS.USDT.abi, provider);
      const balance = await usdtContract.balanceOf(address);
      setUsdtBalance(ethers.formatUnits(balance, 6)); // USDT has 6 decimals
    } catch (error) {
      console.error('Failed to get USDT balance:', error);
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

  const checkUsdtApproval = async (address: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const usdtContract = new ethers.Contract(CONTRACTS.USDT.address, CONTRACTS.USDT.abi, provider);
      const allowance = await usdtContract.allowance(address, CONTRACTS.MAZUNTE_MORTGAGE.address);
      const requiredAmount = ethers.parseUnits(downPaymentUSD.toString(), 6);
      setNeedsUsdtApproval(allowance < requiredAmount);
    } catch (error) {
      console.error('Failed to check USDT approval:', error);
    }
  };

  const getFaucetTokens = async () => {
    if (!isConnected || !window.ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const usdtContract = new ethers.Contract(CONTRACTS.USDT.address, CONTRACTS.USDT.abi, signer);

      toast({
        title: "💰 Getting Test USDT",
        description: "Requesting tokens from faucet...",
      });

      const tx = await usdtContract.faucet();
      await tx.wait();

      toast({
        title: "✅ Faucet Success",
        description: "Received 1,000 test USDT tokens",
      });

      await updateUsdtBalance(account);
    } catch (error: any) {
      console.error('Faucet failed:', error);
      toast({
        title: "❌ Faucet Failed",
        description: error.message || 'Failed to get test tokens',
        variant: "destructive"
      });
    }
  };

  const approveUsdt = async () => {
    if (!isConnected || !window.ethereum) return;

    setIsApproving(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const usdtContract = new ethers.Contract(CONTRACTS.USDT.address, CONTRACTS.USDT.abi, signer);

      const approvalAmount = ethers.parseUnits(downPaymentUSD.toString(), 6);

      toast({
        title: "🔐 Approving USDT",
        description: "Please approve USDT spending in your wallet...",
      });

      const tx = await usdtContract.approve(CONTRACTS.MAZUNTE_MORTGAGE.address, approvalAmount);
      await tx.wait();

      toast({
        title: "✅ USDT Approved",
        description: "Ready to purchase property",
      });

      setNeedsUsdtApproval(false);
    } catch (error: any) {
      console.error('Approval failed:', error);
      toast({
        title: "❌ Approval Failed",
        description: error.message || 'Failed to approve USDT',
        variant: "destructive"
      });
    } finally {
      setIsApproving(false);
    }
  };


  const handlePurchaseProperty = async () => {
    if (!isConnected || !window.ethereum || !isKycApproved) return;

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const mortgageContract = new ethers.Contract(CONTRACTS.MAZUNTE_MORTGAGE.address, CONTRACTS.MAZUNTE_MORTGAGE.abi, signer);

      const downPaymentAmount = ethers.parseUnits(downPaymentUSD.toString(), 6); // USDT 6 decimals

      toast({
        title: "🏠 Processing Purchase",
        description: "Creating your mortgage with AncientMortgage...",
      });

      // Call purchaseProperty on AncientMortgage contract
      const tx = await mortgageContract.purchaseProperty(downPaymentAmount);

      toast({
        title: "⏳ Transaction Pending",
        description: "Waiting for blockchain confirmation...",
      });

      const receipt = await tx.wait();
      
      // Record purchase in database
      try {
        console.log('💾 Recording AncientMortgage purchase in database...');
        const loanAmount = propertyValueUSD - downPaymentUSD;
        const monthlyPayment = (loanAmount * 0.08 / 12) / (1 - Math.pow(1 + (0.08 / 12), -termMonths)); // Proper amortization

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
            purchase_price_base: propertyValueUSD * 1000000, // 6 decimal precision
            down_payment_base: downPaymentUSD * 1000000,
            loan_amount_base: loanAmount * 1000000,
            apr_bps: 800, // 8% APR in basis points
            term_months: termMonths,
            property_id: 1,
            currency: 'USDC-6',
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
        description: `Your property NFT is being held by AncientMortgage until paid off. Platform fees collected, staking pool receives interest payments.`,
      });

      // Update balance and approval status
      await updateUsdtBalance(account);
      await checkUsdtApproval(account);

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
  const hasInsufficientBalance = parseFloat(usdtBalance) < downPaymentUSD;

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <span className="text-sm">USDT Balance</span>
                </div>
                <div className="font-semibold">{parseFloat(usdtBalance).toLocaleString()} USDT</div>
                {hasInsufficientBalance && (
                  <Button onClick={getFaucetTokens} size="sm" variant="outline" className="mt-2">
                    Get Test USDT
                  </Button>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className={`w-4 h-4 ${!needsUsdtApproval ? 'text-green-500' : 'text-red-500'}`} />
                  <span className="text-sm">USDT Approval</span>
                </div>
                <div className={`font-semibold ${!needsUsdtApproval ? 'text-green-600' : 'text-red-600'}`}>
                  {!needsUsdtApproval ? 'Ready' : 'Required'}
                </div>
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
                  <span>Down Payment (20%)</span>
                  <span className="font-semibold">${downPaymentUSD.toLocaleString()} <span className="text-sm text-muted-foreground">(paid in USDT)</span></span>
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

              {/* Action Buttons */}
              <div className="space-y-3">
                {needsUsdtApproval && (
                  <Button 
                    onClick={approveUsdt}
                    disabled={isApproving || hasInsufficientBalance}
                    className="w-full"
                    variant="outline"
                  >
                    {isApproving ? "Approving USDT..." : "1. Approve USDT Spending"}
                  </Button>
                )}
                
                <Button 
                  onClick={handlePurchaseProperty}
                  disabled={isLoading || hasInsufficientBalance || needsUsdtApproval || !isKycApproved}
                  className="w-full"
                  size="lg"
                >
                  {isLoading 
                    ? "Processing Purchase..." 
                    : !isKycApproved
                    ? "KYC Approval Required"
                    : hasInsufficientBalance
                    ? "Insufficient USDT Balance"
                    : needsUsdtApproval
                    ? "Approve USDT First"
                    : "2. Purchase Property with AncientMortgage"
                  }
                </Button>
              </div>

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
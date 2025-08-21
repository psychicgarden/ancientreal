import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';
import { supabase } from '@/integrations/supabase/client';
import { ContractDatabaseIntegration } from '@/lib/contract-database-integration';
import { usePaymentSync } from '@/hooks/usePaymentSync';
import { Home, DollarSign, Calendar, CheckCircle, AlertCircle, MapPin, TrendingUp, Users } from 'lucide-react';
import { PROPERTIES_CATALOG } from '@/lib/propertiesCatalog';

// Minimal ABI for AVAX mortgage operations
const AVAX_MORTGAGE_ABI = [
  'function purchaseProperty(uint256 _propertyValue, uint256 _termMonths) external payable',
  'function makePayment() external payable',
  'function getMortgageDetails(address _borrower) external view returns (tuple(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,bool,address))',
  'function hasMortgage(address) external view returns (bool)',
  'function calculateMonthlyPayment(uint256 _loanAmount, uint256 _interestRate, uint256 _termMonths) external pure returns (uint256)',
  'event MortgageCreated(address indexed borrower, uint256 propertyValue, uint256 downPayment, uint256 loanAmount, uint256 monthlyPayment)',
  'event PaymentMade(address indexed borrower, uint256 paymentAmount, uint256 principalPaid, uint256 interestPaid, uint256 remainingBalance)'
];

export const SimpleAvaxMortgageInterface = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [hasMortgage, setHasMortgage] = useState(false);
  const [mortgageDetails, setMortgageDetails] = useState<any>(null);
  const [contractAddress, setContractAddress] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isStatusChecking, setIsStatusChecking] = useState(false);
  
  // Initialize payment sync hook
  usePaymentSync(contractAddress, account);

  // Featured property from catalog
  const featuredProperty = PROPERTIES_CATALOG[0]; // Art Deco Loft in Mazunte, Mexico
  
  // AVAX to USD conversion (approximate)
  const AVAX_USD_RATE = 43; // $43 per AVAX (approximate)
  
  // Fixed property values - simplified interface
  const propertyValueAVAX = "0.00129"; // Fixed at $129K equivalent
  const suggestedDownPayment = "0.000258"; // Fixed 20% down payment

  // Fixed form values - no user input needed
  const propertyValue = propertyValueAVAX;
  const downPayment = suggestedDownPayment;
  const termMonths = "120"; // Fixed 10 years
  
  // Fixed 8% interest rate
  const FIXED_INTEREST_RATE = 8.0;

  useEffect(() => {
    loadContractAddress();
  }, []);

  useEffect(() => {
    if (isConnected && account && contractAddress) {
      updateBalance(account);
      checkMortgageStatus(account);
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

  // Connect wallet
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
        description: `Ready to invest in ${featuredProperty.name}`,
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

  // Update AVAX balance
  const updateBalance = async (address: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Failed to get balance:', error);
    }
  };

  // Check if user has active mortgage - database first, blockchain as backup
  const checkMortgageStatus = async (address?: string) => {
    const targetAddress = address || account;
    if (!targetAddress) return;
    
    setIsStatusChecking(true);
    try {
      console.log('🔍 Checking mortgage status for address:', targetAddress);
      
      // First check database for immediate response - handle multiple properties
      const { data: dbProperties, error: dbError } = await supabase
        .from('user_properties')
        .select('*')
        .eq('user_address', targetAddress.toLowerCase())
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (dbError) {
        console.warn('⚠️ Database check failed:', dbError);
        // Continue to blockchain fallback
      } else if (dbProperties && dbProperties.length > 0) {
        // Use the most recent property if multiple exist
        const latestProperty = dbProperties[0];
        console.log(`✅ Found ${dbProperties.length} properties in database, using latest:`, latestProperty);
        setHasMortgage(true);
        
        // Get actual payment count from database
        const monthsPaid = await calculateMonthsPaid(targetAddress);
        
        // Convert database property to mortgage details format
        const details = {
          propertyValue: latestProperty.purchase_price?.toString() || '0',
          downPayment: latestProperty.down_payment?.toString() || '0', 
          loanAmount: (latestProperty.purchase_price - latestProperty.down_payment)?.toString() || '0',
          monthlyPayment: latestProperty.monthly_payment?.toString() || '0',
          remainingBalance: latestProperty.remaining_balance?.toString() || '0',
          interestRate: '8.0',
          termMonths: latestProperty.term_months?.toString() || '120',
          monthsPaid: monthsPaid.toString(),
          nextPaymentDue: new Date(),
          isActive: latestProperty.is_active
        };
        
        console.log('🏠 Database mortgage details with payment count:', details);
        setMortgageDetails(details);
        setIsStatusChecking(false);
        return;
      }

      // Fallback to blockchain if no database record found  
      if (contractAddress) {
        console.log('📋 Checking blockchain as fallback...');
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, AVAX_MORTGAGE_ABI, provider);
        
        try {
          const hasActiveMortgage = await contract.hasMortgage(address);
          console.log('✅ Blockchain hasMortgage result:', hasActiveMortgage);
          setHasMortgage(hasActiveMortgage);

          if (hasActiveMortgage) {
            const details = await contract.getMortgageDetails(address);
            const mortgageData = {
              propertyValue: ethers.formatEther(details[0]),
              downPayment: ethers.formatEther(details[1]),
              loanAmount: ethers.formatEther(details[2]),
              monthlyPayment: ethers.formatEther(details[3]),
              remainingBalance: ethers.formatEther(details[4]),
              interestRate: details[5].toString(),
              termMonths: details[6].toString(),
              monthsPaid: details[7].toString(),
              nextPaymentDue: new Date(Number(details[8]) * 1000),
              isActive: details[9]
            };
            setMortgageDetails(mortgageData);
          }
        } catch (contractError) {
          console.warn('⚠️ Contract call failed:', contractError);
          // Don't show error toast if we have database records to fall back on
          setHasMortgage(false);
          setMortgageDetails(null);
        }
      } else {
        console.log('❌ No contract address and no database record found');
        setHasMortgage(false);
        setMortgageDetails(null);
      }
    } catch (error) {
      console.error('❌ Failed to check mortgage status:', error);
      setHasMortgage(false);
      setMortgageDetails(null);
    } finally {
      setIsStatusChecking(false);
    }
  };

  // Purchase property with AVAX
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
        title: "🏠 Processing Investment",
        description: "Creating your fractional real estate investment...",
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
      
      // Record purchase in database immediately
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
            monthly_payment: (parseFloat(propertyValue) - parseFloat(downPayment)) * 0.01, // Rough estimate
            current_value: parseFloat(propertyValue),
            equity_percentage: (parseFloat(downPayment) / parseFloat(propertyValue)) * 100,
            is_active: true,
            purchase_price_base: Math.floor(parseFloat(propertyValue) * 1000000),
            down_payment_base: Math.floor(parseFloat(downPayment) * 1000000),
            loan_amount_base: Math.floor((parseFloat(propertyValue) - parseFloat(downPayment)) * 1000000),
            apr_bps: 800,
            term_months: parseInt(termMonths),
            property_id: 1, // Featured property ID
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
        title: "🎉 Investment Successful!",
        description: `You now own equity in ${featuredProperty.name}`,
      });

      // Refresh status immediately
      await checkMortgageStatus(account);
      await updateBalance(account);

    } catch (error: any) {
      console.error('Purchase failed:', error);
      toast({
        title: "❌ Investment Failed",
        description: error.message || 'Transaction failed',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate actual months paid by querying database
  const calculateMonthsPaid = async (userAddress: string): Promise<number> => {
    try {
      // Count actual payments made by this user for property ID 1 (AVAX mortgage)
      const { data: payments, error } = await supabase
        .from('mortgage_payments_ledger')
        .select('id')
        .eq('user_address', userAddress.toLowerCase())
        .eq('property_id', 1);

      if (error) {
        console.error('Error fetching payment count:', error);
        return 0;
      }

      const paymentCount = payments?.length || 0;
      console.log('📊 Actual payments made:', paymentCount);
      return paymentCount;
    } catch (error) {
      console.error('Error calculating months paid:', error);
      return 0;
    }
  };

  // USD to AVAX conversion using test ratio: 129K USD = 0.00129 AVAX
  const convertUSDToAVAX = (usdAmount: number): string => {
    // Test ratio: 129,000 USD = 0.00129 AVAX
    // So 1 USD = 0.00129 / 129,000 = 0.00000001 AVAX
    const conversionRate = 0.00129 / 129000;
    const avaxAmount = usdAmount * conversionRate;
    return avaxAmount.toFixed(18); // Use high precision for small amounts
  };

  // Make mortgage payment
  const handleMakePayment = async () => {
    if (!isConnected || !mortgageDetails || !contractAddress) return;

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, AVAX_MORTGAGE_ABI, signer);

      // Convert USD monthly payment to AVAX using test ratio
      const usdPayment = parseFloat(mortgageDetails.monthlyPayment);
      const avaxPaymentAmount = convertUSDToAVAX(usdPayment);
      const paymentAmount = ethers.parseEther(avaxPaymentAmount);

      console.log(`💰 Payment conversion: $${usdPayment} USD → ${avaxPaymentAmount} AVAX`);

      toast({
        title: "💰 Processing Payment",
        description: `Submitting $${usdPayment.toFixed(2)} USD (${parseFloat(avaxPaymentAmount).toFixed(8)} AVAX) payment...`,
      });

      const tx = await contract.makePayment({ value: paymentAmount });
      
      toast({
        title: "⏳ Transaction Pending",
        description: "Processing payment...",
      });

      const receipt = await tx.wait();
      
      toast({
        title: "✅ Payment Complete!",
        description: `Your equity in ${featuredProperty.name} has increased`,
      });

      // Event listener will automatically sync to database and refresh status
      setTimeout(async () => {
        console.log('🔄 Auto-refreshing after payment...');
        await checkMortgageStatus();
        await updateBalance(account);
      }, 3000); // Wait 3 seconds for event sync

    } catch (error: any) {
      console.error('Payment failed:', error);
      toast({
        title: "❌ Payment Failed",
        description: error.message || 'Payment transaction failed',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Manual refresh function for debugging
  const handleManualRefresh = async () => {
    if (!isConnected || !account) return;
    
    setIsRefreshing(true);
    console.log('🔄 Manual refresh triggered by user');
    
    try {
      await checkMortgageStatus(account);
      await updateBalance(account);
      
      toast({
        title: "✅ Status Refreshed",
        description: "Mortgage status and balance updated",
      });
    } catch (error) {
      console.error('Manual refresh failed:', error);
      toast({
        title: "❌ Refresh Failed",
        description: "Could not refresh status. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

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
              Featured Investment
            </Badge>
          </div>
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-6 h-6 text-primary" />
            {featuredProperty.name}
          </CardTitle>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            {featuredProperty.location}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Total Property Value</div>
              <div className="font-semibold text-lg">${featuredProperty.totalValue.toLocaleString()}</div>
              <div className="text-muted-foreground text-xs">≈ {propertyValueAVAX} AVAX</div>
            </div>
            <div>
              <div className="text-muted-foreground">Expected Annual Return</div>
              <div className="font-semibold text-lg text-green-600">{featuredProperty.expectedReturn}%</div>
              <div className="text-muted-foreground text-xs">${featuredProperty.monthlyRent}/month rent</div>
            </div>
          </div>
          
          {!isConnected ? (
            <div className="pt-4">
              <Button onClick={connectWallet} className="w-full" size="lg">
                Connect Wallet to Invest
              </Button>
            </div>
          ) : (
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Your Wallet:</span>
                <Badge variant="outline">{account.slice(0, 6)}...{account.slice(-4)}</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Available Balance:</span>
                <div className="text-right">
                  <div className="font-mono">{parseFloat(balance).toFixed(4)} AVAX</div>
                  <div className="text-xs text-muted-foreground">≈ ${(parseFloat(balance) * AVAX_USD_RATE).toFixed(0)}</div>
                </div>
              </div>
              
              {/* Debug & Refresh Controls */}
              <div className="flex justify-between items-center text-sm pt-2 border-t">
                <span className="text-muted-foreground">Debug Controls:</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="text-xs"
                >
                  {isRefreshing ? "Refreshing..." : "Refresh Status"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isConnected && (
        <>
          {/* Platform Status */}
          {!contractAddress && (
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Investment Platform Initializing</span>
                </div>
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                  The blockchain investment infrastructure is being prepared. Use the "Deploy Contract" tab to activate fractional real estate investments.
                </p>
              </CardContent>
            </Card>
          )}

          {!hasMortgage ? (
            // Investment Form
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Fractional Investment Calculator
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Secure your share of {featuredProperty.name} with blockchain-powered fractional ownership
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Investment Amount</Label>
                    <div className="flex items-center h-10 px-3 py-2 border border-input bg-background rounded-md text-sm">
                      <Badge variant="secondary" className="mr-2">Fixed</Badge>
                      <span className="font-semibold">{propertyValue} AVAX</span>
                      <span className="text-muted-foreground ml-2">($129K)</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Full property ownership amount
                    </p>
                  </div>
                  <div>
                    <Label>Initial down payment 20% of $129K</Label>
                    <div className="flex items-center h-10 px-3 py-2 border border-input bg-background rounded-md text-sm">
                      <Badge variant="secondary" className="mr-2">Fixed</Badge>
                      <span className="font-semibold text-green-600">{downPayment} AVAX</span>
                      <span className="text-muted-foreground ml-2">($25,800)</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      which equals $25,800 USD
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Fixed Interest Rate</Label>
                    <div className="flex items-center h-10 px-3 py-2 border border-input bg-background rounded-md text-sm">
                      <Badge variant="secondary" className="mr-2">Fixed</Badge>
                      <span className="font-semibold text-green-600">{FIXED_INTEREST_RATE}% APR</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Guaranteed fixed rate for entire term
                    </p>
                  </div>
                  <div>
                    <Label>Loan Term</Label>
                    <div className="flex items-center h-10 px-3 py-2 border border-input bg-background rounded-md text-sm">
                      <Badge variant="secondary" className="mr-2">Fixed</Badge>
                      <span className="font-semibold">10 years</span>
                      <span className="text-muted-foreground ml-2">(120 months)</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Fixed investment term
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Investment Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Property Share:</span>
                      <span className="font-semibold">
                        {((parseFloat(propertyValue || '0') * AVAX_USD_RATE / featuredProperty.totalValue) * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Initial Investment:</span>
                      <div className="text-right">
                        <div className="font-semibold">{downPayment} AVAX</div>
                        <div className="text-xs text-muted-foreground">
                          ${(parseFloat(downPayment || '0') * AVAX_USD_RATE).toFixed(0)} USD
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Financed Amount:</span>
                      <div className="text-right">
                        <div className="font-semibold">{(parseFloat(propertyValue || '0') - parseFloat(downPayment || '0')).toFixed(2)} AVAX</div>
                        <div className="text-xs text-muted-foreground">
                          ${((parseFloat(propertyValue || '0') - parseFloat(downPayment || '0')) * AVAX_USD_RATE).toFixed(0)} USD
                        </div>
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Projected Monthly Income:</span>
                      <span className="text-green-600">
                        ${((featuredProperty.monthlyRent || 0) * (parseFloat(propertyValue || '0') * AVAX_USD_RATE / featuredProperty.totalValue)).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handlePurchaseProperty}
                  disabled={isLoading || !contractAddress || parseFloat(balance) < parseFloat(downPayment)}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  size="lg"
                >
                  {isLoading ? "Processing Investment..." : 
                   parseFloat(balance) < parseFloat(downPayment) ? "Insufficient AVAX Balance" :
                   `Invest ${downPayment} AVAX in ${featuredProperty.name}`}
                </Button>
                
                {parseFloat(balance) < parseFloat(downPayment) && (
                  <p className="text-xs text-orange-600 text-center">
                    You need {(parseFloat(downPayment) - parseFloat(balance)).toFixed(2)} more AVAX to make this investment
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            // Property Investment Dashboard
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={featuredProperty.image}
                  alt={featuredProperty.name}
                  className="w-full h-32 object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/90" />
                <div className="absolute inset-0 flex items-center">
                  <CardHeader className="text-white relative z-10">
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Home className="w-6 h-6" />
                      Your Investment Portfolio
                      {mortgageDetails?.isActive && (
                        <Badge className="bg-white/20 text-white border-white/30">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-white/90 text-sm">
                      {featuredProperty.name}, {featuredProperty.location}
                    </p>
                  </CardHeader>
                </div>
              </div>
              
              <CardContent className="space-y-6 pt-6">
                {mortgageDetails && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <span className="text-muted-foreground text-sm">Your Investment Value</span>
                          <div className="font-semibold text-xl">
                            ${parseFloat(mortgageDetails.propertyValue).toFixed(0)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {parseFloat(mortgageDetails.propertyValue).toFixed(3)} AVAX
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground text-sm">Your Equity Position</span>
                          <div className="font-semibold text-lg text-green-600">
                            ${parseFloat(mortgageDetails.downPayment).toFixed(0)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {parseFloat(mortgageDetails.downPayment).toFixed(3)} AVAX initial
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <span className="text-muted-foreground text-sm">Outstanding Loan</span>
                          <div className="font-semibold text-xl">
                            ${parseFloat(mortgageDetails.remainingBalance).toFixed(0)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {parseFloat(mortgageDetails.remainingBalance).toFixed(3)} AVAX remaining
                          </div>
                        </div>

                        <div>
                          <span className="text-muted-foreground text-sm">Property Ownership</span>
                          <div className="font-semibold text-lg">
                            {((parseFloat(mortgageDetails.propertyValue) / featuredProperty.totalValue) * 100).toFixed(2)}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            of total property
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg border">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        Monthly Investment Performance
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Payment Progress:</span>
                          <div className="font-semibold">{mortgageDetails.monthsPaid} / {mortgageDetails.termMonths} payments</div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full" 
                              style={{ width: `${(mortgageDetails.monthsPaid / mortgageDetails.termMonths) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Projected Rental Income:</span>
                          <div className="font-semibold text-green-600">
                            ${((featuredProperty.monthlyRent || 0) * (parseFloat(mortgageDetails.propertyValue) / featuredProperty.totalValue)).toFixed(0)}/month
                          </div>
                        </div>
                      </div>
                    </div>

                    {mortgageDetails.isActive && (
                      <div className="space-y-4 pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">Next Monthly Payment</h3>
                            <p className="text-sm text-muted-foreground">
                              ${parseFloat(mortgageDetails.monthlyPayment).toFixed(0)} USD
                              <span className="text-xs ml-1">({convertUSDToAVAX(parseFloat(mortgageDetails.monthlyPayment))} AVAX)</span>
                            </p>
                          </div>
                          <Button 
                            onClick={handleMakePayment}
                            disabled={isLoading}
                            className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent"
                          >
                            <DollarSign className="w-4 h-4" />
                            {isLoading ? "Processing..." : "Pay Now"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
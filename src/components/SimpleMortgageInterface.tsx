import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import { ethers } from 'ethers';
import { Home, DollarSign, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

// Real deployed contract addresses
const CONTRACTS = {
  SIMPLE_MORTGAGE: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318', // Deployed SimpleMortgage contract
  TEST_USDT: '0xc29837e2f495d8f04c5e7aca7d378baa8765dd36' // Real USDT contract from database
};

// Minimal ABIs for mortgage operations only
const SIMPLE_MORTGAGE_ABI = [
  "function purchaseProperty(uint256 _propertyValue, uint256 _downPayment, uint256 _interestRate, uint256 _termMonths) external",
  "function makePayment() external",
  "function getMortgageDetails(address _borrower) external view returns (tuple(uint256 propertyValue, uint256 downPayment, uint256 loanAmount, uint256 monthlyPayment, uint256 remainingBalance, uint256 interestRate, uint256 termMonths, uint256 monthsPaid, uint256 nextPaymentDue, bool isActive, address borrower))",
  "function hasMortgage(address) external view returns (bool)",
  "function isPaymentOverdue(address _borrower) external view returns (bool)"
];

const TEST_USDT_ABI = [
  "function faucet() external",
  "function balanceOf(address account) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function decimals() external view returns (uint8)"
];

export const SimpleMortgageInterface = () => {
  const { isConnected, connectWallet, account } = useWallet();
  const { toast } = useToast();
  
  // State
  const [propertyValue, setPropertyValue] = useState('100000');
  const [downPayment, setDownPayment] = useState('20000');
  const [interestRate, setInterestRate] = useState('800'); // 8% in basis points
  const [termMonths, setTermMonths] = useState('360'); // 30 years
  const [usdtBalance, setUsdtBalance] = useState('0');
  const [mortgageDetails, setMortgageDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get USDT tokens from faucet
  const handleFaucet = async () => {
    if (!isConnected || !window.ethereum) return;

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const usdtContract = new ethers.Contract(CONTRACTS.TEST_USDT, TEST_USDT_ABI, signer);

      const tx = await usdtContract.faucet();
      toast({
        title: "🏪 Faucet Transaction Sent",
        description: "Getting test USDT tokens...",
      });

      await tx.wait();
      
      const balance = await usdtContract.balanceOf(account);
      setUsdtBalance(ethers.formatUnits(balance, 6));

      toast({
        title: "✅ USDT Received!",
        description: `Got 1,000 test USDT tokens`,
      });

    } catch (error: any) {
      console.error('Faucet failed:', error);
      toast({
        title: "❌ Faucet Failed",
        description: error.message || 'Failed to get test tokens',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Purchase property with mortgage
  const handlePurchaseProperty = async () => {
    if (!isConnected || !window.ethereum) return;
    

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // First approve USDT spending
      const usdtContract = new ethers.Contract(CONTRACTS.TEST_USDT, TEST_USDT_ABI, signer);
      const downPaymentWei = ethers.parseUnits(downPayment, 6);
      
      const approveTx = await usdtContract.approve(CONTRACTS.SIMPLE_MORTGAGE, downPaymentWei);
      await approveTx.wait();

      // Purchase property
      const mortgageContract = new ethers.Contract(CONTRACTS.SIMPLE_MORTGAGE, SIMPLE_MORTGAGE_ABI, signer);
      const tx = await mortgageContract.purchaseProperty(
        ethers.parseUnits(propertyValue, 6),
        downPaymentWei,
        parseInt(interestRate),
        parseInt(termMonths)
      );

      toast({
        title: "🏠 Property Purchase Started",
        description: "Processing mortgage application...",
      });

      await tx.wait();

      toast({
        title: "✅ Property Purchased!",
        description: `Mortgage created for $${propertyValue}`,
      });

      // Refresh mortgage details
      await loadMortgageDetails();

    } catch (error: any) {
      console.error('Purchase failed:', error);
      toast({
        title: "❌ Purchase Failed",
        description: error.message || 'Failed to purchase property',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Make monthly payment
  const handleMakePayment = async () => {
    if (!isConnected || !window.ethereum || !mortgageDetails) return;

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Approve payment amount
      const usdtContract = new ethers.Contract(CONTRACTS.TEST_USDT, TEST_USDT_ABI, signer);
      const paymentAmount = mortgageDetails.monthlyPayment;
      
      const approveTx = await usdtContract.approve(CONTRACTS.SIMPLE_MORTGAGE, paymentAmount);
      await approveTx.wait();

      // Make payment
      const mortgageContract = new ethers.Contract(CONTRACTS.SIMPLE_MORTGAGE, SIMPLE_MORTGAGE_ABI, signer);
      const tx = await mortgageContract.makePayment();

      toast({
        title: "💰 Payment Processing",
        description: "Making mortgage payment...",
      });

      await tx.wait();

      toast({
        title: "✅ Payment Made!",
        description: `Monthly payment of $${ethers.formatUnits(paymentAmount, 6)} processed`,
      });

      // Refresh details
      await loadMortgageDetails();

    } catch (error: any) {
      console.error('Payment failed:', error);
      toast({
        title: "❌ Payment Failed",
        description: error.message || 'Failed to make payment',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load mortgage details
  const loadMortgageDetails = async () => {
    if (!isConnected || !window.ethereum || !account) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const mortgageContract = new ethers.Contract(CONTRACTS.SIMPLE_MORTGAGE, SIMPLE_MORTGAGE_ABI, provider);
      
      const hasMortgage = await mortgageContract.hasMortgage(account);
      if (hasMortgage) {
        const details = await mortgageContract.getMortgageDetails(account);
        setMortgageDetails(details);
      }

      // Load USDT balance
      const usdtContract = new ethers.Contract(CONTRACTS.TEST_USDT, TEST_USDT_ABI, provider);
      const balance = await usdtContract.balanceOf(account);
      setUsdtBalance(ethers.formatUnits(balance, 6));

    } catch (error) {
      console.error('Failed to load details:', error);
    }
  };

  // Load data when connected
  React.useEffect(() => {
    if (isConnected && account) {
      loadMortgageDetails();
    }
  }, [isConnected, account]);

  if (!isConnected) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <Home className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Connect Wallet</h3>
          <p className="text-muted-foreground mb-4">
            Connect your wallet to start using the mortgage system
          </p>
          <Button onClick={connectWallet} size="lg">
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Balance & Faucet */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Test USDT Balance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{parseFloat(usdtBalance).toLocaleString()} USDT</span>
            <Badge variant="secondary">Fuji Testnet</Badge>
          </div>
          <Button onClick={handleFaucet} disabled={isLoading} className="w-full">
            {isLoading ? "Getting Tokens..." : "🚰 Get 1,000 Test USDT"}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Mortgage */}
      {mortgageDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Your Mortgage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Property Value:</span>
                <div className="font-semibold">${ethers.formatUnits(mortgageDetails.propertyValue, 6)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Monthly Payment:</span>
                <div className="font-semibold">${ethers.formatUnits(mortgageDetails.monthlyPayment, 6)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Remaining Balance:</span>
                <div className="font-semibold">${ethers.formatUnits(mortgageDetails.remainingBalance, 6)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Months Paid:</span>
                <div className="font-semibold">{mortgageDetails.monthsPaid.toString()}/{mortgageDetails.termMonths.toString()}</div>
              </div>
            </div>
            
            <Separator />
            
            <Button 
              onClick={handleMakePayment} 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              {isLoading ? "Processing..." : `💰 Make Payment ($${ethers.formatUnits(mortgageDetails.monthlyPayment, 6)})`}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Purchase Property */}
      {!mortgageDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Purchase Property
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Property Value ($)</label>
                <Input 
                  value={propertyValue} 
                  onChange={(e) => setPropertyValue(e.target.value)}
                  placeholder="100000"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Down Payment ($)</label>
                <Input 
                  value={downPayment} 
                  onChange={(e) => setDownPayment(e.target.value)}
                  placeholder="20000"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Interest Rate (basis points)</label>
                <Input 
                  value={interestRate} 
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="800"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Term (months)</label>
                <Input 
                  value={termMonths} 
                  onChange={(e) => setTermMonths(e.target.value)}
                  placeholder="360"
                />
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Minimum 20% down payment required</div>
              <div>• Interest rate: {parseInt(interestRate) / 100}% APR</div>
              <div>• Loan term: {Math.round(parseInt(termMonths) / 12)} years</div>
            </div>

            <Button 
              onClick={handlePurchaseProperty} 
              disabled={isLoading || parseFloat(usdtBalance) < parseFloat(downPayment)}
              className="w-full"
            >
              {isLoading ? "Processing..." : "🏠 Purchase Property"}
            </Button>

            {parseFloat(usdtBalance) < parseFloat(downPayment) && (
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <AlertCircle className="w-4 h-4" />
                Insufficient USDT balance. Use faucet to get more tokens.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

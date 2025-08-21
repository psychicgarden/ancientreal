import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';
import { ContractDatabaseIntegration } from '@/lib/contract-database-integration';
import { Home, DollarSign, Calendar, CheckCircle, AlertCircle, Zap } from 'lucide-react';

// Minimal ABI for AVAX mortgage operations
const AVAX_MORTGAGE_ABI = [
  'function purchaseProperty(uint256 _propertyValue, uint256 _interestRate, uint256 _termMonths) external payable',
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

  // Form states
  const [propertyValue, setPropertyValue] = useState('100');
  const [downPayment, setDownPayment] = useState('20');
  const [interestRate, setInterestRate] = useState('8');
  const [termMonths, setTermMonths] = useState('120');

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
        description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
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

  // Check if user has a mortgage
  const checkMortgageStatus = async (address: string) => {
    if (!contractAddress) return;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, AVAX_MORTGAGE_ABI, provider);
      
      const hasActiveMortgage = await contract.hasMortgage(address);
      setHasMortgage(hasActiveMortgage);
      
      if (hasActiveMortgage) {
        const details = await contract.getMortgageDetails(address);
        setMortgageDetails({
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
        });
      }
    } catch (error) {
      console.error('Failed to check mortgage status:', error);
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
      const interestRateBps = parseInt(interestRate) * 100; // Convert % to basis points

      toast({
        title: "🏠 Creating Mortgage",
        description: "Submitting property purchase transaction...",
      });

      const tx = await contract.purchaseProperty(
        propertyValueWei,
        interestRateBps,
        parseInt(termMonths),
        { value: downPaymentWei }
      );

      toast({
        title: "⏳ Transaction Pending",
        description: "Waiting for blockchain confirmation...",
      });

      await tx.wait();
      
      toast({
        title: "✅ Property Purchased!",
        description: `Successfully created mortgage for ${propertyValue} AVAX property`,
      });

      await checkMortgageStatus(account);
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

  // Make mortgage payment
  const handleMakePayment = async () => {
    if (!isConnected || !mortgageDetails || !contractAddress) return;

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, AVAX_MORTGAGE_ABI, signer);

      const paymentAmount = ethers.parseEther(mortgageDetails.monthlyPayment);

      toast({
        title: "💰 Making Payment",
        description: "Submitting mortgage payment...",
      });

      const tx = await contract.makePayment({ value: paymentAmount });
      
      toast({
        title: "⏳ Transaction Pending",
        description: "Processing payment...",
      });

      await tx.wait();
      
      toast({
        title: "✅ Payment Successful!",
        description: `Paid ${mortgageDetails.monthlyPayment} AVAX`,
      });

      await checkMortgageStatus(account);
      await updateBalance(account);

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

  return (
    <div className="space-y-6">
      {/* Wallet Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Native AVAX Mortgage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <Button onClick={connectWallet} className="w-full">
              Connect Wallet
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Account:</span>
                <Badge variant="outline">{account.slice(0, 6)}...{account.slice(-4)}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">AVAX Balance:</span>
                <span className="font-mono">{parseFloat(balance).toFixed(4)} AVAX</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isConnected && (
        <>
          {/* Contract Status */}
          {!contractAddress && (
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Contract Not Deployed</span>
                </div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                  The SimpleAvaxMortgage contract needs to be deployed first. Use the "Deploy Contract" tab to deploy it.
                </p>
              </CardContent>
            </Card>
          )}

          {!hasMortgage ? (
            // Property Purchase Form
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Purchase Property with AVAX
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="propertyValue">Property Value (AVAX)</Label>
                    <Input
                      id="propertyValue"
                      type="number"
                      value={propertyValue}
                      onChange={(e) => setPropertyValue(e.target.value)}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="downPayment">Down Payment (AVAX)</Label>
                    <Input
                      id="downPayment"
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(e.target.value)}
                      placeholder="20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder="8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="termMonths">Term (Months)</Label>
                    <Input
                      id="termMonths"
                      type="number"
                      value={termMonths}
                      onChange={(e) => setTermMonths(e.target.value)}
                      placeholder="120"
                    />
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Property Value:</span>
                      <span>{propertyValue} AVAX</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Down Payment:</span>
                      <span>{downPayment} AVAX ({((parseFloat(downPayment) / parseFloat(propertyValue)) * 100).toFixed(1)}%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loan Amount:</span>
                      <span>{(parseFloat(propertyValue) - parseFloat(downPayment)).toFixed(2)} AVAX</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handlePurchaseProperty}
                  disabled={isLoading || !contractAddress}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? "Processing..." : `Purchase Property (${downPayment} AVAX)`}
                </Button>
              </CardContent>
            </Card>
          ) : (
            // Mortgage Dashboard
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Your Mortgage
                  {mortgageDetails?.isActive && <Badge className="bg-green-100 text-green-800">Active</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {mortgageDetails && (
                  <>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Property Value:</span>
                        <div className="font-mono">{parseFloat(mortgageDetails.propertyValue).toFixed(4)} AVAX</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Down Payment:</span>
                        <div className="font-mono">{parseFloat(mortgageDetails.downPayment).toFixed(4)} AVAX</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Loan Amount:</span>
                        <div className="font-mono">{parseFloat(mortgageDetails.loanAmount).toFixed(4)} AVAX</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Remaining Balance:</span>
                        <div className="font-mono">{parseFloat(mortgageDetails.remainingBalance).toFixed(4)} AVAX</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Monthly Payment:</span>
                        <div className="font-mono">{parseFloat(mortgageDetails.monthlyPayment).toFixed(4)} AVAX</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Payments Made:</span>
                        <div className="font-mono">{mortgageDetails.monthsPaid} / {mortgageDetails.termMonths}</div>
                      </div>
                    </div>

                    <Separator />

                    {mortgageDetails.isActive && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Next Payment</h3>
                            <p className="text-sm text-muted-foreground">
                              {parseFloat(mortgageDetails.monthlyPayment).toFixed(4)} AVAX
                            </p>
                          </div>
                          <Button 
                            onClick={handleMakePayment}
                            disabled={isLoading}
                            className="flex items-center gap-2"
                          >
                            <DollarSign className="w-4 h-4" />
                            {isLoading ? "Processing..." : "Make Payment"}
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
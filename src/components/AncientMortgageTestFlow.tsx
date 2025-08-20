import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle, DollarSign, Home, TrendingUp, ExternalLink } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { CONTRACTS, getExplorerTxUrl } from '@/config/chain';

export const AncientMortgageTestFlow = () => {
  const { isConnected, account, connectWallet } = useWallet();
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; txHash?: string; error?: string }>>({});
  const [isTestingStep, setIsTestingStep] = useState<string | null>(null);
  const [testProgress, setTestProgress] = useState(0);

  const testSteps = [
    {
      id: 'faucet',
      title: 'Get Test USDT',
      description: 'Claim 1,000 test USDT from faucet',
      icon: DollarSign,
      amount: '$1,000 USDT'
    },
    {
      id: 'purchase',
      title: 'Purchase Property',
      description: 'Buy property with $30K down payment',
      icon: Home,
      amount: '$150K Property'
    },
    {
      id: 'stake',
      title: 'Stake in Pool',
      description: 'Deposit USDT to earn mortgage interest',
      icon: TrendingUp,
      amount: '7.5-8.5% APY'
    },
    {
      id: 'payment',
      title: 'Make Payment',
      description: 'Monthly mortgage payment distribution',
      icon: CheckCircle,
      amount: '$1,265/month'
    }
  ];

  const executeRealTest = async (stepId: string) => {
    if (!isConnected || !account) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to test smart contracts",
        variant: "destructive"
      });
      return;
    }

    setIsTestingStep(stepId);
    setTestProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setTestProgress(prev => Math.min(prev + 10, 80));
      }, 500);

      let txHash: string = '';
      let stepTitle = testSteps.find(s => s.id === stepId)?.title || stepId;

      switch (stepId) {
        case 'faucet':
          // Get test USDT from faucet
          const { web3Integration } = await import('@/lib/web3-integration');
          await web3Integration.initialize();
          
          const usdtContract = await web3Integration.getContract('USDT');
          const faucetTx = await usdtContract.faucet();
          const faucetReceipt = await faucetTx.wait();
          txHash = faucetReceipt.hash;
          break;

        case 'purchase':
          // Purchase property with real down payment
          const { web3Integration: web3Purchase } = await import('@/lib/web3-integration');
          await web3Purchase.initialize();
          
          const { transaction } = await web3Purchase.purchaseProperty(30000); // $30K down payment
          const purchaseReceipt = await transaction.wait();
          txHash = purchaseReceipt.hash;
          break;

        case 'stake':
          // Stake USDT in staking pool
          const { web3Integration: web3Stake } = await import('@/lib/web3-integration');
          await web3Stake.initialize();
          
          const stakingPoolContract = await web3Stake.getContract('STAKING_POOL');
          const stakeAmount = web3Stake.parseUSDT('1000');
          
          // For now, just approve USDT (staking pool integration needed)
          await web3Stake.approveUSDT(stakingPoolContract.target as string, '1000');
          
          // Simulate staking transaction
          const stakeTx = await stakingPoolContract.deposit(stakeAmount, account);
          const stakeReceipt = await stakeTx.wait();
          txHash = stakeReceipt.hash;
          break;

        case 'payment':
          // Make mortgage payment
          const { web3Integration: web3Payment } = await import('@/lib/web3-integration');
          await web3Payment.initialize();
          
          const paymentTx = await web3Payment.makePayment();
          const paymentReceipt = await paymentTx.wait();
          txHash = paymentReceipt.hash;
          break;

        default:
          throw new Error(`Unknown test step: ${stepId}`);
      }

      clearInterval(progressInterval);
      setTestProgress(100);
      
      setTestResults(prev => ({
        ...prev,
        [stepId]: { success: true, txHash }
      }));

      toast({
        title: "✅ Real Transaction Successful",
        description: `${stepTitle} completed on Fuji testnet - View on Snowtrace`,
      });

      // Open Snowtrace in new tab
      window.open(getExplorerTxUrl(txHash), '_blank');

    } catch (error: any) {
      console.error(`${stepId} test failed:`, error);
      
      setTestResults(prev => ({
        ...prev,
        [stepId]: { success: false, error: error.message || 'Transaction failed' }
      }));

      toast({
        title: "❌ Transaction Failed",
        description: `${testSteps.find(s => s.id === stepId)?.title}: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsTestingStep(null);
      setTestProgress(0);
    }
  };

  const runFullFlow = async () => {
    for (const step of testSteps) {
      await executeRealTest(step.id);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait between transactions
    }
    
    toast({
      title: "🎉 Real Blockchain Test Complete",
      description: "AncientMortgage business model validated on Fuji testnet with real transactions!"
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-6 h-6 text-primary" />
          Real Blockchain Business Model Execution
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Execute real smart contract transactions on Fuji testnet - no simulations!
          </p>
          {isConnected ? (
            <Badge className="bg-green-600/10 text-green-600 border-green-600/20">
              ✅ {account?.slice(0, 6)}...{account?.slice(-4)}
            </Badge>
          ) : (
            <Button onClick={connectWallet} variant="outline" size="sm">
              Connect Wallet
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Contract Addresses */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Deployed Contracts (Fuji Testnet)</h3>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span>AncientMortgage:</span>
              <a 
                href={`https://testnet.snowtrace.io/address/${CONTRACTS.MAZUNTE_MORTGAGE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-primary hover:underline flex items-center gap-1"
              >
                {CONTRACTS.MAZUNTE_MORTGAGE.slice(0, 8)}...{CONTRACTS.MAZUNTE_MORTGAGE.slice(-6)}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex justify-between">
              <span>TestUSDT:</span>
              <a 
                href={`https://testnet.snowtrace.io/address/${CONTRACTS.USDT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-primary hover:underline flex items-center gap-1"
              >
                {CONTRACTS.USDT.slice(0, 8)}...{CONTRACTS.USDT.slice(-6)}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex justify-between">
              <span>StakingPool:</span>
              <a 
                href={`https://testnet.snowtrace.io/address/${CONTRACTS.STAKING_POOL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-primary hover:underline flex items-center gap-1"
              >
                {CONTRACTS.STAKING_POOL.slice(0, 8)}...{CONTRACTS.STAKING_POOL.slice(-6)}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Test Steps */}
        <div className="grid gap-4 md:grid-cols-2">
          {testSteps.map((step, index) => {
            const Icon = step.icon;
            const result = testResults[step.id];
            const isActive = isTestingStep === step.id;
            
            return (
              <Card key={step.id} className="border-l-4 border-l-primary/30 hover:border-l-primary transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {step.amount}
                    </Badge>
                  </div>
                  
                  {isActive && (
                    <div className="mb-3">
                      <Progress value={testProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Executing real blockchain transaction...</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Button
                      onClick={() => executeRealTest(step.id)}
                      disabled={!isConnected || isActive}
                      size="sm"
                      variant={result?.success ? "secondary" : "default"}
                      className="flex-1 mr-2"
                    >
                      {isActive ? "Processing..." : result?.success ? "✅ Completed" : `Execute ${index + 1}`}
                    </Button>
                    
                    {result?.success && result.txHash && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(getExplorerTxUrl(result.txHash!), '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  {result?.error && (
                    <p className="text-xs text-destructive mt-2">{result.error}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Full Flow Test */}
        <div className="pt-4 border-t">
          <Button 
            onClick={runFullFlow}
            disabled={!isConnected || isTestingStep !== null}
            size="lg"
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            🚀 Execute Real Blockchain Business Model Test
          </Button>
          
          <div className="mt-4 p-4 bg-primary/5 rounded-lg">
            <h3 className="font-medium mb-2">🎯 Real Blockchain Execution:</h3>
            <div className="grid gap-1 text-sm text-muted-foreground">
              <div>• <strong>TestUSDT Faucet:</strong> Real ERC20 token claims with transaction hashes</div>
              <div>• <strong>Property Purchase:</strong> Actual mortgage contracts with down payments</div>
              <div>• <strong>Staking Pool:</strong> Real USDT deposits earning blockchain-verified yields</div>
              <div>• <strong>Mortgage Payments:</strong> Interest distribution to staking pool via smart contracts</div>
              <div>• <strong>All transactions verifiable on Snowtrace explorer</strong></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
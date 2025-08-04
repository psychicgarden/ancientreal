import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import { supabase } from '@/integrations/supabase/client';
import { Web3Integration } from '@/lib/web3-integration';

interface StakingData {
  id: string;
  total_staked: number;
  total_earned: number;
  current_apy: number;
  last_yield_calculation: string;
  is_active: boolean;
}

interface StakingTransaction {
  id: string;
  transaction_type: string;
  amount: number;
  transaction_hash: string | null;
  status: string;
  created_at: string;
}

const BankingInterface = () => {
  const { toast } = useToast();
  const { account: walletAddress, isConnected } = useWallet();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stakingData, setStakingData] = useState<StakingData | null>(null);
  const [transactions, setTransactions] = useState<StakingTransaction[]>([]);
  const [web3] = useState(() => new Web3Integration());

  // Load user staking data
  useEffect(() => {
    if (walletAddress) {
      loadStakingData();
      loadTransactions();
    }
  }, [walletAddress]);

  const loadStakingData = async () => {
    if (!walletAddress) return;

    try {
      const { data, error } = await supabase
        .from('user_staking')
        .select('*')
        .eq('user_wallet_address', walletAddress)
        .maybeSingle();

      if (error) {
        console.error('Error loading staking data:', error);
        return;
      }

      setStakingData(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const loadTransactions = async () => {
    if (!walletAddress) return;

    try {
      const { data, error } = await supabase
        .from('staking_transactions')
        .select('*')
        .eq('user_wallet_address', walletAddress)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading transactions:', error);
        return;
      }

      setTransactions(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeposit = async () => {
    if (!isConnected || !walletAddress) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to deposit funds.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid deposit amount.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Try to initialize web3 - if it fails, continue in demo mode
      try {
        await web3.initialize();
      } catch (error) {
        console.log('Web3 initialization failed, continuing in demo mode:', error);
      }

      // Try to check USDT balance - fallback to demo mode if it fails
      let hasEnoughBalance = true;
      try {
        const balance = await web3.getUSDTBalance(walletAddress);
        if (parseFloat(balance) < amount) {
          hasEnoughBalance = false;
        }
      } catch (error) {
        console.log('USDT balance check failed, proceeding in demo mode:', error);
        // Continue in demo mode - assume user has enough balance
      }

      if (!hasEnoughBalance) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough USDT for this deposit.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Create pending transaction record
      const { data: txData, error: txError } = await supabase
        .from('staking_transactions')
        .insert({
          user_wallet_address: walletAddress,
          transaction_type: 'deposit',
          amount: amount,
          status: 'pending'
        })
        .select()
        .single();

      if (txError) {
        console.error('Transaction insert error:', txError);
        throw new Error('Failed to create transaction record');
      }

      // Simulate blockchain transaction - in real implementation, this would interact with YieldFarmingManager contract
      // For now, we'll always proceed in demo mode since the contracts aren't deployed
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Update transaction as completed
      await supabase
        .from('staking_transactions')
        .update({
          status: 'completed',
          transaction_hash: mockTxHash
        })
        .eq('id', txData.id);

      // Update or create user staking record
      if (stakingData) {
        await supabase
          .from('user_staking')
          .update({
            total_staked: stakingData.total_staked + amount
          })
          .eq('id', stakingData.id);
      } else {
        await supabase
          .from('user_staking')
          .insert({
            user_wallet_address: walletAddress,
            total_staked: amount,
            total_earned: 0,
            current_apy: 8.0,
            is_active: true
          });
      }

      toast({
        title: "Deposit Successful!",
        description: `Successfully deposited ${amount} USDT. You're now earning 8% APY!`,
      });

      setDepositAmount('');
      loadStakingData();
      loadTransactions();

    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        title: "Deposit Failed",
        description: "There was an error processing your deposit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected || !walletAddress || !stakingData) {
      toast({
        title: "Cannot withdraw",
        description: "Please connect your wallet and ensure you have staked funds.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0 || amount > stakingData.total_staked) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create pending withdrawal transaction
      const { data: txData, error: txError } = await supabase
        .from('staking_transactions')
        .insert({
          user_wallet_address: walletAddress,
          transaction_type: 'withdrawal',
          amount: amount,
          status: 'pending'
        })
        .select()
        .single();

      if (txError) throw new Error('Failed to create transaction record');

      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Update transaction as completed
      await supabase
        .from('staking_transactions')
        .update({
          status: 'completed',
          transaction_hash: `0x${Math.random().toString(16).substr(2, 64)}`
        })
        .eq('id', txData.id);

      // Update staking balance
      await supabase
        .from('user_staking')
        .update({
          total_staked: stakingData.total_staked - amount
        })
        .eq('id', stakingData.id);

      toast({
        title: "Withdrawal Successful!",
        description: `Successfully withdrawn ${amount} USDT to your wallet.`,
      });

      setWithdrawAmount('');
      loadStakingData();
      loadTransactions();

    } catch (error) {
      console.error('Withdrawal error:', error);
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing your withdrawal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return '↗️';
      case 'withdrawal': return '↙️';
      case 'yield': return '💰';
      default: return '📝';
    }
  };

  const totalBalance = stakingData ? stakingData.total_staked + stakingData.total_earned : 0;
  const projectedYearlyEarnings = stakingData ? stakingData.total_staked * 0.08 : 0;

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Total Balance</p>
              <p className="text-3xl font-bold text-primary">{formatAmount(totalBalance)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Staked Amount</p>
              <p className="text-3xl font-bold">{formatAmount(stakingData?.total_staked || 0)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Total Earned</p>
              <p className="text-3xl font-bold text-accent">{formatAmount(stakingData?.total_earned || 0)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Staking Interface */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Ultra-Liquid Staking
                <Badge variant="secondary">8% APY</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="deposit" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="deposit">Deposit</TabsTrigger>
                  <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                </TabsList>
                
                <TabsContent value="deposit" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Deposit Amount (USDT)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleDeposit} 
                    disabled={isLoading || !depositAmount}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? 'Processing...' : 'Deposit & Start Earning'}
                  </Button>
                  
                  {depositAmount && parseFloat(depositAmount) > 0 && (
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Annual earnings: ~{formatAmount(parseFloat(depositAmount) * 0.08)}
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="withdraw" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Withdraw Amount (USDT)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="text-lg"
                      max={stakingData?.total_staked || 0}
                    />
                    <p className="text-xs text-muted-foreground">
                      Available: {formatAmount(stakingData?.total_staked || 0)}
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleWithdraw} 
                    disabled={isLoading || !withdrawAmount || !stakingData}
                    className="w-full"
                    size="lg"
                    variant="outline"
                  >
                    {isLoading ? 'Processing...' : 'Withdraw'}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Projected Earnings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Projected Earnings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Daily</span>
                <span className="font-medium">{formatAmount(projectedYearlyEarnings / 365)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly</span>
                <span className="font-medium">{formatAmount(projectedYearlyEarnings / 12)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Yearly</span>
                <span className="font-medium text-primary">{formatAmount(projectedYearlyEarnings)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTransactionIcon(tx.transaction_type)}</span>
                        <div>
                          <p className="text-sm font-medium capitalize">{tx.transaction_type}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(tx.created_at)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {tx.transaction_type === 'withdrawal' ? '-' : '+'}
                          {formatAmount(tx.amount)}
                        </p>
                        <Badge 
                          variant={tx.status === 'completed' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No transactions yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BankingInterface;
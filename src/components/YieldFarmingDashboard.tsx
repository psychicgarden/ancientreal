import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, DollarSign, TrendingUp, BarChart3, Clock, Coins, Building2, Calendar } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { PropertyAppreciationMarketplace } from "@/components/PropertyAppreciationMarketplace";

interface YieldPool {
  id: string;
  name: string;
  stakingToken: string;
  rewardToken: string;
  apy: number;
  totalStaked: number;
  totalRewards: number;
  lockPeriod: number;
  earlyWithdrawalFee: number;
  userStaked: number;
  userRewards: number;
  autoCompounding: boolean;
}

interface UserPosition {
  poolId: string;
  poolName: string;
  staked: number;
  rewards: number;
  apy: number;
  timeRemaining: number;
  autoCompounding: boolean;
}

export const YieldFarmingDashboard = () => {
  const { isConnected, connectWallet } = useWallet();
  const { toast } = useToast();
  const [selectedPool, setSelectedPool] = useState<YieldPool | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isClaimingRewards, setIsClaimingRewards] = useState(false);

  const realEstateYieldPools: YieldPool[] = [
    {
      id: 'pool-developer',
      name: 'Developer Investment Pool',
      stakingToken: 'USDT',
      rewardToken: 'DEV-TOKENS',
      apy: 13.5,
      totalStaked: 5200000,
      totalRewards: 702000,
      lockPeriod: 730, // 24 months
      earlyWithdrawalFee: 0, // Can sell on secondary market instead
      userStaked: 2500,
      userRewards: 125.3,
      autoCompounding: false
    },
    {
      id: 'pool-rental',
      name: 'Rental Income Pool',
      stakingToken: 'PROP-TOKENS',
      rewardToken: 'RENTAL-YIELD',
      apy: 7.2,
      totalStaked: 3100000,
      totalRewards: 223200,
      lockPeriod: 365, // 12 months
      earlyWithdrawalFee: 2,
      userStaked: 1800,
      userRewards: 68.5,
      autoCompounding: true
    }
  ];

  const userPositions: UserPosition[] = [
    {
      poolId: 'pool-bahia',
      poolName: 'Bahia Loft Staking',
      staked: 1250,
      rewards: 45.2,
      apy: 18.5,
      timeRemaining: 23,
      autoCompounding: true
    },
    {
      poolId: 'pool-lp',
      poolName: 'BOHO-USDT LP Staking',
      staked: 2340,
      rewards: 125.7,
      apy: 45.8,
      timeRemaining: 67,
      autoCompounding: true
    }
  ];

  const totalStakedValue = userPositions.reduce((sum, pos) => sum + pos.staked, 0);
  const totalRewardsValue = userPositions.reduce((sum, pos) => sum + pos.rewards, 0);
  const averageAPY = userPositions.reduce((sum, pos, _, arr) => sum + pos.apy / arr.length, 0);

  const handleStake = async () => {
    if (!selectedPool || !stakeAmount || !isConnected) {
      toast({
        title: "Connection Required",
        description: "Please connect your wallet to stake",
        variant: "destructive"
      });
      return;
    }
    
    setIsStaking(true);
    
    try {
      // Simulate smart contract staking transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Staking Successful",
        description: `Successfully staked ${stakeAmount} ${selectedPool.stakingToken} in ${selectedPool.name}`,
      });
      
      // Store stake in localStorage for portfolio tracking
      const stakes = JSON.parse(localStorage.getItem('userStakes') || '[]');
      const newStake = {
        id: Date.now(),
        poolName: selectedPool.name,
        amount: parseFloat(stakeAmount),
        token: selectedPool.stakingToken,
        apy: selectedPool.apy,
        created: new Date().toISOString()
      };
      stakes.push(newStake);
      localStorage.setItem('userStakes', JSON.stringify(stakes));
      
      setStakeAmount('');
    } catch (error) {
      toast({
        title: "Staking Failed",
        description: "Unable to process staking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsStaking(false);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedPool || !withdrawAmount || !isConnected) {
      toast({
        title: "Connection Required",
        description: "Please connect your wallet to withdraw",
        variant: "destructive"
      });
      return;
    }
    
    setIsWithdrawing(true);
    
    try {
      // Simulate smart contract withdrawal transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Withdrawal Successful",
        description: `Successfully withdrew ${withdrawAmount} ${selectedPool.stakingToken} from ${selectedPool.name}`,
      });
      
      setWithdrawAmount('');
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "Unable to process withdrawal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleClaimRewards = async (poolId: string) => {
    if (!isConnected) {
      toast({
        title: "Connection Required",
        description: "Please connect your wallet to claim rewards",
        variant: "destructive"
      });
      return;
    }
    
    setIsClaimingRewards(true);
    
    try {
      // Simulate smart contract claim rewards transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const pool = realEstateYieldPools.find(p => p.id === poolId);
      
      toast({
        title: "Rewards Claimed",
        description: `Successfully claimed ${pool?.userRewards.toFixed(2)} BOHO tokens`,
      });
    } catch (error) {
      toast({
        title: "Claim Failed",
        description: "Unable to claim rewards. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsClaimingRewards(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Yield Farming Dashboard</h2>
        <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
          Auto-Compounding Available
        </Badge>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total Staked</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              ${totalStakedValue.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Across {userPositions.length} pools
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Pending Rewards</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              ${totalRewardsValue.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Ready to claim
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Average APY</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {averageAPY.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Weighted average
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Daily Earnings</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              ${((totalStakedValue * averageAPY / 100) / 365).toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">
              Est. daily yield
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pools" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pools">Investment Pools</TabsTrigger>
          <TabsTrigger value="appreciation">Property Appreciation</TabsTrigger>
          <TabsTrigger value="positions">My Positions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pools" className="space-y-4">
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Real Estate Investment Pools</h3>
            <p className="text-sm text-blue-700">
              Developer investments are locked for 24 months but can be traded on the secondary market. 
              Rental income pools provide steady monthly distributions from completed properties.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pool Selection */}
            <div className="space-y-4">
              {realEstateYieldPools.map((pool) => (
                <Card 
                  key={pool.id}
                  className={`cursor-pointer transition-all ${
                    selectedPool?.id === pool.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedPool(pool)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold">{pool.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Stake {pool.stakingToken} • Earn {pool.rewardToken}
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        {pool.apy}% APY
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Total Staked</div>
                        <div className="font-semibold">${pool.totalStaked.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Lock Period</div>
                        <div className="font-semibold flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {pool.lockPeriod >= 365 ? `${Math.round(pool.lockPeriod / 365)} years` : `${pool.lockPeriod} days`}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Your Stake</div>
                        <div className="font-semibold">${pool.userStaked.toLocaleString()}</div>
                      </div>
                    </div>

                    {pool.userStaked > 0 && (
                      <div className="mt-3 bg-green-50 p-2 rounded-lg">
                        <div className="text-sm text-green-700">
                          Pending rewards: ${pool.userRewards.toFixed(2)} BOHO
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Staking Interface */}
            {selectedPool && (
              <Card>
                <CardHeader>
                  <CardTitle>Stake in {selectedPool.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">APY</div>
                        <div className="font-semibold text-green-600">{selectedPool.apy}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Lock Period</div>
                        <div className="font-semibold">
                          {selectedPool.lockPeriod >= 365 ? `${Math.round(selectedPool.lockPeriod / 365)} years` : `${selectedPool.lockPeriod} days`}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">
                          {selectedPool.id === 'pool-developer' ? 'Secondary Market' : 'Early Exit Fee'}
                        </div>
                        <div className="font-semibold">
                          {selectedPool.id === 'pool-developer' ? 'Available' : `${selectedPool.earlyWithdrawalFee}%`}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Distribution</div>
                        <div className="font-semibold">
                          {selectedPool.id === 'pool-developer' ? 'Project Completion' : 'Monthly'}
                        </div>
                      </div>
                    </div>
                    
                    {selectedPool.id === 'pool-developer' && (
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="text-sm text-yellow-800">
                          <strong>Developer Pool:</strong> 24-month lock ensures project funding stability. 
                          You can trade your tokens on the secondary marketplace for liquidity.
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium">Stake Amount</label>
                    <Input 
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder={`Amount in ${selectedPool.stakingToken}`}
                    />
                  </div>

                  <Button 
                    className="w-full"
                    onClick={isConnected ? handleStake : connectWallet}
                    disabled={isStaking || (isConnected && (!stakeAmount || parseFloat(stakeAmount) <= 0))}
                  >
                    {isStaking 
                      ? "Staking..." 
                      : !isConnected 
                        ? "Connect Wallet to Stake"
                        : `Stake ${selectedPool.stakingToken}`
                    }
                  </Button>

                  {selectedPool.userStaked > 0 && (
                    <>
                      <div className="border-t pt-4">
                        <label className="text-sm font-medium">Withdraw Amount</label>
                        <Input 
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          placeholder={`Max: ${selectedPool.userStaked}`}
                          max={selectedPool.userStaked}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={handleWithdraw}
                          disabled={isWithdrawing || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
                        >
                          {isWithdrawing ? "Withdrawing..." : "Withdraw"}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleClaimRewards(selectedPool.id)}
                          disabled={isClaimingRewards || selectedPool.userRewards <= 0}
                        >
                          {isClaimingRewards ? "Claiming..." : "Claim Rewards"}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="appreciation" className="space-y-4">
          <PropertyAppreciationMarketplace />
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          {userPositions.map((position) => (
            <Card key={position.poolId}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-semibold text-lg">{position.poolName}</div>
                    <div className="text-sm text-muted-foreground">
                      {position.timeRemaining} days remaining
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-700">
                      {position.apy}% APY
                    </Badge>
                    {position.autoCompounding && (
                      <Badge className="ml-2 bg-purple-100 text-purple-700">
                        Auto-Compound
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Staked</div>
                    <div className="text-xl font-bold">${position.staked.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Pending Rewards</div>
                    <div className="text-xl font-bold text-green-600">
                      ${position.rewards.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Daily Yield</div>
                    <div className="text-xl font-bold">
                      ${((position.staked * position.apy / 100) / 365).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Lock Progress</div>
                    <div className="text-xl font-bold">
                      {((90 - position.timeRemaining) / 90 * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Progress value={(90 - position.timeRemaining) / 90 * 100} className="h-2" />
                </div>

                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleClaimRewards(position.poolId)}
                    disabled={isClaimingRewards}
                  >
                    {isClaimingRewards ? "Claiming..." : "Claim Rewards"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedPool(realEstateYieldPools.find(p => p.id === position.poolId) || null);
                      setStakeAmount('');
                    }}
                  >
                    Add Stake
                  </Button>
                  <Button variant="outline" size="sm">
                    Toggle Auto-Compound
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Yield Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Earned (30d)</span>
                    <span className="font-semibold text-green-600">$1,234.56</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Best Performing Pool</span>
                    <span className="font-semibold">BOHO-USDT LP (45.8%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Compound Frequency</span>
                    <span className="font-semibold">Daily</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Next Unlock</span>
                    <span className="font-semibold">23 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Strategy Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="font-semibold text-green-800 text-sm">Optimal Strategy</div>
                    <div className="text-green-700 text-xs">
                      Increase LP token staking for maximum yield
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-semibold text-blue-800 text-sm">Diversification Tip</div>
                    <div className="text-blue-700 text-xs">
                      Consider spreading across multiple pools
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="font-semibold text-purple-800 text-sm">Auto-Compound</div>
                    <div className="text-purple-700 text-xs">
                      Enable for 23% higher annual returns
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
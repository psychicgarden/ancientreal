import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { TrendingUp, DollarSign, ArrowUpDown, Users, Clock, Zap, MapPin, Filter, AlertTriangle, LineChart, Activity, Target, Layers } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AMMLiquidityPool {
  id: string;
  tokenA: string;
  tokenB: string;
  reserveA: number;
  reserveB: number;
  totalLiquidity: number;
  volume24h: number;
  fees24h: number;
  apy: number;
  priceImpact: number;
  userLPTokens: number;
}

interface AdvancedOrder {
  id: string;
  type: 'market' | 'limit' | 'stop_loss' | 'take_profit' | 'dca';
  side: 'buy' | 'sell';
  tokenSymbol: string;
  amount: number;
  price?: number;
  triggerPrice?: number;
  timeInForce: '24h' | '7d' | '30d' | 'GTC';
  status: 'pending' | 'partial' | 'filled' | 'cancelled';
  filled: number;
  created: string;
}

interface PropertyOracle {
  tokenSymbol: string;
  currentPrice: number;
  priceChange24h: number;
  confidence: number;
  lastUpdate: string;
  sources: string[];
}

interface LiquidityIncentive {
  poolId: string;
  rewardToken: string;
  dailyRewards: number;
  multiplier: number;
  boostedAPY: number;
  timeRemaining: number;
}

export const EnhancedSecondaryMarketplace = () => {
  const { isConnected, connectWallet } = useWallet();
  const { toast } = useToast();
  
  // State management
  const [activeTab, setActiveTab] = useState('amm');
  const [selectedPool, setSelectedPool] = useState<AMMLiquidityPool | null>(null);
  const [liquidityAmount, setLiquidityAmount] = useState('');
  const [tradeAmount, setTradeAmount] = useState('');
  const [orderType, setOrderType] = useState('market');
  const [limitPrice, setLimitPrice] = useState('');
  const [slippageTolerance, setSlippageTolerance] = useState([0.5]);
  const [autoRebalance, setAutoRebalance] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data with enhanced AMM functionality
  const ammPools: AMMLiquidityPool[] = [
    {
      id: 'pool-bahia-usdt',
      tokenA: 'BAHIA',
      tokenB: 'USDT',
      reserveA: 125000,
      reserveB: 206250000,
      totalLiquidity: 3200000,
      volume24h: 450000,
      fees24h: 1350,
      apy: 28.5,
      priceImpact: 0.12,
      userLPTokens: 2500
    },
    {
      id: 'pool-tulum-usdt',
      tokenA: 'TULUM',
      tokenB: 'USDT',
      reserveA: 89000,
      reserveB: 169100000,
      totalLiquidity: 2100000,
      volume24h: 320000,
      fees24h: 960,
      apy: 22.8,
      priceImpact: 0.18,
      userLPTokens: 1800
    },
    {
      id: 'pool-santorini-usdt',
      tokenA: 'SANTORINI',
      tokenB: 'USDT',
      reserveA: 156000,
      reserveB: 277680000,
      totalLiquidity: 2800000,
      volume24h: 380000,
      fees24h: 1140,
      apy: 25.2,
      priceImpact: 0.09,
      userLPTokens: 3200
    }
  ];

  const propertyOracles: PropertyOracle[] = [
    {
      tokenSymbol: 'BAHIA',
      currentPrice: 1650,
      priceChange24h: 2.3,
      confidence: 95.8,
      lastUpdate: '2 minutes ago',
      sources: ['Chainlink', 'Pyth', 'Tellor']
    },
    {
      tokenSymbol: 'TULUM',
      currentPrice: 1900,
      priceChange24h: -1.2,
      confidence: 97.1,
      lastUpdate: '1 minute ago',
      sources: ['Chainlink', 'Pyth', 'API3']
    },
    {
      tokenSymbol: 'SANTORINI',
      currentPrice: 1780,
      priceChange24h: 4.1,
      confidence: 94.3,
      lastUpdate: '3 minutes ago',
      sources: ['Chainlink', 'Pyth', 'Band']
    }
  ];

  const liquidityIncentives: LiquidityIncentive[] = [
    {
      poolId: 'pool-bahia-usdt',
      rewardToken: 'BOHO',
      dailyRewards: 2500,
      multiplier: 2.5,
      boostedAPY: 71.2,
      timeRemaining: 45
    },
    {
      poolId: 'pool-tulum-usdt',
      rewardToken: 'BOHO',
      dailyRewards: 1800,
      multiplier: 2.0,
      boostedAPY: 45.6,
      timeRemaining: 32
    }
  ];

  const [userOrders, setUserOrders] = useState<AdvancedOrder[]>([
    {
      id: 'order-001',
      type: 'limit',
      side: 'buy',
      tokenSymbol: 'BAHIA',
      amount: 2.5,
      price: 1600,
      timeInForce: '7d',
      status: 'pending',
      filled: 0,
      created: '2 hours ago'
    },
    {
      id: 'order-002',
      type: 'stop_loss',
      side: 'sell',
      tokenSymbol: 'TULUM',
      amount: 1.8,
      triggerPrice: 1850,
      timeInForce: 'GTC',
      status: 'pending',
      filled: 0,
      created: '1 day ago'
    }
  ]);

  const calculatePriceImpact = (pool: AMMLiquidityPool, amountIn: number, tokenIn: string) => {
    if (!amountIn || amountIn <= 0) return 0;
    
    const k = pool.reserveA * pool.reserveB;
    const reserveIn = tokenIn === pool.tokenA ? pool.reserveA : pool.reserveB;
    const reserveOut = tokenIn === pool.tokenA ? pool.reserveB : pool.reserveA;
    
    const amountOut = (reserveOut * amountIn) / (reserveIn + amountIn);
    const spotPrice = reserveOut / reserveIn;
    const executionPrice = amountOut / amountIn;
    
    return Math.abs((executionPrice - spotPrice) / spotPrice) * 100;
  };

  const calculateOptimalRoute = (tokenIn: string, tokenOut: string, amountIn: number) => {
    // Simulate finding best route through multiple pools
    return {
      route: [tokenIn, 'USDT', tokenOut],
      expectedOutput: amountIn * 0.997, // 0.3% total slippage
      priceImpact: 0.15,
      gasEstimate: 180000
    };
  };

  const handleAddLiquidity = async () => {
    if (!selectedPool || !liquidityAmount || !isConnected) {
      toast({
        title: "Connection Required",
        description: "Please connect wallet and select pool",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate AMM liquidity addition
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const lpTokensReceived = parseFloat(liquidityAmount) * 0.99; // 1% slippage
      
      toast({
        title: "Liquidity Added Successfully",
        description: `Added $${parseFloat(liquidityAmount).toLocaleString()} liquidity, received ${lpTokensReceived.toFixed(2)} LP tokens`,
      });
      
      setLiquidityAmount('');
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Unable to add liquidity. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdvancedTrade = async () => {
    if (!tradeAmount || !isConnected) {
      toast({
        title: "Invalid Parameters",
        description: "Please check trade parameters",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate advanced order placement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newOrder: AdvancedOrder = {
        id: `order-${Date.now()}`,
        type: orderType as any,
        side: 'buy',
        tokenSymbol: 'BAHIA',
        amount: parseFloat(tradeAmount),
        price: orderType === 'limit' ? parseFloat(limitPrice) : undefined,
        timeInForce: '24h',
        status: 'pending',
        filled: 0,
        created: 'Just now'
      };

      setUserOrders(prev => [newOrder, ...prev]);
      
      toast({
        title: "Order Placed",
        description: `${orderType} order for ${tradeAmount} tokens placed successfully`,
      });
      
      setTradeAmount('');
      setLimitPrice('');
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "Unable to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Advanced Trading Hub
        </h2>
        <div className="flex gap-2">
          <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700">
            <Activity className="h-3 w-3 mr-1" />
            Live AMM
          </Badge>
          <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700">
            <Target className="h-3 w-3 mr-1" />
            Oracle Pricing
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="amm" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            AMM Trading
          </TabsTrigger>
          <TabsTrigger value="liquidity" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Liquidity Mining
          </TabsTrigger>
          <TabsTrigger value="advanced-orders" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Advanced Orders
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="oracles" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Price Oracles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="amm" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AMM Pool Selection */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Automated Market Maker Pools</h3>
                <Badge variant="secondary">{ammPools.length} active pools</Badge>
              </div>

              {ammPools.map((pool) => (
                <Card 
                  key={pool.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedPool?.id === pool.id ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                  onClick={() => setSelectedPool(pool)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {pool.tokenA.slice(0, 2)}
                          </div>
                          <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {pool.tokenB.slice(0, 2)}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-lg">{pool.tokenA}/{pool.tokenB}</div>
                          <div className="text-sm text-muted-foreground">
                            Liquidity: ${pool.totalLiquidity.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{pool.apy}%</div>
                        <div className="text-sm text-muted-foreground">APY</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-muted-foreground">24h Volume</div>
                        <div className="font-semibold">${pool.volume24h.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">24h Fees</div>
                        <div className="font-semibold text-green-600">${pool.fees24h.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Price Impact</div>
                        <div className="font-semibold text-orange-600">{pool.priceImpact}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Your LP</div>
                        <div className="font-semibold">{pool.userLPTokens}</div>
                      </div>
                    </div>

                    {liquidityIncentives.find(i => i.poolId === pool.id) && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-800">Liquidity Mining Active</span>
                        </div>
                        <div className="text-xs text-purple-700">
                          Boosted APY: {liquidityIncentives.find(i => i.poolId === pool.id)?.boostedAPY}% 
                          ({liquidityIncentives.find(i => i.poolId === pool.id)?.timeRemaining} days remaining)
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Trading Interface */}
            <div className="space-y-4">
              {selectedPool ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowUpDown className="h-5 w-5" />
                      Swap Tokens
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">From</label>
                      <div className="flex gap-2">
                        <Input 
                          type="number"
                          value={tradeAmount}
                          onChange={(e) => setTradeAmount(e.target.value)}
                          placeholder="0.00"
                          className="flex-1"
                        />
                        <Select defaultValue={selectedPool.tokenA}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={selectedPool.tokenA}>{selectedPool.tokenA}</SelectItem>
                            <SelectItem value={selectedPool.tokenB}>{selectedPool.tokenB}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button variant="ghost" size="sm">
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">To (estimated)</label>
                      <div className="flex gap-2">
                        <Input 
                          type="number"
                          value={tradeAmount ? (parseFloat(tradeAmount) * 0.997).toFixed(6) : ''}
                          readOnly
                          className="flex-1 bg-muted"
                        />
                        <Select defaultValue={selectedPool.tokenB}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={selectedPool.tokenB}>{selectedPool.tokenB}</SelectItem>
                            <SelectItem value={selectedPool.tokenA}>{selectedPool.tokenA}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Slippage Tolerance</span>
                        <span>{slippageTolerance[0]}%</span>
                      </div>
                      <Slider
                        value={slippageTolerance}
                        onValueChange={setSlippageTolerance}
                        max={5}
                        min={0.1}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    {tradeAmount && (
                      <div className="bg-muted/50 p-3 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Price Impact</span>
                          <span className="text-orange-600">
                            {calculatePriceImpact(selectedPool, parseFloat(tradeAmount), selectedPool.tokenA).toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Trading Fee</span>
                          <span>0.3%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Minimum Received</span>
                          <span>{tradeAmount ? (parseFloat(tradeAmount) * 0.995).toFixed(6) : '0'}</span>
                        </div>
                      </div>
                    )}

                    <Button 
                      className="w-full"
                      onClick={isConnected ? handleAdvancedTrade : connectWallet}
                      disabled={isProcessing || !tradeAmount}
                    >
                      {isProcessing 
                        ? "Processing Swap..." 
                        : !isConnected 
                          ? "Connect Wallet"
                          : "Swap Tokens"
                      }
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a pool to start trading</p>
                  </CardContent>
                </Card>
              )}

              {/* Market Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Market Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Value Locked</span>
                    <span className="font-semibold">${ammPools.reduce((sum, pool) => sum + pool.totalLiquidity, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">24h Volume</span>
                    <span className="font-semibold">${ammPools.reduce((sum, pool) => sum + pool.volume24h, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Fees Generated</span>
                    <span className="font-semibold text-green-600">${ammPools.reduce((sum, pool) => sum + pool.fees24h, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Liquidity Providers</span>
                    <span className="font-semibold">2,847</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="liquidity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Add Liquidity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPool && (
                  <>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                      <div className="font-medium text-blue-900 mb-2">
                        {selectedPool.tokenA}/{selectedPool.tokenB} Pool
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700">Base APY:</span>
                          <span className="font-semibold ml-2">{selectedPool.apy}%</span>
                        </div>
                        <div>
                          <span className="text-blue-700">Boosted APY:</span>
                          <span className="font-semibold ml-2 text-purple-600">
                            {liquidityIncentives.find(i => i.poolId === selectedPool.id)?.boostedAPY || selectedPool.apy}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Liquidity Amount (USD)</label>
                      <Input 
                        type="number"
                        value={liquidityAmount}
                        onChange={(e) => setLiquidityAmount(e.target.value)}
                        placeholder="Enter amount in USD"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Auto-rebalance</span>
                      <Switch 
                        checked={autoRebalance}
                        onCheckedChange={setAutoRebalance}
                      />
                    </div>

                    {liquidityAmount && (
                      <div className="bg-muted/50 p-3 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>LP Tokens to Receive</span>
                          <span className="font-semibold">{(parseFloat(liquidityAmount) * 0.99).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Share of Pool</span>
                          <span>{((parseFloat(liquidityAmount) / selectedPool.totalLiquidity) * 100).toFixed(4)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Daily Rewards</span>
                          <span className="text-green-600">
                            ${((parseFloat(liquidityAmount) * selectedPool.apy / 100) / 365).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}

                    <Button 
                      className="w-full"
                      onClick={handleAddLiquidity}
                      disabled={isProcessing || !liquidityAmount || !selectedPool}
                    >
                      {isProcessing ? "Adding Liquidity..." : "Add Liquidity"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Liquidity Mining Rewards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {liquidityIncentives.map((incentive) => {
                  const pool = ammPools.find(p => p.id === incentive.poolId);
                  return (
                    <div key={incentive.poolId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold">
                          {pool?.tokenA}/{pool?.tokenB}
                        </div>
                        <Badge className="bg-purple-100 text-purple-700">
                          {incentive.multiplier}x Rewards
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Daily Rewards</span>
                          <span className="font-semibold">{incentive.dailyRewards} {incentive.rewardToken}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Boosted APY</span>
                          <span className="font-semibold text-green-600">{incentive.boostedAPY}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time Remaining</span>
                          <span className="font-semibold">{incentive.timeRemaining} days</span>
                        </div>
                      </div>
                      <Progress 
                        value={(incentive.timeRemaining / 90) * 100} 
                        className="mt-3 h-2"
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advanced-orders" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Place Advanced Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Order Type</label>
                  <Select value={orderType} onValueChange={setOrderType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market Order</SelectItem>
                      <SelectItem value="limit">Limit Order</SelectItem>
                      <SelectItem value="stop_loss">Stop Loss</SelectItem>
                      <SelectItem value="take_profit">Take Profit</SelectItem>
                      <SelectItem value="dca">Dollar Cost Average</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Amount</label>
                  <Input 
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    placeholder="Amount of tokens"
                  />
                </div>

                {(orderType === 'limit' || orderType === 'stop_loss' || orderType === 'take_profit') && (
                  <div>
                    <label className="text-sm font-medium">
                      {orderType === 'limit' ? 'Limit Price' : 'Trigger Price'}
                    </label>
                    <Input 
                      type="number"
                      value={limitPrice}
                      onChange={(e) => setLimitPrice(e.target.value)}
                      placeholder="Price in USDT"
                    />
                  </div>
                )}

                <Button 
                  className="w-full"
                  onClick={handleAdvancedTrade}
                  disabled={isProcessing || !tradeAmount}
                >
                  Place {orderType.replace('_', ' ')} Order
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={order.side === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                            {order.side.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{order.tokenSymbol}</span>
                        </div>
                        <Badge variant="outline">{order.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div>Amount: {order.amount}</div>
                        <div>Type: {order.type}</div>
                        {order.price && <div>Price: ${order.price}</div>}
                        <div>Created: {order.created}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="oracles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {propertyOracles.map((oracle) => (
              <Card key={oracle.tokenSymbol}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold text-lg">{oracle.tokenSymbol}</div>
                    <Badge className="bg-green-100 text-green-700">
                      {oracle.confidence}% confidence
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold mb-2">
                    ${oracle.currentPrice.toLocaleString()}
                  </div>
                  <div className={`text-sm mb-3 ${oracle.priceChange24h > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {oracle.priceChange24h > 0 ? '+' : ''}{oracle.priceChange24h}% (24h)
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>Updated: {oracle.lastUpdate}</div>
                    <div>Sources: {oracle.sources.join(', ')}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Total TVL</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  ${ammPools.reduce((sum, pool) => sum + pool.totalLiquidity, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">+12.5% vs last week</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">24h Volume</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  ${ammPools.reduce((sum, pool) => sum + pool.volume24h, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">+8.2% vs yesterday</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Fees Generated</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  ${ammPools.reduce((sum, pool) => sum + pool.fees24h, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Last 24 hours</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Active Traders</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">2,847</div>
                <div className="text-sm text-muted-foreground">+15.3% vs last week</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
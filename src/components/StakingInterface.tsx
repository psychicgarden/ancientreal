import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { 
  PiggyBank, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown, 
  Wallet, 
  Clock,
  Zap,
  Shield,
  DollarSign,
  BarChart3
} from "lucide-react";

export const StakingInterface = () => {
  const { isConnected, connectWallet, usdtBalance } = useWallet();
  const { toast } = useToast();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [stakedBalance, setStakedBalance] = useState(12500); // Demo balance
  const [currentAPY, setCurrentAPY] = useState(8.2);
  const [dailyYield, setDailyYield] = useState(2.85);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Demo transaction history
  const [transactions] = useState([
    { type: "deposit", amount: 5000, date: "2024-01-28", status: "completed" },
    { type: "yield", amount: 15.50, date: "2024-01-27", status: "completed" },
    { type: "deposit", amount: 2500, date: "2024-01-25", status: "completed" },
    { type: "yield", amount: 12.30, date: "2024-01-24", status: "completed" },
    { type: "withdraw", amount: 1000, date: "2024-01-22", status: "completed" }
  ]);

  const handleDeposit = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive"
      });
      return;
    }

    setIsDepositing(true);
    
    try {
      // Simulate deposit transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStakedBalance(prev => prev + parseFloat(depositAmount));
      setDepositAmount("");
      
      toast({
        title: "Deposit Successful",
        description: `Deposited $${parseFloat(depositAmount).toLocaleString()} USDT to Ancient Savings`,
      });
    } catch (error) {
      toast({
        title: "Deposit Failed",
        description: "Unable to process deposit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (!withdrawAmount || amount <= 0 || amount > stakedBalance) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive"
      });
      return;
    }

    setIsWithdrawing(true);
    
    try {
      // Simulate withdrawal transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStakedBalance(prev => prev - amount);
      setWithdrawAmount("");
      
      toast({
        title: "Withdrawal Successful",
        description: `Withdrawn $${amount.toLocaleString()} USDT from Ancient Savings`,
      });
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

  const projectedYearlyEarnings = stakedBalance * (currentAPY / 100);
  const projectedMonthlyEarnings = projectedYearlyEarnings / 12;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Staking Interface */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Balance Overview */}
          <Card className="bg-gradient-card border-accent/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Ancient Savings</CardTitle>
                  <CardDescription>Ultra-liquid staking with guaranteed returns</CardDescription>
                </div>
                <PiggyBank className="w-8 h-8 text-gold" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Staked Balance</div>
                  <div className="text-3xl font-bold text-gold">${stakedBalance.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">USDT</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Current APY</div>
                  <div className="text-3xl font-bold text-green-500">{currentAPY}%</div>
                  <div className="text-xs text-green-400">↗ Trending up</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Daily Yield</div>
                  <div className="text-3xl font-bold text-primary">${dailyYield}</div>
                  <div className="text-xs text-muted-foreground">Last 24h</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deposit/Withdraw Interface */}
          <Card className="bg-gradient-card border-accent/20">
            <CardHeader>
              <CardTitle>Manage Your Savings</CardTitle>
              <CardDescription>Deposit or withdraw USDT instantly</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="deposit" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="deposit" className="flex items-center gap-2">
                    <ArrowUp className="w-4 h-4" />
                    Deposit
                  </TabsTrigger>
                  <TabsTrigger value="withdraw" className="flex items-center gap-2">
                    <ArrowDown className="w-4 h-4" />
                    Withdraw
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="deposit" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Deposit Amount (USDT)</label>
                    <Input
                      type="number"
                      placeholder="Enter amount to deposit"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="text-lg"
                    />
                    <div className="text-xs text-muted-foreground">
                      Available: ${isConnected ? (usdtBalance || "0") : "Connect wallet"}
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">Projected Earnings</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground">Monthly</div>
                        <div className="font-semibold text-green-500">
                          ${depositAmount ? ((parseFloat(depositAmount) * currentAPY / 100) / 12).toFixed(2) : "0.00"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Yearly</div>
                        <div className="font-semibold text-green-500">
                          ${depositAmount ? ((parseFloat(depositAmount) * currentAPY / 100)).toFixed(2) : "0.00"}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleDeposit} 
                    className="w-full" 
                    size="lg"
                    disabled={isDepositing || !depositAmount}
                  >
                    {isDepositing ? "Processing..." : isConnected ? "Deposit to Ancient Savings" : "Connect Wallet"}
                  </Button>
                </TabsContent>
                
                <TabsContent value="withdraw" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Withdrawal Amount (USDT)</label>
                    <Input
                      type="number"
                      placeholder="Enter amount to withdraw"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="text-lg"
                    />
                    <div className="text-xs text-muted-foreground">
                      Available: ${stakedBalance.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <div className="text-sm font-medium">Instant Withdrawal</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Funds available immediately in your wallet
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleWithdraw} 
                    variant="outline"
                    className="w-full" 
                    size="lg"
                    disabled={isWithdrawing || !withdrawAmount}
                  >
                    {isWithdrawing ? "Processing..." : "Withdraw from Ancient Savings"}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Key Features */}
          <Card className="bg-gradient-card border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg">Key Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-500" />
                <div>
                  <div className="text-sm font-medium">Instant Liquidity</div>
                  <div className="text-xs text-muted-foreground">Withdraw anytime</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-sm font-medium">Risk-Free Yield</div>
                  <div className="text-xs text-muted-foreground">Guaranteed returns</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-sm font-medium">Daily Compounding</div>
                  <div className="text-xs text-muted-foreground">Maximize growth</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transfer to Investment */}
          <Card className="bg-gradient-card border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg">Ready to Invest?</CardTitle>
              <CardDescription>
                Use your savings for property down payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full mb-3" asChild>
                <a href="/investor">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Browse Properties
                </a>
              </Button>
              <div className="text-xs text-muted-foreground text-center">
                Minimum $30k down payment required
              </div>
            </CardContent>
          </Card>

          {/* Projected Earnings */}
          <Card className="bg-gradient-card border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg">Projected Earnings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monthly</span>
                <span className="font-semibold text-green-500">${projectedMonthlyEarnings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Yearly</span>
                <span className="font-semibold text-green-500">${projectedYearlyEarnings.toFixed(2)}</span>
              </div>
              <Progress value={(currentAPY / 15) * 100} className="h-2" />
              <div className="text-xs text-muted-foreground text-center">
                {currentAPY}% APY • Top tier yield
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transaction History */}
      <Card className="mt-8 bg-gradient-card border-accent/20">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your Ancient Savings transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((tx, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    tx.type === 'deposit' ? 'bg-green-500' : 
                    tx.type === 'withdraw' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <div className="text-sm font-medium capitalize">{tx.type}</div>
                    <div className="text-xs text-muted-foreground">{tx.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${
                    tx.type === 'withdraw' ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {tx.type === 'withdraw' ? '-' : '+'}${tx.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">USDT</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
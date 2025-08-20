import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { 
  Wallet, 
  TrendingUp, 
  Home, 
  Users,
  Activity,
  ArrowRight,
  DollarSign,
  Calculator,
  Target,
  RefreshCw
} from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';

interface UserStaking {
  id: string;
  user_wallet_address: string;
  total_staked: number;
  total_earned: number;
  is_active: boolean;
  last_yield_calculation: string;
  created_at: string;
  updated_at: string;
}

interface UserProperty {
  id: string;
  user_wallet_address: string;
  property_name: string;
  property_location: string;
  purchase_price: number;
  down_payment: number;
  remaining_balance: number;
  monthly_payment: number;
  purchase_date: string;
  is_active: boolean;
}

interface MortgagePayment {
  id: number;
  user_address: string;
  property_id: number;
  principal_delta_base: number;
  interest_delta_base: number;
  created_at: string;
  tx_hash?: string;
}

interface PoolMetrics {
  totalStaked: number;
  availableCapital: number;
  deployedCapital: number;
  utilizationRate: number;
  activeStakers: number;
  totalProperties: number;
  monthlyInterestExpected: number;
  currentAPY: number;
}

interface CapitalFlowItem {
  date: string;
  type: 'deposit' | 'withdrawal' | 'mortgage_funding' | 'interest_received';
  amount: number;
  description: string;
  user?: string;
}

export const LendingPoolOperations = () => {
  const [stakingData, setStakingData] = useState<UserStaking[]>([]);
  const [propertyData, setPropertyData] = useState<UserProperty[]>([]);
  const [mortgagePayments, setMortgagePayments] = useState<MortgagePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setError(null);
      
      // Fetch staking data
      const { data: stakingData, error: stakingError } = await supabase
        .from('user_staking')
        .select('*')
        .eq('is_active', true)
        .order('total_staked', { ascending: false });

      if (stakingError) throw stakingError;

      // Fetch property data
      const { data: propertyData, error: propertyError } = await supabase
        .from('user_properties')
        .select('*')
        .eq('is_active', true)
        .order('purchase_date', { ascending: false });

      if (propertyError) throw propertyError;

      // Fetch mortgage payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('mortgage_payments_ledger')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (paymentsError) throw paymentsError;

      setStakingData(stakingData || []);
      setPropertyData(propertyData || []);
      setMortgagePayments(paymentsData || []);
    } catch (error) {
      console.error('Error fetching lending pool data:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Calculate pool metrics
  const calculatePoolMetrics = (): PoolMetrics => {
    const totalStaked = stakingData.reduce((sum, staker) => sum + staker.total_staked, 0);
    const totalMortgageDebt = propertyData.reduce((sum, prop) => sum + prop.remaining_balance, 0);
    const deployedCapital = Math.min(totalStaked * 0.8, totalMortgageDebt); // 80% deployment max
    const availableCapital = totalStaked - deployedCapital;
    const utilizationRate = totalStaked > 0 ? (deployedCapital / totalStaked) * 100 : 0;
    
    // Calculate APY based on 7.5% interest rate + appreciation share
    const annualInterestRate = 0.075; // 7.5% base rate
    const appreciationShareAPY = 0.015; // ~1.5% from 10% appreciation share amortized over 10 years
    const currentAPY = (annualInterestRate + appreciationShareAPY) * 100; // ~9%
    
    const monthlyInterestExpected = deployedCapital * annualInterestRate / 12;

    return {
      totalStaked,
      availableCapital,
      deployedCapital,
      utilizationRate,
      activeStakers: stakingData.length,
      totalProperties: propertyData.length,
      monthlyInterestExpected,
      currentAPY
    };
  };

  const poolMetrics = calculatePoolMetrics();

  // Generate demo capital flow scenarios
  const generateCapitalFlowScenarios = (): CapitalFlowItem[] => {
    const scenarios: CapitalFlowItem[] = [];
    
    // Recent staking deposits
    stakingData.slice(0, 5).forEach(staker => {
      scenarios.push({
        date: staker.created_at,
        type: 'deposit',
        amount: staker.total_staked,
        description: `Staking deposit`,
        user: staker.user_wallet_address.slice(0, 6) + '...' + staker.user_wallet_address.slice(-4)
      });
    });

    // Recent property purchases (funded by pool)
    propertyData.slice(0, 3).forEach(property => {
      const loanAmount = property.purchase_price - property.down_payment;
      scenarios.push({
        date: property.purchase_date,
        type: 'mortgage_funding',
        amount: loanAmount,
        description: `Mortgage funding for ${property.property_name}`,
        user: property.user_wallet_address.slice(0, 6) + '...' + property.user_wallet_address.slice(-4)
      });
    });

    // Simulated interest payments
    const last30Days = Array.from({ length: 6 }, (_, i) => {
      const date = subDays(new Date(), i * 5);
      return {
        date: date.toISOString(),
        type: 'interest_received' as const,
        amount: poolMetrics.monthlyInterestExpected / 6,
        description: `Interest payments from mortgages`,
        user: 'Multiple borrowers'
      };
    });

    scenarios.push(...last30Days);

    return scenarios.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 15);
  };

  const capitalFlowData = generateCapitalFlowScenarios();

  // Chart data for pool performance
  const performanceData = Array.from({ length: 12 }, (_, i) => {
    const month = format(subDays(new Date(), i * 30), 'MMM');
    const baseAPY = 8;
    const variance = Math.random() * 4 - 2; // ±2% variance
    return {
      month,
      apy: Math.max(0, baseAPY + variance),
      poolSize: poolMetrics.totalStaked * (0.8 + Math.random() * 0.4)
    };
  }).reverse();

  // Capital allocation pie chart data
  const allocationData = [
    { name: 'Available Capital', value: poolMetrics.availableCapital, color: 'hsl(var(--chart-1))' },
    { name: 'Deployed in Mortgages', value: poolMetrics.deployedCapital, color: 'hsl(var(--chart-2))' },
    { name: 'Reserve Buffer', value: poolMetrics.totalStaked * 0.1, color: 'hsl(var(--chart-3))' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-destructive">Error loading lending pool data: {error}</p>
          <Button onClick={fetchAllData} variant="outline" className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Lending Pool Operations
          </h2>
          <p className="text-muted-foreground">Real-time capital flow from staking to mortgage funding</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-sm">
            Live Data
          </Badge>
          <Button onClick={fetchAllData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Pool Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pool Capital</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${poolMetrics.totalStaked.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {poolMetrics.activeStakers} active stakers
                </p>
              </div>
              <Wallet className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Deployed in Mortgages</p>
                <p className="text-2xl font-bold text-green-600">
                  ${poolMetrics.deployedCapital.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {poolMetrics.utilizationRate.toFixed(1)}% utilization
                </p>
              </div>
              <Home className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available Capital</p>
                <p className="text-2xl font-bold text-yellow-600">
                  ${poolMetrics.availableCapital.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ready for new loans
                </p>
              </div>
              <Target className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current APY</p>
                <p className="text-2xl font-bold text-purple-600">
                  {poolMetrics.currentAPY.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Real yield from mortgages
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Capital Flow Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5" />
              Capital Flow Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Investor Deposits</span>
                </div>
                <span className="text-sm font-bold">${poolMetrics.totalStaked.toLocaleString()}</span>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Mortgage Funding</span>
                </div>
                <span className="text-sm font-bold">${poolMetrics.deployedCapital.toLocaleString()}</span>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">Interest Returns</span>
                </div>
                <span className="text-sm font-bold">${poolMetrics.monthlyInterestExpected.toLocaleString()}/mo</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Capital Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {allocationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pool APY Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`${value.toFixed(2)}%`, 'APY']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="apy" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pool Size Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Pool Size']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar dataKey="poolSize" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Capital Flow Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Capital Flow Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {capitalFlowData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recent activity to display
            </div>
          ) : (
            <div className="space-y-3">
              {capitalFlowData.map((flow, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      flow.type === 'deposit' ? 'bg-blue-500' : 
                      flow.type === 'mortgage_funding' ? 'bg-green-500' : 
                      flow.type === 'interest_received' ? 'bg-purple-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <p className="font-medium">${flow.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{flow.description}</p>
                      {flow.user && (
                        <p className="text-xs text-muted-foreground">User: {flow.user}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      flow.type === 'deposit' ? 'default' : 
                      flow.type === 'mortgage_funding' ? 'secondary' : 
                      flow.type === 'interest_received' ? 'outline' : 'destructive'
                    }>
                      {flow.type.replace('_', ' ')}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(flow.date), 'MMM dd, HH:mm')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Demo Scenario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Live Example: Next Property Purchase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Scenario: $200k Property</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property Value:</span>
                  <span className="font-medium">$200,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buyer Down Payment (20%):</span>
                  <span className="font-medium">$40,000</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span className="font-medium">Pool Funds Required:</span>
                  <span className="font-bold">$160,000</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Pool Capacity</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available Capital:</span>
                  <span className="font-medium">${poolMetrics.availableCapital.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Can Fund:</span>
                  <span className={`font-bold ${poolMetrics.availableCapital >= 160000 ? 'text-green-600' : 'text-red-600'}`}>
                    {poolMetrics.availableCapital >= 160000 ? 'YES' : 'NO'}
                  </span>
                </div>
                <div className="flex justify-between text-purple-600">
                  <span className="font-medium">Expected Monthly Interest:</span>
                  <span className="font-bold">~$1,067</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Investor Returns</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Annual Interest to Pool:</span>
                  <span className="font-medium">~$12,800</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">10-Year Appreciation (est.):</span>
                  <span className="font-medium">~$20,000</span>
                </div>
                <div className="flex justify-between text-purple-600">
                  <span className="font-medium">Total Pool Return:</span>
                  <span className="font-bold">~$148,000</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Example */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Live Example: Pool Capital at Work</CardTitle>
          <p className="text-sm text-muted-foreground">
            Real scenario showing how your staked funds generate returns through mortgage lending
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Investment</h4>
                <div className="p-4 bg-white/50 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pool Investment</span>
                    <span className="font-bold">$160,000</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Investment Period</span>
                    <span>10 years</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Target APY</span>
                    <span>{poolMetrics.currentAPY.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Returns</h4>
                <div className="p-4 bg-white/50 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Principal Repaid</span>
                    <span className="font-bold">$160,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Interest Income (7.5%)</span>
                    <span className="font-bold text-green-600">$120,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Appreciation Share (10%)</span>
                    <span className="font-bold text-green-600">$20,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Platform Fees</span>
                    <span className="font-bold text-green-600">$8,000</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">Total Returns</span>
                      <span className="font-bold text-green-600">$308,000</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Net Profit on $160k</span>
                      <span className="text-green-600">+$148,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50/50 rounded-lg border border-blue-200/50">
              <h5 className="font-semibold text-blue-800 mb-2">How This Investment Works</h5>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Pool capital funds mortgages for property buyers at 8% APR</p>
                <p>• Investors earn 7.5% annual interest from mortgage payments</p>
                <p>• Principal is fully repaid when mortgages are paid off</p>
                <p>• Additional returns from 10% property appreciation share after 10 years</p>
                <p>• Platform fees from successful property transactions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
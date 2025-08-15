import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Users,
  Activity,
  Percent
} from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';

interface PlatformFeeData {
  id: string;
  user_wallet_address: string;
  fee_amount_usd: number;
  fee_percentage: number;
  payment_status: string;
  created_at: string;
  property_value_usd: number;
}

interface DailyFeeData {
  date: string;
  totalFees: number;
  transactionCount: number;
}

export const PlatformAnalytics = () => {
  const [platformFees, setPlatformFees] = useState<PlatformFeeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlatformFees();
  }, []);

  const fetchPlatformFees = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('platform_fees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPlatformFees(data || []);
    } catch (error) {
      console.error('Error fetching platform fees:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Calculate key metrics
  const totalFeesCollected = platformFees
    .filter(fee => fee.payment_status === 'completed')
    .reduce((sum, fee) => sum + fee.fee_amount_usd, 0);

  const totalFeesPending = platformFees
    .filter(fee => fee.payment_status === 'pending')
    .reduce((sum, fee) => sum + fee.fee_amount_usd, 0);

  const totalTransactions = platformFees.length;
  const averageFeePerTransaction = totalTransactions > 0 ? totalFeesCollected / totalTransactions : 0;

  // Get last 30 days data
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), i));
    return format(date, 'yyyy-MM-dd');
  }).reverse();

  const dailyFeeData: DailyFeeData[] = last30Days.map(date => {
    const dayFees = platformFees.filter(fee => 
      fee.payment_status === 'completed' && 
      format(new Date(fee.created_at), 'yyyy-MM-dd') === date
    );
    
    return {
      date: format(new Date(date), 'MMM dd'),
      totalFees: dayFees.reduce((sum, fee) => sum + fee.fee_amount_usd, 0),
      transactionCount: dayFees.length
    };
  });

  // Calculate growth metrics
  const last7DaysFees = platformFees
    .filter(fee => {
      const feeDate = new Date(fee.created_at);
      const sevenDaysAgo = subDays(new Date(), 7);
      return feeDate >= sevenDaysAgo && fee.payment_status === 'completed';
    })
    .reduce((sum, fee) => sum + fee.fee_amount_usd, 0);

  const prev7DaysFees = platformFees
    .filter(fee => {
      const feeDate = new Date(fee.created_at);
      const fourteenDaysAgo = subDays(new Date(), 14);
      const sevenDaysAgo = subDays(new Date(), 7);
      return feeDate >= fourteenDaysAgo && feeDate < sevenDaysAgo && fee.payment_status === 'completed';
    })
    .reduce((sum, fee) => sum + fee.fee_amount_usd, 0);

  const weeklyGrowthRate = prev7DaysFees > 0 ? 
    ((last7DaysFees - prev7DaysFees) / prev7DaysFees) * 100 : 0;

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
          <p className="text-destructive">Error loading platform analytics: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Platform Fee Analytics
          </h2>
          <p className="text-muted-foreground">Real-time platform revenue tracking</p>
        </div>
        <Badge variant="outline" className="text-sm">
          Live Data
        </Badge>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Fees Collected</p>
                <p className="text-2xl font-bold text-green-600">
                  ${totalFeesCollected.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Fees</p>
                <p className="text-2xl font-bold text-yellow-600">
                  ${totalFeesPending.toLocaleString()}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold text-blue-600">{totalTransactions}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Fee/Transaction</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${averageFeePerTransaction.toFixed(0)}
                </p>
              </div>
              <Percent className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Weekly Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className={`text-3xl font-bold ${
                weeklyGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {weeklyGrowthRate >= 0 ? '+' : ''}{weeklyGrowthRate.toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">vs. previous week</p>
              <div className="mt-2 text-sm">
                <span className="text-muted-foreground">This week: </span>
                <span className="font-medium">${last7DaysFees.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Unique Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {new Set(platformFees.map(fee => fee.user_wallet_address)).size}
              </div>
              <p className="text-sm text-muted-foreground">total platform users</p>
              <div className="mt-2 text-sm">
                <span className="text-muted-foreground">Avg fees per user: </span>
                <span className="font-medium">
                  ${(totalFeesCollected / Math.max(new Set(platformFees.map(fee => fee.user_wallet_address)).size, 1)).toFixed(0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Platform Fees (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyFeeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`$${value}`, 'Platform Fees']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Bar dataKey="totalFees" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Volume Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyFeeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [value, 'Transactions']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="transactionCount" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Platform Fee Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {platformFees.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No platform fees recorded yet
            </div>
          ) : (
            <div className="space-y-3">
              {platformFees.slice(0, 10).map((fee) => (
                <div key={fee.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      fee.payment_status === 'completed' ? 'bg-green-500' : 
                      fee.payment_status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium">${fee.fee_amount_usd.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {fee.user_wallet_address.slice(0, 6)}...{fee.user_wallet_address.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      fee.payment_status === 'completed' ? 'default' : 
                      fee.payment_status === 'pending' ? 'secondary' : 'destructive'
                    }>
                      {fee.payment_status}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(fee.created_at), 'MMM dd, HH:mm')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
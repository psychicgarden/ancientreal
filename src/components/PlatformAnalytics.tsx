import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, CheckCircle2, ExternalLink, FileText, ShieldCheck } from "lucide-react";
import { getExplorerTxUrl } from "@/lib/utils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface TransactionRow {
  id: string;
  transaction_hash: string;
  amount: number;
  transaction_type: string;
  status: string;
  created_at: string;
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--destructive))"];

export function PlatformAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Market Overview Data
  const [totalMarketValue, setTotalMarketValue] = useState(0);
  const [availableProperties, setAvailableProperties] = useState(0);
  const [averageROI, setAverageROI] = useState(0);
  const [totalActiveInvestors, setTotalActiveInvestors] = useState(0);

  // Platform Health Metrics
  const [monthlyVolume, setMonthlyVolume] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [platformReliability, setPlatformReliability] = useState(0);
  const [avgInvestmentSize, setAvgInvestmentSize] = useState(0);

  // Market Trends
  const [propertyTrends, setPropertyTrends] = useState<{ month: string; avgPrice: number; volume: number }[]>([]);
  const [locationPerformance, setLocationPerformance] = useState<{ location: string; avgROI: number; count: number }[]>([]);
  
  // Recent Market Activity
  const [marketActivity, setMarketActivity] = useState<TransactionRow[]>([]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get total market value from all available properties
        const { data: allProperties, error: propsError } = await supabase
          .from("property_fractionalization")
          .select("current_speculation_price,is_active,property_location,tokens_sold,total_tokens_available,monthly_base_rent,original_purchase_price");
        if (propsError) throw propsError;

        const activeProperties = (allProperties || []).filter((p: any) => p.is_active);
        const totalValue = activeProperties.reduce((sum: number, p: any) => sum + Number(p.current_speculation_price || 0), 0);
        setTotalMarketValue(totalValue);
        setAvailableProperties(activeProperties.length);

        // Calculate average ROI based on rental yield
        const avgROI = activeProperties.length > 0 
          ? activeProperties.reduce((sum: number, p: any) => {
              const monthlyRent = Number(p.monthly_base_rent || 0);
              const propertyValue = Number(p.current_speculation_price || p.original_purchase_price || 1);
              const annualROI = (monthlyRent * 12 / propertyValue) * 100;
              return sum + annualROI;
            }, 0) / activeProperties.length
          : 0;
        setAverageROI(avgROI);

        // Get total active investors
        const { data: investorsData, error: investorsError } = await supabase
          .from("fractional_investments")
          .select("investor_wallet_address")
          .eq("status", "active");
        if (investorsError) throw investorsError;
        
        const uniqueInvestors = new Set((investorsData || []).map((i: any) => i.investor_wallet_address));
        setTotalActiveInvestors(uniqueInvestors.size);

        // Calculate monthly platform volume
        const currentMonth = new Date();
        const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        
        const { data: monthlyTransactions, error: monthlyError } = await supabase
          .from("user_transactions")
          .select("amount,created_at")
          .gte("created_at", firstDayOfMonth.toISOString())
          .eq("status", "completed");
        if (monthlyError) throw monthlyError;

        const monthlyVol = (monthlyTransactions || []).reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);
        setMonthlyVolume(monthlyVol);
        setTransactionCount((monthlyTransactions || []).length);

        // Calculate average investment size
        if (transactionCount > 0) {
          setAvgInvestmentSize(monthlyVol / transactionCount);
        }

        // Platform reliability from payment history
        const { data: paymentData, error: paymentError } = await supabase
          .from("payment_history")
          .select("status");
        if (paymentError) throw paymentError;

        const completedPayments = (paymentData || []).filter((p: any) => p.status === "completed").length;
        const totalPayments = (paymentData || []).length;
        setPlatformReliability(totalPayments > 0 ? (completedPayments / totalPayments) * 100 : 100);

        // Property trends over time
        const { data: historicalData, error: historicalError } = await supabase
          .from("user_transactions")
          .select("amount,created_at,transaction_type")
          .eq("status", "completed")
          .order("created_at", { ascending: true });
        if (historicalError) throw historicalError;

        // Group by month for trends
        const trendsByMonth: Record<string, { total: number; count: number }> = {};
        (historicalData || []).forEach((t: any) => {
          const date = new Date(t.created_at);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          if (!trendsByMonth[monthKey]) {
            trendsByMonth[monthKey] = { total: 0, count: 0 };
          }
          trendsByMonth[monthKey].total += Number(t.amount || 0);
          trendsByMonth[monthKey].count += 1;
        });

        const trends = Object.entries(trendsByMonth)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([month, data]) => ({
            month: month,
            avgPrice: data.count > 0 ? data.total / data.count : 0,
            volume: data.total
          }));
        setPropertyTrends(trends);

        // Location performance analysis
        const locationStats: Record<string, { totalROI: number; count: number }> = {};
        activeProperties.forEach((p: any) => {
          const location = p.property_location || "Unknown";
          const monthlyRent = Number(p.monthly_base_rent || 0);
          const propertyValue = Number(p.current_speculation_price || p.original_purchase_price || 1);
          const roi = (monthlyRent * 12 / propertyValue) * 100;
          
          if (!locationStats[location]) {
            locationStats[location] = { totalROI: 0, count: 0 };
          }
          locationStats[location].totalROI += roi;
          locationStats[location].count += 1;
        });

        const locationPerf = Object.entries(locationStats)
          .map(([location, stats]) => ({
            location,
            avgROI: stats.count > 0 ? stats.totalROI / stats.count : 0,
            count: stats.count
          }))
          .sort((a, b) => b.avgROI - a.avgROI);
        setLocationPerformance(locationPerf);

        // Recent significant market activity
        const { data: recentActivity, error: activityError } = await supabase
          .from("user_transactions")
          .select("id,transaction_hash,amount,transaction_type,status,created_at")
          .eq("status", "completed")
          .gte("amount", 1000) // Only significant transactions
          .order("created_at", { ascending: false })
          .limit(8);
        if (activityError) throw activityError;
        setMarketActivity((recentActivity as any) || []);

      } catch (e: any) {
        console.error("Platform Analytics Error:", e);
        setError(e.message || "Failed to load platform analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  // Market insights calculations
  const marketGrowthRate = useMemo(() => {
    if (propertyTrends.length < 2) return 0;
    const recent = propertyTrends.slice(-3);
    const older = propertyTrends.slice(-6, -3);
    if (recent.length === 0 || older.length === 0) return 0;
    
    const recentAvg = recent.reduce((sum, t) => sum + t.volume, 0) / recent.length;
    const olderAvg = older.reduce((sum, t) => sum + t.volume, 0) / older.length;
    
    return olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;
  }, [propertyTrends]);

  const topPerformingLocation = useMemo(() => {
    return locationPerformance.length > 0 ? locationPerformance[0] : null;
  }, [locationPerformance]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Loading platform analytics...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center text-destructive">
            {error}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Market Intelligence Dashboard</h2>
        <p className="text-muted-foreground">
          Real-time market insights and platform performance metrics to guide your investment strategy.
        </p>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Market Value</CardTitle>
            <CardDescription>All available properties combined</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">${totalMarketValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            <div className="text-sm text-muted-foreground mt-2">{availableProperties} properties available</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Market ROI</CardTitle>
            <CardDescription>Platform-wide rental yield</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{averageROI.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground mt-2">Annual rental yield</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Investors</CardTitle>
            <CardDescription>Unique wallet addresses investing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{totalActiveInvestors}</div>
            <div className="text-sm text-muted-foreground mt-2">Across all properties</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Reliability</CardTitle>
            <CardDescription>Payment processing success rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{platformReliability.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground mt-2">Transaction success</div>
          </CardContent>
        </Card>
      </div>

      {/* Market Activity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Volume</CardTitle>
            <CardDescription>Current month transaction volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">${monthlyVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            <div className="text-sm text-muted-foreground mt-2">{transactionCount} transactions</div>
            <div className="text-sm text-muted-foreground">Avg: ${avgInvestmentSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Growth</CardTitle>
            <CardDescription>3-month volume trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-emerald-600">
              {marketGrowthRate > 0 ? '+' : ''}{marketGrowthRate.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground mt-2">Quarterly growth</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Location</CardTitle>
            <CardDescription>Highest performing market</CardDescription>
          </CardHeader>
          <CardContent>
            {topPerformingLocation ? (
              <>
                <div className="text-lg font-semibold">{topPerformingLocation.location}</div>
                <div className="text-2xl font-bold text-emerald-600">{topPerformingLocation.avgROI.toFixed(1)}% ROI</div>
                <div className="text-sm text-muted-foreground">{topPerformingLocation.count} properties</div>
              </>
            ) : (
              <div className="text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Market Trends and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Market Volume Trends</CardTitle>
                <CardDescription>Monthly transaction volume over time</CardDescription>
              </div>
              <BarChart3 className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={propertyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'volume' ? `$${Number(value).toLocaleString()}` : `$${Number(value).toLocaleString()}`,
                      name === 'volume' ? 'Volume' : 'Avg Price'
                    ]}
                  />
                  <Bar dataKey="volume" fill="hsl(var(--primary))" name="volume" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Performance</CardTitle>
            <CardDescription>ROI by geographic market</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {locationPerformance.slice(0, 5).map((location, index) => (
                <div key={location.location} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{location.location}</div>
                    <div className="text-sm text-muted-foreground">{location.count} properties</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-emerald-600">{location.avgROI.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">Avg ROI</div>
                  </div>
                </div>
              ))}
              {locationPerformance.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No location data available yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Market Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Significant Market Activity</CardTitle>
              <CardDescription>Recent high-value transactions ($1,000+)</CardDescription>
            </div>
            <Activity className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Verification</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketActivity.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="whitespace-nowrap text-sm">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm capitalize">
                      {tx.transaction_type.replace('_', ' ')}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800">
                        {tx.status}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right text-sm font-semibold">
                      ${Number(tx.amount || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {tx.transaction_hash ? (
                        <a 
                          href={getExplorerTxUrl(tx.transaction_hash)} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-primary underline inline-flex items-center gap-1 hover:text-primary/80"
                        >
                          Verify <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Pending</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {marketActivity.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No recent significant market activity
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
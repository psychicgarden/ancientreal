
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, BarChart3, PieChart, Calendar, Target } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { supabase } from "@/integrations/supabase/client";
import { calculateMortgageMetrics, calculatePortfolioMetrics, MortgageData } from "@/lib/mortgageCalculations";
import { fromBase } from "@/lib/money";

interface EnhancedPortfolioAnalyticsProps {
  // This component will fetch its own data directly from the database
}

export const EnhancedPortfolioAnalytics: React.FC<EnhancedPortfolioAnalyticsProps> = () => {
  const { isConnected, account } = useWallet();
  const [mortgageProperties, setMortgageProperties] = useState<any[]>([]);
  const [fractionalInvestments, setFractionalInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!isConnected || !account) {
        setLoading(false);
        return;
      }

      try {
        // Fetch mortgage properties
        const { data: userProperties, error: mortgageError } = await supabase
          .from('user_properties')
          .select('*')
          .eq('user_wallet_address', account.toLowerCase())
          .eq('is_active', true);

        if (mortgageError) throw mortgageError;

        // Fetch fractional investments
        const { data: fractionalData, error: fractionalError } = await supabase
          .from('fractional_investments')
          .select(`
            *,
            property_fractionalization (
              property_name,
              property_location,
              current_speculation_price,
              monthly_base_rent
            )
          `)
          .eq('investor_wallet_address', account.toLowerCase())
          .eq('status', 'active');

        if (fractionalError) throw fractionalError;

        setMortgageProperties(userProperties || []);
        setFractionalInvestments(fractionalData || []);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();

    // Real-time subscriptions
    const propertiesChannel = supabase
      .channel('user_properties_analytics')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_properties',
        filter: `user_wallet_address=eq.${account?.toLowerCase()}`
      }, () => fetchPortfolioData())
      .subscribe();

    const fractionalChannel = supabase
      .channel('fractional_investments_analytics')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'fractional_investments',
        filter: `investor_wallet_address=eq.${account?.toLowerCase()}`
      }, () => fetchPortfolioData())
      .subscribe();

    return () => {
      supabase.removeChannel(propertiesChannel);
      supabase.removeChannel(fractionalChannel);
    };
  }, [isConnected, account]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-8 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Calculate real mortgage metrics
  const mortgageMetrics = mortgageProperties.map(property => {
    const mortgageData: MortgageData = {
      loanAmountBase: BigInt(property.loan_amount_base || 0),
      principalPaidBase: BigInt(property.principal_paid_base || 0),
      interestPaidBase: BigInt(property.interest_paid_base || 0),
      aprBps: Number(property.apr_bps || 800),
      termMonths: Number(property.term_months || 120),
      purchaseDate: property.purchase_date
    };
    const purchasePrice = property.purchase_price_base ? 
      fromBase(property.purchase_price_base) : 
      Number(property.purchase_price || 0);
    
    return {
      ...property,
      metrics: calculateMortgageMetrics(mortgageData, purchasePrice),
      purchasePrice
    };
  });

  // Calculate portfolio totals using real data
  const portfolioData = mortgageMetrics.reduce((acc, property) => {
    return {
      totalInvestment: acc.totalInvestment + property.purchasePrice,
      totalEquity: acc.totalEquity + property.metrics.equityBuilt,
      totalDebt: acc.totalDebt + property.metrics.remainingBalance,
      totalMonthlyPayment: acc.totalMonthlyPayment + property.metrics.monthlyPayment,
      totalPrincipalPaid: acc.totalPrincipalPaid + property.metrics.paidBalance,
      totalInterestPaid: acc.totalInterestPaid + property.metrics.totalInterestPaid
    };
  }, {
    totalInvestment: 0,
    totalEquity: 0,
    totalDebt: 0,
    totalMonthlyPayment: 0,
    totalPrincipalPaid: 0,
    totalInterestPaid: 0
  });

  // Add fractional investment values
  const totalFractionalInvestment = fractionalInvestments.reduce((sum, inv) => sum + inv.investment_amount, 0);
  const currentFractionalValue = fractionalInvestments.reduce((sum, inv) => {
    const currentPrice = inv.property_fractionalization?.current_speculation_price || inv.original_property_price;
    return sum + (currentPrice * inv.ownership_percentage / 100);
  }, 0);

  const totalCurrentValue = portfolioData.totalInvestment + (currentFractionalValue - totalFractionalInvestment);
  const totalGain = portfolioData.totalEquity + (currentFractionalValue - totalFractionalInvestment);
  const totalROI = portfolioData.totalInvestment > 0 ? (totalGain / portfolioData.totalInvestment) * 100 : 0;

  // Calculate annual yield based on monthly rental income from fractional properties
  const monthlyRentalIncome = fractionalInvestments.reduce((sum, inv) => {
    const baseRent = inv.property_fractionalization?.monthly_base_rent || 0;
    return sum + (baseRent * inv.ownership_percentage / 100);
  }, 0);

  const annualIncome = monthlyRentalIncome * 12;
  const yieldPercentage = portfolioData.totalInvestment > 0 ? (annualIncome / portfolioData.totalInvestment) * 100 : 0;

  // Portfolio composition data
  const allProperties = [
    ...mortgageMetrics.map(property => ({
      property: property.property_name,
      owned: property.metrics.ownershipPercentage,
      total: 100,
      value: property.purchasePrice,
      type: 'mortgage' as const
    })),
    ...fractionalInvestments.map(investment => ({
      property: investment.property_fractionalization?.property_name || 'Unknown Property',
      owned: investment.ownership_percentage,
      total: 100,
      value: investment.property_fractionalization?.current_speculation_price || investment.original_property_price,
      type: 'fractional' as const
    }))
  ];

  // Analytics calculations
  const analytics = {
    equityBuilt: portfolioData.totalEquity,
    diversificationScore: Math.min(95, 30 + (allProperties.length * 15)),
    riskLevel: allProperties.length >= 3 ? 'Low' : allProperties.length >= 2 ? 'Medium' : 'High',
    averageTimeToPayoff: mortgageMetrics.length > 0 
      ? mortgageMetrics.reduce((sum, p) => sum + p.metrics.remainingMonths, 0) / mortgageMetrics.length / 12
      : 0,
    projectedValue5Years: totalCurrentValue * 1.65
  };

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Total ROI</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {totalROI.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">
              ${totalGain.toLocaleString()} gain
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Annual Yield</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {yieldPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">
              ${annualIncome.toLocaleString()}/year
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Equity Built</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              ${analytics.equityBuilt.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Principal payments
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Diversification</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {analytics.diversificationScore}%
            </div>
            <div className="text-sm text-muted-foreground">
              Risk score: {analytics.riskLevel}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Portfolio Composition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allProperties.length > 0 ? allProperties.map((property, index) => {
              const ownershipPercent = property.owned;
              const propertyValue = (property.value * property.owned) / 100;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{property.property}</div>
                      <div className="text-sm text-muted-foreground">
                        {property.owned.toFixed(1)}% ownership • ${propertyValue.toLocaleString()} value
                      </div>
                    </div>
                    <Badge variant={ownershipPercent === 100 ? "default" : "secondary"}>
                      {ownershipPercent === 100 ? "Fully Owned" : `${ownershipPercent.toFixed(0)}% Owned`}
                    </Badge>
                  </div>
                  <Progress value={ownershipPercent} className="h-2" />
                </div>
              );
            }) : (
              <div className="text-center py-8 text-muted-foreground">
                No properties in portfolio yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Financial Projections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Mortgage Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time to Full Ownership</span>
                <span className="font-semibold">{analytics.averageTimeToPayoff.toFixed(1)} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Payment Total</span>
                <span className="font-semibold">${portfolioData.totalMonthlyPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Remaining Principal</span>
                <span className="font-semibold">${(portfolioData.totalInvestment - analytics.equityBuilt).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              5-Year Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Projected Value</span>
                <span className="font-semibold text-green-600">
                  ${analytics.projectedValue5Years.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Appreciation</span>
                <span className="font-semibold text-green-600">
                  ${(analytics.projectedValue5Years - totalCurrentValue).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">5-Year ROI</span>
                <span className="font-semibold text-green-600">
                  {(((analytics.projectedValue5Years - portfolioData.totalInvestment) / portfolioData.totalInvestment) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Income Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Income Sources Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 font-semibold">Monthly Rental Income</div>
              <div className="text-2xl font-bold">${monthlyRentalIncome.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">
                ${(monthlyRentalIncome * 12).toLocaleString()} annually
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 font-semibold">Equity Building</div>
              <div className="text-2xl font-bold">${analytics.equityBuilt.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">
                From principal payments
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-purple-600 font-semibold">Property Appreciation</div>
              <div className="text-2xl font-bold">${totalGain.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">
                Current unrealized gains
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

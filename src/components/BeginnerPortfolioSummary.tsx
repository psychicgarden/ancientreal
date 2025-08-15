import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, DollarSign, Home, Building, Target } from "lucide-react";
import { InvestorTierStatus } from "./InvestorTierStatus";

import { useWallet } from "@/contexts/WalletContext";
import { supabase } from "@/integrations/supabase/client";

interface PortfolioSummaryProps {
  userProperties?: any[];
  developerInvestments?: any[];
  loading?: boolean;
}

export const BeginnerPortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  userProperties: propUserProperties,
  developerInvestments: propDeveloperInvestments,
  loading: propLoading
}) => {
  const { isConnected, account } = useWallet();
  const [userProperties, setUserProperties] = useState<any[]>([]);
  const [developerInvestments, setDeveloperInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Use props if provided, otherwise fetch data
  const actualUserProperties = propUserProperties || userProperties;
  const actualDeveloperInvestments = propDeveloperInvestments || developerInvestments;
  const actualLoading = propLoading !== undefined ? propLoading : loading;

  // Fetch data only if not provided via props
  useEffect(() => {
    if (propUserProperties && propDeveloperInvestments) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      if (!isConnected || !account) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch user properties
        const { data: properties } = await supabase
          .from('user_properties')
          .select('*')
          .eq('user_wallet_address', account.toLowerCase())
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        // Fetch developer investments
        const { data: investments } = await supabase
          .from('developer_investments')
          .select(`
            *,
            developer_projects (
              title,
              description,
              creator_name,
              target_funding,
              current_funding,
              image_url
            )
          `)
          .eq('user_wallet_address', account.toLowerCase())
          .order('created_at', { ascending: false });

        setUserProperties(properties || []);
        setDeveloperInvestments(investments || []);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isConnected, account, propUserProperties, propDeveloperInvestments]);

  // Deduplicate properties by unique purchase key
  const uniqueUserProperties = useMemo(() => {
    const map = new Map<string, any>();
    for (const p of actualUserProperties) {
      const key = p.unique_purchase_key || `${p.property_name}|${p.property_location}`;
      const existing = map.get(key);
      if (!existing) {
        map.set(key, p);
      } else {
        const a = new Date(existing.updated_at || existing.created_at || 0).getTime();
        const b = new Date(p.updated_at || p.created_at || 0).getTime();
        if (b >= a) map.set(key, p);
      }
    }
    return Array.from(map.values());
  }, [actualUserProperties]);

  // Calculate real portfolio metrics
  const portfolioData = useMemo(() => {
    const propertyInvestment = uniqueUserProperties.reduce((sum, prop) => sum + (prop.down_payment || 0), 0);
    const developerInvestment = actualDeveloperInvestments.reduce((sum, inv) => sum + (inv.investment_amount || 0), 0);
    const totalInvested = propertyInvestment + developerInvestment;
    
    const propertyCurrentValue = uniqueUserProperties.reduce((sum, prop) => sum + (prop.current_value || 0), 0);
    const developerCurrentValue = actualDeveloperInvestments.reduce((sum, inv) => sum + (inv.projected_value || inv.investment_amount || 0), 0);
    const totalValue = propertyCurrentValue + developerCurrentValue;
    
    const totalGains = totalValue - totalInvested;
    const monthlyIncome = Math.round(uniqueUserProperties.reduce((sum, prop) => sum + ((prop.monthly_payment || 0) * 0.7), 0)); // Rental income minus mortgage

    return {
      totalValue,
      totalInvested,
      totalGains,
      monthlyIncome,
      properties: uniqueUserProperties.map(prop => ({
        name: prop.property_name,
        value: prop.current_value || 0,
        equity: ((prop.current_value || 0) * (prop.equity_percentage || 0)) / 100,
        monthlyReturn: (prop.monthly_payment || 0) * 0.7
      })),
      developerInvestments: actualDeveloperInvestments.map(inv => ({
        name: inv.developer_projects?.title || 'Development Project',
        invested: inv.investment_amount || 0,
        projectedValue: inv.projected_value || inv.investment_amount || 0,
        ownershipPercent: inv.ownership_percentage || 0
      }))
    };
  }, [uniqueUserProperties, actualDeveloperInvestments]);

  const totalReturn = portfolioData.totalInvested > 0 ? ((portfolioData.totalValue - portfolioData.totalInvested) / portfolioData.totalInvested) * 100 : 0;
  const yearlyIncome = portfolioData.monthlyIncome * 12;
  const roi = portfolioData.totalInvested > 0 ? (yearlyIncome / portfolioData.totalInvested) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Your Portfolio Summary</h2>
        <p className="text-muted-foreground">Track your investments and earnings growth</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Portfolio</p>
                <p className="text-2xl font-bold">${portfolioData.totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Gains</p>
                <p className="text-2xl font-bold text-green-600">+${portfolioData.totalGains.toLocaleString()}</p>
                <p className="text-xs text-green-600">+{totalReturn.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Income</p>
                <p className="text-2xl font-bold text-blue-600">${portfolioData.monthlyIncome.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">${Math.round(yearlyIncome).toLocaleString()}/year</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Annual ROI</p>
                <p className="text-2xl font-bold text-purple-600">{roi.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Return on Investment</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ancient Investor Tier Status */}
      <InvestorTierStatus totalInvestmentAmount={portfolioData.totalInvested} />

      {/* Loading state */}
      {actualLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Mortgage Properties */}
          {portfolioData.properties.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Your Mortgage Properties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioData.properties.map((property, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{property.name || 'Property Investment'}</div>
                        <div className="text-sm text-muted-foreground">
                          ${property.equity.toLocaleString()} equity built
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${property.value.toLocaleString()}</div>
                        <div className="text-sm text-green-600">
                          +${Math.round(property.monthlyReturn)}/month net
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Developer Investments */}
          {portfolioData.developerInvestments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Development Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioData.developerInvestments.map((investment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{investment.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {investment.ownershipPercent}% ownership
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${investment.projectedValue.toLocaleString()}</div>
                        <div className="text-sm text-blue-600">
                          ${investment.invested.toLocaleString()} invested
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}


    </div>
  );
};
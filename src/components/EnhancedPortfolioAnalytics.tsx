import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, BarChart3, PieChart, Calendar, Target } from "lucide-react";

interface PortfolioData {
  totalInvestment: number;
  currentValue: number;
  availableProfits: number;
  activeProperties: number;
  monthlyIncome: number;
}

interface EnhancedPortfolioAnalyticsProps {
  portfolioData: PortfolioData;
}

export const EnhancedPortfolioAnalytics: React.FC<EnhancedPortfolioAnalyticsProps> = ({ 
  portfolioData 
}) => {
  const totalGain = portfolioData.currentValue - portfolioData.totalInvestment;
  const totalROI = (totalGain / portfolioData.totalInvestment) * 100;
  const annualIncome = portfolioData.monthlyIncome * 12;
  const yieldPercentage = (annualIncome / portfolioData.totalInvestment) * 100;

  // Mock additional analytics data
  const analytics = {
    equityBuilt: 45000,
    appreciationGain: totalGain - 45000,
    diversificationScore: 85,
    riskLevel: 'Medium',
    timeToFullOwnership: '7.2 years',
    projectedValue5Years: portfolioData.currentValue * 1.65,
    capTable: [
      { property: 'Bahia Loft', owned: 100, total: 100, value: 165000 },
      { property: 'Tulum Penthouse', owned: 45, total: 100, value: 190000 },
      { property: 'Santorini Apartment', owned: 38, total: 100, value: 178000 }
    ]
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
            {analytics.capTable.map((property, index) => {
              const ownershipPercent = (property.owned / property.total) * 100;
              const propertyValue = (property.value * property.owned) / 100;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{property.property}</div>
                      <div className="text-sm text-muted-foreground">
                        {property.owned}% ownership • ${propertyValue.toLocaleString()} value
                      </div>
                    </div>
                    <Badge variant={ownershipPercent === 100 ? "default" : "secondary"}>
                      {ownershipPercent === 100 ? "Fully Owned" : `${ownershipPercent.toFixed(0)}% Owned`}
                    </Badge>
                  </div>
                  <Progress value={ownershipPercent} className="h-2" />
                </div>
              );
            })}
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
                <span className="font-semibold">{analytics.timeToFullOwnership}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Payment Total</span>
                <span className="font-semibold">${portfolioData.monthlyIncome.toLocaleString()}</span>
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
                  ${(analytics.projectedValue5Years - portfolioData.currentValue).toLocaleString()}
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
              <div className="text-green-600 font-semibold">Rental Income</div>
              <div className="text-2xl font-bold">${(portfolioData.monthlyIncome * 0.7).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">70% of total income</div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 font-semibold">Appreciation</div>
              <div className="text-2xl font-bold">${(portfolioData.monthlyIncome * 0.2).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">20% of total income</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-purple-600 font-semibold">Yield Farming</div>
              <div className="text-2xl font-bold">${(portfolioData.monthlyIncome * 0.1).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">10% of total income</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
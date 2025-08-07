import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, DollarSign, Home, Coins, Target, Clock } from "lucide-react";
import { InvestorTierStatus } from "./InvestorTierStatus";

export const BeginnerPortfolioSummary = () => {
  // Mock data - in real app this would come from props or API
  const portfolioData = {
    totalValue: 75000,
    totalInvested: 50000,
    totalGains: 25000,
    monthlyIncome: 625,
    properties: [
      { name: "Beachfront Villa", value: 30000, tokens: 30, monthlyReturn: 300 },
      { name: "Jungle Resort", value: 22500, tokens: 30, monthlyReturn: 225 },
      { name: "Desert Oasis", value: 22500, tokens: 45, monthlyReturn: 100 }
    ],
    stakingPools: [
      { name: "High-Yield Pool", staked: 15000, apy: 15, monthlyReturn: 187.50 },
      { name: "Stable Pool", staked: 10000, apy: 8, monthlyReturn: 66.67 }
    ],
    activeLoans: [
      { amount: 15000, monthlyPayment: 1285, remainingMonths: 11 }
    ]
  };

  const totalReturn = ((portfolioData.totalValue - portfolioData.totalInvested) / portfolioData.totalInvested) * 100;
  const yearlyIncome = portfolioData.monthlyIncome * 12;
  const roi = (yearlyIncome / portfolioData.totalInvested) * 100;

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
                <p className="text-2xl font-bold text-blue-600">${portfolioData.monthlyIncome}</p>
                <p className="text-xs text-muted-foreground">${yearlyIncome.toLocaleString()}/year</p>
              </div>
              <Coins className="h-8 w-8 text-blue-600" />
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

      {/* Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Your Property Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolioData.properties.map((property, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{property.name}</div>
                  <div className="text-sm text-muted-foreground">{property.tokens} tokens owned</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${property.value.toLocaleString()}</div>
                  <div className="text-sm text-green-600">+${property.monthlyReturn}/month</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Staking Positions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Staking Positions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolioData.stakingPools.map((pool, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{pool.name}</div>
                  <div className="text-sm text-muted-foreground">{pool.apy}% APY</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${pool.staked.toLocaleString()}</div>
                  <div className="text-sm text-green-600">+${pool.monthlyReturn.toFixed(2)}/month</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Loans */}
      {portfolioData.activeLoans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Active Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolioData.activeLoans.map((loan, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Loan Amount: ${loan.amount.toLocaleString()}</span>
                    <Badge variant="outline">{loan.remainingMonths} months left</Badge>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Monthly Payment: ${loan.monthlyPayment.toLocaleString()}</span>
                    <span>Remaining: ${(loan.monthlyPayment * loan.remainingMonths).toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={((12 - loan.remainingMonths) / 12) * 100} 
                    className="mt-2 h-2" 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 border rounded-lg text-center">
              <Home className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Buy More Tokens</div>
              <div className="text-xs text-muted-foreground">Expand your portfolio</div>
            </div>
            <div className="p-3 border rounded-lg text-center">
              <Coins className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className="text-sm font-medium">Increase Staking</div>
              <div className="text-xs text-muted-foreground">Boost passive income</div>
            </div>
            <div className="p-3 border rounded-lg text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className="text-sm font-medium">Compound Returns</div>
              <div className="text-xs text-muted-foreground">Reinvest earnings</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
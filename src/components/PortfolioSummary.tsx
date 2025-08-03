import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CashOutModal } from "./CashOutModal";
import { TrendingUp, DollarSign, Home, Repeat } from "lucide-react";

interface PortfolioSummaryProps {
  portfolioData?: {
    totalInvestment: number;
    currentValue: number;
    availableProfits: number;
    activeProperties: number;
    monthlyIncome: number;
  };
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ 
  portfolioData = {
    totalInvestment: 150000,
    currentValue: 187500,
    availableProfits: 37500,
    activeProperties: 3,
    monthlyIncome: 2850
  }
}) => {
  const [showCashOut, setShowCashOut] = useState(false);

  const totalGain = portfolioData.currentValue - portfolioData.totalInvestment;
  const totalROI = (totalGain / portfolioData.totalInvestment) * 100;

  return (
    <>
      <div className="space-y-6">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Total Investment</span>
              </div>
              <div className="text-2xl font-bold">${portfolioData.totalInvestment.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Initial capital</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Current Value</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                ${portfolioData.currentValue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                +${totalGain.toLocaleString()} ({totalROI.toFixed(1)}%)
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Active Properties</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {portfolioData.activeProperties}
              </div>
              <div className="text-sm text-muted-foreground">Generating income</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Repeat className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Monthly Income</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                ${portfolioData.monthlyIncome.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                ${(portfolioData.monthlyIncome * 12).toLocaleString()}/year
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Profits Section */}
        <Card className="bg-gradient-to-r from-green-50/50 to-primary/5 border-green-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Available Profits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">
                  ${portfolioData.availableProfits.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Ready for withdrawal or reinvestment
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Profit Available
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button 
                variant="outline"
                onClick={() => setShowCashOut(true)}
                className="h-12 border-green-500/30 text-green-700 hover:bg-green-50"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Cash Out (5% fee applies)
              </Button>
              
              <Button 
                className="h-12 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  // TODO: Navigate to investment options
                  console.log("Reinvesting profits");
                }}
              >
                <Repeat className="h-4 w-4 mr-2" />
                Reinvest (No fees)
              </Button>
            </div>

            <div className="bg-green-50/50 border border-green-200 rounded-lg p-3">
              <div className="text-sm text-green-800">
                <strong>💡 Smart Move:</strong> Reinvesting your ${portfolioData.availableProfits.toLocaleString()} profits 
                saves you ${(portfolioData.availableProfits * 0.05).toLocaleString()} in platform fees while continuing to earn returns.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cash Out Modal */}
      <CashOutModal
        open={showCashOut}
        onOpenChange={setShowCashOut}
        availableBalance={portfolioData.availableProfits}
        portfolioValue={portfolioData.currentValue}
      />
    </>
  );
};
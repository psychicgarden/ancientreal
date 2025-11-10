import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { calculateScenario, ScenarioInputs } from "@/lib/revenueScenarios";
import { TrendingUp, DollarSign, Percent } from "lucide-react";

export const SensitivityDashboard: React.FC = () => {
  const [apr, setApr] = useState(11.5);
  const [cashRate, setCashRate] = useState(20);
  const [termYears, setTermYears] = useState(15);

  const inputs: ScenarioInputs = {
    apr,
    cashPurchaseRate: cashRate / 100,
    totalUnits: 112,
    avgPropertyPrice: 143000,
    platformFeeRate: 0.035,
    termYears,
    appreciationRate: 0.07,
    samShare: 0.30,
  };

  const result = calculateScenario(inputs, "Custom Scenario");

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
      <CardContent className="p-8">
        <div className="mb-6">
          <Badge variant="outline" className="mb-3">Interactive Analysis</Badge>
          <h3 className="text-3xl font-bold mb-2">Sensitivity Dashboard</h3>
          <p className="text-muted-foreground">
            Adjust APR and cash purchase rate to see real-time revenue impact
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* APR Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Percent className="w-5 h-5 text-primary" />
                <span className="font-semibold">Mortgage APR</span>
              </div>
              <span className="text-2xl font-bold text-primary">{apr.toFixed(1)}%</span>
            </div>
            <Slider
              value={[apr]}
              onValueChange={(value) => setApr(value[0])}
              min={6}
              max={14}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>6%</span>
              <span>14%</span>
            </div>
          </div>

          {/* Cash Purchase Rate Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="font-semibold">Cash Purchase Rate</span>
              </div>
              <span className="text-2xl font-bold text-primary">{cashRate}%</span>
            </div>
            <Slider
              value={[cashRate]}
              onValueChange={(value) => setCashRate(value[0])}
              min={10}
              max={40}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10%</span>
              <span>40%</span>
            </div>
          </div>

          {/* Mortgage Term Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="font-semibold">Mortgage Term</span>
              </div>
              <span className="text-2xl font-bold text-primary">{termYears}y</span>
            </div>
            <Slider
              value={[termYears]}
              onValueChange={(value) => setTermYears(value[0])}
              min={7}
              max={20}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>7 years</span>
              <span>20 years</span>
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="bg-background/50 rounded-lg p-6 border border-border/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">15-Year Total Revenue</div>
              <div className="text-2xl font-bold text-primary">
                ${result.totalRevenue.toFixed(2)}M
              </div>
              <div className="text-xs text-muted-foreground mt-1">Fees + Interest + SAM</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">IRR</div>
              <div className="text-2xl font-bold">
                {result.irr.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Cash Multiple</div>
              <div className="text-2xl font-bold">
                {result.cashMultiple.toFixed(1)}×
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Appreciation (30% SAM)</div>
              <div className="text-2xl font-bold">
                ${result.appreciationShare.toFixed(2)}M
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm mb-4">
            <div className="bg-background/80 rounded p-3">
              <div className="text-muted-foreground mb-1">Platform Fees</div>
              <div className="font-semibold">${result.platformFees.toFixed(2)}M</div>
            </div>
            <div className="bg-background/80 rounded p-3">
              <div className="text-muted-foreground mb-1">Mortgage Interest</div>
              <div className="font-semibold">${result.mortgageInterest.toFixed(2)}M</div>
            </div>
            <div className="bg-background/80 rounded p-3">
              <div className="text-muted-foreground mb-1">Total Loan Amount</div>
              <div className="font-semibold">${result.totalLoanAmount.toFixed(2)}M</div>
            </div>
          </div>
          
          <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
            <div className="text-xs font-medium text-muted-foreground mb-1">
              Note: Construction Profit (${result.constructionProfit.toFixed(2)}M) shown separately in Development Flywheel
            </div>
            <div className="text-xs text-muted-foreground">
              This dashboard shows 15-year financial revenue only: Platform Fees + Mortgage Interest + Appreciation Share
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold text-foreground">Analysis: </span>
              <span className="text-muted-foreground">
                {termYears <= 10 
                  ? "Shorter terms accelerate IRR and liquidity but increase monthly payments. Best for buyers with strong cash flow."
                  : termYears >= 18
                  ? "Longer terms improve affordability but delay appreciation capture. Monthly payment: $" + Math.round(result.avgMonthlyPayment) + "."
                  : "Balanced term. IRR: " + result.irr.toFixed(1) + "%. Monthly payment: $" + Math.round(result.avgMonthlyPayment) + "."
                }
                {apr >= 10 && termYears >= 15
                  ? " Higher APR with longer term balances revenue well."
                  : apr < 8 && termYears <= 10
                  ? " Lower APR with shorter term optimizes for faster liquidity."
                  : ""
                }
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

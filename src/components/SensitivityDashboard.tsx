import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { calculateScenario, ScenarioInputs } from "@/lib/revenueScenarios";
import { TrendingUp, DollarSign, Percent } from "lucide-react";

export const SensitivityDashboard: React.FC = () => {
  const [apr, setApr] = useState(8);
  const [cashRate, setCashRate] = useState(20);

  const inputs: ScenarioInputs = {
    apr,
    cashPurchaseRate: cashRate / 100,
    totalUnits: 112,
    avgPropertyPrice: 143000,
    platformFeeRate: 0.035,
    termYears: 15,
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

        <div className="grid md:grid-cols-2 gap-8 mb-8">
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
              <span>6% (Very Competitive)</span>
              <span>14% (High Rate)</span>
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
              <span>10% (Mostly Financed)</span>
              <span>40% (High Cash)</span>
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="bg-background/50 rounded-lg p-6 border border-border/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Revenue</div>
              <div className="text-2xl font-bold text-primary">
                ${result.totalRevenue.toFixed(2)}M
              </div>
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
              <div className="text-sm text-muted-foreground mb-1">Interest Revenue</div>
              <div className="text-2xl font-bold">
                ${result.mortgageInterest.toFixed(2)}M
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-background/80 rounded p-3">
              <div className="text-muted-foreground mb-1">Financed Units</div>
              <div className="font-semibold">{result.financedUnits} units</div>
            </div>
            <div className="bg-background/80 rounded p-3">
              <div className="text-muted-foreground mb-1">Cash Units</div>
              <div className="font-semibold">{result.cashUnits} units</div>
            </div>
            <div className="bg-background/80 rounded p-3">
              <div className="text-muted-foreground mb-1">Total Loan Amount</div>
              <div className="font-semibold">${result.totalLoanAmount.toFixed(2)}M</div>
            </div>
            <div className="bg-background/80 rounded p-3">
              <div className="text-muted-foreground mb-1">Avg Monthly Payment</div>
              <div className="font-semibold">${Math.round(result.avgMonthlyPayment)}</div>
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
                {apr < 8 
                  ? "Lower rates increase affordability but reduce interest revenue. Consider buyer acquisition cost."
                  : apr > 11
                  ? "Higher rates maximize revenue but may price out buyers. Monitor sales velocity carefully."
                  : "Balanced rate optimizes for both revenue and market appeal."
                }
                {cashRate < 20
                  ? " Low cash requirement maximizes accessibility."
                  : cashRate > 30
                  ? " High cash requirement de-risks but shrinks buyer pool."
                  : " Moderate cash balance provides steady capital."
                }
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { calculateMortgageOnlyScenario, ScenarioInputs } from "@/lib/revenueScenarios";
import { TrendingUp, DollarSign, Percent, Home } from "lucide-react";

export const MortgageOnlySensitivityDashboard: React.FC = () => {
  const [apr, setApr] = useState(8);
  const [cashRate, setCashRate] = useState(20);
  const [termYears, setTermYears] = useState(15);

  const inputs: ScenarioInputs = {
    apr,
    cashPurchaseRate: cashRate / 100,
    totalUnits: 112,
    avgPropertyPrice: 143000,
    platformFeeRate: 0.035,
    termYears,
    appreciationRate: 0.07, // Not used in mortgage-only
    samShare: 0, // No SAM
  };

  const result = calculateMortgageOnlyScenario(inputs, "Mortgage-Only");

  const getRecommendation = () => {
    if (apr >= 10 && cashRate >= 30) {
      return "Conservative model with higher APR and cash rates. Strong interest revenue with minimal appreciation risk exposure.";
    } else if (apr <= 7 && cashRate <= 15) {
      return "Buyer-friendly rates maximize adoption. Lower revenue compensated by higher volume potential.";
    } else if (termYears <= 10) {
      return "Accelerated payback period improves IRR. Consider for cash-focused strategy.";
    } else {
      return "Balanced mortgage model. Provides steady interest income without SAM complexity.";
    }
  };

  return (
    <Card className="w-full border-border/50 shadow-lg">
      <CardContent className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Home className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                Mortgage-Only Model
              </h2>
            </div>
            <Badge variant="outline" className="text-base px-4 py-2 border-primary/50">
              No SAM - Buyer Owns 100% Appreciation
            </Badge>
          </div>
          <p className="text-muted-foreground text-lg">
            Traditional mortgage financing without shared appreciation. Revenue from platform fees and mortgage interest only.
          </p>
        </div>

        {/* Interactive Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* APR Control */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">
                Mortgage APR
              </label>
              <span className="text-2xl font-bold text-primary">{apr}%</span>
            </div>
            <Slider
              value={[apr]}
              onValueChange={(value) => setApr(value[0])}
              min={5}
              max={12}
              step={0.5}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5%</span>
              <span>12%</span>
            </div>
          </div>

          {/* Cash Purchase Rate */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">
                Cash Purchase Rate
              </label>
              <span className="text-2xl font-bold text-primary">{cashRate}%</span>
            </div>
            <Slider
              value={[cashRate]}
              onValueChange={(value) => setCashRate(value[0])}
              min={10}
              max={40}
              step={5}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10%</span>
              <span>40%</span>
            </div>
          </div>

          {/* Term Years */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">
                Mortgage Term
              </label>
              <span className="text-2xl font-bold text-primary">{termYears}Y</span>
            </div>
            <Slider
              value={[termYears]}
              onValueChange={(value) => setTermYears(value[0])}
              min={10}
              max={30}
              step={5}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10Y</span>
              <span>30Y</span>
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card/50 p-6 rounded-lg border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
            </div>
            <p className="text-3xl font-bold text-foreground">
              ${result.totalRevenue.toFixed(2)}M
            </p>
          </div>

          <div className="bg-card/50 p-6 rounded-lg border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">IRR</p>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {result.irr.toFixed(1)}%
            </p>
          </div>

          <div className="bg-card/50 p-6 rounded-lg border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">Cash Multiple</p>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {result.cashMultiple.toFixed(1)}x
            </p>
          </div>

          <div className="bg-card/50 p-6 rounded-lg border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">Interest Revenue</p>
            </div>
            <p className="text-3xl font-bold text-foreground">
              ${result.mortgageInterest.toFixed(2)}M
            </p>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-muted/30 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Revenue Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Platform Fees (3.5%)</span>
              <span className="font-semibold text-foreground">
                ${result.platformFees.toFixed(2)}M
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Mortgage Interest ({apr}% APR)</span>
              <span className="font-semibold text-foreground">
                ${result.mortgageInterest.toFixed(2)}M
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-border">
              <span className="text-muted-foreground">Appreciation Share (0% SAM)</span>
              <span className="font-semibold text-foreground">$0.00M</span>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Strategy Insight
          </h3>
          <p className="text-muted-foreground">{getRecommendation()}</p>
        </div>

        {/* Investment Summary */}
        <div className="mt-8 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10 border-2 border-primary/40 rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
            <DollarSign className="h-7 w-7 text-primary" />
            Investment Summary ({termYears} Years)
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {/* Initial Investment */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Initial Investment
              </p>
              <p className="text-3xl font-bold text-foreground">
                $3.00M
              </p>
            </div>

            {/* Total Revenue */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Total Revenue
              </p>
              <p className="text-3xl font-bold text-primary">
                ${result.totalRevenue.toFixed(2)}M
              </p>
            </div>

            {/* Net Profit */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Net Profit
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                ${(result.totalRevenue - 3.0).toFixed(2)}M
              </p>
            </div>

            {/* IRR */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                IRR
              </p>
              <p className="text-3xl font-bold text-foreground">
                {result.irr.toFixed(1)}%
              </p>
            </div>

            {/* Cash Multiple */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Cash Multiple (ROI)
              </p>
              <p className="text-3xl font-bold text-foreground">
                {result.cashMultiple.toFixed(2)}x
              </p>
            </div>

            {/* Total Return */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Total Return
              </p>
              <p className="text-3xl font-bold text-primary">
                {(((result.totalRevenue / 3.0) - 1) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Note */}
        <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border/30">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> This model removes the 30% SAM component. 
            Buyers own 100% of property appreciation, which may increase adoption rates but reduces platform revenue by approximately 50% compared to the SAM model.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

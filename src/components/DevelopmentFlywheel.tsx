import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateDevelopmentFlywheel } from "@/lib/revenueScenarios";
import { Building2, DollarSign, TrendingUp } from "lucide-react";

export const DevelopmentFlywheel: React.FC = () => {
  const flywheel = calculateDevelopmentFlywheel();

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
      <CardContent className="p-8">
        <div className="mb-6">
          <Badge variant="outline" className="mb-3">Operational Cash Flow</Badge>
          <h3 className="text-3xl font-bold mb-2">Development Flywheel</h3>
          <p className="text-muted-foreground">
            Self-funding development model across 6 locations (NOT included in 15-year IRR)
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-background/80 rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Construction Profit</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              ${(flywheel.totalConstructionProfit / 1_000_000).toFixed(2)}M
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Sale price − $75k build cost
            </div>
          </div>
          
          <div className="bg-background/80 rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Platform Fees</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              ${(flywheel.totalPlatformFees / 1_000_000).toFixed(2)}M
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              3.5% on all sales
            </div>
          </div>
          
          <div className="bg-background/80 rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Total Cash In</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              ${(flywheel.totalCashIn / 1_000_000).toFixed(2)}M
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Down payments + cash sales + fees
            </div>
          </div>
        </div>

        {/* Flip-by-Flip Breakdown */}
        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Flip-by-Flip Breakdown
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-3">Flip</th>
                  <th className="text-right py-2 px-3">Units</th>
                  <th className="text-right py-2 px-3">Build Cost</th>
                  <th className="text-right py-2 px-3">Gross Sales</th>
                  <th className="text-right py-2 px-3">Down Payments</th>
                  <th className="text-right py-2 px-3">Cash Sales</th>
                  <th className="text-right py-2 px-3">Platform Fees</th>
                  <th className="text-right py-2 px-3 font-semibold">Cash In</th>
                </tr>
              </thead>
              <tbody>
                {flywheel.flips.map((flip, idx) => (
                  <tr key={idx} className="border-b border-border/30 hover:bg-background/50">
                    <td className="py-3 px-3 font-medium">{flip.flip}</td>
                    <td className="text-right py-3 px-3">{flip.units}</td>
                    <td className="text-right py-3 px-3 text-muted-foreground">
                      ${(flip.buildCost / 1_000_000).toFixed(2)}M
                    </td>
                    <td className="text-right py-3 px-3">
                      ${(flip.grossSales / 1_000_000).toFixed(2)}M
                    </td>
                    <td className="text-right py-3 px-3">
                      ${(flip.downPayments / 1_000).toFixed(0)}K
                    </td>
                    <td className="text-right py-3 px-3">
                      ${(flip.cashSales / 1_000).toFixed(0)}K
                    </td>
                    <td className="text-right py-3 px-3">
                      ${(flip.platformFees / 1_000).toFixed(0)}K
                    </td>
                    <td className="text-right py-3 px-3 font-semibold text-primary">
                      ${(flip.totalCashIn / 1_000_000).toFixed(2)}M
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Important Note */}
        <div className="mt-6 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <div className="flex items-start gap-3">
            <div className="text-amber-500 text-lg mt-0.5">⚠️</div>
            <div className="text-sm">
              <span className="font-semibold text-foreground">Important: </span>
              <span className="text-muted-foreground">
                Construction profit is an <strong>operational metric</strong> that shows development viability 
                and cash-flow recycling across flips. It is <strong>NOT included</strong> in the 15-year financial revenue 
                or IRR calculations, which only track Platform Fees + Mortgage Interest + Appreciation Share.
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

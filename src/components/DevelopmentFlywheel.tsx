import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateDevelopmentFlywheel } from "@/lib/revenueScenarios";
import { Building2, DollarSign, TrendingUp, ArrowRight } from "lucide-react";

// Initial seed capital (Two-Pocket Model: DevCo only)
const INITIAL_SEED = 1.9; // $1.9M

export const DevelopmentFlywheel: React.FC = () => {
  const flywheel = calculateDevelopmentFlywheel();
  
  // Calculate running capital with Two-Pocket model
  // DevCo receives 100% gross sales from FinCo at closing
  let runningCapital = INITIAL_SEED;
  const flipsWithCapital = flywheel.flips.map((flip) => {
    const buildCostM = flip.buildCost / 1_000_000;
    const grossSalesM = flip.grossSales / 1_000_000;
    const netProfitM = grossSalesM - buildCostM;
    runningCapital = runningCapital + netProfitM;
    return {
      ...flip,
      grossSalesM,
      buildCostM,
      netProfitM,
      runningCapital,
    };
  });
  
  const finalCapital = runningCapital;

  return (
    <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
      <CardContent className="p-8">
        <div className="mb-6">
          <Badge variant="outline" className="mb-3 border-emerald-500/50 text-emerald-400">Two-Pocket Model</Badge>
          <h3 className="text-3xl font-bold mb-2">Development Flywheel</h3>
          <p className="text-muted-foreground">
            DevCo receives 100% gross sales from FinCo at closing. Capital compounds from $1.9M → ${finalCapital.toFixed(1)}M
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-background/80 rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-muted-foreground">Seed Capital</span>
            </div>
            <div className="text-2xl font-bold text-emerald-500">
              ${INITIAL_SEED.toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              DevCo only (VC-funded)
            </div>
          </div>

          <div className="bg-background/80 rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Gross Sales</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              ${(flywheel.totalGrossSales / 1_000_000).toFixed(2)}M
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              100% from FinCo at closing
            </div>
          </div>
          
          <div className="bg-background/80 rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-muted-foreground">Total Net Profit</span>
            </div>
            <div className="text-2xl font-bold text-emerald-500">
              ${((flywheel.totalGrossSales - flywheel.totalConstructionCost) / 1_000_000).toFixed(2)}M
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Gross Sales - Build Costs
            </div>
          </div>

          <div className="bg-background/80 rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">Final Capital</span>
            </div>
            <div className="text-2xl font-bold text-amber-500">
              ${finalCapital.toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {((finalCapital / INITIAL_SEED - 1) * 100).toFixed(0)}% growth
            </div>
          </div>
        </div>

        {/* Flip-by-Flip Breakdown */}
        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Flip-by-Flip Capital Compounding
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-3">Flip</th>
                  <th className="text-right py-2 px-3">Units</th>
                  <th className="text-right py-2 px-3">Build Cost</th>
                  <th className="text-right py-2 px-3">Gross Sales</th>
                  <th className="text-right py-2 px-3">Net Profit</th>
                  <th className="text-right py-2 px-3">Running Capital</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/30 bg-emerald-500/5">
                  <td className="py-3 px-3 font-medium">Start</td>
                  <td className="text-right py-3 px-3">-</td>
                  <td className="text-right py-3 px-3 text-muted-foreground">-</td>
                  <td className="text-right py-3 px-3">-</td>
                  <td className="text-right py-3 px-3">-</td>
                  <td className="text-right py-3 px-3 font-bold text-emerald-500">
                    ${INITIAL_SEED.toFixed(2)}M
                  </td>
                </tr>
                {flipsWithCapital.map((flip, idx) => (
                  <tr key={idx} className="border-b border-border/30 hover:bg-background/50">
                    <td className="py-3 px-3 font-medium">{flip.flip}</td>
                    <td className="text-right py-3 px-3">{flip.units}</td>
                    <td className="text-right py-3 px-3 text-muted-foreground">
                      ${flip.buildCostM.toFixed(2)}M
                    </td>
                    <td className="text-right py-3 px-3 font-semibold">
                      ${flip.grossSalesM.toFixed(2)}M
                    </td>
                    <td className="text-right py-3 px-3 text-emerald-500 font-semibold">
                      +${flip.netProfitM.toFixed(2)}M
                    </td>
                    <td className="text-right py-3 px-3 font-bold text-primary">
                      ${flip.runningCapital.toFixed(2)}M
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Two-Pocket Explanation */}
        <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="flex items-start gap-3">
            <div className="text-blue-400 text-lg mt-0.5">💡</div>
            <div className="text-sm">
              <span className="font-semibold text-foreground">Two-Pocket Model: </span>
              <span className="text-muted-foreground">
                <strong>DevCo</strong> (VC $1.9M) builds homes and receives 100% gross sales from <strong>FinCo</strong> at closing.{" "}
                <strong>FinCo</strong> (DeFi stakers at 7% yield) holds mortgages separately.
                This keeps DevCo capital velocity high (25%+ IRR) while mortgages are serviced by separate liquidity.
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

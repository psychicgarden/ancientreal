import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEED_PHASE, formatCurrency } from "@/lib/businessModelConstants";
import { Building2, DollarSign, TrendingUp, ArrowRight, AlertCircle } from "lucide-react";

export const DevelopmentFlywheel: React.FC = () => {
  // Seed-funded flips only (2 flips, 32 units)
  const seedFlips = [
    {
      flip: "Flip 1",
      location: "Peru",
      flag: "🇵🇪",
      units: SEED_PHASE.flip1.units,
      buildCostM: SEED_PHASE.flip1.buildCost,
      grossSalesM: SEED_PHASE.flip1.grossSales,
      netProfitM: SEED_PHASE.flip1.netProfit,
      runningCapital: SEED_PHASE.capital + SEED_PHASE.flip1.netProfit,
    },
    {
      flip: "Flip 2",
      location: "Brazil",
      flag: "🇧🇷",
      units: SEED_PHASE.flip2.units,
      buildCostM: SEED_PHASE.flip2.buildCost,
      grossSalesM: SEED_PHASE.flip2.grossSales,
      netProfitM: SEED_PHASE.flip2.netProfit,
      runningCapital: SEED_PHASE.finalCapital,
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
      <CardContent className="p-8">
        <div className="mb-6">
          <Badge variant="outline" className="mb-3 border-emerald-500/50 text-emerald-400">
            Seed-Funded Development
          </Badge>
          <h3 className="text-3xl font-bold mb-2">Development Flywheel</h3>
          <p className="text-muted-foreground">
            ${SEED_PHASE.capital}M seed capital → {SEED_PHASE.units} units across 2 flips → ~${SEED_PHASE.finalCapital.toFixed(1)}M final capital
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
              ${SEED_PHASE.capital}M
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              VC-funded (2 flips)
            </div>
          </div>

          <div className="bg-background/80 rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Gross Sales</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              ${SEED_PHASE.totalGrossSales.toFixed(2)}M
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {SEED_PHASE.units} units sold
            </div>
          </div>
          
          <div className="bg-background/80 rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-muted-foreground">Net Profit</span>
            </div>
            <div className="text-2xl font-bold text-emerald-500">
              ${SEED_PHASE.totalNetProfit.toFixed(2)}M
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              44% gross margin
            </div>
          </div>

          <div className="bg-background/80 rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">Final Capital</span>
            </div>
            <div className="text-2xl font-bold text-amber-500">
              ~${SEED_PHASE.finalCapital.toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round((SEED_PHASE.finalCapital / SEED_PHASE.capital - 1) * 100)}% growth
            </div>
          </div>
        </div>

        {/* Flip-by-Flip Breakdown */}
        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Seed-Funded Capital Compounding
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-3">Flip</th>
                  <th className="text-left py-2 px-3">Location</th>
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
                  <td className="py-3 px-3">—</td>
                  <td className="text-right py-3 px-3">-</td>
                  <td className="text-right py-3 px-3 text-muted-foreground">-</td>
                  <td className="text-right py-3 px-3">-</td>
                  <td className="text-right py-3 px-3">-</td>
                  <td className="text-right py-3 px-3 font-bold text-emerald-500">
                    ${SEED_PHASE.capital.toFixed(2)}M
                  </td>
                </tr>
                {seedFlips.map((flip, idx) => (
                  <tr key={idx} className="border-b border-border/30 hover:bg-background/50">
                    <td className="py-3 px-3 font-medium">{flip.flip}</td>
                    <td className="py-3 px-3">
                      <span className="mr-2">{flip.flag}</span>
                      {flip.location}
                    </td>
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

        {/* Platform Pivot */}
        <div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-start gap-3">
            <ArrowRight className="text-purple-400 w-5 h-5 mt-0.5" />
            <div>
              <span className="font-semibold text-purple-400">Platform Pivot (After Flip 2): </span>
              <span className="text-muted-foreground text-sm">
                Ancient stops building and becomes a pure protocol. ~${SEED_PHASE.finalCapital.toFixed(1)}M treasury + institutional capital 
                (MakerDAO, Centrifuge) enables financing of <span className="text-purple-400 font-medium">10,000+ partner units</span> without laying another brick.
              </span>
            </div>
          </div>
        </div>

        {/* VC Bridge Lender */}
        <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-400 w-5 h-5 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold text-blue-400">VC as Bridge Lender: </span>
              <span className="text-muted-foreground">
                Until institutional FinCo arrives (Month 18-24), VC seed capital acts as <span className="text-blue-400 font-medium">bridge lender earning 10% APR</span> on the 
                ${(SEED_PHASE.mortgages * 0.7 * 140000 / 1_000_000).toFixed(1)}M mortgage book. This replaces the "DeFi stakers at 7%" model with real, deployed capital.
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

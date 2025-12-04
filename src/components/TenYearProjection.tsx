import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, Building, Globe, Database, Rocket, AlertCircle } from "lucide-react";
import { TEN_YEAR_PROJECTION, SEED_PHASE, formatCurrency, getPhaseColor } from "@/lib/businessModelConstants";

const phaseLabels: Record<string, string> = {
  seed: "Seed Phase",
  platform: "Platform Phase",
  data: "Data Phase",
};

export default function TenYearProjection() {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-primary/50 text-primary">
            10-Year Strategic Roadmap
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            From <span className="text-blue-400">32 Proof Units</span> to <span className="text-green-400">10,000 Partner Units</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            $1.9M Seed → Platform Pivot → Global Credit Bureau
          </p>
        </div>

        {/* Phase Legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <Building className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">Seed Phase (Y1-2): 32 Units, VC-Funded</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <Globe className="h-5 w-5 text-purple-400" />
            <span className="text-sm text-purple-400 font-medium">Platform Phase (Y3-7): Partner-Driven</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
            <Database className="h-5 w-5 text-green-400" />
            <span className="text-sm text-green-400 font-medium">Data Phase (Y7-10): OCCR Licensing</span>
          </div>
        </div>

        {/* Institutional Capital Notice */}
        <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold text-amber-400">Platform Pivot Note: </span>
              <span className="text-muted-foreground">
                After 32 seed-funded units (Y1-2), Ancient stops building and becomes a pure protocol. 
                Y3+ projections require <span className="text-amber-400 font-medium">institutional capital deployment</span> (MakerDAO, Centrifuge, etc.) 
                targeted for Month 18-24.
              </span>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <Card className="bg-card/50 border-border/50 overflow-hidden">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Consolidated 10-Year Financial Model
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 bg-muted/20">
                    <TableHead className="font-bold text-foreground">Metric</TableHead>
                    {TEN_YEAR_PROJECTION.map((row) => {
                      const phaseColors = getPhaseColor(row.phase);
                      return (
                        <TableHead key={row.year} className="text-center min-w-[120px]">
                          <div className="space-y-1">
                            <div className="font-bold text-foreground">{row.year}</div>
                            <Badge className={`text-xs ${phaseColors.bg} ${phaseColors.text} ${phaseColors.border}`}>
                              {phaseLabels[row.phase]}
                            </Badge>
                            {row.funded === "institutional" && (
                              <div className="text-[10px] text-amber-400">Institutional</div>
                            )}
                          </div>
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Units Section */}
                  <TableRow className="border-border/30 bg-blue-500/5">
                    <TableCell className="font-semibold text-blue-400">Units Sold (Internal)</TableCell>
                    {TEN_YEAR_PROJECTION.map((row) => (
                      <TableCell key={row.year} className="text-center">
                        {row.internalUnits > 0 ? (
                          <span className="font-medium">{row.internalUnits}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-border/30 bg-purple-500/5">
                    <TableCell className="font-semibold text-purple-400">Units Financed (Partners)</TableCell>
                    {TEN_YEAR_PROJECTION.map((row) => (
                      <TableCell key={row.year} className="text-center">
                        {row.partnerUnits > 0 ? (
                          <span className="text-purple-400 font-medium">{row.partnerUnits.toLocaleString()}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-border/30 bg-muted/30">
                    <TableCell className="font-bold">Total GMV</TableCell>
                    {TEN_YEAR_PROJECTION.map((row) => (
                      <TableCell key={row.year} className="text-center font-bold text-primary">
                        {formatCurrency(row.gmv)}
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Revenue Section Header */}
                  <TableRow className="border-border/50 bg-muted/50">
                    <TableCell colSpan={7} className="font-bold text-lg text-foreground py-3">
                      REVENUE STREAMS
                    </TableCell>
                  </TableRow>

                  <TableRow className="border-border/30">
                    <TableCell className="text-muted-foreground">DevCo Profit (Flips)</TableCell>
                    {TEN_YEAR_PROJECTION.map((row) => (
                      <TableCell key={row.year} className="text-center">
                        {row.devCoProfit > 0 ? `$${row.devCoProfit}M` : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-border/30">
                    <TableCell className="text-muted-foreground">Origination Fees (3%)</TableCell>
                    {TEN_YEAR_PROJECTION.map((row) => (
                      <TableCell key={row.year} className="text-center">
                        ${row.originationFees}M
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-border/30 bg-purple-500/5">
                    <TableCell className="text-purple-400 font-semibold">Developer Fee (5%)</TableCell>
                    {TEN_YEAR_PROJECTION.map((row) => (
                      <TableCell key={row.year} className="text-center text-purple-400">
                        {row.developerFee > 0 ? `$${row.developerFee}M` : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-border/30">
                    <TableCell className="text-muted-foreground">Mortgage Spread (3% NIM)</TableCell>
                    {TEN_YEAR_PROJECTION.map((row) => (
                      <TableCell key={row.year} className="text-center">
                        ${row.mortgageSpread}M
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-border/30 bg-green-500/5">
                    <TableCell className="text-green-400 font-semibold">Data Licensing (OCCR)</TableCell>
                    {TEN_YEAR_PROJECTION.map((row) => (
                      <TableCell key={row.year} className="text-center text-green-400">
                        {row.dataLicensing > 0 ? `$${row.dataLicensing}M` : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-border/50 bg-primary/10">
                    <TableCell className="font-bold text-primary">TOTAL REVENUE</TableCell>
                    {TEN_YEAR_PROJECTION.map((row) => (
                      <TableCell key={row.year} className="text-center font-bold text-primary text-lg">
                        ${row.totalRevenue}M
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Valuation Section Header */}
                  <TableRow className="border-border/50 bg-muted/50">
                    <TableCell colSpan={7} className="font-bold text-lg text-foreground py-3">
                      VALUATION
                    </TableCell>
                  </TableRow>

                  <TableRow className="border-border/30">
                    <TableCell className="text-muted-foreground">Multiple Applied</TableCell>
                    {TEN_YEAR_PROJECTION.map((row) => (
                      <TableCell key={row.year} className="text-center">
                        <Badge variant="outline" className={row.multiple >= 15 ? "border-green-500/50 text-green-400" : "border-border/50"}>
                          {row.multiple}× {row.multiple <= 5 ? "(RE)" : "(Fintech)"}
                        </Badge>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-border/50 bg-gradient-to-r from-primary/10 to-green-500/10">
                    <TableCell className="font-bold text-lg">Enterprise Value</TableCell>
                    {TEN_YEAR_PROJECTION.map((row) => (
                      <TableCell key={row.year} className="text-center">
                        <span className={`font-bold text-lg ${row.valuation >= 1000 ? "text-green-400" : row.valuation >= 100 ? "text-primary" : "text-foreground"}`}>
                          {formatCurrency(row.valuation)}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Key Insight */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 rounded-xl border border-primary/30">
          <div className="flex items-start gap-4">
            <Rocket className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-xl mb-2">The Platform Pivot: Why Exit Value Stays High</h3>
              <p className="text-muted-foreground">
                <span className="text-blue-400 font-semibold">32 seed-funded units prove the rails work</span> (legal, technical, OCCR). 
                After Year 2, we <span className="text-purple-400 font-semibold">stop building and start licensing</span>. 
                Exit value comes from <span className="text-green-400 font-semibold">10,000 partner units</span> financed through our protocol—not from Ancient laying bricks.
                Less capital at risk, same (or higher) exit value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

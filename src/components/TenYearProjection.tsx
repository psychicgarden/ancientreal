import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, Building, Globe, Database, Rocket } from "lucide-react";
import { TEN_YEAR_PROJECTION, formatCurrency, getPhaseColor } from "@/lib/businessModelConstants";

// Filter to only show Y1, Y5, Y10 for condensed view
const CONDENSED_PROJECTION = TEN_YEAR_PROJECTION.filter(
  (row) => row.year === "Y1" || row.year === "Y5" || row.year === "Y10"
);

const phaseLabels: Record<string, string> = {
  seed: "Seed",
  platform: "Platform",
  data: "Data",
};

export default function TenYearProjection() {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-primary/50 text-primary">
            10-Year Trajectory
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-blue-400">32 Units</span> → <span className="text-purple-400">Protocol</span> → <span className="text-green-400">10,000 Partners</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            $1.9M Seed → Platform Pivot → Global Credit Bureau
          </p>
        </div>

        {/* Phase Legend - Compact */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <Building className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-blue-400 font-medium">Y1-2: Build</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <Globe className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-purple-400 font-medium">Y3-7: License</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
            <Database className="h-4 w-4 text-green-400" />
            <span className="text-xs text-green-400 font-medium">Y8-10: Data</span>
          </div>
        </div>

        {/* Condensed Table - Y1, Y5, Y10 only */}
        <Card className="bg-card/50 border-border/50 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 bg-muted/20">
                    <TableHead className="font-bold text-foreground">Metric</TableHead>
                    {CONDENSED_PROJECTION.map((row) => {
                      const phaseColors = getPhaseColor(row.phase);
                      return (
                        <TableHead key={row.year} className="text-center min-w-[120px]">
                          <div className="space-y-1">
                            <div className="font-bold text-foreground text-lg">{row.year}</div>
                            <Badge className={`text-xs ${phaseColors.bg} ${phaseColors.text} ${phaseColors.border}`}>
                              {phaseLabels[row.phase]}
                            </Badge>
                          </div>
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Units */}
                  <TableRow className="border-border/30">
                    <TableCell className="font-medium">Total Units</TableCell>
                    {CONDENSED_PROJECTION.map((row) => (
                      <TableCell key={row.year} className="text-center font-medium">
                        {(row.internalUnits + row.partnerUnits).toLocaleString()}
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* GMV */}
                  <TableRow className="border-border/30 bg-muted/10">
                    <TableCell className="font-medium">GMV</TableCell>
                    {CONDENSED_PROJECTION.map((row) => (
                      <TableCell key={row.year} className="text-center font-bold text-primary">
                        {formatCurrency(row.gmv)}
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Mortgage Book */}
                  <TableRow className="border-border/30">
                    <TableCell className="font-medium">Mortgage Book</TableCell>
                    {CONDENSED_PROJECTION.map((row) => (
                      <TableCell key={row.year} className="text-center font-medium text-amber-400">
                        {row.mortgageBook ? `$${row.mortgageBook}M` : "—"}
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Total Revenue */}
                  <TableRow className="border-border/30 bg-muted/10">
                    <TableCell className="font-medium">Revenue</TableCell>
                    {CONDENSED_PROJECTION.map((row) => (
                      <TableCell key={row.year} className="text-center font-bold text-green-500">
                        ${row.totalRevenue}M
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Multiple */}
                  <TableRow className="border-border/30 bg-muted/10">
                    <TableCell className="font-medium">Multiple</TableCell>
                    {CONDENSED_PROJECTION.map((row) => (
                      <TableCell key={row.year} className="text-center">
                        <Badge variant="outline" className={row.multiple >= 15 ? "border-green-500/50 text-green-400" : "border-border/50"}>
                          {row.multiple}×
                        </Badge>
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Valuation */}
                  <TableRow className="border-border/50 bg-gradient-to-r from-primary/5 to-green-500/5">
                    <TableCell className="font-bold text-lg">Valuation</TableCell>
                    {CONDENSED_PROJECTION.map((row) => (
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

        {/* Key Insight - Compact */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 rounded-xl border border-primary/30">
          <div className="flex items-start gap-3">
            <Rocket className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Platform Pivot:</span> After 32 seed-funded units prove the rails, 
              we <span className="text-purple-400 font-semibold">stop building</span> and 
              <span className="text-green-400 font-semibold"> start licensing</span>. 
              Exit value comes from 10,000+ partner units—not from laying bricks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
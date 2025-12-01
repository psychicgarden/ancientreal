import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, Building, Globe, Database, Rocket } from "lucide-react";

// 10-Year Financial Projection Data aligned with Investment Thesis
const projectionData = [
  {
    year: "Year 1",
    label: "Peru Genesis",
    internalUnits: 15,
    partnerUnits: 0,
    gmv: 2.0,
    devCoProfit: 0.9,
    originationFees: 0.06,
    mortgageSpread: 0.05,
    dataLicensing: 0,
    totalRevenue: 1.0,
    multiple: 4,
    valuation: 4,
    phase: "asset"
  },
  {
    year: "Year 2",
    label: "Brazil Scale",
    internalUnits: 21,
    partnerUnits: 0,
    gmv: 3.0,
    devCoProfit: 1.4,
    originationFees: 0.1,
    mortgageSpread: 0.2,
    dataLicensing: 0,
    totalRevenue: 1.7,
    multiple: 5,
    valuation: 8.5,
    phase: "asset"
  },
  {
    year: "Year 3",
    label: "Platform Launch",
    internalUnits: 30,
    partnerUnits: 100,
    gmv: 18,
    devCoProfit: 2.0,
    originationFees: 0.5,
    mortgageSpread: 1.5,
    dataLicensing: 0.2,
    totalRevenue: 4.2,
    multiple: 8,
    valuation: 33,
    phase: "platform"
  },
  {
    year: "Year 5",
    label: "Protocol Scale",
    internalUnits: 50,
    partnerUnits: 500,
    gmv: 85,
    devCoProfit: 4.0,
    originationFees: 2.5,
    mortgageSpread: 8.0,
    dataLicensing: 5.0,
    totalRevenue: 19.5,
    multiple: 15,
    valuation: 290,
    phase: "platform"
  },
  {
    year: "Year 7",
    label: "Global Network",
    internalUnits: 0,
    partnerUnits: 2500,
    gmv: 400,
    devCoProfit: 0,
    originationFees: 12,
    mortgageSpread: 25,
    dataLicensing: 20,
    totalRevenue: 57,
    multiple: 20,
    valuation: 1100,
    phase: "data"
  },
  {
    year: "Year 10",
    label: "Credit Bureau",
    internalUnits: 0,
    partnerUnits: 10000,
    gmv: 1500,
    devCoProfit: 0,
    originationFees: 45,
    mortgageSpread: 80,
    dataLicensing: 100,
    totalRevenue: 225,
    multiple: 20,
    valuation: 4500,
    phase: "data"
  }
];

const phaseColors = {
  asset: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  platform: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  data: "bg-green-500/20 text-green-400 border-green-500/30"
};

const phaseLabels = {
  asset: "Asset Phase",
  platform: "Platform Phase",
  data: "Data Phase"
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
            The Path to <span className="text-primary">$1 Billion Protocol</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From $1.9M Seed Liquidity to Global Credit Bureau
          </p>
        </div>

        {/* Phase Legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-muted-foreground">Asset Phase (Y1-3): Build & Prove</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-purple-400" />
            <span className="text-sm text-muted-foreground">Platform Phase (Y4-7): Scale with Partners</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-green-400" />
            <span className="text-sm text-muted-foreground">Data Phase (Y8-10): Monetize OCCR</span>
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
                    {projectionData.map((row) => (
                      <TableHead key={row.year} className="text-center min-w-[120px]">
                        <div className="space-y-1">
                          <div className="font-bold text-foreground">{row.year}</div>
                          <Badge className={`text-xs ${phaseColors[row.phase]}`}>
                            {phaseLabels[row.phase]}
                          </Badge>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Units Section */}
                  <TableRow className="border-border/30 bg-blue-500/5">
                    <TableCell className="font-semibold text-blue-400">Units Sold (Internal)</TableCell>
                    {projectionData.map((row) => (
                      <TableCell key={row.year} className="text-center">
                        {row.internalUnits > 0 ? row.internalUnits : "—"}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-border/30 bg-purple-500/5">
                    <TableCell className="font-semibold text-purple-400">Units Sold (Partners)</TableCell>
                    {projectionData.map((row) => (
                      <TableCell key={row.year} className="text-center">
                        {row.partnerUnits > 0 ? row.partnerUnits.toLocaleString() : "—"}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-border/30 bg-muted/30">
                    <TableCell className="font-bold">Total GMV</TableCell>
                    {projectionData.map((row) => (
                      <TableCell key={row.year} className="text-center font-bold text-primary">
                        ${row.gmv >= 1000 ? `${(row.gmv / 1000).toFixed(1)}B` : `${row.gmv}M`}
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
                    {projectionData.map((row) => (
                      <TableCell key={row.year} className="text-center">
                        {row.devCoProfit > 0 ? `$${row.devCoProfit}M` : "—"}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-border/30">
                    <TableCell className="text-muted-foreground">Origination Fees (3%)</TableCell>
                    {projectionData.map((row) => (
                      <TableCell key={row.year} className="text-center">
                        ${row.originationFees}M
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-border/30">
                    <TableCell className="text-muted-foreground">Mortgage Spread (4%)</TableCell>
                    {projectionData.map((row) => (
                      <TableCell key={row.year} className="text-center">
                        ${row.mortgageSpread}M
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-border/30 bg-green-500/5">
                    <TableCell className="text-green-400 font-semibold">Data Licensing (OCCR)</TableCell>
                    {projectionData.map((row) => (
                      <TableCell key={row.year} className="text-center text-green-400">
                        {row.dataLicensing > 0 ? `$${row.dataLicensing}M` : "—"}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-border/50 bg-primary/10">
                    <TableCell className="font-bold text-primary">TOTAL REVENUE</TableCell>
                    {projectionData.map((row) => (
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
                    {projectionData.map((row) => (
                      <TableCell key={row.year} className="text-center">
                        <Badge variant="outline" className={row.multiple >= 15 ? "border-green-500/50 text-green-400" : "border-border/50"}>
                          {row.multiple}× {row.multiple <= 5 ? "(RE)" : "(Fintech)"}
                        </Badge>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-border/50 bg-gradient-to-r from-primary/10 to-green-500/10">
                    <TableCell className="font-bold text-lg">Enterprise Value</TableCell>
                    {projectionData.map((row) => (
                      <TableCell key={row.year} className="text-center">
                        <span className={`font-bold text-lg ${row.valuation >= 1000 ? "text-green-400" : row.valuation >= 100 ? "text-primary" : "text-foreground"}`}>
                          ${row.valuation >= 1000 ? `${(row.valuation / 1000).toFixed(1)}B` : `${row.valuation}M`}
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
        <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 via-purple-500/10 to-green-500/10 rounded-xl border border-primary/30">
          <div className="flex items-start gap-4">
            <Rocket className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-xl mb-2">The "Amazon" Strategy</h3>
              <p className="text-muted-foreground">
                We use the <span className="text-blue-400 font-semibold">Cash Flow of Real Estate</span> (Years 1-5) 
                to fund the <span className="text-green-400 font-semibold">Scale of Software</span> (Years 5-10). 
                By Year 7, we stop building and become a pure protocol—licensing credit data to Aave, Compound, and Neo-Banks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

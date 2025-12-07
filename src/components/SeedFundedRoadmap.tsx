import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, DollarSign, Home, Building2, FileCheck, TrendingUp, Wallet } from "lucide-react";
import { SEED_PHASE } from "@/lib/businessModelConstants";

// Seed-funded constants aligned with Pitch Deck Slide 10
const SEED_CAPITAL = SEED_PHASE.capital; // $1.9M
const TOTAL_MORTGAGES = SEED_PHASE.mortgages; // 32 (per deck)
const MORTGAGE_BOOK = SEED_PHASE.mortgageBook; // $3.46M (per deck)
const ANNUAL_REVENUE = SEED_PHASE.annualRevenue; // $345K (per deck)
const TREASURY_REMAINING = SEED_PHASE.treasuryRemaining; // $494K (per deck)

const SEED_FUNDED_FLIPS = [
  {
    flip: "Flip 1",
    codename: "GENESIS",
    location: "Pisac, Peru",
    flag: "🇵🇪",
    units: 15,
    salePrice: 135_000,
    structure: "Reserva de Dominio",
    year: "Year 1",
  },
  {
    flip: "Flip 2",
    codename: "SCALE",
    location: "Bahia, Brazil",
    flag: "🇧🇷",
    units: 17,
    salePrice: 145_000,
    structure: "Alienação Fiduciária",
    year: "Year 2",
  },
];

export const SeedFundedRoadmap: React.FC = () => {
  const totalUnits = SEED_FUNDED_FLIPS.reduce((sum, flip) => sum + flip.units, 0);
  
  // Calculate flip financials
  const flip1BuildCost = 15 * 75_000; // $1.125M
  const flip1GrossSales = 15 * 135_000; // $2.025M
  const flip2BuildCost = 17 * 75_000; // $1.275M
  const flip2GrossSales = 17 * 145_000; // $2.465M
  
  const totalBuildCost = (flip1BuildCost + flip2BuildCost) / 1_000_000; // $2.4M
  const totalGrossSales = (flip1GrossSales + flip2GrossSales) / 1_000_000; // $4.49M

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header - Aligned with Deck Slide 10 */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-emerald-500/50 text-emerald-400">
            The $1.9M Seed Plan
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Building the First <span className="text-primary">Data Set</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            2 Flips, 32 Homes across Peru and Brazil. <span className="text-emerald-400 font-semibold">${MORTGAGE_BOOK}M mortgage book</span> proves traction for institutional capital.
          </p>
        </div>

        {/* Key Outcomes - Deck Slide 10 Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <Wallet className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
              <p className="text-2xl font-bold text-emerald-500">${SEED_CAPITAL}M</p>
              <p className="text-xs text-muted-foreground">Seed Capital</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <Home className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-primary">{totalUnits}</p>
              <p className="text-xs text-muted-foreground">Units Built & Sold</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <FileCheck className="h-6 w-6 mx-auto mb-2 text-purple-400" />
              <p className="text-2xl font-bold text-purple-400">{TOTAL_MORTGAGES}</p>
              <p className="text-xs text-muted-foreground">Mortgages Originated</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-amber-500" />
              <p className="text-2xl font-bold text-amber-500">${MORTGAGE_BOOK}M</p>
              <p className="text-xs text-muted-foreground">Mortgage Book</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-400" />
              <p className="text-2xl font-bold text-green-400">${ANNUAL_REVENUE}M</p>
              <p className="text-xs text-muted-foreground">Annual Revenue @ 10%</p>
            </CardContent>
          </Card>
        </div>

        {/* Treasury Remaining Highlight */}
        <Card className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/30 mb-8">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4 text-center">Capital is Recycled Into Assets</h3>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 py-2 px-4">
                Start: ${SEED_CAPITAL}M
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 py-2 px-4">
                Build 32 Units: ${totalBuildCost.toFixed(1)}M
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 py-2 px-4">
                Generate: ${MORTGAGE_BOOK}M Book
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge className="bg-primary/20 text-primary border-primary/30 py-2 px-4">
                Treasury: ${TREASURY_REMAINING}M
              </Badge>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              This initial mortgage book provides <span className="text-emerald-400 font-semibold">12+ months of repayment and enforcement data</span>, 
              proving the model to institutional credit providers like MakerDAO and Centrifuge.
            </p>
          </CardContent>
        </Card>

        {/* Flip Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {SEED_FUNDED_FLIPS.map((flip) => {
            const buildCost = flip.units * 75_000;
            const grossSales = flip.units * flip.salePrice;
            const netProfit = grossSales - buildCost;
            const mortgageBook = flip.units * flip.salePrice * 0.70; // 70% financed after 30% down
            
            return (
              <Card key={flip.codename} className="bg-card/50 border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{flip.year}</Badge>
                    <span className="text-3xl">{flip.flag}</span>
                  </div>
                  <CardTitle className="text-2xl">
                    {flip.flip}: <span className="text-primary">"{flip.codename}"</span>
                  </CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{flip.location}</span>
                    <Badge variant="secondary" className="text-xs">{flip.structure}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Unit Stats */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{flip.units}</p>
                      <p className="text-xs text-muted-foreground">Units</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-2xl font-bold text-purple-400">{flip.units}</p>
                      <p className="text-xs text-muted-foreground">Mortgages</p>
                    </div>
                  </div>

                  {/* Financials */}
                  <div className="space-y-2 text-sm p-3 bg-muted/20 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Build Cost ($75K/unit)</span>
                      <span className="text-red-400">${(buildCost / 1_000_000).toFixed(2)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross Sales (${flip.salePrice / 1000}K/unit)</span>
                      <span className="text-green-400">${(grossSales / 1_000_000).toFixed(2)}M</span>
                    </div>
                    <div className="flex justify-between border-t border-border/50 pt-2">
                      <span className="font-semibold">Net Profit</span>
                      <span className="font-bold text-emerald-500">${(netProfit / 1_000_000).toFixed(2)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mortgage Book (70% LTV)</span>
                      <span className="text-purple-400">${(mortgageBook / 1_000_000).toFixed(2)}M</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Path to Institutional Capital */}
        <Card className="mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <Building2 className="h-8 w-8 mx-auto mb-3 text-purple-400" />
            <h3 className="text-xl font-bold mb-2">Path to First $20M–$50M Credit Facility</h3>
            <p className="text-muted-foreground mb-4">
              {TOTAL_MORTGAGES} performing mortgages + ${MORTGAGE_BOOK}M book = 
              <span className="text-purple-400 font-semibold"> Proof of concept for MakerDAO / Centrifuge</span>
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="outline" className="text-purple-400 border-purple-400/50">32 Performing Loans ✓</Badge>
              <Badge variant="outline" className="text-purple-400 border-purple-400/50">Multi-Jurisdiction ✓</Badge>
              <Badge variant="outline" className="text-purple-400 border-purple-400/50">Title Retention Legal ✓</Badge>
              <Badge variant="outline" className="text-purple-400 border-purple-400/50">OCCR Data Asset ✓</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SeedFundedRoadmap;
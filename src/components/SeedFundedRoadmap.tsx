import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, DollarSign, Home, Building2, FileCheck, TrendingUp, Wallet } from "lucide-react";

// Seed-funded constants (Two Flips with $1.9M)
const SEED_CAPITAL = 1.9; // $1.9M
const BUILD_COST = 75_000; // $75K per unit

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

// Buyer segment distribution
const BUYER_MIX = {
  CASH: 0.20,
  BTC_COLLATERAL: 0.50,
  NOMAD: 0.30,
};
const DOWN_PAYMENT = 0.30; // 30% for all financed buyers

interface FlipFinancials {
  flip: string;
  units: number;
  buildCost: number;
  grossSales: number;
  cashUnits: number;
  btcUnits: number;
  nomadUnits: number;
  cashRevenue: number;
  downPayments: number;
  totalImmediate: number;
  mortgageBook: number;
  netProfit: number;
}

function calculateFlipFinancials(flip: typeof SEED_FUNDED_FLIPS[0]): FlipFinancials {
  const buildCost = flip.units * BUILD_COST;
  const grossSales = flip.units * flip.salePrice;
  
  const cashUnits = Math.round(flip.units * BUYER_MIX.CASH);
  const btcUnits = Math.round(flip.units * BUYER_MIX.BTC_COLLATERAL);
  const nomadUnits = flip.units - cashUnits - btcUnits;
  
  const cashRevenue = cashUnits * flip.salePrice;
  const financedUnits = btcUnits + nomadUnits;
  const downPayments = financedUnits * flip.salePrice * DOWN_PAYMENT;
  const totalImmediate = cashRevenue + downPayments;
  const mortgageBook = financedUnits * flip.salePrice * (1 - DOWN_PAYMENT);
  const netProfit = grossSales - buildCost;
  
  return {
    flip: flip.flip,
    units: flip.units,
    buildCost,
    grossSales,
    cashUnits,
    btcUnits,
    nomadUnits,
    cashRevenue,
    downPayments,
    totalImmediate,
    mortgageBook,
    netProfit,
  };
}

export const SeedFundedRoadmap: React.FC = () => {
  const flip1 = calculateFlipFinancials(SEED_FUNDED_FLIPS[0]);
  const flip2 = calculateFlipFinancials(SEED_FUNDED_FLIPS[1]);
  
  const totalUnits = flip1.units + flip2.units;
  const totalMortgages = (flip1.btcUnits + flip1.nomadUnits) + (flip2.btcUnits + flip2.nomadUnits);
  const totalMortgageBook = (flip1.mortgageBook + flip2.mortgageBook) / 1_000_000;
  
  // Capital flow calculation
  const afterFlip1Build = SEED_CAPITAL - (flip1.buildCost / 1_000_000);
  const afterFlip1Sales = afterFlip1Build + (flip1.totalImmediate / 1_000_000);
  const afterFlip2Build = afterFlip1Sales - (flip2.buildCost / 1_000_000);
  const afterFlip2Sales = afterFlip2Build + (flip2.totalImmediate / 1_000_000);

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-emerald-500/50 text-emerald-400">
            Seed-Funded Execution
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            $1.9M → <span className="text-primary">2 Flips</span> → {totalMortgages} Mortgages
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            32 units across Peru and Brazil. <span className="text-emerald-400 font-semibold">${totalMortgageBook.toFixed(2)}M mortgage book</span> proves traction for institutional capital.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <Wallet className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
              <p className="text-3xl font-bold text-emerald-500">${SEED_CAPITAL}M</p>
              <p className="text-sm text-muted-foreground">Seed Capital</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <Home className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold text-primary">{totalUnits}</p>
              <p className="text-sm text-muted-foreground">Total Units</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <FileCheck className="h-6 w-6 mx-auto mb-2 text-purple-400" />
              <p className="text-3xl font-bold text-purple-400">{totalMortgages}</p>
              <p className="text-sm text-muted-foreground">Mortgages</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-amber-500" />
              <p className="text-3xl font-bold text-amber-500">${totalMortgageBook.toFixed(2)}M</p>
              <p className="text-sm text-muted-foreground">Mortgage Book</p>
            </CardContent>
          </Card>
        </div>

        {/* Capital Flow Visualization */}
        <Card className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/30 mb-8">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4 text-center">Capital Flow Timeline</h3>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 py-2 px-4">
                Start: ${SEED_CAPITAL}M
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 py-2 px-4">
                Build F1: -${(flip1.buildCost / 1_000_000).toFixed(2)}M
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 py-2 px-4">
                Sell F1: +${(flip1.totalImmediate / 1_000_000).toFixed(2)}M
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 py-2 px-4">
                Build F2: -${(flip2.buildCost / 1_000_000).toFixed(2)}M
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 py-2 px-4">
                Sell F2: +${(flip2.totalImmediate / 1_000_000).toFixed(2)}M
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge className="bg-primary/20 text-primary border-primary/30 py-2 px-4">
                Final: ${afterFlip2Sales.toFixed(2)}M + ${totalMortgageBook.toFixed(2)}M book
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Flip Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {SEED_FUNDED_FLIPS.map((flip, idx) => {
            const financials = idx === 0 ? flip1 : flip2;
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
                  {/* Unit Breakdown */}
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2 bg-muted/30 rounded-lg">
                      <p className="text-lg font-bold">{financials.units}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <p className="text-lg font-bold text-amber-500">{financials.cashUnits}</p>
                      <p className="text-xs text-muted-foreground">Cash</p>
                    </div>
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <p className="text-lg font-bold text-orange-500">{financials.btcUnits}</p>
                      <p className="text-xs text-muted-foreground">BTC</p>
                    </div>
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <p className="text-lg font-bold text-purple-500">{financials.nomadUnits}</p>
                      <p className="text-xs text-muted-foreground">Nomad</p>
                    </div>
                  </div>

                  {/* Financials */}
                  <div className="space-y-2 text-sm p-3 bg-muted/20 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Build Cost</span>
                      <span className="text-red-400">${(financials.buildCost / 1_000_000).toFixed(2)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cash Sales ({financials.cashUnits} units)</span>
                      <span className="text-green-400">${(financials.cashRevenue / 1_000_000).toFixed(2)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Down Payments (30%)</span>
                      <span className="text-green-400">${(financials.downPayments / 1_000_000).toFixed(2)}M</span>
                    </div>
                    <div className="flex justify-between border-t border-border/50 pt-2">
                      <span className="font-semibold">Immediate Cash</span>
                      <span className="font-bold text-emerald-500">${(financials.totalImmediate / 1_000_000).toFixed(2)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mortgage Book</span>
                      <span className="text-purple-400">${(financials.mortgageBook / 1_000_000).toFixed(2)}M</span>
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
            <h3 className="text-xl font-bold mb-2">Path to Institutional Capital</h3>
            <p className="text-muted-foreground mb-4">
              {totalMortgages} performing mortgages + ${totalMortgageBook.toFixed(2)}M book = 
              <span className="text-purple-400 font-semibold"> Proof of concept for MakerDAO / Centrifuge</span>
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="outline" className="text-purple-400 border-purple-400/50">20+ Performing Loans ✓</Badge>
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

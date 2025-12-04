import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, DollarSign, Home, Zap, RefreshCw, Lock } from "lucide-react";

interface FlipData {
  name: string;
  codename: string;
  location: string;
  flag: string;
  year: string;
  units: number;
  buildCost: number;
  salePrice: number;
  margin: string;
  netProfit: number;
  innovation: string;
  structure: string;
  phase: "seed" | "future";
}

// Phase 1: Seed-funded flips (32 units with $1.9M)
const seedFlips: FlipData[] = [
  {
    name: "Flip 1",
    codename: "THE GENESIS",
    location: "Pisac, Peru",
    flag: "🇵🇪",
    year: "Year 1",
    units: 15,
    buildCost: 75000,
    salePrice: 135000,
    margin: "44%",
    netProfit: 900000,
    innovation: "Title Retention + Two-Product Mortgage launch (50% BTC / 30% Nomad)",
    structure: "Reserva de Dominio",
    phase: "seed"
  },
  {
    name: "Flip 2",
    codename: "THE SCALE",
    location: "Bahia, Brazil",
    flag: "🇧🇷",
    year: "Year 2",
    units: 17,
    buildCost: 75000,
    salePrice: 145000,
    margin: "48%",
    netProfit: 1190000,
    innovation: "Multi-jurisdiction proof + Alienação Fiduciária structure",
    structure: "Brazilian LTDA",
    phase: "seed"
  },
];

// Phase 2: Future flips (funded by profits + institutional capital)
const futureFlips: FlipData[] = [
  {
    name: "Flip 3",
    codename: "THE CLUB",
    location: "Corfu, Greece",
    flag: "🇬🇷",
    year: "Year 3",
    units: 16,
    buildCost: 75000,
    salePrice: 165000,
    margin: "55%",
    netProfit: 1440000,
    innovation: "Serviced Accommodation model (bypass EU tenant laws)",
    structure: "Greek IKE SPV",
    phase: "future"
  },
  {
    name: "Flip 4",
    codename: "THE LEASEHOLD",
    location: "Koh Phangan, Thailand",
    flag: "🇹🇭",
    year: "Year 4",
    units: 25,
    buildCost: 75000,
    salePrice: 110000,
    margin: "32%",
    netProfit: 875000,
    innovation: "30-Year Pre-Paid Lease structure (high volume)",
    structure: "30+30 Leasehold",
    phase: "future"
  },
  {
    name: "Flip 5",
    codename: "THE WHALE HAVEN",
    location: "Mazunte, Mexico",
    flag: "🇲🇽",
    year: "Year 5",
    units: 20,
    buildCost: 75000,
    salePrice: 250000,
    margin: "70%",
    netProfit: 3500000,
    innovation: "Luxury $250K+ market for matured Crypto Whales",
    structure: "Mexican SAPI + Fideicomiso",
    phase: "future"
  },
  {
    name: "Flip 6",
    codename: "THE CITADEL",
    location: "Antalya, Turkey",
    flag: "🇹🇷",
    year: "Year 6",
    units: 50,
    buildCost: 75000,
    salePrice: 160000,
    margin: "53%",
    netProfit: 4250000,
    innovation: "Fully autonomous On-Chain City with governance tokens",
    structure: "Turkish SPV",
    phase: "future"
  }
];

const allFlips = [...seedFlips, ...futureFlips];

export default function SixFlipRoadmap() {
  const seedUnits = seedFlips.reduce((sum, f) => sum + f.units, 0);
  const seedMortgages = Math.round(seedUnits * 0.80); // 80% financed
  const totalUnits = allFlips.reduce((sum, f) => sum + f.units, 0);
  const totalProfit = allFlips.reduce((sum, f) => sum + f.netProfit, 0);

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-primary/50 text-primary">
            Two-Product Mortgage Protocol
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            $1.9M Seed → <span className="text-primary">2 Flips</span> → {seedMortgages} Mortgages
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            <span className="text-emerald-400 font-semibold">Seed funds Flips 1-2 ({seedUnits} units).</span> Profits + institutional capital fund Flips 3-6.
          </p>
        </div>

        {/* Seed-Funded Phase Highlight */}
        <Card className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              <span className="font-bold text-emerald-500">Seed-Funded: $1.9M → 32 Units → 26 Mortgages</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm mb-4">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 py-2 px-4">$1.9M Seed</Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 py-2 px-4">Flip 1: 15 units (Peru)</Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 py-2 px-4">Flip 2: 17 units (Brazil)</Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 py-2 px-4">$2.55M Mortgage Book</Badge>
            </div>
            <p className="text-center text-muted-foreground text-sm">
              <span className="text-emerald-400 font-semibold">80% mortgage origination</span> (50% BTC-Collateralized + 30% Nomad) proves traction for institutional capital
            </p>
          </CardContent>
        </Card>

        {/* Future Growth Flow */}
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 mb-12">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <RefreshCw className="h-5 w-5 text-purple-400" />
              <span className="font-bold text-purple-400">Future Growth: Profits + Institutional Capital</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30">Flip 3: +$1.44M</Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Flip 4: +$0.88M</Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Flip 5: +$3.5M</Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Flip 6: +$4.25M</Badge>
            </div>
            <p className="text-center text-muted-foreground text-sm mt-4">
              Flips 3-6 funded by recycled profits + MakerDAO/Centrifuge facility
            </p>
          </CardContent>
        </Card>

        {/* Phase 1: Seed-Funded Flips */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-lg px-4 py-2">
              Phase 1: Seed-Funded
            </Badge>
            <span className="text-muted-foreground">$1.9M capital deployed</span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {seedFlips.map((flip) => (
              <Card 
                key={flip.codename} 
                className="bg-card/50 border-emerald-500/30 hover:border-emerald-500/50 transition-all hover:shadow-lg overflow-hidden"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      {flip.year} • Seed-Funded
                    </Badge>
                    <span className="text-2xl">{flip.flag}</span>
                  </div>
                  <CardTitle className="text-xl mt-2">
                    <span className="text-muted-foreground text-sm">{flip.name}:</span>{" "}
                    <span className="text-primary">"{flip.codename}"</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{flip.location}</span>
                    <Badge variant="secondary" className="text-xs ml-auto">{flip.structure}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-2 bg-muted/30 rounded-lg text-center">
                      <Home className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-lg font-bold">{flip.units}</p>
                      <p className="text-xs text-muted-foreground">Units</p>
                    </div>
                    <div className="p-2 bg-purple-500/10 rounded-lg text-center">
                      <p className="text-lg font-bold text-purple-400">{Math.round(flip.units * 0.8)}</p>
                      <p className="text-xs text-muted-foreground">Mortgages</p>
                    </div>
                    <div className="p-2 bg-green-500/10 rounded-lg text-center">
                      <DollarSign className="h-4 w-4 mx-auto mb-1 text-green-500" />
                      <p className="text-lg font-bold text-green-500">{flip.margin}</p>
                      <p className="text-xs text-muted-foreground">Margin</p>
                    </div>
                  </div>
                  <div className="text-xs space-y-1 p-2 bg-muted/20 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Build</span>
                      <span>${(flip.buildCost / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sell</span>
                      <span>${(flip.salePrice / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between border-t border-border/50 pt-1 mt-1">
                      <span className="font-semibold">Net Profit</span>
                      <span className="font-bold text-green-500">${(flip.netProfit / 1_000_000).toFixed(2)}M</span>
                    </div>
                  </div>
                  <div className="p-2 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">{flip.innovation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Phase 2: Future Flips */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-lg px-4 py-2">
              Phase 2: Future Growth
            </Badge>
            <span className="text-muted-foreground">Profits + Institutional Capital</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {futureFlips.map((flip) => (
              <Card 
                key={flip.codename} 
                className="bg-card/30 border-border/30 opacity-80 hover:opacity-100 transition-all overflow-hidden"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">{flip.year}</Badge>
                    <span className="text-xl">{flip.flag}</span>
                  </div>
                  <CardTitle className="text-sm mt-2">
                    <span className="text-muted-foreground text-xs">{flip.name}:</span>{" "}
                    <span className="text-primary text-sm">"{flip.codename}"</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>{flip.location}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-1 bg-muted/30 rounded text-center">
                      <p className="text-sm font-bold">{flip.units}</p>
                      <p className="text-xs text-muted-foreground">Units</p>
                    </div>
                    <div className="p-1 bg-green-500/10 rounded text-center">
                      <p className="text-sm font-bold text-green-500">${(flip.netProfit / 1_000_000).toFixed(1)}M</p>
                      <p className="text-xs text-muted-foreground">Profit</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-emerald-500/10 border-emerald-500/30">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-emerald-400">{seedUnits}</p>
              <p className="text-sm text-muted-foreground">Seed-Funded Units</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/10 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-purple-400">{seedMortgages}</p>
              <p className="text-sm text-muted-foreground">Mortgages (80%)</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{totalUnits}</p>
              <p className="text-sm text-muted-foreground">Total Units (All Flips)</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-500">${(totalProfit / 1_000_000).toFixed(1)}M</p>
              <p className="text-sm text-muted-foreground">Total DevCo Profit</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-orange-400">6</p>
              <p className="text-sm text-muted-foreground">Countries</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

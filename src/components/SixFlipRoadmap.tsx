import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, DollarSign, Home, Zap, RefreshCw } from "lucide-react";

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
}

const flips: FlipData[] = [
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
    netProfit: 975000,
    innovation: "Title Retention legal structure + Credit Score beta launch",
    structure: "Reserva de Dominio"
  },
  {
    name: "Flip 2",
    codename: "THE SCALE",
    location: "Bahia, Brazil",
    flag: "🇧🇷",
    year: "Year 2",
    units: 21,
    buildCost: 80000,
    salePrice: 145000,
    margin: "45%",
    netProfit: 1400000,
    innovation: "Alienação Fiduciária (Fast Eviction) smart contracts",
    structure: "Brazilian LTDA"
  },
  {
    name: "Flip 3",
    codename: "THE CLUB",
    location: "Corfu, Greece",
    flag: "🇬🇷",
    year: "Year 3",
    units: 16,
    buildCost: 90000,
    salePrice: 165000,
    margin: "45%",
    netProfit: 1200000,
    innovation: "Serviced Accommodation model (bypass EU tenant laws)",
    structure: "Greek IKE SPV"
  },
  {
    name: "Flip 4",
    codename: "THE LEASEHOLD",
    location: "Koh Phangan, Thailand",
    flag: "🇹🇭",
    year: "Year 4",
    units: 25,
    buildCost: 60000,
    salePrice: 110000,
    margin: "45%",
    netProfit: 1500000,
    innovation: "30-Year Pre-Paid Lease structure (high volume)",
    structure: "30+30 Leasehold"
  },
  {
    name: "Flip 5",
    codename: "THE WHALE HAVEN",
    location: "Mazunte, Mexico",
    flag: "🇲🇽",
    year: "Year 5",
    units: 20,
    buildCost: 125000,
    salePrice: 250000,
    margin: "50%",
    netProfit: 2500000,
    innovation: "Luxury $250K+ market for matured Crypto Whales",
    structure: "Mexican SAPI + Fideicomiso"
  },
  {
    name: "Flip 6",
    codename: "THE CITADEL",
    location: "Antalya, Turkey",
    flag: "🇹🇷",
    year: "Year 6",
    units: 50,
    buildCost: 80000,
    salePrice: 160000,
    margin: "50%",
    netProfit: 4000000,
    innovation: "Fully autonomous On-Chain City with governance tokens",
    structure: "Turkish SPV"
  }
];

export default function SixFlipRoadmap() {
  const totalUnits = flips.reduce((sum, f) => sum + f.units, 0);
  const totalProfit = flips.reduce((sum, f) => sum + f.netProfit, 0);

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-primary/50 text-primary">
            The Hardware Engine
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The <span className="text-primary">"6 Flip" Roadmap</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            $1.75M Seed funds Flip 1. <span className="text-green-500 font-semibold">Recycled Profits</span> fund Flips 2-6. 
            Non-dilutive growth for early investors.
          </p>
        </div>

        {/* Recycled Profits Flow Diagram */}
        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 mb-12 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <RefreshCw className="h-5 w-5 text-green-500" />
              <span className="font-bold text-green-500">Profit Recycling Flywheel</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <Badge className="bg-primary/20 text-primary border-primary/30">$1.75M Seed</Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Flip 1: +$975K</Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Flip 2: +$1.4M</Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30">Flip 3: +$1.2M</Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Flip 4: +$1.5M</Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Flip 5: +$2.5M</Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Flip 6: +$4M</Badge>
            </div>
            <p className="text-center text-muted-foreground text-sm mt-4">
              Total Accumulated Profit: <span className="text-green-500 font-bold">${(totalProfit / 1_000_000).toFixed(1)}M</span> from {totalUnits} units
            </p>
          </CardContent>
        </Card>

        {/* Flip Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flips.map((flip, idx) => (
            <Card 
              key={flip.codename} 
              className="bg-card/50 border-border/50 hover:border-primary/30 transition-all hover:shadow-lg overflow-hidden"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {flip.year}
                  </Badge>
                  <span className="text-2xl">{flip.flag}</span>
                </div>
                <CardTitle className="text-lg mt-2">
                  <span className="text-muted-foreground text-sm">{flip.name}:</span>{" "}
                  <span className="text-primary">"{flip.codename}"</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location */}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{flip.location}</span>
                  <Badge variant="secondary" className="text-xs ml-auto">
                    {flip.structure}
                  </Badge>
                </div>

                {/* Units & Economics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 bg-muted/30 rounded-lg text-center">
                    <Home className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-lg font-bold">{flip.units}</p>
                    <p className="text-xs text-muted-foreground">Units</p>
                  </div>
                  <div className="p-2 bg-green-500/10 rounded-lg text-center">
                    <DollarSign className="h-4 w-4 mx-auto mb-1 text-green-500" />
                    <p className="text-lg font-bold text-green-500">{flip.margin}</p>
                    <p className="text-xs text-muted-foreground">Margin</p>
                  </div>
                </div>

                {/* Unit Economics */}
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
                    <span className="font-bold text-green-500">${(flip.netProfit / 1_000_000).toFixed(1)}M</span>
                  </div>
                </div>

                {/* Innovation */}
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

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{totalUnits}</p>
              <p className="text-sm text-muted-foreground">Total Units</p>
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
              <p className="text-3xl font-bold text-purple-400">6</p>
              <p className="text-sm text-muted-foreground">Countries</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-orange-400">6</p>
              <p className="text-sm text-muted-foreground">Years</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

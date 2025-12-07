import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bitcoin, Globe, XCircle, ArrowRight, TrendingUp, Banknote, Scale, Shield, Building2 } from "lucide-react";

// 5 Megatrends from Pitch Deck Slide 6
const megatrends = [
  {
    icon: TrendingUp,
    title: "Nomad Surge",
    stat: "5X since 2019",
    desc: "Digital Nomads projected to reach 1B by 2035 — the forgotten high-income class invisible to banks.",
    color: "text-blue-400",
  },
  {
    icon: Bitcoin,
    title: "Crypto Wealth Demands Real Assets",
    stat: "$1.1T Trapped",
    desc: "Selling BTC triggers 20–37% capital gains tax. Our model solves their #1 pain point.",
    color: "text-orange-400",
  },
  {
    icon: Banknote,
    title: "Global Mortgage Collapse",
    stat: "12–45% Rates",
    desc: "Local mortgage rates in LATAM & SE Asia force markets to run on cash, locking out millions.",
    color: "text-red-400",
  },
  {
    icon: Scale,
    title: "Legal Rails Unlocked",
    stat: "Reserva de Dominio",
    desc: "New title-retention laws enable instant, courtless foreclosure. Global mortgage enforcement is finally programmable.",
    color: "text-purple-400",
  },
  {
    icon: Building2,
    title: "The RWA Boom",
    stat: "#1 Priority",
    desc: "Real-World Assets are the top priority for BlackRock, Fidelity, and Coinbase. On-chain mortgages are the next trillion-dollar category.",
    color: "text-emerald-400",
  },
];

export default function MarketFailure() {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2">
            The Market Failure
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Two Worlds <span className="text-destructive">Disconnected</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            No bridge exists to connect <span className="text-primary font-semibold">Trapped Crypto Wealth</span> with{" "}
            <span className="text-primary font-semibold">Real World Housing Demand</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Supply Side - Crypto Whales */}
          <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/30">
            <CardHeader>
              <Badge className="w-fit bg-orange-500/20 text-orange-500 border-orange-500/30 mb-2">
                SUPPLY SIDE
              </Badge>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Bitcoin className="h-8 w-8 text-orange-500" />
                The Crypto Whale
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Problem:</p>
                    <p className="text-muted-foreground">Holds millions in BTC/ETH but is "homeless" in the fiat world</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Friction:</p>
                    <p className="text-muted-foreground">Selling crypto triggers massive capital gains tax and loss of upside</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Result:</p>
                    <p className="text-muted-foreground">$1 Trillion sits dormant on-chain, earning low yield</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-orange-500/20">
                <p className="text-3xl font-bold text-orange-500">$1T+</p>
                <p className="text-sm text-muted-foreground">Trapped Crypto Wealth</p>
              </div>
            </CardContent>
          </Card>

          {/* Demand Side - Global Nomads */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <CardHeader>
              <Badge className="w-fit bg-blue-500/20 text-blue-500 border-blue-500/30 mb-2">
                DEMAND SIDE
              </Badge>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Globe className="h-8 w-8 text-blue-500" />
                The Global Nomad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Problem:</p>
                    <p className="text-muted-foreground">Earns high income ($5k-$10k/mo) but has Zero FICO Score</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Friction:</p>
                    <p className="text-muted-foreground">Rejected by legacy banks globally despite strong cash flow</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Result:</p>
                    <p className="text-muted-foreground">A massive, credit-worthy demographic is forced to rent forever</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-blue-500/20">
                <p className="text-3xl font-bold text-blue-500">115M+</p>
                <p className="text-sm text-muted-foreground">Credit-Invisible Global Nomads</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* The Void */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <ArrowRight className="h-12 w-12 text-destructive/30" />
          </div>
          <Card className="bg-gradient-to-r from-destructive/10 via-destructive/20 to-destructive/10 border-destructive/30">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-destructive mb-2">THE VOID</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                There is <span className="text-destructive font-bold">no trusted way</span> to collateralize crypto into real estate at scale.
                No bridge exists to connect <span className="font-semibold">Trapped Crypto Wealth</span> with{" "}
                <span className="font-semibold">Real World Housing Demand</span>.
              </p>
              <div className="mt-6 p-4 bg-background/50 rounded-lg inline-block">
                <p className="text-primary font-bold text-xl">
                  Ancient is building the missing financial rail.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Perfect Macro Moment - 5 Megatrends */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-primary/50 text-primary">
              The Perfect Macro Moment
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Five Converging <span className="text-primary">Megatrends</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ancient is not early — it's <span className="text-primary font-semibold">perfectly timed</span>.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {megatrends.map((trend) => (
              <Card 
                key={trend.title} 
                className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 hover:border-primary/30"
              >
                <CardContent className="p-5">
                  <trend.icon className={`h-8 w-8 mb-3 ${trend.color}`} />
                  <div className={`text-xl font-bold mb-2 ${trend.color}`}>{trend.stat}</div>
                  <h3 className="text-sm font-semibold mb-2">{trend.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{trend.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
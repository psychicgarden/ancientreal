import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, Zap, Home, DollarSign, CheckCircle2, ArrowRight } from "lucide-react";

interface RiskMitigation {
  title: string;
  description: string;
  icon: React.ElementType;
  highlight?: string;
}

const mitigations: RiskMitigation[] = [
  {
    title: "Title Retention (Reserva de Dominio)",
    description: "Ancient Protocol retains Legal Title until the final dollar is paid. No foreclosure court needed.",
    icon: FileText,
    highlight: "100% Title Control",
  },
  {
    title: "Smart Default",
    description: "If a buyer stops paying, the Smart Contract revokes their access NFT instantly. No legal delays.",
    icon: Zap,
    highlight: "Instant Revocation",
  },
  {
    title: "Yield-Based Liquidation",
    description: "If a unit defaults, we instantly seize it and place it in our Short-Term Rental Pool.",
    icon: Home,
    highlight: "2.5× Coverage",
  },
  {
    title: "DeFi Rate Hedging",
    description: "Fixed-rate hedging via Pendle Swaps and Threshold USD (thUSD) locks our cost of capital at 0-6%.",
    icon: Shield,
    highlight: "Rate Protection",
  },
];

export default function KillSwitch() {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-destructive/50 text-destructive">
            Risk Management
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The <span className="text-destructive">"Kill Switch"</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We solve the "Illiquidity Risk" of Peruvian Real Estate with a{" "}
            <span className="text-primary font-semibold">Yield-Based Liquidation</span> model.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {mitigations.map((item, idx) => (
            <Card 
              key={item.title} 
              className="bg-card/50 border-border/50 hover:border-primary/30 transition-all hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                    {item.highlight}
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-4">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Yield Liquidation Math */}
        <Card className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              <Shield className="h-6 w-6 inline-block mr-2 text-green-500" />
              Yield Liquidation Math
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Loan Cost */}
              <div className="text-center p-6 bg-background/50 rounded-xl">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-destructive" />
                <p className="text-sm text-muted-foreground mb-1">Annual Loan Cost</p>
                <p className="text-3xl font-bold text-destructive">$7,000</p>
                <p className="text-xs text-muted-foreground">Interest + Principal</p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center">
                <ArrowRight className="h-8 w-8 text-muted-foreground" />
              </div>

              {/* Rental Income */}
              <div className="text-center p-6 bg-background/50 rounded-xl">
                <Home className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm text-muted-foreground mb-1">Annual Rental Income</p>
                <p className="text-3xl font-bold text-green-500">$18,000</p>
                <p className="text-xs text-muted-foreground">Short-Term Rental Pool</p>
              </div>
            </div>

            {/* Result */}
            <div className="mt-8 text-center p-6 bg-green-500/10 rounded-xl border border-green-500/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <p className="text-xl font-bold text-green-500">Result: 2.5× Debt Service Coverage</p>
              </div>
              <p className="text-muted-foreground">
                Rental income covers debt service <span className="font-semibold">2.5×</span>. 
                The investor gets paid <span className="text-green-500 font-semibold">even if the house doesn't sell</span>.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* DeFi Rate Hedging Detail */}
        <Card className="mt-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              <Shield className="h-6 w-6 inline-block mr-2 text-blue-500" />
              DeFi Rate Spike Protection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-background/50 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Pendle Swaps</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Lock in fixed yields on variable-rate DeFi positions. If stablecoin borrow rates spike, 
                  our hedged position keeps cost of capital at <span className="text-green-400 font-semibold">6% max</span>.
                </p>
              </div>
              <div className="p-4 bg-background/50 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Threshold USD (thUSD)</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Hard-coded 0% borrowing against BTC collateral. Even in extreme market conditions, 
                  our capital cost is <span className="text-green-400 font-semibold">locked at zero</span>.
                </p>
              </div>
            </div>
            <div className="mt-6 text-center p-4 bg-green-500/10 rounded-lg border border-green-500/30">
              <p className="text-green-400 font-semibold">
                Result: We borrow at 0-6%, lend at 10%. Spread protected in all market conditions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Safety Note */}
        <div className="mt-8 text-center p-6 bg-muted/30 rounded-xl border border-border/50">
          <p className="text-lg font-medium">
            <span className="text-primary font-bold">Zero Foreclosure Risk</span> — We never go to court. 
            Title retention means we already own the asset. Default = Rental activation.
          </p>
        </div>
      </div>
    </section>
  );
}

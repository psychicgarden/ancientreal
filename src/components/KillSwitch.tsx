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

        <div className="grid md:grid-cols-3 gap-6 mb-12">
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

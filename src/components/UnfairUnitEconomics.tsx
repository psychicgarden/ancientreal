import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Building2, Percent, MapPin, Zap } from "lucide-react";

interface EconomicMetric {
  label: string;
  value: string;
  subtext?: string;
  icon: React.ElementType;
  highlight?: boolean;
}

const metrics: EconomicMetric[] = [
  {
    label: "Location",
    value: "Pisac, Peru",
    subtext: '"Bitcoin Valley"',
    icon: MapPin,
  },
  {
    label: "Land Value Growth",
    value: "14×",
    subtext: "$20 → $280/m² in 20 years",
    icon: TrendingUp,
    highlight: true,
  },
  {
    label: "Build Cost (All-in)",
    value: "$91,000",
    subtext: "Vertically integrated",
    icon: Building2,
  },
  {
    label: "Sale Price",
    value: "$135,000",
    subtext: "Dynamic pricing to $150K",
    icon: DollarSign,
  },
  {
    label: "Gross Margin",
    value: "32-48%",
    subtext: "Construction arbitrage",
    icon: Percent,
    highlight: true,
  },
  {
    label: "Cash-on-Cash Return",
    value: "20%+",
    subtext: "Verified operational yield",
    icon: Zap,
    highlight: true,
  },
];

export default function UnfairUnitEconomics() {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2">
            The "Unfair" Advantage
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Unit Economics <span className="text-primary">They Can't Match</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Because we are the <span className="text-primary font-semibold">General Contractor</span> (Vertical Integration), 
            we capture margins that subsidize the protocol.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {metrics.map((metric) => (
            <Card 
              key={metric.label} 
              className={`transition-all hover:shadow-lg ${
                metric.highlight 
                  ? "border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10" 
                  : "bg-card/50 border-border/50"
              }`}
            >
              <CardContent className="p-6 text-center">
                <metric.icon className={`h-8 w-8 mx-auto mb-3 ${metric.highlight ? "text-primary" : "text-muted-foreground"}`} />
                <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                <p className={`text-3xl font-bold mb-1 ${metric.highlight ? "text-primary" : "text-foreground"}`}>
                  {metric.value}
                </p>
                {metric.subtext && (
                  <p className="text-xs text-muted-foreground">{metric.subtext}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* VC Note */}
        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500/20 rounded-full shrink-0">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <Badge className="bg-green-500/20 text-green-500 border-green-500/30 mb-2">
                  VC NOTE
                </Badge>
                <p className="text-lg font-medium">
                  This margin allows us to offer <span className="text-green-500 font-bold">"0% Loans"</span> and still be profitable — 
                  a customer acquisition tool <span className="text-green-500 font-bold">no bank can match</span>.
                </p>
                <p className="text-muted-foreground mt-2">
                  Vertical integration creates a moat: we build the hardware to power the software. 
                  Construction margins fund protocol development while competitors raise venture capital for every expansion.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profit Flow Visualization */}
        <div className="mt-12 grid md:grid-cols-4 gap-4">
          {[
            { step: 1, label: "Build", value: "$91K", color: "text-muted-foreground" },
            { step: 2, label: "Sell", value: "$135K", color: "text-blue-500" },
            { step: 3, label: "Margin", value: "$44K", color: "text-green-500" },
            { step: 4, label: "ROI", value: "48%", color: "text-primary" },
          ].map((item, idx) => (
            <div key={item.step} className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
              <div className="text-xs text-muted-foreground mb-1">Step {item.step}</div>
              <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, Layers, Coins, Building2, Landmark, CheckCircle2 } from "lucide-react";

export default function CompetitorMoat() {
  const competitors = [
    {
      icon: Layers,
      category: "Real estate tokenization platforms",
      limitation: "They list assets but cannot generate credit data or offer mortgages.",
    },
    {
      icon: Coins,
      category: "Crypto lending protocols",
      limitation: "They have capital but no enforcement rights or real identity signals.",
    },
    {
      icon: Building2,
      category: "Local developers",
      limitation: "They build homes but cannot create cross-border financial infrastructure.",
    },
    {
      icon: Landmark,
      category: "Mortgage companies",
      limitation: "Their systems only operate within one country.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-base px-5 py-1.5 border-primary/50 text-primary">
            Competitive Moat
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Why Competitors Cannot Copy This
          </h2>
          <p className="text-lg text-muted-foreground">
            Other categories fail to combine all elements required:
          </p>
        </div>

        {/* Competitor Grid */}
        <div className="grid sm:grid-cols-2 gap-5 mb-12">
          {competitors.map((comp, idx) => (
            <Card key={idx} className="bg-destructive/5 border-destructive/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <comp.icon className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">{comp.category}</h3>
                    <div className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">{comp.limitation}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ancient's Advantage */}
        <Card className="bg-primary/5 border-primary/30">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-4">Ancient combines it all:</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Construction, repayment data, underwriting models, and enforceable legal rights — 
              into one integrated system.
            </p>
            <p className="text-xl font-medium text-primary">
              This is the only path to a global credit score.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

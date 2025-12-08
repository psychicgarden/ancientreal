import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Home, FileText, Scale, Database, CheckCircle2 } from "lucide-react";

export default function The32HomeDataset() {
  const flips = [
    { location: "Peru", units: 15, color: "bg-primary/20 border-primary/40 text-primary" },
    { location: "Brazil", units: 17, color: "bg-amber-500/20 border-amber-500/40 text-amber-500" },
  ];

  const outputs = [
    "32 repayment histories",
    "32 enforcement records",
    "32 onchain credit profiles",
    "32 construction margins",
    "A diversified dataset across two jurisdictions",
  ];

  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-base px-5 py-1.5 border-primary/50 text-primary">
            The Dataset
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Our First Two Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ancient begins by developing two real estate projects that allow us to collect 
            repayment data from a meaningful sample size.
          </p>
        </div>

        {/* Flip Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {flips.map((flip, idx) => (
            <Card key={idx} className={`${flip.color} border`}>
              <CardContent className="p-8 text-center">
                <MapPin className="h-8 w-8 mx-auto mb-3" />
                <p className="text-sm uppercase tracking-wider mb-2 opacity-80">Flip {idx + 1}</p>
                <p className="text-4xl font-bold mb-1">{flip.units}</p>
                <p className="text-lg">homes in {flip.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Total */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary/20 to-amber-500/20 rounded-full border border-primary/30">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold">Total: 32 homes</span>
          </div>
        </div>

        {/* Outputs */}
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-8">
            <h3 className="font-bold text-lg mb-6 text-center">These 32 homes provide:</h3>
            <div className="grid sm:grid-cols-2 gap-3 max-w-xl mx-auto">
              {outputs.map((output, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  <span className="text-muted-foreground">{output}</span>
                </div>
              ))}
            </div>
            <p className="text-center mt-8 text-lg text-foreground font-medium">
              This is enough to validate underwriting assumptions and support institutional credit lines.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

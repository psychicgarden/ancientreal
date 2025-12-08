import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, Rocket, Building2, Database, TrendingUp } from "lucide-react";

interface TractionPhase {
  phase: number;
  title: string;
  status: "live" | "building" | "raising";
  metrics: string;
  revenue?: string;
  purpose: string;
  icon: React.ElementType;
}

const phases: TractionPhase[] = [
  {
    phase: 1,
    title: "Proof of Operations",
    status: "live",
    metrics: "12 Units",
    revenue: "$75K Net Income",
    purpose: "We know how to run this profitably. 18.75% Net Yields validated.",
    icon: Building2,
  },
  {
    phase: 2,
    title: "Proof of Execution",
    status: "building",
    metrics: "16 Units",
    revenue: "Fully Funded",
    purpose: "Vertical construction capability. Building infrastructure at scale.",
    icon: Loader2,
  },
  {
    phase: 3,
    title: "Proof of Protocol",
    status: "raising",
    metrics: "15 Custom Homes",
    revenue: "$1.9M Raise",
    purpose: "The 'Genesis Block' for the On-Chain Credit Score (OCCR).",
    icon: Rocket,
  },
];

export default function TractionTrilogy() {
  const getStatusBadge = (status: TractionPhase["status"]) => {
    switch (status) {
      case "live":
        return (
          <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            LIVE
          </Badge>
        );
      case "building":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            BUILDING
          </Badge>
        );
      case "raising":
        return (
          <Badge className="bg-primary/20 text-primary border-primary/30">
            <Rocket className="h-3 w-3 mr-1" />
            RAISING
          </Badge>
        );
    }
  };

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2">
            The Trilogy
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            De-Risking <span className="text-primary">Execution</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We aren't asking you to fund a theory. We are funding a <span className="text-primary font-semibold">scale-up</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {phases.map((phase) => (
            <Card 
              key={phase.phase} 
              className={`relative overflow-hidden transition-all hover:shadow-lg ${
                phase.status === "live" 
                  ? "border-green-500/50 bg-gradient-to-br from-green-500/5 to-green-500/10" 
                  : phase.status === "building"
                  ? "border-yellow-500/50 bg-gradient-to-br from-yellow-500/5 to-yellow-500/10"
                  : "border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    Phase {phase.phase}
                  </Badge>
                  {getStatusBadge(phase.status)}
                </div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <phase.icon className={`h-5 w-5 ${
                    phase.status === "live" ? "text-green-500" :
                    phase.status === "building" ? "text-yellow-500" : "text-primary"
                  }`} />
                  {phase.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Metrics:</span>
                    <span className="font-bold text-lg">{phase.metrics}</span>
                  </div>
                  {phase.revenue && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Revenue/Status:</span>
                      <span className={`font-semibold ${
                        phase.status === "live" ? "text-green-500" :
                        phase.status === "building" ? "text-yellow-500" : "text-primary"
                      }`}>{phase.revenue}</span>
                    </div>
                  )}
                </div>
                <div className="pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">{phase.purpose}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bitcoin Valley Highlight */}
        <Card className="bg-gradient-to-r from-primary/10 via-orange-500/10 to-primary/10 border-primary/30">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Database className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold">Bitcoin Valley</h3>
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our flagship community in Pisac, Peru — the <span className="text-primary font-semibold">"Genesis Block"</span> for the 
              On-Chain Credit Score. Phase 3 proves the protocol before opening to global developers.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

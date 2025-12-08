import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Users, CreditCard, ArrowRight } from "lucide-react";

export default function ScalingPath() {
  const phases = [
    {
      phase: 1,
      icon: Home,
      title: "Build & Validate",
      description: "Complete the first 32 homes. Begin servicing repayments. Build credit records.",
      color: "border-green-500/40 bg-green-500/5",
      iconColor: "text-green-500",
    },
    {
      phase: 2,
      icon: Users,
      title: "Open Platform",
      description: "Open the system to partner developers. Ancient becomes the credit engine for builders across LATAM.",
      color: "border-blue-500/40 bg-blue-500/5",
      iconColor: "text-blue-500",
    },
    {
      phase: 3,
      icon: CreditCard,
      title: "Expand Credit",
      description: "Offer down payment assistance, renovation financing, and additional rent-to-own products built on the same credit score.",
      color: "border-primary/40 bg-primary/5",
      iconColor: "text-primary",
    },
  ];

  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-base px-5 py-1.5 border-primary/50 text-primary">
            Scaling Path
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            From 32 Homes to Global Platform
          </h2>
        </div>

        {/* Phase Timeline */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {phases.map((phase, idx) => (
            <div key={idx} className="relative">
              <Card className={`h-full ${phase.color} border`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-background/50 ${phase.iconColor}`}>
                      <phase.icon className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="text-xs">Phase {phase.phase}</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{phase.title}</h3>
                  <p className="text-muted-foreground">{phase.description}</p>
                </CardContent>
              </Card>
              {idx < phases.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-6 w-6 text-muted-foreground/30" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Line */}
        <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-amber-500/10 rounded-xl border border-primary/20">
          <p className="text-xl font-medium text-foreground">
            Ancient becomes the mortgage infrastructure for a global population that lives across borders.
          </p>
        </div>
      </div>
    </section>
  );
}

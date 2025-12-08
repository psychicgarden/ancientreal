import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Home, Scale, Code2, Settings, CheckCircle2 } from "lucide-react";

export default function TheAsk() {
  const useOfFunds = [
    { icon: Home, label: "Land acquisition", allocation: "40%" },
    { icon: Home, label: "Construction", allocation: "35%" },
    { icon: Scale, label: "Legal structuring", allocation: "10%" },
    { icon: Code2, label: "Technology development", allocation: "10%" },
    { icon: Settings, label: "Mortgage servicing operations", allocation: "5%" },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-base px-5 py-1.5 border-primary/50 text-primary">
            The Ask
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Join the Seed Round
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ancient is raising capital to complete two real estate projects and generate 
            the first large-scale onchain credit dataset for cross-border borrowers.
          </p>
        </div>

        {/* Deal Terms */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-green-500 mb-1">$1.9M</p>
              <p className="text-sm text-muted-foreground">Seed Raise</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/10 border-primary/30">
            <CardContent className="p-6 text-center">
              <Home className="h-10 w-10 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold text-primary mb-1">32</p>
              <p className="text-sm text-muted-foreground">Homes Built</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="p-6 text-center">
              <Scale className="h-10 w-10 text-amber-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-amber-500 mb-1">~15%</p>
              <p className="text-sm text-muted-foreground">Target Ownership</p>
            </CardContent>
          </Card>
        </div>

        {/* Use of Funds */}
        <Card className="bg-card/50 border-border/50 mb-10">
          <CardContent className="p-8">
            <h3 className="font-bold text-lg mb-6 text-center">Use of Funds</h3>
            <div className="space-y-3 max-w-md mx-auto">
              {useOfFunds.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">{item.label}</span>
                  </div>
                  <span className="font-bold text-primary">{item.allocation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Goal */}
        <Card className="bg-primary/5 border-primary/30">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-4">The Goal</h3>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Build and sell 32 homes, originate 32 mortgages, and produce the data 
              required to scale into a global credit platform.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

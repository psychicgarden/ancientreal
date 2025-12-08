import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Receipt, CreditCard, CheckCircle2 } from "lucide-react";

export default function WhatAncientDoes() {
  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-base px-5 py-1.5 border-primary/50 text-primary">
            The Solution
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            What Ancient Does
          </h2>
        </div>

        {/* Core Value Prop */}
        <div className="text-center mb-12">
          <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-4">
            Ancient builds homes and sells them using a <span className="text-primary font-semibold">rent-to-own</span> structure.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Every monthly payment mints a <span className="text-primary font-medium">repayment receipt onchain</span>.
            <br />
            These receipts form a verifiable onchain credit score.
          </p>
        </div>

        {/* Two Benefits */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-primary/5 border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Home Ownership</h3>
              </div>
              <p className="text-muted-foreground">
                Nomads can finally buy a home with reasonable terms — 20% down, fixed interest, clear amortization.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-amber-500/5 border-amber-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <CreditCard className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold">Portable Credit</h3>
              </div>
              <p className="text-muted-foreground">
                They build a global credit record that travels with them — qualifying for financing in any country.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Line */}
        <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-amber-500/10 rounded-xl border border-primary/20">
          <p className="text-lg md:text-xl font-medium text-foreground">
            This is the first mortgage infrastructure built for people who live internationally.
          </p>
        </div>
      </div>
    </section>
  );
}

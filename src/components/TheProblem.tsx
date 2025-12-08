import React from "react";
import { Badge } from "@/components/ui/badge";
import { XCircle, Globe, CreditCard, Building, Plane, Coins } from "lucide-react";

export default function TheProblem() {
  const rejectionReasons = [
    { icon: CreditCard, text: "No local credit history" },
    { icon: Plane, text: "Move countries frequently" },
    { icon: Globe, text: "Cross-border lending does not exist" },
    { icon: Building, text: "Foreign buyer rates are extremely high" },
    { icon: Coins, text: "Banks reject crypto income and remote workers" },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-base px-5 py-1.5 border-destructive/50 text-destructive">
            The Problem
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Digital nomads cannot get a mortgage.{" "}
            <span className="text-destructive">Anywhere.</span>
          </h2>
        </div>

        {/* Main Problem Statement */}
        <div className="mb-12">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 text-center max-w-3xl mx-auto">
            There are more than <span className="text-foreground font-semibold">115 million people</span> earning remote income while living abroad. 
            They earn well, they pay on time, and they travel freely.
          </p>
          <p className="text-xl md:text-2xl text-center font-medium text-foreground mb-10">
            None of that qualifies them for a mortgage.
          </p>
        </div>

        {/* Rejection Reasons */}
        <div className="mb-16">
          <p className="text-lg font-medium text-center mb-6 text-muted-foreground">Banks reject them because:</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {rejectionReasons.map((reason, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg"
              >
                <XCircle className="h-5 w-5 text-destructive shrink-0" />
                <span className="text-sm text-foreground">{reason.text}</span>
              </div>
            ))}
          </div>
          <p className="text-lg text-center mt-8 text-muted-foreground italic">
            They are forced to rent forever.
          </p>
        </div>

        {/* Secondary Problem */}
        <div className="border-t border-border pt-12">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-6">
            There is no global credit system
          </h3>
          <div className="space-y-4 text-center text-muted-foreground max-w-2xl mx-auto">
            <p className="text-lg">Wallet data is not credit history.</p>
            <p className="text-lg">There is no way to verify repayment behavior for someone who lives across borders.</p>
            <p className="text-lg">Long-term lending without local collateral is nearly impossible.</p>
          </div>
          <p className="text-xl text-center mt-8 font-medium text-foreground">
            A high-income global population is locked out of property ownership.
          </p>
        </div>
      </div>
    </section>
  );
}

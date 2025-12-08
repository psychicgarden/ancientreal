import React from "react";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, Scale, FileText, CheckCircle2 } from "lucide-react";

export default function DataLaboratory() {
  const dataPoints = [
    { icon: DollarSign, label: "Real monthly payments", color: "text-green-500" },
    { icon: Users, label: "Real borrower behavior", color: "text-blue-500" },
    { icon: Scale, label: "Real enforcement rights", color: "text-purple-500" },
    { icon: FileText, label: "Real underwriting records", color: "text-amber-500" },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-base px-5 py-1.5 border-primary/50 text-primary">
            Why Real Estate?
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Why Real Estate Is the Right Starting Point
          </h2>
        </div>

        {/* Core Insight */}
        <div className="text-center mb-12">
          <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-4">
            To build a credit system, you need verified repayment and enforcement data.
          </p>
          <p className="text-lg text-muted-foreground">
            Ancient generates this data by developing and selling real homes.
          </p>
        </div>

        {/* Data Points Grid */}
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
          {dataPoints.map((point, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-4 p-5 bg-muted/30 rounded-xl border border-border/50"
            >
              <div className={`p-2 rounded-lg bg-background ${point.color}`}>
                <point.icon className="h-5 w-5" />
              </div>
              <span className="text-lg font-medium text-foreground">{point.label}</span>
            </div>
          ))}
        </div>

        {/* Conclusion */}
        <div className="text-center">
          <p className="text-lg md:text-xl text-muted-foreground mb-4">
            This produces a dataset that lenders can trust.
          </p>
          <p className="text-xl md:text-2xl font-medium text-primary">
            It is the only practical way to bootstrap a global onchain credit score.
          </p>
        </div>
      </div>
    </section>
  );
}

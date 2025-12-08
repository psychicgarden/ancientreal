import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Receipt, Settings, Building2, Database } from "lucide-react";

export default function SimpleBusinessModel() {
  const revenueStreams = [
    {
      icon: TrendingUp,
      title: "Interest Spread",
      description: "Borrow at lower rates, lend at higher rates using risk-adjusted underwriting.",
      color: "text-green-500 bg-green-500/10 border-green-500/30",
    },
    {
      icon: Receipt,
      title: "Origination Fees",
      description: "Paid by buyers at the start of their rent-to-own agreement.",
      color: "text-blue-500 bg-blue-500/10 border-blue-500/30",
    },
    {
      icon: Settings,
      title: "Servicing Fees",
      description: "Monthly fees for managing payment flow, accounting, and enforcement logic.",
      color: "text-purple-500 bg-purple-500/10 border-purple-500/30",
    },
    {
      icon: Building2,
      title: "Construction Margin",
      description: "Early projects create cash flow that funds software development.",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/30",
    },
    {
      icon: Database,
      title: "Credit Data Licensing",
      description: "The onchain credit profiles can be licensed to future lenders.",
      color: "text-primary bg-primary/10 border-primary/30",
    },
  ];

  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-base px-5 py-1.5 border-primary/50 text-primary">
            Business Model
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            How Ancient Makes Money
          </h2>
          <p className="text-lg text-muted-foreground">
            Ancient earns from five core areas:
          </p>
        </div>

        {/* Revenue Streams Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {revenueStreams.map((stream, idx) => (
            <Card key={idx} className={`border ${stream.color.split(' ')[2]}`}>
              <CardContent className="p-6">
                <div className={`inline-flex p-3 rounded-xl mb-4 ${stream.color.split(' ')[1]}`}>
                  <stream.icon className={`h-6 w-6 ${stream.color.split(' ')[0]}`} />
                </div>
                <h3 className="text-lg font-bold mb-2">{stream.title}</h3>
                <p className="text-sm text-muted-foreground">{stream.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Note */}
        <p className="text-center mt-10 text-lg text-muted-foreground">
          These revenue streams grow as the credit dataset expands.
        </p>
      </div>
    </section>
  );
}

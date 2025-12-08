import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Percent, Shield, Building2, TrendingUp } from "lucide-react";

const metrics = [
  {
    label: "Gross Margins",
    value: "44%",
    subtext: "Vertical integration moat",
    icon: Percent,
    color: "text-primary",
  },
  {
    label: "Debt Coverage",
    value: "2.5×",
    subtext: "Rental income vs loan cost",
    icon: Shield,
    color: "text-green-500",
  },
  {
    label: "Units Pipeline",
    value: "32",
    subtext: "Seed-funded (Peru + Brazil)",
    icon: Building2,
    color: "text-blue-500",
  },
  {
    label: "Annual Revenue",
    value: "$345K",
    subtext: "Mortgage book @ 10% APR",
    icon: TrendingUp,
    color: "text-amber-500",
  },
];

export default function CoreMetrics() {
  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-3">
            The Numbers That Matter
          </Badge>
          <h2 className="text-3xl font-bold">
            Unit Economics <span className="text-primary">+ Risk Protection</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <Card 
              key={metric.label} 
              className="bg-card/50 border-border/50 hover:border-primary/30 transition-all"
            >
              <CardContent className="p-5 text-center">
                <metric.icon className={`h-6 w-6 mx-auto mb-2 ${metric.color}`} />
                <p className={`text-2xl md:text-3xl font-bold ${metric.color}`}>
                  {metric.value}
                </p>
                <p className="text-sm font-medium text-foreground mt-1">{metric.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{metric.subtext}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Compact explanation */}
        <div className="mt-6 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
          <span className="text-primary font-medium">44% margins</span> fund 0% loans competitors can't match. 
          <span className="text-green-500 font-medium"> 2.5× coverage</span> means rental income pays investors even if properties don't sell.
        </div>
      </div>
    </section>
  );
}

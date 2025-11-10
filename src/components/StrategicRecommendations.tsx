import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Target, Shield, TrendingUp, Users, DollarSign } from "lucide-react";

export const StrategicRecommendations: React.FC = () => {
  const recommendations = [
    {
      icon: Target,
      title: "Recommended: Tiered Pricing Model",
      description: "Start at 8% APR with 20% cash to capture early adopters, gradually increase to 11.5% APR with 30% cash for later buyers",
      pros: ["Balances revenue maximization with sales velocity", "Creates urgency through progressive pricing", "Adapts to market conditions"],
      impact: "~$18.5M total revenue, 19-23% IRR",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      icon: Users,
      title: "Buyer Affordability Analysis",
      description: "8% APR = $855/mo payment vs 11.5% APR = $1,017/mo payment (+$162/mo). Target demographics: remote workers earning $60k-150k/year",
      pros: ["8% APR accessible to broader market", "11.5% APR still affordable for $80k+ earners", "Both rates competitive vs traditional mortgages"],
      impact: "Market penetration vs revenue optimization",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      icon: Shield,
      title: "Risk Mitigation Strategy",
      description: "Higher cash purchase rates (25-30%) reduce financing risk and accelerate capital recovery",
      pros: ["More upfront capital for next flip", "Lower default risk", "Faster ROI on each property"],
      impact: "De-risked portfolio, improved cash conversion",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20"
    },
    {
      icon: DollarSign,
      title: "Competitive Rate Analysis",
      description: "Traditional mortgages: 6.5-7.5% (requires citizenship). International mortgages: 8-12% (high barriers). Credit cards/personal loans: 15-25%",
      pros: ["8% APR highly competitive for nomads", "11.5% APR still beats alternatives", "No citizenship requirement is key differentiator"],
      impact: "Clear value proposition vs all alternatives",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20"
    },
    {
      icon: TrendingUp,
      title: "Revenue Optimization Timeline",
      description: "Implement dynamic pricing across 18-24 months: Early birds get 8%, mid-buyers get 10%, late adopters get 11.5%",
      pros: ["Rewards early supporters", "Captures market growth", "Maintains sales momentum"],
      impact: "Maximizes total revenue while managing velocity",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20"
    },
  ];

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardContent className="p-8">
        <div className="mb-8">
          <Badge variant="outline" className="mb-3">Strategic Analysis</Badge>
          <h3 className="text-3xl font-bold mb-3">Executive Recommendations</h3>
          <p className="text-lg text-muted-foreground">
            Data-driven insights to optimize revenue while maintaining market penetration
          </p>
        </div>

        <div className="space-y-6">
          {recommendations.map((rec, idx) => {
            const Icon = rec.icon;
            return (
              <div 
                key={idx}
                className={`${rec.bgColor} ${rec.borderColor} border-2 rounded-lg p-6 transition-all hover:shadow-lg`}
              >
                <div className="flex items-start gap-4">
                  <div className={`${rec.color} mt-1`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold mb-2">{rec.title}</h4>
                    <p className="text-muted-foreground mb-4">{rec.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Key Benefits
                        </div>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {rec.pros.map((pro, i) => (
                            <li key={i}>• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-sm font-semibold mb-2">Expected Impact</div>
                        <p className="text-sm text-muted-foreground">{rec.impact}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Box */}
        <div className="mt-8 bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary rounded-full p-3">
              <CheckCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">Recommended Action Plan</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Phase 1 (Flip 1-2):</strong> Launch at 8% APR, 20% cash to build momentum and proof-of-concept
                </p>
                <p>
                  <strong className="text-foreground">Phase 2 (Flip 3-4):</strong> Increase to 10% APR, 25% cash as demand validates pricing power
                </p>
                <p>
                  <strong className="text-foreground">Phase 3 (Flip 5-6):</strong> Target 11.5% APR, 30% cash for premium locations with strong demand
                </p>
                <p className="mt-4 text-foreground font-semibold">
                  Expected Blended Revenue: $18.3-18.7M | IRR: 19-23% | Risk-Adjusted Performance: Optimal
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Target, Shield, TrendingUp, Users, DollarSign } from "lucide-react";
export const StrategicRecommendations: React.FC = () => {
  const recommendations = [{
    icon: Target,
    title: "Recommended: Tiered Pricing Model",
    description: "Start at 8% APR with 20% cash to capture early adopters, gradually increase to 11.5% APR with 30% cash for later buyers",
    pros: ["Balances revenue maximization with sales velocity", "Creates urgency through progressive pricing", "Adapts to market conditions"],
    impact: "~$18.5M total revenue, 19-23% IRR",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20"
  }, {
    icon: Users,
    title: "Buyer Affordability Analysis",
    description: "8% APR = $855/mo payment vs 11.5% APR = $1,017/mo payment (+$162/mo). Target demographics: remote workers earning $60k-150k/year",
    pros: ["8% APR accessible to broader market", "11.5% APR still affordable for $80k+ earners", "Both rates competitive vs traditional mortgages"],
    impact: "Market penetration vs revenue optimization",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20"
  }, {
    icon: Shield,
    title: "Risk Mitigation Strategy",
    description: "Higher cash purchase rates (25-30%) reduce financing risk and accelerate capital recovery",
    pros: ["More upfront capital for next flip", "Lower default risk", "Faster ROI on each property"],
    impact: "De-risked portfolio, improved cash conversion",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20"
  }, {
    icon: DollarSign,
    title: "Competitive Rate Analysis",
    description: "Traditional mortgages: 6.5-7.5% (requires citizenship). International mortgages: 8-12% (high barriers). Credit cards/personal loans: 15-25%",
    pros: ["8% APR highly competitive for nomads", "11.5% APR still beats alternatives", "No citizenship requirement is key differentiator"],
    impact: "Clear value proposition vs all alternatives",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20"
  }, {
    icon: TrendingUp,
    title: "Revenue Optimization Timeline",
    description: "Implement dynamic pricing across 18-24 months: Early birds get 8%, mid-buyers get 10%, late adopters get 11.5%",
    pros: ["Rewards early supporters", "Captures market growth", "Maintains sales momentum"],
    impact: "Maximizes total revenue while managing velocity",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20"
  }];
  return <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      
    </Card>;
};
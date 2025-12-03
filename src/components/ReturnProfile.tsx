import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Rocket, ArrowUpRight } from "lucide-react";

// Exit scenarios data - the hero numbers VCs care about
const exitScenarios = [
  { year: 3, label: "Early M&A", valuation: 33, stakeValue: 5, multiple: 2.6, color: "orange" },
  { year: 5, label: "Series B/C", valuation: 290, stakeValue: 43.5, multiple: 23, color: "blue" },
  { year: 7, label: "IPO-Ready", valuation: 1100, stakeValue: 165, multiple: 87, color: "purple" },
  { year: 10, label: "Full Scale", valuation: 4500, stakeValue: 675, multiple: 355, color: "green" },
];

export default function ReturnProfile() {
  const getColorClass = (color: string, type: 'bg' | 'border' | 'text') => {
    const colors: Record<string, Record<string, string>> = {
      orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
      blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
      purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
      green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
    };
    return colors[color]?.[type] || '';
  };

  return (
    <section className="py-16 px-4 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Header - Lead with stake value */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-green-500/50 text-green-500">
            Exit Value
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your 15% Stake: <span className="text-green-500">$5M → $675M</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Exit value at each milestone on $1.9M working capital
          </p>
        </div>

        {/* Exit Value Cards - Hero Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {exitScenarios.map((scenario) => (
            <Card 
              key={scenario.year} 
              className={`${getColorClass(scenario.color, 'bg')} ${getColorClass(scenario.color, 'border')} border-2 overflow-hidden`}
            >
              <CardContent className="p-6 text-center">
                <Badge className={`mb-3 ${getColorClass(scenario.color, 'bg')} ${getColorClass(scenario.color, 'text')} ${getColorClass(scenario.color, 'border')}`}>
                  Year {scenario.year}
                </Badge>
                <p className="text-xs text-muted-foreground mb-2">{scenario.label}</p>
                
                {/* Hero Number - Stake Value */}
                <p className={`text-4xl font-bold mb-1 ${getColorClass(scenario.color, 'text')}`}>
                  ${scenario.stakeValue >= 1000 ? `${(scenario.stakeValue / 1000).toFixed(1)}B` : `${scenario.stakeValue}M`}
                </p>
                <p className="text-xs text-muted-foreground">15% stake value</p>
                
                <div className="mt-4 pt-4 border-t border-border/30">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valuation</span>
                    <span className="font-medium">
                      ${scenario.valuation >= 1000 ? `${(scenario.valuation / 1000).toFixed(1)}B` : `${scenario.valuation}M`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Return</span>
                    <span className="font-bold text-green-400">{scenario.multiple}×</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Row */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* BTC Return */}
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Target className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">BTC Collateral</p>
                  <p className="text-2xl font-bold text-green-400">$5M Returned</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Full principal return. Never sold, no tax event.
              </p>
            </CardContent>
          </Card>

          {/* Profit Share */}
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profit Share</p>
                  <p className="text-2xl font-bold text-blue-400">15% Annual</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                ~$400K by Year 3 from protocol profits.
              </p>
            </CardContent>
          </Card>

          {/* Working Capital */}
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/20">
                  <ArrowUpRight className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Working Capital</p>
                  <p className="text-2xl font-bold text-primary">$1.9M</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Borrowed from staked BTC. Returns 2.6× to 355×.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Point */}
        <Card className="bg-gradient-to-r from-primary/10 to-green-500/10 border-primary/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Rocket className="h-10 w-10 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold text-lg">The Venture Staking Advantage</p>
                <p className="text-muted-foreground">
                  BTC collateral backs the debt and is returned in full. Equity stake is pure upside.{" "}
                  <span className="text-green-400 font-semibold">Zero capital at risk. Exit value: $5M - $675M.</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

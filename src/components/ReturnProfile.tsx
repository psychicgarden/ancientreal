import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Rocket, ArrowUpRight, AlertCircle } from "lucide-react";
import { EXIT_SCENARIOS, SEED_PHASE, formatCurrency } from "@/lib/businessModelConstants";

// Exit scenarios data from constants
const exitScenarios = [
  { year: 3, ...EXIT_SCENARIOS.year3, color: "orange" },
  { year: 5, ...EXIT_SCENARIOS.year5, color: "blue" },
  { year: 7, ...EXIT_SCENARIOS.year7, color: "purple" },
  { year: 10, ...EXIT_SCENARIOS.year10, color: "green" },
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
            Your 15% Stake: <span className="text-green-500">${formatCurrency(EXIT_SCENARIOS.year3.stakeValue)} → ${formatCurrency(EXIT_SCENARIOS.year10.stakeValue)}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Exit value at each milestone on ${SEED_PHASE.capital}M working capital
          </p>
        </div>

        {/* Exit Value Cards - Hero Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                  {formatCurrency(scenario.stakeValue)}
                </p>
                <p className="text-xs text-muted-foreground">15% stake value</p>
                
                <div className="mt-4 pt-4 border-t border-border/30">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valuation</span>
                    <span className="font-medium">
                      {formatCurrency(scenario.valuation)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Return</span>
                    <span className="font-bold text-green-400">{scenario.multipleOnCapital}×</span>
                  </div>
                </div>

                {/* Institutional Badge */}
                {scenario.phase !== "seed" && (
                  <div className="mt-3 pt-3 border-t border-border/30">
                    <span className="text-[10px] text-amber-400">Requires Institutional Capital</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Institutional Capital Note */}
        <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold text-amber-400">Scale-Phase Dependency: </span>
              <span className="text-muted-foreground">
                Year 3+ exit values require institutional capital deployment (MakerDAO, Centrifuge) 
                targeted for Month 18-24. Year 3 exit is achievable with seed phase alone.
              </span>
            </div>
          </div>
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
                  <p className="text-2xl font-bold text-primary">${SEED_PHASE.capital}M</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Borrowed from staked BTC. Returns {EXIT_SCENARIOS.year3.multipleOnCapital}× to {EXIT_SCENARIOS.year10.multipleOnCapital}×.
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
                  <span className="text-green-400 font-semibold">
                    Principal protected by real estate. Exit value: ${formatCurrency(EXIT_SCENARIOS.year3.stakeValue)} - ${formatCurrency(EXIT_SCENARIOS.year10.stakeValue)}.
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

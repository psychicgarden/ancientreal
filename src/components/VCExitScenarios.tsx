import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Target, Building2, Coins, ArrowRight, CheckCircle2, Info } from "lucide-react";

interface ExitScenario {
  year: number;
  label: string;
  revenue: number;
  multiple: number;
  valuation: number;
  stakeValue: number;
  multipleOnCapital: number;
  exitType: string;
  color: string;
}

const exitScenarios: ExitScenario[] = [
  { year: 3, label: "Early M&A", revenue: 4.2, multiple: 8, valuation: 33, stakeValue: 5, multipleOnCapital: 2.6, exitType: "Strategic Acquisition", color: "orange" },
  { year: 5, label: "Series B/C", revenue: 19.5, multiple: 15, valuation: 290, stakeValue: 43.5, multipleOnCapital: 23, exitType: "Growth Round / M&A", color: "blue" },
  { year: 7, label: "IPO-Ready", revenue: 57, multiple: 20, valuation: 1100, stakeValue: 165, multipleOnCapital: 87, exitType: "IPO / Strategic", color: "purple" },
  { year: 10, label: "Full Scale", revenue: 225, multiple: 20, valuation: 4500, stakeValue: 675, multipleOnCapital: 355, exitType: "IPO / TGE", color: "green" },
];

const comparableExits = [
  { name: "SoFi", year: 2021, type: "SPAC/IPO", valuation: 8.5, revenue: 0.98, multiple: 8.7, category: "Fintech" },
  { name: "Rocket Mortgage", year: 2020, type: "IPO", valuation: 44, revenue: 5.1, multiple: 8.6, category: "Mortgage" },
  { name: "Affirm", year: 2021, type: "IPO", valuation: 24, revenue: 0.87, multiple: 27.6, category: "Fintech" },
  { name: "Divvy Homes", year: 2025, type: "M&A", valuation: 1.0, revenue: 0.15, multiple: 6.7, category: "PropTech" },
  { name: "MakerDAO", year: 2024, type: "FDV", valuation: 6.0, revenue: 0.2, multiple: 30, category: "DeFi/RWA" },
  { name: "Centrifuge", year: 2024, type: "FDV", valuation: 0.4, revenue: 0.02, multiple: 20, category: "RWA" },
];

const multipleJustification = [
  { years: "1-3", multiple: "4-8×", reason: "Real estate company. Revenue from asset sales. RE multiples apply.", icon: Building2 },
  { years: "3-5", multiple: "8-15×", reason: "Platform revenue grows (origination, spread). We're Rocket Mortgage.", icon: TrendingUp },
  { years: "7-10", multiple: "20×", reason: "OCCR data licensing dominates. We're Experian for global credit.", icon: Coins },
];

export default function VCExitScenarios() {
  const [selectedExit, setSelectedExit] = useState<number>(5);
  const currentScenario = exitScenarios.find(s => s.year === selectedExit) || exitScenarios[1];

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
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-green-500/50 text-green-500">
            Exit Value Analysis
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your <span className="text-green-500">15% Stake</span> at Exit
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            $1.9M working capital → potential $675M+ stake value
          </p>
        </div>

        {/* Exit Timeline Selector */}
        <Card className="bg-card/50 border-border/50 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground mb-1">Select Exit Window</p>
                <p className="text-lg font-semibold">Click to see your stake value</p>
              </div>
              
              {/* Timeline */}
              <div className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-2">
                {exitScenarios.map((scenario, index) => (
                  <React.Fragment key={scenario.year}>
                    <button
                      onClick={() => setSelectedExit(scenario.year)}
                      className={`flex flex-col items-center p-4 rounded-xl transition-all min-w-[100px] ${
                        selectedExit === scenario.year
                          ? `${getColorClass(scenario.color, 'bg')} ${getColorClass(scenario.color, 'border')} border-2`
                          : 'bg-muted/30 border border-border/50 hover:bg-muted/50'
                      }`}
                    >
                      <span className={`text-2xl font-bold ${selectedExit === scenario.year ? getColorClass(scenario.color, 'text') : ''}`}>
                        Y{scenario.year}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">{scenario.label}</span>
                    </button>
                    {index < exitScenarios.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 hidden md:block" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Exit Details */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* Main Value Card */}
          <Card className={`lg:col-span-2 ${getColorClass(currentScenario.color, 'bg')} ${getColorClass(currentScenario.color, 'border')} border-2`}>
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <Badge className={`${getColorClass(currentScenario.color, 'bg')} ${getColorClass(currentScenario.color, 'text')} ${getColorClass(currentScenario.color, 'border')}`}>
                  Year {currentScenario.year} Exit
                </Badge>
                <span className="text-sm text-muted-foreground">{currentScenario.exitType}</span>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Stake Value - Hero Number */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Your 15% Stake Value</p>
                  <p className={`text-5xl md:text-6xl font-bold ${getColorClass(currentScenario.color, 'text')}`}>
                    ${currentScenario.stakeValue >= 1000 ? `${(currentScenario.stakeValue / 1000).toFixed(1)}B` : `${currentScenario.stakeValue}M`}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {currentScenario.multipleOnCapital}× on $1.9M working capital
                  </p>
                </div>

                {/* Breakdown */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Revenue</span>
                    <span className="font-bold">${currentScenario.revenue}M</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Multiple</span>
                    <span className="font-bold">{currentScenario.multiple}×</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Enterprise Value</span>
                    <span className="font-bold">${currentScenario.valuation >= 1000 ? `${(currentScenario.valuation / 1000).toFixed(1)}B` : `${currentScenario.valuation}M`}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* BTC Return Card */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Plus: Full BTC Return
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">BTC Collateral</p>
                <p className="text-2xl font-bold text-green-400">$5M Returned</p>
                <p className="text-xs text-muted-foreground mt-1">No tax event, never sold</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">+ Profit Share</p>
                <p className="text-lg font-bold">15% Annual Distributions</p>
                <p className="text-xs text-muted-foreground mt-1">~$400K by Year 3</p>
              </div>
              <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg text-center">
                <p className="text-xs text-primary font-semibold">
                  Zero capital at risk
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Exit Scenarios Table */}
        <Card className="bg-card/50 border-border/50 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Exit Value Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground font-medium">Exit Window</th>
                    <th className="text-right py-3 px-4 text-sm text-muted-foreground font-medium">Revenue</th>
                    <th className="text-right py-3 px-4 text-sm text-muted-foreground font-medium">Multiple</th>
                    <th className="text-right py-3 px-4 text-sm text-muted-foreground font-medium">Valuation</th>
                    <th className="text-right py-3 px-4 text-sm text-muted-foreground font-medium">15% Stake</th>
                    <th className="text-right py-3 px-4 text-sm text-muted-foreground font-medium">Return Multiple</th>
                  </tr>
                </thead>
                <tbody>
                  {exitScenarios.map((scenario) => (
                    <tr 
                      key={scenario.year} 
                      className={`border-b border-border/30 ${selectedExit === scenario.year ? getColorClass(scenario.color, 'bg') : ''}`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getColorClass(scenario.color, 'text')}>
                            Year {scenario.year}
                          </Badge>
                          <span className="text-sm">{scenario.label}</span>
                        </div>
                      </td>
                      <td className="text-right py-4 px-4 font-medium">${scenario.revenue}M</td>
                      <td className="text-right py-4 px-4 font-medium">{scenario.multiple}×</td>
                      <td className="text-right py-4 px-4 font-medium">
                        ${scenario.valuation >= 1000 ? `${(scenario.valuation / 1000).toFixed(1)}B` : `${scenario.valuation}M`}
                      </td>
                      <td className={`text-right py-4 px-4 font-bold ${getColorClass(scenario.color, 'text')}`}>
                        ${scenario.stakeValue >= 1000 ? `${(scenario.stakeValue / 1000).toFixed(0)}M` : `${scenario.stakeValue}M`}
                      </td>
                      <td className="text-right py-4 px-4 font-bold text-green-400">
                        {scenario.multipleOnCapital}×
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Comparables and Multiple Justification */}
        <Tabs defaultValue="comparables" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="comparables">Comparable Exits</TabsTrigger>
            <TabsTrigger value="multiples">Why 20× Multiple?</TabsTrigger>
          </TabsList>

          <TabsContent value="comparables">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Market Comparables
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  How similar companies were valued at exit
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {comparableExits.map((comp) => (
                    <div key={comp.name} className="p-4 bg-muted/30 rounded-lg border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold">{comp.name}</span>
                        <Badge variant="outline" className="text-xs">{comp.category}</Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Exit Type</span>
                          <span>{comp.type} ({comp.year})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Valuation</span>
                          <span className="font-medium">${comp.valuation}B</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Revenue</span>
                          <span>${comp.revenue}B</span>
                        </div>
                        <div className="flex justify-between border-t border-border/50 pt-1 mt-1">
                          <span className="text-muted-foreground">Multiple</span>
                          <span className="font-bold text-primary">{comp.multiple}×</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <p className="text-sm">
                    <span className="font-semibold text-primary">The Narrative:</span>{" "}
                    "We're building the Rocket Mortgage for global nomads. Rocket at 10× would put us at $2.25B on Year 10 revenue. At fintech 20×, we're at $4.5B."
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="multiples">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Multiple Progression Logic
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Why multiples increase as the business model evolves
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {multipleJustification.map((stage, index) => (
                    <div key={stage.years} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 flex-shrink-0">
                        <stage.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">Years {stage.years}</Badge>
                          <span className="font-bold text-lg">{stage.multiple}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{stage.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm font-semibold mb-2">Comparable Justification:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Experian</p>
                      <p className="font-bold">5× (mature)</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">TransUnion</p>
                      <p className="font-bold">4× (mature)</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Affirm</p>
                      <p className="font-bold">8× (growth)</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Early Fintech</p>
                      <p className="font-bold text-primary">15-20× (pre-profit)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

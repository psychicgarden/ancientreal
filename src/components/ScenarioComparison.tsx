import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, CheckCircle, DollarSign, Clock } from "lucide-react";
import { ScenarioResults } from "@/lib/revenueScenarios";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { generateScenarioCashFlow } from "@/lib/revenueScenarios";

interface ScenarioComparisonProps {
  scenarios: ScenarioResults[];
}

export const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({ scenarios }) => {
  return (
    <div className="space-y-8">
      {/* Scenario Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {scenarios.map((scenario, idx) => {
          const colorClass = idx === 0 ? "border-blue-500/50 bg-blue-500/5" : 
                            idx === 1 ? "border-red-500/50 bg-red-500/5" : 
                            "border-purple-500/50 bg-purple-500/5";
          const iconColor = idx === 0 ? "text-blue-500" : 
                           idx === 1 ? "text-red-500" : 
                           "text-purple-500";
          
          return (
            <Card key={scenario.name} className={`${colorClass} border-2`}>
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">
                      {scenario.name}
                    </Badge>
                    {scenario.investorPaybackMonths && (
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {scenario.investorPaybackMonths < 12 
                          ? `${scenario.investorPaybackMonths}mo` 
                          : `${Math.floor(scenario.investorPaybackMonths / 12)}y ${scenario.investorPaybackMonths % 12}m`}
                      </Badge>
                    )}
                  </div>
                  <div className={`text-4xl font-bold ${iconColor}`}>
                    ${scenario.totalRevenue.toFixed(2)}M
                  </div>
                  <div className="text-sm text-muted-foreground">Total Revenue (5yr builds + 15yr income)</div>
                </div>

                <div className="space-y-3 text-sm">
                  {scenario.developmentPhaseCash && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded p-2">
                      <div className="flex justify-between">
                        <span className="text-green-700 dark:text-green-400 font-medium">Dev Phase Cash (Y0-5):</span>
                        <span className="font-bold text-green-700 dark:text-green-400">${scenario.developmentPhaseCash.toFixed(2)}M</span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fees:</span>
                    <span className="font-mono font-semibold">${scenario.platformFees.toFixed(2)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mortgage Interest:</span>
                    <span className="font-mono font-semibold">${scenario.mortgageInterest.toFixed(2)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Appreciation:</span>
                    <span className="font-mono font-semibold">${scenario.appreciationShare.toFixed(2)}M</span>
                  </div>
                  
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IRR:</span>
                      <span className="font-bold">{scenario.irr.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cash Multiple:</span>
                      <span className="font-bold">{scenario.cashMultiple.toFixed(1)}×</span>
                    </div>
                  </div>

                  <div className="bg-background/50 rounded p-3 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Financed units:</span>
                      <span className="font-semibold">{scenario.financedUnits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cash units:</span>
                      <span className="font-semibold">{scenario.cashUnits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg monthly payment:</span>
                      <span className="font-semibold">${Math.round(scenario.avgMonthlyPayment)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Comparison Chart */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold mb-6">Cash Flow Comparison</h3>
          
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={scenarios[0] ? generateScenarioCashFlow(scenarios[0]) : []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="year" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                label={{ value: 'Revenue ($M)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              
              {scenarios.map((scenario, idx) => {
                const data = generateScenarioCashFlow(scenario);
                const colors = ['hsl(217, 91%, 60%)', 'hsl(0, 84%, 60%)', 'hsl(271, 91%, 65%)'];
                return (
                  <Line
                    key={scenario.name}
                    data={data}
                    type="monotone"
                    dataKey="cumulative"
                    name={scenario.name}
                    stroke={colors[idx]}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                );
              })}
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk/Reward Analysis */}
      <div className="grid md:grid-cols-3 gap-6">
        {scenarios.map((scenario, idx) => {
          const risks = idx === 0 
            ? ["Lower returns", "Slower capital growth"]
            : idx === 1
            ? ["Higher monthly payments may slow sales", "Fewer buyers qualify", "Market sensitivity"]
            : ["Complex pricing structure", "Requires dynamic adjustment"];
          
          const rewards = idx === 0
            ? ["Broadest market appeal", "Fastest sales velocity", "Proven model"]
            : idx === 1
            ? ["+$2.46M more revenue (+14%)", "Higher IRR: 20-24%", "More upfront capital"]
            : ["Balanced growth", "Adaptive strategy", "Risk mitigation"];

          return (
            <Card key={scenario.name} className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-4">{scenario.name}</h4>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span className="font-semibold text-sm">Risks</span>
                    </div>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {risks.map((risk, i) => (
                        <li key={i}>• {risk}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-semibold text-sm">Rewards</span>
                    </div>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {rewards.map((reward, i) => (
                        <li key={i}>• {reward}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bitcoin, TrendingUp, Percent, DollarSign, Infinity } from "lucide-react";

export default function VCReturnCalculator() {
  const [btcDeposit, setBtcDeposit] = useState(5000000);
  const [scenario, setScenario] = useState<"bear" | "base" | "bull">("base");
  
  // BTC-Staked Structure
  const workingCapital = btcDeposit * 0.35; // 35% borrowed as stablecoins
  const equityPercent = 0.15;
  const profitSharePercent = 0.15;
  
  // Scenario-based returns
  const scenarios = {
    bear: {
      label: "Bear",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      totalProfit: 10700000, // From 6 flips
      companyValuation: 100000000,
      description: "Conservative: Slower sales, lower margins"
    },
    base: {
      label: "Base",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      totalProfit: 22000000,
      companyValuation: 400000000,
      description: "Expected: On-target execution"
    },
    bull: {
      label: "Bull",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      totalProfit: 46700000,
      companyValuation: 2000000000,
      description: "Optimistic: Fast sales, premium pricing, expansion"
    }
  };
  
  const currentScenario = scenarios[scenario];
  const profitShare = currentScenario.totalProfit * profitSharePercent;
  const equityValue = currentScenario.companyValuation * equityPercent;
  const totalReturn = profitShare + equityValue;
  
  // ROI calculation (capital deployed = $0)
  const roi = "∞"; // Infinite because no capital deployed
  const multiple = totalReturn / workingCapital;

  // Flip progression data
  const flipProgression = [
    { flip: 1, profit: 750000, cumulative: 750000 },
    { flip: 2, profit: 1000000, cumulative: 1750000 },
    { flip: 3, profit: 1300000, cumulative: 3050000 },
    { flip: 4, profit: 2000000, cumulative: 5050000 },
    { flip: 5, profit: 3000000, cumulative: 8050000 },
    { flip: 6, profit: 4500000, cumulative: 12550000 },
  ];

  return (
    <Card className="bg-card/50 backdrop-blur border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bitcoin className="h-5 w-5 text-orange-500" />
          VC Return Calculator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          BTC-Staked Investment: Zero capital deployed, infinite ROI potential
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* BTC Deposit Slider */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>BTC Collateral Deposit</span>
            <span className="font-bold text-orange-500">${(btcDeposit / 1000000).toFixed(1)}M</span>
          </div>
          <Slider
            value={[btcDeposit]}
            onValueChange={(v) => setBtcDeposit(v[0])}
            min={2000000}
            max={10000000}
            step={500000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$2M</span>
            <span>$10M</span>
          </div>
        </div>

        {/* Investment Structure */}
        <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg p-4">
          <div className="text-sm font-medium mb-3">Investment Structure</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">BTC Deposited:</span>
              <span className="float-right font-bold">${(btcDeposit / 1000000).toFixed(1)}M</span>
            </div>
            <div>
              <span className="text-muted-foreground">Working Capital:</span>
              <span className="float-right font-bold text-green-500">${(workingCapital / 1000000).toFixed(2)}M</span>
            </div>
            <div>
              <span className="text-muted-foreground">Equity Stake:</span>
              <span className="float-right font-bold">15%</span>
            </div>
            <div>
              <span className="text-muted-foreground">Profit Share:</span>
              <span className="float-right font-bold">15%</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border/50 text-center">
            <Badge variant="outline" className="text-orange-500 border-orange-500">
              100% BTC Returned • Zero Capital Deployed
            </Badge>
          </div>
        </div>

        {/* Scenario Tabs */}
        <Tabs value={scenario} onValueChange={(v) => setScenario(v as "bear" | "base" | "bull")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bear" className="text-red-500">🐻 Bear</TabsTrigger>
            <TabsTrigger value="base" className="text-yellow-500">📊 Base</TabsTrigger>
            <TabsTrigger value="bull" className="text-green-500">🐂 Bull</TabsTrigger>
          </TabsList>
          
          <TabsContent value={scenario} className="mt-4">
            <div className={`${currentScenario.bgColor} rounded-lg p-4`}>
              <div className="text-xs text-muted-foreground mb-2">{currentScenario.description}</div>
              
              {/* Return Breakdown */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-background/50 rounded-lg p-3 text-center">
                  <Percent className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                  <div className="text-xl font-bold">${(profitShare / 1000000).toFixed(1)}M</div>
                  <div className="text-xs text-muted-foreground">Profit Share (15%)</div>
                </div>
                
                <div className="bg-background/50 rounded-lg p-3 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                  <div className="text-xl font-bold">${(equityValue / 1000000).toFixed(0)}M</div>
                  <div className="text-xs text-muted-foreground">Equity Value (15%)</div>
                </div>
              </div>
              
              {/* Total Return */}
              <div className="mt-4 bg-background/50 rounded-lg p-4 text-center">
                <DollarSign className="h-6 w-6 mx-auto mb-1 text-primary" />
                <div className={`text-3xl font-bold ${currentScenario.color}`}>
                  ${(totalReturn / 1000000).toFixed(0)}M
                </div>
                <div className="text-sm text-muted-foreground">Total Return</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* ROI Display */}
        <div className="bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Return on Investment</div>
              <div className="text-xs text-muted-foreground">Capital deployed by VC: $0</div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Infinity className="h-8 w-8 text-primary" />
                <span className="text-3xl font-bold text-primary">ROI</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {multiple.toFixed(0)}× on working capital
              </div>
            </div>
          </div>
        </div>

        {/* Flip Progression */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Compounding Engine: 6 Flips</div>
          <div className="grid grid-cols-6 gap-1">
            {flipProgression.map((flip) => (
              <div key={flip.flip} className="text-center">
                <div 
                  className="bg-gradient-to-t from-primary to-orange-500 rounded-t mx-auto mb-1"
                  style={{ 
                    height: `${(flip.cumulative / 12550000) * 60}px`, 
                    width: '100%',
                    minHeight: '10px'
                  }}
                />
                <div className="text-xs font-bold">${(flip.profit / 1000000).toFixed(1)}M</div>
                <div className="text-[10px] text-muted-foreground">Flip {flip.flip}</div>
              </div>
            ))}
          </div>
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Total from 6 Flips: </span>
            <span className="font-bold text-primary">$12.55M+ profit</span>
          </div>
        </div>

        {/* Key Points */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-orange-500/10 rounded p-2">
            <div className="font-bold text-orange-500">100%</div>
            <div className="text-muted-foreground">BTC Returned</div>
          </div>
          <div className="bg-green-500/10 rounded p-2">
            <div className="font-bold text-green-500">$0</div>
            <div className="text-muted-foreground">Capital at Risk</div>
          </div>
          <div className="bg-primary/10 rounded p-2">
            <div className="font-bold text-primary">15%</div>
            <div className="text-muted-foreground">Equity + Profit</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

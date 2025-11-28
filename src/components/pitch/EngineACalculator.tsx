import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Bitcoin, Home, TrendingUp, Shield } from "lucide-react";

export default function EngineACalculator() {
  const [btcAmount, setBtcAmount] = useState(150000);
  const [btcPrice, setBtcPrice] = useState(100000);
  
  const btcUnits = btcAmount / btcPrice;
  const ltvRatio = 0.5; // 50% LTV
  const propertyValue = btcAmount * ltvRatio;
  const liquidationThreshold = btcPrice * 0.65; // 65% of current price
  
  // Traditional mortgage comparison (7% over 30 years)
  const traditionalRate = 0.07;
  const termYears = 30;
  const monthlyTraditional = (propertyValue * (traditionalRate/12) * Math.pow(1 + traditionalRate/12, termYears*12)) / (Math.pow(1 + traditionalRate/12, termYears*12) - 1);
  const totalTraditionalPayments = monthlyTraditional * termYears * 12;
  const interestSaved = totalTraditionalPayments - propertyValue;
  
  // BTC appreciation scenario (conservative 15% annual)
  const btcAppreciation = 0.15;
  const btcValueIn5Years = btcAmount * Math.pow(1 + btcAppreciation, 5);
  const btcGains = btcValueIn5Years - btcAmount;

  return (
    <Card className="bg-card/50 backdrop-blur border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bitcoin className="h-5 w-5 text-orange-500" />
          Engine A: HODL Home Calculator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Stake crypto collateral → Get 0% interest mortgage → Keep your upside
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* BTC Collateral Slider */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>BTC Collateral Value</span>
            <span className="font-bold text-orange-500">${btcAmount.toLocaleString()}</span>
          </div>
          <Slider
            value={[btcAmount]}
            onValueChange={(v) => setBtcAmount(v[0])}
            min={50000}
            max={500000}
            step={10000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$50K</span>
            <span>$500K</span>
          </div>
        </div>

        {/* BTC Price Slider */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>BTC Price Assumption</span>
            <span className="font-bold">${btcPrice.toLocaleString()}</span>
          </div>
          <Slider
            value={[btcPrice]}
            onValueChange={(v) => setBtcPrice(v[0])}
            min={50000}
            max={250000}
            step={5000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$50K</span>
            <span>$250K</span>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="bg-background/50 rounded-lg p-4 text-center">
            <Home className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">${propertyValue.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Property Value (50% LTV)</div>
          </div>
          
          <div className="bg-background/50 rounded-lg p-4 text-center">
            <Bitcoin className="h-6 w-6 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">{btcUnits.toFixed(2)} BTC</div>
            <div className="text-xs text-muted-foreground">Collateral Staked</div>
          </div>
          
          <div className="bg-green-500/10 rounded-lg p-4 text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-green-500">${interestSaved.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Interest Saved vs 7% Mortgage</div>
          </div>
          
          <div className="bg-orange-500/10 rounded-lg p-4 text-center">
            <Shield className="h-6 w-6 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold text-orange-500">${liquidationThreshold.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Liquidation Price (65%)</div>
          </div>
        </div>

        {/* BTC Upside */}
        <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">BTC Value in 5 Years (15% CAGR)</div>
              <div className="text-xs text-muted-foreground">You keep 100% of the upside</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-orange-500">${btcValueIn5Years.toLocaleString()}</div>
              <Badge variant="outline" className="text-green-500 border-green-500">
                +${btcGains.toLocaleString()} gains
              </Badge>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-primary/5 rounded p-2">
            <div className="font-bold text-primary">0%</div>
            <div className="text-muted-foreground">Interest Rate</div>
          </div>
          <div className="bg-primary/5 rounded p-2">
            <div className="font-bold text-primary">50%</div>
            <div className="text-muted-foreground">Max LTV</div>
          </div>
          <div className="bg-primary/5 rounded p-2">
            <div className="font-bold text-primary">100%</div>
            <div className="text-muted-foreground">Keep Upside</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, TrendingUp, TrendingDown, Lock, Unlock, AlertTriangle } from "lucide-react";

export const VentureStakingExplainer: React.FC = () => {
  const mechanics = [
    { label: "BTC Collateral Deposited", value: "$5M", note: "Segregated custody (BitGo/Copper)" },
    { label: "Loan-to-Value (LTV)", value: "35%", note: "Conservative vs 50-70% typical" },
    { label: "USDC Borrowed", value: "$1.9M", note: "Deployed to PropCo construction" },
    { label: "Interest Rate", value: "~10% APR", note: "On borrowed USDC" },
    { label: "Liquidation Threshold", value: "150% LTV", note: "BTC must drop 57%+ to trigger" },
  ];

  const scenarios = [
    { btcChange: "-50%", btcValue: 2.5, ltvResult: "76%", status: "safe", statusColor: "text-green-500" },
    { btcChange: "-30%", btcValue: 3.5, ltvResult: "54%", status: "safe", statusColor: "text-green-500" },
    { btcChange: "0%", btcValue: 5.0, ltvResult: "38%", status: "safe", statusColor: "text-green-500" },
    { btcChange: "+50%", btcValue: 7.5, ltvResult: "25%", status: "safe", statusColor: "text-green-500" },
    { btcChange: "+100%", btcValue: 10.0, ltvResult: "19%", status: "safe", statusColor: "text-green-500" },
  ];

  const investorReturns = [
    { type: "OpCo Equity", value: "15%", description: "Stake in tech company (20x multiple at exit)" },
    { type: "PropCo Profit Share", value: "15%", description: "Annual distributions from construction margins" },
    { type: "BTC Return", value: "100%", description: "Full collateral returned at loan repayment" },
    { type: "BTC Appreciation", value: "Unlimited", description: "Investor keeps all BTC upside" },
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-amber-500/50 text-amber-400">
            Venture Staking Mechanics
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How <span className="text-amber-400">$5M BTC</span> Becomes <span className="text-green-500">$1.9M USDC</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Zero capital deployed. Full BTC returned. Maximum upside retained.
          </p>
        </div>

        {/* Mechanics Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* How It Works */}
          <Card className="bg-amber-500/5 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Collateral Mechanics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mechanics.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-background/50 rounded-lg border border-border/50 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.note}</p>
                  </div>
                  <span className="text-xl font-bold text-amber-400">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Investor Returns */}
          <Card className="bg-green-500/5 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-500 flex items-center gap-2">
                <Unlock className="h-5 w-5" />
                What Investors Receive
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {investorReturns.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-background/50 rounded-lg border border-border/50 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{item.type}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <span className="text-xl font-bold text-green-500">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* BTC Price Scenarios */}
        <Card className="bg-card/50 border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              BTC Price Scenario Analysis
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              What happens to collateral at different BTC price levels
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground font-medium">BTC Change</th>
                    <th className="text-right py-3 px-4 text-sm text-muted-foreground font-medium">Collateral Value</th>
                    <th className="text-right py-3 px-4 text-sm text-muted-foreground font-medium">LTV</th>
                    <th className="text-right py-3 px-4 text-sm text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarios.map((scenario, idx) => (
                    <tr key={idx} className="border-b border-border/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {scenario.btcChange.startsWith("-") ? (
                            <TrendingDown className="h-4 w-4 text-red-400" />
                          ) : (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          )}
                          <span className={scenario.btcChange.startsWith("-") ? "text-red-400" : "text-green-500"}>
                            {scenario.btcChange}
                          </span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 font-medium">${scenario.btcValue}M</td>
                      <td className="text-right py-3 px-4 font-medium">{scenario.ltvResult}</td>
                      <td className="text-right py-3 px-4">
                        <Badge variant="outline" className={`${scenario.statusColor} border-green-500/30`}>
                          {scenario.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-amber-400">Liquidation only occurs if BTC drops 57%+</span> from deposit price
                  while loan remains outstanding. Even in a severe bear market, 35% LTV provides substantial buffer.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visual Flow */}
        <Card className="bg-gradient-to-r from-amber-500/10 via-primary/10 to-green-500/10 border-primary/30">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4 text-center">Investment Flow</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              <div className="text-center p-4 bg-amber-500/20 rounded-lg border border-amber-500/30 min-w-[140px]">
                <p className="text-sm text-muted-foreground mb-1">Deposit</p>
                <p className="text-2xl font-bold text-amber-400">$5M BTC</p>
              </div>
              <div className="text-2xl text-primary">→</div>
              <div className="text-center p-4 bg-primary/20 rounded-lg border border-primary/30 min-w-[140px]">
                <p className="text-sm text-muted-foreground mb-1">Borrow at 35% LTV</p>
                <p className="text-2xl font-bold text-primary">$1.9M USDC</p>
              </div>
              <div className="text-2xl text-primary">→</div>
              <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30 min-w-[140px]">
                <p className="text-sm text-muted-foreground mb-1">Returns</p>
                <p className="text-lg font-bold text-green-500">15% Equity + BTC</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-background/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-primary">Key Advantage:</span> No taxable event on BTC.
                Collateral stays in segregated custody. Investor keeps 100% of BTC appreciation.
                Risk is backed by debt-free real estate worth more than the loan.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default VentureStakingExplainer;

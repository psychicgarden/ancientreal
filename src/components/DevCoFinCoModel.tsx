import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Building2, Wallet, Zap, TrendingUp, Shield, RefreshCw, DollarSign, Users, Lock } from "lucide-react";

interface TransactionStep {
  label: string;
  amount: string;
  direction: "in" | "out";
}

const FINCO_ECONOMICS = {
  borrowerRate: 10, // 10% to borrowers
  stakerYield: 7,   // 7% to liquidity providers
  nim: 3,           // 3% Net Interest Margin
};

export default function DevCoFinCoModel() {
  const transactionFlow: TransactionStep[] = [
    { label: "Nomad pays 20% down", amount: "$27K", direction: "in" },
    { label: "FinCo wires 80%", amount: "$108K", direction: "in" },
    { label: "DevCo receives total", amount: "$135K", direction: "out" },
  ];

  return (
    <Card className="bg-card/50 backdrop-blur border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            The Two-Pocket Engine
          </CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            Originate-to-Distribute
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          DevCo builds fast. FinCo holds mortgages. IRR protected.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Two Pocket Structure */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* DevCo Card */}
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
            <CardHeader className="pb-3">
              <Badge className="w-fit bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                DEVCO
              </Badge>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-500" />
                Development Company
              </CardTitle>
              <p className="text-xs text-muted-foreground">Uses VC Seed Money</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {[
                  { icon: Zap, text: "Build → Sell → Recycle" },
                  { icon: DollarSign, text: "Gets cashed out 100% at closing" },
                  { icon: TrendingUp, text: "Capital recycles every 12 months" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <item.icon className="h-4 w-4 text-green-500 shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-green-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Target IRR</span>
                  <Badge className="bg-green-500 text-white">&gt;25%</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  High velocity construction loop
                </p>
              </div>
            </CardContent>
          </Card>

          {/* FinCo Card */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <CardHeader className="pb-3">
              <Badge className="w-fit bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30">
                FINCO
              </Badge>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wallet className="h-5 w-5 text-blue-500" />
                Protocol / Liquidity Pool
              </CardTitle>
              <p className="text-xs text-muted-foreground">Funded by DeFi Yield Seekers</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {[
                  { icon: Users, text: "Stakers deposit USDC" },
                  { icon: TrendingUp, text: `Earn ${FINCO_ECONOMICS.stakerYield}% yield` },
                  { icon: Lock, text: "Mortgages held on-chain" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <item.icon className="h-4 w-4 text-blue-500 shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-blue-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Net Interest Margin</span>
                  <Badge className="bg-blue-500 text-white">{FINCO_ECONOMICS.nim}%</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Borrower pays {FINCO_ECONOMICS.borrowerRate}% → Staker gets {FINCO_ECONOMICS.stakerYield}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Flow */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            Transaction Flow: Selling a $135K Home
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {transactionFlow.map((step, idx) => (
              <div 
                key={idx}
                className={`flex items-center gap-2 p-3 rounded-lg border ${
                  step.direction === "in" 
                    ? "bg-green-500/10 border-green-500/30" 
                    : "bg-primary/10 border-primary/30"
                }`}
              >
                <div className="text-lg font-bold">{idx + 1}</div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">{step.label}</div>
                  <div className={`font-bold ${step.direction === "in" ? "text-green-500" : "text-primary"}`}>
                    {step.amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 bg-primary/10 rounded-lg border border-primary/20 text-center">
            <p className="text-sm font-medium">
              Result: DevCo gets <span className="text-primary font-bold">$135K cash immediately</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              80% ROI on $75K build cost • Capital recycled for next build
            </p>
          </div>
        </div>

        {/* The Rocket Mortgage Pitch */}
        <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg p-4 border border-orange-500/20">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-orange-500 shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold mb-2">The "Rocket Mortgage" Pitch</h4>
              <p className="text-sm text-muted-foreground italic">
                "If you offer mortgages, won't your money be tied up for 15 years?"
              </p>
              <p className="text-sm mt-2">
                <span className="font-semibold">No.</span> We operate like{" "}
                <span className="text-primary font-bold">Rocket Mortgage</span>, not a commercial bank.
                We originate the loan, but the capital comes from our{" "}
                <span className="text-blue-500 font-bold">Liquidity Pool</span> (funded by DeFi stakers).
                DevCo gets cashed out <span className="text-green-500 font-bold">100% at closing</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-green-500/10 rounded-lg p-3">
            <div className="text-lg font-bold text-green-500">&gt;25%</div>
            <div className="text-xs text-muted-foreground">DevCo IRR</div>
          </div>
          <div className="bg-blue-500/10 rounded-lg p-3">
            <div className="text-lg font-bold text-blue-500">{FINCO_ECONOMICS.stakerYield}%</div>
            <div className="text-xs text-muted-foreground">Staker Yield</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-3">
            <div className="text-lg font-bold text-primary">{FINCO_ECONOMICS.borrowerRate}%</div>
            <div className="text-xs text-muted-foreground">Borrower Rate</div>
          </div>
          <div className="bg-orange-500/10 rounded-lg p-3">
            <div className="text-lg font-bold text-orange-500">{FINCO_ECONOMICS.nim}%</div>
            <div className="text-xs text-muted-foreground">Protocol NIM</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

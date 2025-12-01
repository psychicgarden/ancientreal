import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Wallet, TrendingUp, Shield, Users, DollarSign, Building2, Percent, Clock } from "lucide-react";

// FinCo Economics from the Two-Pocket Model
const FINCO_ECONOMICS = {
  borrowerRate: 10.0,    // 10% to borrowers
  stakerYield: 7.0,      // 7% to liquidity providers
  nim: 3.0,              // 3% Net Interest Margin
  targetPoolSize: 5.0,   // $5M target liquidity pool
  avgLoanSize: 108000,   // 80% of $135K avg price
  mortgagesServiced: 88, // ~78% of 112 units financed
};

interface FlowStep {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}

const flowSteps: FlowStep[] = [
  { icon: Users, label: "DeFi Stakers", value: "Deposit USDC", color: "text-blue-500" },
  { icon: Wallet, label: "Liquidity Pool", value: "$5M Target", color: "text-green-500" },
  { icon: Building2, label: "DevCo Purchase", value: "100% at Close", color: "text-primary" },
  { icon: DollarSign, label: "Mortgage Payments", value: "10% APR", color: "text-amber-500" },
  { icon: TrendingUp, label: "Staker Returns", value: "7% Yield", color: "text-emerald-500" },
];

export const FinCoLiquidityPool: React.FC = () => {
  const totalMortgageValue = (FINCO_ECONOMICS.avgLoanSize * FINCO_ECONOMICS.mortgagesServiced) / 1_000_000;
  const annualInterestIncome = totalMortgageValue * (FINCO_ECONOMICS.borrowerRate / 100);
  const annualStakerPayout = FINCO_ECONOMICS.targetPoolSize * (FINCO_ECONOMICS.stakerYield / 100);
  const annualProtocolRevenue = annualInterestIncome - annualStakerPayout;

  return (
    <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="mb-2 border-blue-500/50 text-blue-400">
              Separate Capital Stack
            </Badge>
            <CardTitle className="text-2xl font-bold">
              FinCo Liquidity Pool
            </CardTitle>
            <p className="text-muted-foreground mt-1">
              DeFi-funded mortgage capital — separate from DevCo seed
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-400">
              {FINCO_ECONOMICS.stakerYield}%
            </div>
            <div className="text-sm text-muted-foreground">Staker Yield</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Two-Pocket Explanation */}
        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            Why Separate Capital?
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">DevCo</strong> (VC-funded $1.9M) builds homes and needs fast capital recycling for 25%+ IRR.{" "}
            <strong className="text-foreground">FinCo</strong> (DeFi-funded) holds mortgages long-term for 7% yield.
            Separating these prevents VC capital from being trapped in 15-year loans.
          </p>
        </div>

        {/* Flow Diagram */}
        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
          <h4 className="font-semibold mb-4">Capital Flow</h4>
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
            {flowSteps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center text-center min-w-[80px]">
                  <div className={`p-3 rounded-full bg-background border border-border/50 ${step.color}`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium mt-2">{step.label}</span>
                  <span className="text-xs text-muted-foreground">{step.value}</span>
                </div>
                {idx < flowSteps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Economics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-background/80 rounded-lg p-4 border border-border/50 text-center">
            <Percent className="w-5 h-5 mx-auto mb-2 text-amber-500" />
            <div className="text-2xl font-bold text-amber-500">{FINCO_ECONOMICS.borrowerRate}%</div>
            <div className="text-xs text-muted-foreground">Borrower Rate</div>
          </div>
          <div className="bg-background/80 rounded-lg p-4 border border-border/50 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-2 text-emerald-500" />
            <div className="text-2xl font-bold text-emerald-500">{FINCO_ECONOMICS.stakerYield}%</div>
            <div className="text-xs text-muted-foreground">Staker Yield</div>
          </div>
          <div className="bg-background/80 rounded-lg p-4 border border-border/50 text-center">
            <DollarSign className="w-5 h-5 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">{FINCO_ECONOMICS.nim}%</div>
            <div className="text-xs text-muted-foreground">Protocol NIM</div>
          </div>
          <div className="bg-background/80 rounded-lg p-4 border border-border/50 text-center">
            <Wallet className="w-5 h-5 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold text-blue-500">${FINCO_ECONOMICS.targetPoolSize}M</div>
            <div className="text-xs text-muted-foreground">Target Pool</div>
          </div>
        </div>

        {/* Annual Economics */}
        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Annual Economics (at Scale)
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-foreground">
                ${annualInterestIncome.toFixed(2)}M
              </div>
              <div className="text-xs text-muted-foreground">Interest Income (10%)</div>
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-500">
                ${annualStakerPayout.toFixed(2)}M
              </div>
              <div className="text-xs text-muted-foreground">Staker Payouts (7%)</div>
            </div>
            <div>
              <div className="text-lg font-bold text-primary">
                ${annualProtocolRevenue.toFixed(2)}M
              </div>
              <div className="text-xs text-muted-foreground">Protocol Revenue (3%)</div>
            </div>
          </div>
        </div>

        {/* Liquidity Trigger */}
        <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <h5 className="font-semibold text-amber-400 mb-1">Liquidity Trigger Rule</h5>
              <p className="text-sm text-muted-foreground">
                DevCo only issues mortgages when FinCo pool has funds. Empty pool = cash buyers only.
                Full pool = floodgates open to nomads. This protects DevCo IRR and ensures capital velocity.
              </p>
            </div>
          </div>
        </div>

        {/* How to Participate */}
        <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
          <h5 className="font-semibold mb-3">Staker Benefits</h5>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>7% fixed yield backed by real estate mortgages</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Title-Wrapper NFT collateral — instant liquidation on default</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Monthly USDC distributions from mortgage payments</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>No lock-up — withdraw anytime (subject to pool liquidity)</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinCoLiquidityPool;

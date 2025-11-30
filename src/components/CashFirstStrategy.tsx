import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, TrendingUp, Building2, DollarSign } from "lucide-react";

interface Phase {
  name: string;
  timeline: string;
  cashPercent: number;
  mortgagePercent: number;
  samPercent: number;
  description: string;
  highlight: string;
}

const phases: Phase[] = [
  {
    name: "Phase 1: Cash Heavy",
    timeline: "Years 1-2",
    cashPercent: 40,
    mortgagePercent: 60,
    samPercent: 0,
    description: "Cash buyers replenish construction fund. Mortgages build OCCR proof of concept.",
    highlight: "Prove asset quality for LPs",
  },
  {
    name: "Phase 2: Debt Scale",
    timeline: "Years 3-5",
    cashPercent: 10,
    mortgagePercent: 90,
    samPercent: 0,
    description: "Track record enables $50M RWA Debt Facility from MakerDAO/Centrifuge.",
    highlight: "Mass adoption - become 'The Bank'",
  },
  {
    name: "Phase 3: BlackRock Turn",
    timeline: "Year 5+",
    cashPercent: 5,
    mortgagePercent: 95,
    samPercent: 0,
    description: "Bundle 1,000 mortgages into 'Nomad Bonds' (NFT). Sell to Pension Funds/Aave DAO.",
    highlight: "Securitization - keep Servicing Rights",
  },
];

export default function CashFirstStrategy() {
  return (
    <Card className="bg-card/50 backdrop-blur border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Cash-First Strategy: Phased Evolution
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          40/60 Cash-Heavy → 10/90 Debt Scale → Securitization at Scale
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Phase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {phases.map((phase, idx) => (
            <div key={phase.name} className="relative">
              <Card className={`bg-card/80 border-border/50 h-full ${idx === 0 ? 'ring-2 ring-primary/50' : ''}`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={idx === 0 ? "default" : "outline"} className="text-xs">
                      {phase.timeline}
                    </Badge>
                    {idx < phases.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground hidden lg:block absolute -right-3 top-1/2 z-10" />
                    )}
                  </div>
                  
                  <h4 className="font-semibold text-sm">{phase.name}</h4>
                  
                  {/* Product Mix Bar */}
                  <div className="h-4 rounded-full overflow-hidden flex bg-muted">
                    {phase.cashPercent > 0 && (
                      <div 
                        className="bg-green-500 h-full transition-all" 
                        style={{ width: `${phase.cashPercent}%` }}
                        title={`Cash: ${phase.cashPercent}%`}
                      />
                    )}
                    {phase.mortgagePercent > 0 && (
                      <div 
                        className="bg-primary h-full transition-all" 
                        style={{ width: `${phase.mortgagePercent}%` }}
                        title={`Mortgage: ${phase.mortgagePercent}%`}
                      />
                    )}
                    {phase.samPercent > 0 && (
                      <div 
                        className="bg-orange-500 h-full transition-all" 
                        style={{ width: `${phase.samPercent}%` }}
                        title={`SAM: ${phase.samPercent}%`}
                      />
                    )}
                  </div>
                  
                  {/* Legend */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {phase.cashPercent > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        Cash {phase.cashPercent}%
                      </span>
                    )}
                    {phase.mortgagePercent > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        Mortgage {phase.mortgagePercent}%
                      </span>
                    )}
                    {phase.samPercent > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        SAM {phase.samPercent}%
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground">{phase.description}</p>
                  
                  <div className="pt-2 border-t border-border/50">
                    <span className="text-xs font-medium text-primary">{phase.highlight}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Why Cash-First */}
        <div className="bg-gradient-to-r from-green-500/10 to-primary/10 rounded-lg p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            Why Cash-First?
          </h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <div className="font-medium text-green-500">Maximum Velocity</div>
              <p className="text-muted-foreground text-xs">Cash sales return 100% immediately vs. 20% down + 15-year stream</p>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-primary">Faster Compounding</div>
              <p className="text-muted-foreground text-xs">$1.75M → $10M+ treasury through rapid flip reinvestment</p>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-orange-500">Protocol Validation</div>
              <p className="text-muted-foreground text-xs">Prove construction margins before locking capital in 15-year mortgages</p>
            </div>
          </div>
        </div>

        {/* Key Metrics - Updated for Two-Pocket Model */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-green-500/10 rounded-lg p-3">
            <div className="text-lg font-bold text-green-500">40%</div>
            <div className="text-xs text-muted-foreground">Cash at Start</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-3">
            <div className="text-lg font-bold text-primary">10%</div>
            <div className="text-xs text-muted-foreground">Borrower Rate</div>
          </div>
          <div className="bg-blue-500/10 rounded-lg p-3">
            <div className="text-lg font-bold text-blue-500">7%</div>
            <div className="text-xs text-muted-foreground">Staker Yield</div>
          </div>
          <div className="bg-orange-500/10 rounded-lg p-3">
            <div className="text-lg font-bold text-orange-500">3%</div>
            <div className="text-xs text-muted-foreground">Protocol NIM</div>
          </div>
        </div>

        {/* Liquidity Trigger Rule */}
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/20">
          <h4 className="font-semibold mb-2 flex items-center gap-2 text-orange-500">
            <Zap className="h-4 w-4" />
            IRR Protection Rule
          </h4>
          <p className="text-sm text-muted-foreground italic mb-2">
            "We only issue a mortgage if the External Liquidity Pool has funds to buy the house from DevCo CASH."
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-background/50 rounded">
              <span className="font-medium">Pool Empty →</span> Cash Buyers Only
            </div>
            <div className="p-2 bg-background/50 rounded">
              <span className="font-medium">Pool Full →</span> Open Mortgage Floodgates
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

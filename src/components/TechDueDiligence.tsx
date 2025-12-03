import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Server, 
  Shield, 
  Database, 
  Code, 
  Layers, 
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Wallet,
  FileText,
  TrendingUp,
  Users,
  Lock,
  Zap
} from "lucide-react";

const TechDueDiligence = () => {
  const techStack = [
    { name: "Frontend", tech: "React + TypeScript + Vite", status: "live", icon: Code },
    { name: "Backend", tech: "Supabase (PostgreSQL + Auth + Edge Functions)", status: "live", icon: Database },
    { name: "Smart Contracts", tech: "Solidity (Title-Wrapper NFT, Repayment NFT)", status: "development", icon: FileText },
    { name: "OCCR Engine", tech: "On-Chain Credit Report Data Model", status: "development", icon: Shield },
    { name: "Kill Switch", tech: "Reserva de Dominio Legal Integration", status: "validated", icon: Lock },
  ];

  const productSuite = [
    {
      engine: "Engine A",
      name: "HODL Home",
      target: "Crypto Whales",
      mechanism: "Stake BTC → 0% Mortgage",
      value: "No tax event, keep upside",
      color: "from-amber-500/20 to-orange-500/20",
      borderColor: "border-amber-500/30",
    },
    {
      engine: "Engine B",
      name: "Credit Home",
      target: "Global Nomads",
      mechanism: "10-20% down → 10% APR",
      value: "Builds OCCR credit score",
      color: "from-emerald-500/20 to-teal-500/20",
      borderColor: "border-emerald-500/30",
    },
    {
      engine: "OCCR",
      name: "Credit Report",
      target: "Both Engines",
      mechanism: "Repayment NFTs → Credit Identity",
      value: "Portable, borderless credit",
      color: "from-violet-500/20 to-purple-500/20",
      borderColor: "border-violet-500/30",
    },
  ];

  const technicalMoat = [
    {
      name: "Title-Wrapper NFT",
      description: "Property as NFT containing SPV deed + debt ledger + payment stream",
      defensibility: "First to tokenize full mortgage stack, not just fractional ownership",
      icon: FileText,
    },
    {
      name: "OCCR Data Asset",
      description: "First borderless credit report built from on-chain repayment history",
      defensibility: "Licensable to DeFi protocols (Aave, Compound) seeking real-world credit data",
      icon: Database,
    },
    {
      name: "Kill Switch",
      description: "Legal + smart contract integration for instant default handling",
      defensibility: "No foreclosure courts = 2.5x debt coverage from STR yields",
      icon: Zap,
    },
    {
      name: "Vertical Integration",
      description: "80% ROI from being the General Contractor ($75K build → $135K sale)",
      defensibility: "Customer acquisition subsidy competitors can't match",
      icon: Building2,
    },
  ];

  const evolutionPhases = [
    {
      stage: "Seed Stage",
      title: "Vertical Integration",
      description: "Build 15 homes in Peru",
      purpose: '"Training data" for credit algorithm + proof of legal rails',
      status: "current",
    },
    {
      stage: "Series A",
      title: "Open Protocol",
      description: "3rd party developers (Bali, Tulum, Brazil)",
      purpose: "Stop building, start financing. Buy their inventory for our users.",
      status: "planned",
    },
    {
      stage: "Series B",
      title: "Securitization",
      description: "Bundle mortgages into 'Nomad Bonds'",
      purpose: "Sell to MakerDAO/Pension Funds. Keep servicing rights + data licensing.",
      status: "vision",
    },
  ];

  const techRisks = [
    {
      risk: "Smart Contract Security",
      status: "development",
      mitigation: "Third-party audit planned before mainnet deployment",
      severity: "medium",
    },
    {
      risk: "Multi-Jurisdiction Compliance",
      status: "validated",
      mitigation: "Title Retention validated in Peru. Phased rollout with local counsel.",
      severity: "low",
    },
    {
      risk: "Oracle Integration",
      status: "planned",
      mitigation: "Chainlink integration for property appraisals",
      severity: "medium",
    },
    {
      risk: "OCCR Adoption",
      status: "unproven",
      mitigation: "Start with Engine B users as first cohort. Build proof before licensing.",
      severity: "high",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Live</Badge>;
      case "validated":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Validated</Badge>;
      case "development":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">In Development</Badge>;
      case "planned":
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Planned</Badge>;
      case "unproven":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Unproven</Badge>;
      case "current":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Current</Badge>;
      case "vision":
        return <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">Vision</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "low":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case "medium":
        return <Clock className="h-4 w-4 text-amber-400" />;
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header - Simplified since parent provides context */}
      <div className="text-center space-y-2 mb-4">
        <h3 className="text-2xl font-bold text-foreground">Platform Architecture</h3>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          An honest assessment of what we've built and what's defensible. VCs appreciate candor.
        </p>
      </div>

      {/* Section 1: What We've Built */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            What We've Built
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {techStack.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/30"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.tech}</p>
                  </div>
                </div>
                {getStatusBadge(item.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Protocol Architecture */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Protocol Architecture: OpCo / PropCo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* OpCo */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-violet-500/20">
                  <Code className="h-6 w-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">OpCo</h3>
                  <p className="text-sm text-violet-400">The Tech Layer</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-violet-400" />
                  OCCR Credit Engine
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-violet-400" />
                  Smart Contract Suite
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-violet-400" />
                  Platform UI & APIs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-violet-400" />
                  Brand & Community
                </li>
              </ul>
              <div className="pt-4 border-t border-violet-500/20">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Valuation Multiple</span>
                  <span className="font-bold text-violet-400">20x Revenue</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Investors</span>
                  <span className="font-medium text-foreground">VCs get equity here</span>
                </div>
              </div>
            </div>

            {/* PropCo */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Building2 className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">PropCo</h3>
                  <p className="text-sm text-emerald-400">The Asset Layer</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Legal Title Deeds
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Liquidity Pool
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Mortgage Book
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  STR Yield Assets
                </li>
              </ul>
              <div className="pt-4 border-t border-emerald-500/20">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Valuation Multiple</span>
                  <span className="font-bold text-emerald-400">1x NAV</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Investors</span>
                  <span className="font-medium text-foreground">Yield seekers stake here</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/30">
            <p className="text-sm text-muted-foreground text-center">
              <span className="font-medium text-foreground">Why the split?</span> VCs invest in high-growth tech (OpCo) without balance sheet encumbrance from real estate assets (PropCo).
              This enables 20x revenue valuation vs. 1x NAV for property holdings.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Product Suite */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            The Product Suite: Dual Engines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {productSuite.map((product, index) => (
              <div
                key={index}
                className={`p-5 rounded-xl bg-gradient-to-br ${product.color} border ${product.borderColor}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    {product.engine}
                  </Badge>
                  <span className="font-bold text-foreground">{product.name}</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">Target</p>
                    <p className="text-foreground font-medium">{product.target}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">Mechanism</p>
                    <p className="text-foreground">{product.mechanism}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">Value Prop</p>
                    <p className="text-foreground">{product.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Technical Moat */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Technical Moat: What's Defensible
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {technicalMoat.map((moat, index) => (
              <div
                key={index}
                className="p-5 rounded-xl bg-muted/30 border border-border/30 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <moat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground">{moat.name}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{moat.description}</p>
                <div className="pt-3 border-t border-border/30">
                  <p className="text-xs text-primary font-medium">
                    Defensibility: {moat.defensibility}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Builder → Platform Evolution */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Builder → Platform Evolution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/50 hidden md:block" />
            
            <div className="space-y-6">
              {evolutionPhases.map((phase, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row gap-4 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="flex-1 md:text-right md:pr-8">
                    {index % 2 === 0 && (
                      <div className="p-5 rounded-xl bg-muted/30 border border-border/30">
                        <div className="flex items-center gap-2 justify-end mb-2">
                          {getStatusBadge(phase.status)}
                          <span className="text-xs text-muted-foreground">{phase.stage}</span>
                        </div>
                        <h4 className="font-bold text-foreground mb-1">{phase.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{phase.description}</p>
                        <p className="text-xs text-primary">{phase.purpose}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Center dot */}
                  <div className="hidden md:flex items-center justify-center z-10">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      phase.status === "current" 
                        ? "bg-emerald-500 border-emerald-400" 
                        : "bg-muted border-border"
                    }`} />
                  </div>
                  
                  <div className="flex-1 md:pl-8">
                    {index % 2 !== 0 && (
                      <div className="p-5 rounded-xl bg-muted/30 border border-border/30">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-muted-foreground">{phase.stage}</span>
                          {getStatusBadge(phase.status)}
                        </div>
                        <h4 className="font-bold text-foreground mb-1">{phase.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{phase.description}</p>
                        <p className="text-xs text-primary">{phase.purpose}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Tech Risks & Mitigations */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Tech Risks & Mitigations
            <Badge variant="outline" className="ml-2 text-xs">Honest Assessment</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Risk</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mitigation</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Severity</th>
                </tr>
              </thead>
              <tbody>
                {techRisks.map((item, index) => (
                  <tr key={index} className="border-b border-border/20 hover:bg-muted/20">
                    <td className="py-4 px-4 font-medium text-foreground">{item.risk}</td>
                    <td className="py-4 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{item.mitigation}</td>
                    <td className="py-4 px-4 text-center">{getSeverityIcon(item.severity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-200 text-center">
              <span className="font-medium">VC Note:</span> We present risks honestly because solving them is our job.
              The 12 operational units prove we can execute. The protocol layer is where we need capital to scale.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechDueDiligence;

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Rocket, 
  Shield, 
  Globe, 
  ArrowDown, 
  Zap,
  Users,
  Building,
  Wallet,
  Briefcase,
  Check,
  X
} from "lucide-react";

export default function AWSPitch() {
  const evolutionSteps = [
    { company: "Amazon", action: "built warehouses", result: "to launch AWS", icon: Building },
    { company: "Tesla", action: "built cars", result: "to launch Autopilot", icon: Zap },
    { company: "Rocket", action: "built underwriting", result: "to dominate mortgages", icon: Rocket },
    { company: "Ancient", action: "builds homes", result: "to launch Global Credit Oracle", icon: Globe },
  ];

  const mortgageBlockedSegments = [
    { label: "Digital Nomads", value: "50M → 100M", sublabel: "by 2030", icon: Users },
    { label: "Expats & Cross-Border", value: "87M", sublabel: "workers globally", icon: Globe },
    { label: "Crypto-Native", value: "20-40M", sublabel: "no fiat docs", icon: Wallet },
    { label: "Remote Founders", value: "35M", sublabel: "no credit score", icon: Briefcase },
  ];

  const comparisonData = [
    { feature: "Jurisdiction", rocket: "U.S. only", ancient: "100+ countries", ancientWins: true },
    { feature: "Credit Required", rocket: "FICO score", ancient: "None needed", ancientWins: true },
    { feature: "Income Proof", rocket: "W-2 required", ancient: "BTC collateral accepted", ancientWins: true },
    { feature: "Default Enforcement", rocket: "U.S. courts (2-7 years)", ancient: "30-day recovery", ancientWins: true },
    { feature: "TAM Size", rocket: "$2T (U.S.)", ancient: "$18T (Global)", ancientWins: true },
    { feature: "Asset Ownership", rocket: "Doesn't own homes", ancient: "Holds title until payoff", ancientWins: true },
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-primary/5 via-background to-orange-500/5">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Main Headline */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            We Are Repeating the{" "}
            <span className="bg-gradient-to-r from-primary via-orange-500 to-red-500 bg-clip-text text-transparent">
              Rocket Mortgage Playbook
            </span>
            {" "}— For the Entire World
          </h2>
          
          {/* Zero Foreclosure Risk Badge */}
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-6 py-3 mb-6">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="text-lg font-semibold text-green-500">
              Zero Foreclosure Risk — We Retain Legal Title End-to-End
            </span>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Rocket Mortgage proved digital underwriting works in one country.
            <br />
            <span className="text-primary font-semibold">We prove crypto-collateralized underwriting works in every country.</span>
          </p>
        </div>

        {/* Section 1: Evolution Lineage */}
        <Card className="bg-background/80 border-border/50">
          <CardContent className="p-6 md:p-8">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">
              The Inevitability Pattern
            </Badge>
            <h3 className="text-xl font-bold mb-6">Hardware → Software: The Proven Playbook</h3>
            
            <div className="grid md:grid-cols-4 gap-4">
              {evolutionSteps.map((step, index) => (
                <div key={step.company} className="relative">
                  <div className={`p-4 rounded-xl border ${
                    step.company === "Ancient" 
                      ? "bg-primary/10 border-primary/30" 
                      : "bg-muted/30 border-border/50"
                  }`}>
                    <step.icon className={`h-8 w-8 mb-3 ${
                      step.company === "Ancient" ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <p className={`font-bold ${step.company === "Ancient" ? "text-primary" : ""}`}>
                      {step.company}
                    </p>
                    <p className="text-sm text-muted-foreground">{step.action}</p>
                    <p className="text-sm font-medium mt-1">{step.result}</p>
                  </div>
                  {index < evolutionSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-muted-foreground">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 2: TAM Funnel */}
        <Card className="bg-background/80 border-border/50">
          <CardContent className="p-6 md:p-8">
            <Badge variant="outline" className="mb-4 text-blue-500 border-blue-500/30">
              The Untapped Market Rocket Never Touched
            </Badge>
            <h3 className="text-xl font-bold mb-6">TAM: The $18 Trillion Mortgage Gap</h3>
            
            {/* Funnel Visualization */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border/30">
                <span className="font-medium">Global Home Transactions</span>
                <span className="text-xl font-bold text-muted-foreground">100M/year</span>
              </div>
              <div className="flex justify-center"><ArrowDown className="h-5 w-5 text-muted-foreground" /></div>
              
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/40">
                <span className="font-medium">Cross-Border Purchases</span>
                <span className="text-xl font-bold text-blue-500">18-22M/year</span>
              </div>
              <div className="flex justify-center"><ArrowDown className="h-5 w-5 text-muted-foreground" /></div>
              
              <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-orange-500">Mortgage-Blocked Buyers</span>
                  <span className="text-2xl font-bold text-orange-500">120-150M</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {mortgageBlockedSegments.map((segment) => (
                    <div key={segment.label} className="text-center p-3 bg-background/50 rounded-lg">
                      <segment.icon className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                      <p className="font-bold text-sm">{segment.value}</p>
                      <p className="text-xs text-muted-foreground">{segment.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center"><ArrowDown className="h-5 w-5 text-muted-foreground" /></div>
              
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">Unserved TAM</span>
                  <span className="text-3xl font-bold text-primary">$18 TRILLION</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">120M buyers × $150K avg home = unserved demand</p>
              </div>
            </div>
            
            {/* Bottom Line Stats */}
            <div className="grid md:grid-cols-3 gap-4 p-4 bg-green-500/10 rounded-xl border border-green-500/30">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">0.1% Market Capture</p>
                <p className="text-2xl font-bold text-green-500">$18B</p>
                <p className="text-xs text-muted-foreground">Annual Originations</p>
              </div>
              <div className="text-center border-x border-green-500/20">
                <p className="text-sm text-muted-foreground">At 3% NIM Spread</p>
                <p className="text-2xl font-bold text-green-500">$540M</p>
                <p className="text-xs text-muted-foreground">Net Interest Margin</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Real Estate Required</p>
                <p className="text-2xl font-bold text-green-500">ZERO</p>
                <p className="text-xs text-muted-foreground">To scale at this level</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Rocket vs Ancient Comparison */}
        <Card className="bg-background/80 border-border/50">
          <CardContent className="p-6 md:p-8">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">
              Why Ancient Wins
            </Badge>
            <h3 className="text-xl font-bold mb-6">Rocket Mortgage vs. Ancient Protocol</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Feature</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Rocket Mortgage</th>
                    <th className="text-center py-3 px-4 font-medium text-primary">Ancient Protocol</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row) => (
                    <tr key={row.feature} className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium">{row.feature}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <X className="h-4 w-4 text-red-500" />
                          <span className="text-muted-foreground text-sm">{row.rocket}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-primary font-medium text-sm">{row.ancient}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Underwriting Laboratory */}
        <Card className="bg-gradient-to-r from-primary/10 via-orange-500/10 to-primary/10 border-primary/30">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <div>
                <Badge variant="outline" className="mb-2 text-orange-500 border-orange-500/30">
                  The Underwriting Laboratory
                </Badge>
                <h3 className="text-xl font-bold mb-3">
                  Our First 15-32 Homes Are Not Real Estate Projects
                </h3>
                <p className="text-lg text-muted-foreground mb-4">
                  They are the <span className="text-primary font-semibold">underwriting laboratory</span> for a $750B mortgage gap.
                </p>
                
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "BTC-backed underwriting",
                    "Credit-invisible nomad underwriting",
                    "Global KYC + on-chain repayment identity",
                    "Instant enforceability using title retention",
                    "Risk models lenders can finally price",
                    "Real-world default → recovery → liquidity cycles"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                
                <p className="mt-6 text-lg font-medium">
                  After Peru + Brazil, Ancient stops being a developer and becomes{" "}
                  <span className="text-primary">the Rocket Mortgage of the borderless economy</span> —
                  the underwriting engine that powers thousands of developers globally.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tagline */}
        <div className="text-center">
          <p className="text-2xl font-bold text-muted-foreground">
            <span className="text-primary">ANCIENT PROTOCOL</span>
          </p>
          <p className="text-lg text-muted-foreground italic mt-2">
            Rocket digitized the U.S. mortgage. We digitize the world's mortgage.
          </p>
        </div>

      </div>
    </section>
  );
}

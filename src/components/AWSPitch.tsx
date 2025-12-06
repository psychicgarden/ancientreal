import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Shield, 
  Globe, 
  Users,
  Building,
  TrendingUp,
  Target,
  ChevronDown,
  Home,
  Gavel,
  Scale,
  Zap,
  Check,
  X
} from "lucide-react";

export default function AWSPitch() {
  const [showComparison, setShowComparison] = useState(false);
  const [showLab, setShowLab] = useState(false);

  const stats = [
    {
      value: "115M+",
      label: "Global Mobile Class",
      sublabel: "80M nomads + 35M remote workers",
      icon: Users,
    },
    {
      value: "$1.8T",
      label: "SAM",
      sublabel: "12M active buyers seeking assets",
      icon: Target,
    },
    {
      value: "44%",
      label: "Gross Margins",
      sublabel: "Unfair unit economics",
      icon: TrendingUp,
    },
    {
      value: "12",
      label: "Units Operational",
      sublabel: "Proving the model at 20% yields",
      icon: Building,
    },
  ];

  const comparisonData = [
    { feature: "Jurisdiction", rocket: "U.S. only", ancient: "100+ countries" },
    { feature: "Credit Required", rocket: "FICO score", ancient: "None needed" },
    { feature: "Income Proof", rocket: "W-2 required", ancient: "BTC collateral accepted" },
    { feature: "Default Enforcement", rocket: "U.S. courts (2-7 years)", ancient: "30-day recovery" },
    { feature: "TAM Size", rocket: "$2T (U.S.)", ancient: "$18T (Global)" },
    { feature: "Asset Ownership", rocket: "Doesn't own homes", ancient: "Holds title until payoff" },
  ];

  const labValidations = [
    { icon: Shield, text: "BTC-backed underwriting" },
    { icon: Users, text: "Credit-invisible nomad underwriting" },
    { icon: Globe, text: "Global KYC + on-chain repayment identity" },
    { icon: Gavel, text: "Instant enforceability using title retention" },
    { icon: Scale, text: "Risk models lenders can finally price" },
    { icon: Zap, text: "Real-world default → recovery → liquidity cycles" },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
            Zero Foreclosure Risk — We Retain Legal Title End-to-End
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Building the Rails to Become the{" "}
            <span className="text-primary">Rocket Mortgage</span>
            <br />of International Real Estate
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Rocket Mortgage proved digital underwriting works in one country.
            <br />
            <span className="text-foreground font-medium">
              We prove crypto-collateralized underwriting works in every country.
            </span>
          </p>
        </div>

        {/* 4 Stat Boxes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card/50 border-border/50 hover:border-primary/30 transition-all">
              <CardContent className="p-6 text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.sublabel}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* TAM Breakdown */}
        <Card className="bg-card/30 border-border/50 mb-8">
          <CardContent className="p-6 md:p-8">
            <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
              The Global Mobile Class: 115 Million Strong
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-primary/5 rounded-lg p-5 border border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">80M</div>
                    <div className="text-sm text-muted-foreground">Active Digital Nomads</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Currently traveling or living outside home country. <span className="text-foreground font-medium">63M earn &gt;$50K/year</span>
                </p>
              </div>
              
              <div className="bg-secondary/30 rounded-lg p-5 border border-secondary/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center">
                    <Users className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">35M</div>
                    <div className="text-sm text-muted-foreground">Ready-to-Deploy Remote</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Fully remote in US/UK/EU earning <span className="text-foreground font-medium">&gt;$80K/year</span>. Waiting for permission to leave.
                </p>
              </div>
            </div>

            <div className="text-center p-4 bg-muted/30 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground mb-2">
                A <span className="font-semibold text-foreground">115 million person</span> nation without a bank.
              </p>
              <p className="text-xs text-muted-foreground">
                They earn strong currencies (USD/EUR) but live in high-growth emerging markets. Ancient is the bridge.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Narrative Block */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 mb-8">
          <CardContent className="p-6 md:p-8">
            <div className="space-y-4 text-center max-w-3xl mx-auto">
              <p className="text-foreground">
                <span className="font-semibold">Banks require credit history.</span> Nomads don't have one. Crypto can't use one.
                <br />So we built the missing piece—<span className="text-primary font-semibold">the repayment engine.</span>
              </p>
              
              <p className="text-muted-foreground">
                Unlike traditional mortgages, we retain legal title until final payment.
                <br /><span className="text-foreground">No courts. No foreclosure delays. Zero capital at risk.</span>
              </p>
              
              <p className="text-muted-foreground">
                12 operational units proving the model at 20% real yields.
                <br /><span className="text-primary font-medium">$1.9M to scale the rails globally.</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Collapsible: Comparison Table */}
        <Collapsible open={showComparison} onOpenChange={setShowComparison} className="mb-4">
          <CollapsibleTrigger className="w-full">
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-all cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Scale className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Rocket Mortgage vs. Ancient Protocol</span>
                </div>
                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${showComparison ? 'rotate-180' : ''}`} />
              </CardContent>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-2 bg-card/30 border-border/50">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Feature</th>
                        <th className="text-center py-3 px-4 text-muted-foreground font-medium">Rocket Mortgage</th>
                        <th className="text-center py-3 px-4 text-primary font-medium">Ancient Protocol</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.map((row, index) => (
                        <tr key={index} className="border-b border-border/50 last:border-0">
                          <td className="py-3 px-4 text-foreground font-medium">{row.feature}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <X className="h-4 w-4 text-destructive" />
                              <span className="text-muted-foreground">{row.rocket}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="text-primary font-medium">{row.ancient}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Collapsible: Underwriting Laboratory */}
        <Collapsible open={showLab} onOpenChange={setShowLab} className="mb-12">
          <CollapsibleTrigger className="w-full">
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-all cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">The Underwriting Laboratory: Why We Build 15-32 Homes</span>
                </div>
                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${showLab ? 'rotate-180' : ''}`} />
              </CardContent>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-2 bg-card/30 border-border/50">
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground mb-6">
                  Our first 15-32 homes are not real estate projects.
                  <br />
                  <span className="text-foreground font-medium">They are the underwriting laboratory for a $750B mortgage gap.</span>
                </p>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {labValidations.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <item.icon className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>
                
                <p className="text-center text-sm text-muted-foreground">
                  After Peru + Brazil, Ancient stops being a developer and becomes the
                  <span className="text-primary font-medium"> Rocket Mortgage of the borderless economy</span>
                  —the underwriting engine that powers thousands of developers globally.
                </p>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Final Tagline */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">
            Ancient Protocol
          </p>
          <p className="text-xl md:text-2xl font-semibold text-foreground">
            The Rocket Mortgage for the{" "}
            <span className="text-primary">Borderless Economy</span>
          </p>
        </div>
      </div>
    </section>
  );
}

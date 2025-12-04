import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Info, FileText } from "lucide-react";

export const ModelAssumptions: React.FC = () => {
  const coreAssumptions = [
    { label: "Build cost per unit", value: "$75K", validated: true, note: "Validated in Peru pilot" },
    { label: "Average sale price (Year 1-2)", value: "$135K-$145K", validated: true, note: "Peru/Brazil market" },
    { label: "Down payment (all financed)", value: "30%", validated: false, note: "Industry standard" },
    { label: "Mortgage APR (borrower)", value: "10%", validated: false, note: "Target rate" },
    { label: "VC bridge rate", value: "10%", validated: false, note: "Matches borrower rate" },
    { label: "Default rate target", value: "<5%", validated: false, note: "Kill Switch mitigates" },
    { label: "Platform fee", value: "3%", validated: false, note: "On GMV at closing" },
    { label: "Gross margin", value: "44%", validated: true, note: "Proven in operations" },
  ];

  const dependencies = [
    {
      phase: "Year 3+",
      requirement: "Institutional capital ($5-20M facility)",
      risk: "Medium",
      mitigation: "26 performing mortgages exceed DeFi lender minimums",
    },
    {
      phase: "Year 5+",
      requirement: "200+ partner units originated",
      risk: "High",
      mitigation: "Developer pipeline building; can scale slower if needed",
    },
    {
      phase: "Year 7+",
      requirement: "OCCR adoption by institutional lenders",
      risk: "High",
      mitigation: "Data licensing is optionality, not core thesis requirement",
    },
  ];

  const disclosures = [
    "OCCR data licensing revenue ($15M Year 10) represents strategic optionality, not core thesis dependency",
    "Exit valuations assume successful platform scaling and institutional capital deployment",
    "Conservative scenario (Year 3 @ $7.5M valuation) achievable with seed phase only",
    "All projections beyond Year 2 require successful execution of platform pivot",
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-muted/20 to-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-primary/50 text-primary">
            Full Transparency
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Model <span className="text-primary">Assumptions</span> & Dependencies
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything we're assuming—and what could go wrong
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Core Assumptions */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Core Model Assumptions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {coreAssumptions.map((assumption, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-muted/30 rounded-lg border border-border/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {assumption.validated ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Info className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{assumption.label}</p>
                      <p className="text-xs text-muted-foreground">{assumption.note}</p>
                    </div>
                  </div>
                  <span className="font-bold text-primary">{assumption.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Key Dependencies */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-400" />
                Key Dependencies by Phase
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dependencies.map((dep, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-muted/30 rounded-lg border border-border/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{dep.phase}</Badge>
                    <Badge
                      variant="outline"
                      className={
                        dep.risk === "High"
                          ? "text-red-400 border-red-500/30"
                          : "text-amber-400 border-amber-500/30"
                      }
                    >
                      {dep.risk} Risk
                    </Badge>
                  </div>
                  <p className="font-medium text-sm mb-1">{dep.requirement}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">Mitigation:</span> {dep.mitigation}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Disclosures */}
        <Card className="bg-gradient-to-r from-primary/5 to-amber-500/5 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Important Disclosures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {disclosures.map((disclosure, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="text-primary font-bold">•</span>
                  <span>{disclosure}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Conservative Floor */}
        <Card className="mt-8 bg-green-500/10 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2 text-green-500">Conservative Floor (Seed Phase Only)</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Even if institutional capital never materializes and platform pivot fails,
                  the seed phase alone delivers:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-3 bg-background/50 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">32 Units Built</p>
                    <p className="text-xl font-bold text-green-500">$2.1M Profit</p>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Year 3 Exit</p>
                    <p className="text-xl font-bold text-green-500">$7.5M Valuation</p>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">15% Stake</p>
                    <p className="text-xl font-bold text-green-500">$1.1M Return</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 italic">
                  Plus full $5M BTC collateral returned. Real estate secures principal.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ModelAssumptions;

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, DollarSign, Briefcase, TrendingUp, Lock, Unlock, ArrowRight } from "lucide-react";

export const TheDealSection: React.FC = () => {
  const dealTerms = [
    { label: "BTC Collateral", value: "$5M", note: "Segregated custody (BitGo/Copper)", icon: <Lock className="h-5 w-5 text-amber-400" /> },
    { label: "USDC Borrowed", value: "$1.9M", note: "35% LTV (conservative)", icon: <DollarSign className="h-5 w-5 text-green-500" /> },
    { label: "OpCo Equity", value: "15%", note: "Tech company stake (20x exit)", icon: <TrendingUp className="h-5 w-5 text-primary" /> },
    { label: "PropCo Profit Share", value: "15%", note: "Annual construction margin distributions", icon: <Briefcase className="h-5 w-5 text-blue-400" /> },
  ];

  const exitScenarios = [
    { year: "Year 3", valuation: "$10-12M", stake: "$1.5-1.8M", multiple: "~1×" },
    { year: "Year 5", valuation: "$70-100M", stake: "$10-15M", multiple: "5-8×" },
    { year: "Year 7", valuation: "$300-500M", stake: "$45-75M", multiple: "24-40×" },
    { year: "Exit", valuation: "$1.5B-3B", stake: "$225-450M", multiple: "118-237×" },
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-muted/20 to-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-primary/50 text-primary">
            The Deal
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-amber-400">$5M BTC</span> → <span className="text-green-500">15% Equity</span> + <span className="text-primary">BTC Returned</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Zero capital deployed. Zero taxable event. Maximum upside retained.
          </p>
        </div>

        {/* Visual Flow */}
        <Card className="bg-gradient-to-r from-amber-500/10 via-primary/10 to-green-500/10 border-primary/30 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
              <div className="text-center p-4 bg-amber-500/20 rounded-xl border border-amber-500/30 min-w-[160px]">
                <Lock className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Deposit</p>
                <p className="text-2xl font-bold text-amber-400">$5M BTC</p>
              </div>
              <ArrowRight className="h-8 w-8 text-primary hidden md:block" />
              <div className="text-center p-4 bg-primary/20 rounded-xl border border-primary/30 min-w-[160px]">
                <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Borrow @ 35% LTV</p>
                <p className="text-2xl font-bold text-primary">$1.9M USDC</p>
              </div>
              <ArrowRight className="h-8 w-8 text-primary hidden md:block" />
              <div className="text-center p-4 bg-green-500/20 rounded-xl border border-green-500/30 min-w-[160px]">
                <Unlock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Receive</p>
                <p className="text-lg font-bold text-green-500">15% Equity + BTC</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deal Terms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {dealTerms.map((term, idx) => (
            <Card key={idx} className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-muted rounded-lg">{term.icon}</div>
                  <span className="font-semibold">{term.label}</span>
                </div>
                <p className="text-3xl font-bold text-primary mb-1">{term.value}</p>
                <p className="text-xs text-muted-foreground">{term.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Exit Scenarios Table */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Your 15% Stake Value at Exit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground font-medium">Exit Window</th>
                    <th className="text-right py-3 px-4 text-sm text-muted-foreground font-medium">Valuation</th>
                    <th className="text-right py-3 px-4 text-sm text-muted-foreground font-medium">Your Stake</th>
                    <th className="text-right py-3 px-4 text-sm text-muted-foreground font-medium">Multiple</th>
                  </tr>
                </thead>
                <tbody>
                  {exitScenarios.map((scenario, idx) => (
                    <tr key={idx} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-medium">{scenario.year}</td>
                      <td className="text-right py-3 px-4">{scenario.valuation}</td>
                      <td className="text-right py-3 px-4 font-bold text-green-500">{scenario.stake}</td>
                      <td className="text-right py-3 px-4">
                        <Badge variant="outline" className="border-primary/50 text-primary">
                          {scenario.multiple}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Key Differentiators */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Card className="bg-amber-500/5 border-amber-500/30 p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-amber-400" />
              <div>
                <p className="font-semibold text-amber-400">Zero Tax Event</p>
                <p className="text-xs text-muted-foreground">BTC never sold, no capital gains</p>
              </div>
            </div>
          </Card>
          <Card className="bg-green-500/5 border-green-500/30 p-4">
            <div className="flex items-center gap-3">
              <Lock className="h-6 w-6 text-green-500" />
              <div>
                <p className="font-semibold text-green-500">Full BTC Returned</p>
                <p className="text-xs text-muted-foreground">Keep 100% of appreciation</p>
              </div>
            </div>
          </Card>
          <Card className="bg-primary/5 border-primary/30 p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold text-primary">Real Estate Backing</p>
                <p className="text-xs text-muted-foreground">Debt-free homes as collateral floor</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TheDealSection;
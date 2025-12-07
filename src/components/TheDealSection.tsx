import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, FileText, ArrowRight } from "lucide-react";

export const TheDealSection: React.FC = () => {
  const exitScenarios = [
    { milestone: "Seed", valuation: "$12M", stake: "~15%", note: "SAFE cap" },
    { milestone: "Series A", valuation: "$70-100M", stake: "$10-15M", note: "Post 2 flips" },
    { milestone: "Series B", valuation: "$300-500M", stake: "$45-75M", note: "5k+ mortgages" },
    { milestone: "Exit/IPO", valuation: "$1.5B-3B", stake: "$225-450M", note: "Global platform" },
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-muted/20 to-background">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-primary/50 text-primary">
            The Ask
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-green-500">$1.9M</span> SAFE at <span className="text-primary">$12M</span> Cap
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Standard seed terms. 32 units built. Protocol proven. Platform pivot.
          </p>
        </div>

        {/* Simple Deal Terms */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-green-500 mb-1">$1.9M</p>
              <p className="text-sm text-muted-foreground">Seed Raise</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/10 border-primary/30">
            <CardContent className="p-6 text-center">
              <FileText className="h-10 w-10 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold text-primary mb-1">$12M</p>
              <p className="text-sm text-muted-foreground">SAFE Cap (Negotiable)</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-10 w-10 text-amber-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-amber-400 mb-1">~15%</p>
              <p className="text-sm text-muted-foreground">Target Ownership</p>
            </CardContent>
          </Card>
        </div>

        {/* Use of Funds - Simple */}
        <Card className="bg-card/50 border-border/50 mb-10">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Use of Funds
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <p className="text-2xl font-bold text-foreground">79%</p>
                <p className="text-sm text-muted-foreground">Construction</p>
                <p className="text-xs text-muted-foreground/70">32 units (Peru + Brazil)</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <p className="text-2xl font-bold text-foreground">10%</p>
                <p className="text-sm text-muted-foreground">Tech & Legal</p>
                <p className="text-xs text-muted-foreground/70">Protocol + SPVs</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <p className="text-2xl font-bold text-foreground">6%</p>
                <p className="text-sm text-muted-foreground">Team</p>
                <p className="text-xs text-muted-foreground/70">Operations</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <p className="text-2xl font-bold text-foreground">5%</p>
                <p className="text-sm text-muted-foreground">Marketing</p>
                <p className="text-xs text-muted-foreground/70">HELOC partnerships</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exit Milestones */}
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Valuation Milestones
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
              {exitScenarios.map((scenario, idx) => (
                <React.Fragment key={idx}>
                  <div className="text-center p-3 bg-muted/30 rounded-lg min-w-[120px]">
                    <p className="text-xs text-muted-foreground mb-1">{scenario.milestone}</p>
                    <p className="text-xl font-bold text-primary">{scenario.valuation}</p>
                    <p className="text-xs text-muted-foreground/70">{scenario.note}</p>
                  </div>
                  {idx < exitScenarios.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TheDealSection;
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, DollarSign, Users, Building2, Briefcase, CheckCircle2 } from "lucide-react";

export const CapitalStackExplainer: React.FC = () => {
  const capitalSources = [
    {
      source: "VC Seed Capital",
      amount: 1.9,
      description: "Borrowed against $5M BTC at 35% LTV",
      use: "Construction funding + bridge lending",
      icon: <Briefcase className="h-5 w-5 text-primary" />,
    },
    {
      source: "Cash Sales (6 units)",
      amount: 0.84,
      description: "6 units × $140K average = $840K",
      use: "Immediate capital recycle",
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
    },
    {
      source: "Down Payments (26 units)",
      amount: 1.09,
      description: "26 units × 30% × $140K = $1.09M",
      use: "Partial construction cost recovery",
      icon: <Users className="h-5 w-5 text-blue-400" />,
    },
  ];

  const capitalUses = [
    { use: "Construction (32 units × $75K)", amount: 2.4 },
    { use: "Tech & Legal (protocol, SPVs)", amount: 0.4 },
    { use: "Team & Operations", amount: 0.1 },
    { use: "Marketing & Partnerships", amount: 0.1 },
  ];

  const timeline = [
    { month: "Month 0", action: "Deploy $1.5M to build Flip 1 (15 units Peru)", capital: 1.9 },
    { month: "Month 9", action: "Flip 1 sells → $2.03M gross, $1.38M from buyers", capital: 2.28 },
    { month: "Month 10", action: "Deploy $1.28M to build Flip 2 (17 units Brazil)", capital: 1.0 },
    { month: "Month 18", action: "Flip 2 sells → $2.47M gross, $1.55M from buyers", capital: 3.99 },
    { month: "Month 24", action: "Treasury = ~$4M + mortgage book earning 10% APR", capital: 3.99 },
  ];

  const totalSources = capitalSources.reduce((sum, s) => sum + s.amount, 0);
  const totalUses = capitalUses.reduce((sum, u) => sum + u.amount, 0);

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-muted/20 to-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-green-500/50 text-green-500">
            Capital Stack Transparency
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How <span className="text-green-500">$1.9M</span> Becomes <span className="text-primary">$3.83M</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            VC seed capital + buyer cash flow at closing = complete capital picture
          </p>
        </div>

        {/* Sources & Uses Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Capital Sources */}
          <Card className="bg-green-500/5 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-500 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Capital Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {capitalSources.map((source, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-background/50 rounded-lg border border-border/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg">{source.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{source.source}</span>
                        <span className="text-xl font-bold text-green-500">
                          ${source.amount.toFixed(2)}M
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{source.description}</p>
                      <p className="text-xs text-primary mt-1">{source.use}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">Total Capital Available</span>
                  <span className="text-2xl font-bold text-green-500">${totalSources.toFixed(2)}M</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Capital Uses */}
          <Card className="bg-blue-500/5 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Capital Uses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {capitalUses.map((use, idx) => (
                <div key={idx} className="p-4 bg-background/50 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{use.use}</span>
                    <span className="text-lg font-bold text-blue-400">${use.amount.toFixed(2)}M</span>
                  </div>
                </div>
              ))}
              
              <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">Total Capital Required</span>
                  <span className="text-2xl font-bold text-blue-400">${totalUses.toFixed(2)}M</span>
                </div>
              </div>

              <div className="p-3 bg-primary/10 rounded-lg border border-primary/30 text-center">
                <p className="text-sm font-medium text-primary">
                  Surplus: ${(totalSources - totalUses).toFixed(2)}M working capital buffer
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Capital Timeline */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-primary" />
              Capital Recycling Timeline
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              How seed capital compounds through construction cycles
            </p>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
              
              <div className="space-y-4">
                {timeline.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-4 relative">
                    <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 border border-primary/50 z-10">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 p-4 bg-muted/30 rounded-lg border border-border/50">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <Badge variant="outline" className="mb-1">{event.month}</Badge>
                          <p className="text-sm">{event.action}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Treasury</p>
                          <p className="text-lg font-bold text-green-500">${event.capital.toFixed(2)}M</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Insight */}
        <Card className="mt-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-primary/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h3 className="font-bold mb-2">Why This Math Works</h3>
                <p className="text-sm text-muted-foreground">
                  VCs often ask: "How does $1.9M fund $2.4M in construction?"
                  <span className="text-green-500 font-semibold"> Answer: It doesn't need to.</span>
                  {" "}Buyer cash flow ($1.93M from cash sales + down payments) arrives at closing,
                  recycling into subsequent construction. The $1.9M is the <span className="text-primary font-semibold">catalyst</span>,
                  not the complete capital source.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CapitalStackExplainer;

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, FileCheck, TrendingUp, Landmark, Globe, CheckCircle2 } from "lucide-react";

interface MilestoneProps {
  period: string;
  title: string;
  description: string;
  metrics: { label: string; value: string }[];
  icon: React.ReactNode;
  status: "complete" | "active" | "pending";
}

const Milestone: React.FC<MilestoneProps> = ({ period, title, description, metrics, icon, status }) => {
  const statusColors = {
    complete: "border-green-500/50 bg-green-500/5",
    active: "border-primary/50 bg-primary/5",
    pending: "border-border/50 bg-card/50",
  };
  
  const badgeColors = {
    complete: "bg-green-500/20 text-green-400",
    active: "bg-primary/20 text-primary",
    pending: "bg-muted text-muted-foreground",
  };

  return (
    <Card className={`${statusColors[status]} transition-all`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${status === "complete" ? "bg-green-500/20" : status === "active" ? "bg-primary/20" : "bg-muted"}`}>
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={badgeColors[status]}>{period}</Badge>
              {status === "complete" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
            </div>
            <h3 className="text-xl font-bold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <div className="grid grid-cols-2 gap-3">
              {metrics.map((metric, idx) => (
                <div key={idx} className="p-2 bg-background/50 rounded-lg text-center">
                  <p className="text-lg font-bold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const InstitutionalCapitalTimeline: React.FC = () => {
  const milestones: MilestoneProps[] = [
    {
      period: "Months 0-12",
      title: "Flip 1: Genesis (Peru)",
      description: "Build and sell 15 units in Pisac, Peru. Originate first 12 mortgages. Prove Title Retention legal structure works.",
      metrics: [
        { label: "Units Built", value: "15" },
        { label: "Mortgages", value: "12" },
        { label: "Mortgage Book", value: "$1.13M" },
        { label: "Legal Structure", value: "Proven" },
      ],
      icon: <Building2 className="h-6 w-6 text-green-500" />,
      status: "active",
    },
    {
      period: "Months 12-24",
      title: "Flip 2: Scale (Brazil)",
      description: "Build and sell 17 units in Bahia, Brazil. Prove multi-jurisdiction execution with Alienação Fiduciária structure.",
      metrics: [
        { label: "Units Built", value: "17" },
        { label: "Mortgages", value: "14" },
        { label: "Total Book", value: "$2.55M" },
        { label: "Jurisdictions", value: "2" },
      ],
      icon: <Globe className="h-6 w-6 text-primary" />,
      status: "pending",
    },
    {
      period: "Months 18-24",
      title: "Institutional Outreach",
      description: "Apply to MakerDAO, Centrifuge, and traditional RWA lenders with 26+ performing mortgage track record.",
      metrics: [
        { label: "Performing Loans", value: "26+" },
        { label: "Default Rate", value: "Target 0%" },
        { label: "OCCR Data Points", value: "1,000+" },
        { label: "Facility Target", value: "$5-20M" },
      ],
      icon: <FileCheck className="h-6 w-6 text-purple-400" />,
      status: "pending",
    },
    {
      period: "Months 24-36",
      title: "Institutional Capital Deployed",
      description: "Secure $5-20M facility at 6-8% APR. Replace VC bridge capital. Scale to 100+ units/year.",
      metrics: [
        { label: "Facility Size", value: "$5-20M" },
        { label: "Cost of Capital", value: "6-8%" },
        { label: "Spread (NIM)", value: "2-4%" },
        { label: "Annual Capacity", value: "100+ units" },
      ],
      icon: <Landmark className="h-6 w-6 text-amber-500" />,
      status: "pending",
    },
    {
      period: "Year 3+",
      title: "Protocol Scale",
      description: "Become the standard for cross-border mortgage origination. Partner developers use Ancient rails. OCCR becomes global credit identity.",
      metrics: [
        { label: "GMV Target", value: "$50M+" },
        { label: "Partner Developers", value: "10+" },
        { label: "OCCR Users", value: "1,000+" },
        { label: "Revenue Multiple", value: "20x" },
      ],
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      status: "pending",
    },
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-purple-500/50 text-purple-400">
            Path to Scale
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Institutional Capital Timeline
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From $1.9M seed to institutional lending facility. 
            <span className="text-purple-400 font-semibold"> 26 mortgages prove the model.</span>
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-6 relative">
          {/* Vertical line connector */}
          <div className="absolute left-[2.75rem] top-0 bottom-0 w-0.5 bg-border/50 hidden md:block" />
          
          {milestones.map((milestone, idx) => (
            <Milestone key={idx} {...milestone} />
          ))}
        </div>

        {/* Key Insight */}
        <Card className="mt-8 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h3 className="font-bold mb-2">Why 26 Mortgages Matter</h3>
                <p className="text-sm text-muted-foreground">
                  Institutional DeFi lenders (MakerDAO, Centrifuge, Goldfinch) require <span className="text-amber-400 font-semibold">minimum 20 performing loans</span> to 
                  evaluate credit quality. Our seed-funded 32 units generate 26 mortgages, exceeding this threshold and providing:
                </p>
                <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                  <li>• Statistical significance for default rate analysis</li>
                  <li>• Multi-jurisdiction legal structure validation</li>
                  <li>• OCCR credit data for underwriting models</li>
                  <li>• Proof of Title Retention enforcement</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default InstitutionalCapitalTimeline;

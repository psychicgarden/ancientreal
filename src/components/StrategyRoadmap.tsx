import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Home, Building2, Coins, ArrowRight } from "lucide-react";

const phases = [
  {
    stage: "Seed Stage",
    timing: "Now",
    title: "Vertical Integration",
    icon: Settings,
    action: "Build and operate the first 15-32 homes in our Peru \"R&D Lab.\"",
    goal: "Control all variables to perfect the legal rails (Title Retention) and data rails (OCCR).",
    highlight: "Our construction margin subsidizes the tech build.",
    status: "active"
  },
  {
    stage: "Series A",
    timing: "Year 2",
    title: "Horizontal Scale",
    icon: Building2,
    action: "Open the protocol to accredited 3rd party developers in LATAM & beyond (Mexico, Bali, Brazil).",
    goal: "Become the \"Global Divvy.\"",
    highlight: "We stop building; we start financing. From 15 homes to 1,000 homes without laying a brick.",
    status: "upcoming"
  },
  {
    stage: "Series B",
    timing: "Year 4",
    title: "Securitization",
    icon: Coins,
    action: "Bundle thousands of mortgage NFTs into \"Ancient Bonds\" (yield-bearing tokens).",
    goal: "Sell these bonds to MakerDAO, pension funds, and L1 treasuries.",
    highlight: "Become the \"BlackRock of On-Chain Mortgages.\"",
    status: "future"
  }
];

const StrategyRoadmap = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-primary border-primary/30">
            The Strategy
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            From a Controlled Lab to a<br />
            <span className="text-primary">Global Mortgage Standard</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three phases to transform from property developer to the infrastructure layer for borderless mortgages.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-primary/30 -translate-y-1/2 z-0" />
          
          {/* Phases */}
          <div className="grid md:grid-cols-3 gap-6 relative z-10">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              return (
                <Card 
                  key={phase.title}
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    phase.status === 'active' 
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                      : 'border-border/50 bg-card'
                  }`}
                >
                  {/* Phase Indicator */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50" />
                  
                  <CardContent className="pt-6 pb-6 space-y-4">
                    {/* Stage Badge */}
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={phase.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {phase.stage} • {phase.timing}
                      </Badge>
                      <div className={`p-2 rounded-full ${
                        phase.status === 'active' ? 'bg-primary/20' : 'bg-muted'
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          phase.status === 'active' ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-foreground">
                      {phase.title}
                    </h3>

                    {/* Action */}
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Action:</span> {phase.action}
                      </p>
                      
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Goal:</span> {phase.goal}
                      </p>
                    </div>

                    {/* Highlight */}
                    <div className={`p-3 rounded-lg text-sm font-medium ${
                      phase.status === 'active' 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'bg-muted text-foreground'
                    }`}>
                      {phase.highlight}
                    </div>

                    {/* Arrow to next phase (except last) */}
                    {index < phases.length - 1 && (
                      <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                        <div className="bg-background border border-border rounded-full p-1">
                          <ArrowRight className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bottom Caption */}
        <p className="text-center text-sm text-muted-foreground mt-8 max-w-xl mx-auto">
          <span className="font-semibold">Scale / Capital Efficiency</span> increases as we move from building homes to financing homes to securitizing mortgages.
        </p>
      </div>
    </section>
  );
};

export default StrategyRoadmap;

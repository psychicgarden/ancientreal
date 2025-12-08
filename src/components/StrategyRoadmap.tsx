import { Card } from "@/components/ui/card";
import { Settings, Home, Coins } from "lucide-react";

const StrategyRoadmap = () => {
  const phases = [
    {
      stage: "Seed Stage – Now",
      title: "Vertical Integration",
      icon: Settings,
      action: 'Build and operate the first 15-43 homes in our Peru "R&D Lab."',
      goal: "Control all variables to perfect the legal rails (Title Retention) and data rails (OCCR). Our construction margin subsidizes the tech build.",
      position: "left",
    },
    {
      stage: "Series A – Year 2",
      title: "Horizontal Scale",
      icon: Home,
      action: "Open the protocol to accredited 3rd party developers in LATAM & beyond (Mexico, Bali, Brazil).",
      goal: 'Become the "Global Divvy." We stop building; we start financing. We move from financing 15 homes to 1,000 homes without laying a brick.',
      position: "center",
    },
    {
      stage: "Series B – Year 4",
      title: "Securitization",
      icon: Coins,
      action: 'Bundle thousands of mortgage NFTs into "Ancient Bonds" (yield-bearing tokens).',
      goal: 'Sell these bonds to MakerDAO, pension funds, and L1 treasuries. Become the "BlackRock of On-Chain Mortgages."',
      position: "right",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
            The Strategy: From a Controlled Lab
            <br />
            <span className="italic text-primary">to a Global Mortgage Standard.</span>
          </h2>
        </div>

        {/* Roadmap Visual */}
        <div className="relative max-w-6xl mx-auto">
          {/* Curved Arrow Path - SVG */}
          <div className="hidden md:block absolute inset-0 z-0">
            <svg
              viewBox="0 0 1000 400"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              {/* Main curve */}
              <path
                d="M 50 350 Q 200 340 350 280 Q 500 220 650 150 Q 800 80 950 30"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="4"
                strokeLinecap="round"
                className="opacity-60"
              />
              {/* Arrow head */}
              <polygon
                points="940,40 960,25 945,55"
                fill="hsl(var(--primary))"
                className="opacity-80"
              />
              {/* Phase dots */}
              <circle cx="120" cy="340" r="12" fill="hsl(var(--primary))" />
              <circle cx="500" cy="200" r="12" fill="hsl(var(--primary))" />
              <circle cx="880" cy="50" r="12" fill="hsl(var(--primary))" />
            </svg>
          </div>

          {/* Y-Axis Label */}
          <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
            <span className="text-sm text-muted-foreground font-medium tracking-wider">
              Scale / Capital Efficiency
            </span>
          </div>

          {/* Phase Cards */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative z-10">
            {phases.map((phase, index) => (
              <Card
                key={phase.title}
                className={`p-6 bg-card/80 backdrop-blur border-border/50 hover:border-primary/30 transition-all duration-300 ${
                  index === 0 ? "md:mt-48" : index === 1 ? "md:mt-24" : "md:mt-0"
                }`}
              >
                {/* Icon & Stage */}
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <phase.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                    {phase.stage}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {phase.title}
                </h3>

                {/* Action */}
                <div className="mb-4">
                  <span className="text-sm font-semibold text-primary">Action: </span>
                  <span className="text-sm text-muted-foreground">{phase.action}</span>
                </div>

                {/* Goal */}
                <div className="pt-4 border-t border-border/50">
                  <span className="text-sm font-semibold text-primary">Goal: </span>
                  <span className="text-sm text-muted-foreground">{phase.goal}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* X-Axis Label */}
          <div className="text-center mt-8 md:mt-12">
            <span className="text-sm text-muted-foreground font-medium tracking-wider">
              Time / Evolution →
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrategyRoadmap;

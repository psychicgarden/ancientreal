import { Settings, Home, Coins, ArrowRight, Globe, Zap, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Import beautiful property images
import villaTulum from "@/assets/villa-tulum.jpg";
import villaBali from "@/assets/villa-bali.jpg";
import ecoSmartCity from "@/assets/eco-smart-city.jpg";

const StrategyRoadmap = () => {
  const phases = [
    {
      stage: "Seed Stage – Now",
      title: "Vertical Integration",
      subtitle: "The R&D Lab",
      icon: Settings,
      action: 'Build and operate the first 32 homes across Peru & Brazil as our "R&D Lab."',
      goal: "Control all variables to perfect the legal rails (Title Retention) and data rails (OCCR). Our 44% construction margin subsidizes the tech build.",
      image: villaTulum,
      metrics: ["32 homes", "44% margins", "2 countries"],
      gradient: "from-amber-600/90 to-orange-800/90",
      color: "amber",
    },
    {
      stage: "Series A – Year 2",
      title: "Horizontal Scale",
      subtitle: "The Global Divvy",
      icon: Home,
      action: "Open the protocol to accredited 3rd party developers in LATAM & beyond (Mexico, Bali, Thailand).",
      goal: 'Become the "Global Divvy." We stop building; we start financing. From 32 homes to 1,000+ homes without laying a brick.',
      image: villaBali,
      metrics: ["1,000+ homes", "Zero construction", "Global reach"],
      gradient: "from-emerald-600/90 to-teal-800/90",
      color: "emerald",
    },
    {
      stage: "Series B – Year 4",
      title: "Securitization",
      subtitle: "The BlackRock Play",
      icon: Coins,
      action: 'Bundle thousands of mortgage NFTs into "Ancient Bonds" (yield-bearing tokens).',
      goal: 'Sell these bonds to MakerDAO, pension funds, and L1 treasuries. Become the "BlackRock of On-Chain Mortgages."',
      image: ecoSmartCity,
      metrics: ["$1B+ AUM", "Institutional", "Protocol Exit"],
      gradient: "from-violet-600/90 to-purple-900/90",
      color: "violet",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Mission Statement - The "Why" */}
        <div className="max-w-4xl mx-auto text-center mb-20 md:mb-28">
          {/* Kicker */}
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Our Vision
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary" />
          </div>

          {/* Mission */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-tight mb-8">
            We're building the{" "}
            <span className="font-bold bg-gradient-to-r from-primary via-orange-500 to-red-500 bg-clip-text text-transparent">
              mortgage infrastructure
            </span>{" "}
            that banks can't—and won't—build.
          </h2>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Traditional banks require FICO scores, W-2 income, and local residency. 
            That locks out <span className="text-foreground font-medium">50M+ digital nomads</span> earning 
            $5K-$15K/month with perfect payment ability but zero credit history.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-10">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Globe className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold text-foreground">50M+</span>
              </div>
              <span className="text-sm text-muted-foreground">Nomads Excluded</span>
            </div>
            <div className="h-12 w-px bg-border hidden md:block" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap className="h-5 w-5 text-amber-500" />
                <span className="text-3xl font-bold text-foreground">$900B</span>
              </div>
              <span className="text-sm text-muted-foreground">Annual Dead Rent</span>
            </div>
            <div className="h-12 w-px bg-border hidden md:block" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Target className="h-5 w-5 text-emerald-500" />
                <span className="text-3xl font-bold text-foreground">0</span>
              </div>
              <span className="text-sm text-muted-foreground">Global Solutions</span>
            </div>
          </div>
        </div>

        {/* Roadmap Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-base px-6 py-2 border-primary/50 text-primary">
            The Phased Roadmap
          </Badge>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            From a Controlled Lab
          </h3>
          <h3 className="text-3xl md:text-4xl font-bold italic bg-gradient-to-r from-primary via-orange-500 to-red-500 bg-clip-text text-transparent">
            to a Global Mortgage Standard
          </h3>
        </div>

        {/* Phase Cards */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-violet-500 transform -translate-y-1/2 z-0 opacity-20" />
          
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-6 relative z-10">
            {phases.map((phase, index) => (
              <div
                key={phase.title}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-[520px] md:h-[560px] rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
                  {/* Background Image */}
                  <img
                    src={phase.image}
                    alt={phase.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${phase.gradient} opacity-90`} />
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-3xl transform -translate-x-24 translate-y-24" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between text-white">
                    {/* Top Section */}
                    <div>
                      {/* Phase Number + Stage */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-white text-xl border border-white/30">
                            {index + 1}
                          </div>
                          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                            <phase.icon className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <span className="text-xs font-semibold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full uppercase tracking-wider">
                          {phase.stage}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                        {phase.title}
                      </h3>
                      <p className="text-lg font-medium text-white/80 italic">
                        {phase.subtitle}
                      </p>
                    </div>

                    {/* Middle - Metrics Pills */}
                    <div className="flex flex-wrap gap-2 my-4">
                      {phase.metrics.map((metric) => (
                        <span
                          key={metric}
                          className="text-sm font-semibold bg-white/25 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>

                    {/* Bottom Section */}
                    <div className="space-y-3">
                      {/* Action */}
                      <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                        <span className="text-xs font-bold uppercase tracking-wider text-white/60 mb-1 block">
                          Action
                        </span>
                        <p className="text-sm leading-relaxed text-white/95">
                          {phase.action}
                        </p>
                      </div>

                      {/* Goal */}
                      <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                        <span className="text-xs font-bold uppercase tracking-wider text-white/60 mb-1 block">
                          Goal
                        </span>
                        <p className="text-sm leading-relaxed text-white/95">
                          {phase.goal}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow Connector - Desktop Only */}
                {index < phases.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-20">
                    <div className="w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-lg">
                      <ArrowRight className="w-3 h-3 text-primary" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Label */}
        <div className="flex items-center justify-center mt-14 md:mt-20">
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
            <span className="text-sm font-medium tracking-wider uppercase">
              Time / Evolution
            </span>
            <ArrowRight className="w-4 h-4" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
          </div>
        </div>

        {/* Bottom Insight Card */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-br from-primary/5 via-muted/30 to-primary/10 border border-primary/20 overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 text-center">
              <div className="text-4xl mb-4">🏗️ → 💻</div>
              <h4 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                Hardware-enabled software play
              </h4>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We build <span className="text-primary font-semibold">32 homes</span> to prove the rails work, 
                then finance <span className="text-emerald-500 font-semibold">10,000+</span> without touching concrete. 
                <span className="block mt-2 text-foreground font-medium">
                  The homes are the training data. The protocol is the product.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrategyRoadmap;
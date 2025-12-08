import { Settings, Home, Coins, ArrowRight } from "lucide-react";

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
      action: 'Build and operate the first 15-43 homes in our Peru "R&D Lab."',
      goal: "Control all variables to perfect the legal rails (Title Retention) and data rails (OCCR). Our construction margin subsidizes the tech build.",
      image: villaTulum,
      metrics: ["15-43 homes", "44% margins", "Peru launch"],
      gradient: "from-amber-600/90 to-orange-800/90",
    },
    {
      stage: "Series A – Year 2",
      title: "Horizontal Scale",
      subtitle: "The Global Divvy",
      icon: Home,
      action: "Open the protocol to accredited 3rd party developers in LATAM & beyond (Mexico, Bali, Brazil).",
      goal: 'Become the "Global Divvy." We stop building; we start financing. From 15 homes to 1,000 homes without laying a brick.',
      image: villaBali,
      metrics: ["1,000+ homes", "Zero construction", "Global reach"],
      gradient: "from-emerald-600/90 to-teal-800/90",
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
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              The Phased Roadmap
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-4">
            From a Controlled Lab
          </h2>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold italic bg-gradient-to-r from-primary via-orange-500 to-red-500 bg-clip-text text-transparent">
            to a Global Mortgage Standard
          </h2>
        </div>

        {/* Phase Cards - Horizontal Scroll on Mobile, Grid on Desktop */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-violet-500 transform -translate-y-1/2 z-0 opacity-30" />
          
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-6 relative z-10">
            {phases.map((phase, index) => (
              <div
                key={phase.title}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-[500px] md:h-[550px] rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
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
                  <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                    {/* Top Section */}
                    <div>
                      {/* Stage Badge */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                          <phase.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-semibold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full uppercase tracking-wider">
                          {phase.stage}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                        {phase.title}
                      </h3>
                      <p className="text-lg font-medium text-white/80 italic mb-6">
                        {phase.subtitle}
                      </p>
                    </div>

                    {/* Middle - Metrics Pills */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {phase.metrics.map((metric) => (
                        <span
                          key={metric}
                          className="text-sm font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>

                    {/* Bottom Section */}
                    <div className="space-y-4">
                      {/* Action */}
                      <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                        <span className="text-xs font-bold uppercase tracking-wider text-white/70 mb-1 block">
                          Action
                        </span>
                        <p className="text-sm leading-relaxed text-white/90">
                          {phase.action}
                        </p>
                      </div>

                      {/* Goal */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                        <span className="text-xs font-bold uppercase tracking-wider text-white/70 mb-1 block">
                          Goal
                        </span>
                        <p className="text-sm leading-relaxed text-white/90">
                          {phase.goal}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Phase Number */}
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-white text-lg border border-white/30">
                    {index + 1}
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
        <div className="flex items-center justify-center mt-12 md:mt-16">
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
            <span className="text-sm font-medium tracking-wider uppercase">
              Time / Evolution
            </span>
            <ArrowRight className="w-4 h-4" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <span className="font-semibold text-foreground">Hardware-enabled software play:</span>{" "}
            We build 15 homes to prove the rails, then finance 10,000+ without touching concrete.
          </p>
        </div>
      </div>
    </section>
  );
};

export default StrategyRoadmap;

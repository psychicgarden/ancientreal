import { Button } from "@/components/ui/button";
import { ArrowRight, Home, TrendingUp, Building, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ASSETS } from "@/lib/assets";

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: `url(${ASSETS.HERO_IMAGE})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
        <div className="max-w-5xl mx-auto">

          {/* Live Traction Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-foreground/90">
              LIVE: 12 Units • 18.75% Verified Yields • Bitcoin Valley Deploying
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in">
            <span className="text-foreground">The RWA Mortgage Rail</span>
            <br />
            <span className="bg-gradient-to-r from-gold via-gold/90 to-amber-500 bg-clip-text text-transparent">
              for the Borderless Economy
            </span>
          </h1>

          {/* Three-Column Problem Statement */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mb-8 animate-fade-in">
            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="text-3xl md:text-4xl font-bold text-gold mb-2">$1T</div>
              <div className="text-sm text-muted-foreground">Crypto stranded on-chain</div>
            </div>
            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="text-3xl md:text-4xl font-bold text-gold mb-2">$750B</div>
              <div className="text-sm text-muted-foreground">Nomad demand locked out</div>
            </div>
            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="text-3xl md:text-4xl font-bold text-gold mb-2">15%+</div>
              <div className="text-sm text-muted-foreground">Emerging market real yields</div>
            </div>
          </div>

          {/* Connecting Statement */}
          <p className="text-lg md:text-xl text-foreground/80 font-medium mb-8 animate-fade-in">
            Ancient Protocol connects all three.
          </p>

          {/* Value Proposition */}
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in">
            We convert idle BTC and stablecoins into real homes, real income streams, and real credit identity
            for a global population banks cannot underwrite.
          </p>

          {/* The Reveal - Infrastructure Masked as Housing */}
          <div className="mb-10 animate-fade-in">
            <p className="text-sm uppercase tracking-widest text-gold/80 mb-6">
              This is RWA infrastructure masked as housing
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <Home className="w-5 h-5 text-gold" />
                <div className="text-left">
                  <div className="font-semibold text-foreground">Homes</div>
                  <div className="text-xs text-muted-foreground">The distribution layer</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <TrendingUp className="w-5 h-5 text-gold" />
                <div className="text-left">
                  <div className="font-semibold text-foreground">Mortgages</div>
                  <div className="text-xs text-muted-foreground">The rails</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <Database className="w-5 h-5 text-gold" />
                <div className="text-left">
                  <div className="font-semibold text-foreground">Credit Bureau</div>
                  <div className="text-xs text-muted-foreground">The endgame</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in">
            <Button 
              variant="hero" 
              size="lg" 
              className="text-base sm:text-lg px-8 py-4"
              onClick={() => navigate('/business-model')}
            >
              View Investment Memo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="text-base sm:text-lg px-8 py-4 border-gold/30 text-gold hover:bg-gold/10"
              onClick={() => navigate('/pitch-deck')}
            >
              See Traction
            </Button>
          </div>

          {/* Traction Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto mb-8 animate-fade-in">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gold/10 backdrop-blur-sm rounded-xl mx-auto mb-3">
                <Building className="w-6 h-6 sm:w-7 sm:h-7 text-gold" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">12</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Operational Units</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gold/10 backdrop-blur-sm rounded-xl mx-auto mb-3">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-gold" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">18.75%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Verified Net Yields</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gold/10 backdrop-blur-sm rounded-xl mx-auto mb-3">
                <Home className="w-6 h-6 sm:w-7 sm:h-7 text-gold" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">15</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Bitcoin Valley Homes</div>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-lg md:text-xl font-medium text-foreground/90 animate-fade-in">
            Ancient Protocol — <span className="text-gold">The global mortgage layer the world was missing.</span>
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-foreground/20 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-foreground/20 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import { Button } from "@/components/ui/button";
import { ArrowRight, Home, TrendingUp, Shield } from "lucide-react";
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
        <div className="absolute inset-0 bg-gradient-hero/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight sm:leading-relaxed text-accent-foreground mb-4 sm:mb-6">
            The World's First
            <br />
            <span className="bg-gradient-to-r from-gold to-gold/80 bg-clip-text text-transparent">
              Decentralized Nation
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-accent-foreground/80 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
            50 Million digital nomads seeking homeownership abroad and can't get a mortgage.
            <br className="hidden sm:block" />
            <span className="block sm:inline"> We Solve That.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-16 px-4">
            <Button variant="hero" size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto" onClick={() => navigate('/banking')}>
              Start Investing
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
            <Button 
              variant="default"
              size="lg"
              className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary/90 w-full sm:w-auto"
              onClick={() => navigate('/investor')}
            >
              View Properties
            </Button>
          </div>

          {/* Stats - Real Traction */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto px-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-accent-foreground/10 backdrop-blur-sm rounded-xl mx-auto mb-3 sm:mb-4">
                <Home className="w-6 h-6 sm:w-8 sm:h-8 text-gold" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-accent-foreground mb-1 sm:mb-2">12 Units</div>
              <div className="text-sm sm:text-base text-accent-foreground/70">Live & Generating Income</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-accent-foreground/10 backdrop-blur-sm rounded-xl mx-auto mb-3 sm:mb-4">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-gold" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-accent-foreground mb-1 sm:mb-2">18.75%</div>
              <div className="text-sm sm:text-base text-accent-foreground/70">Net Verified Yields</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-accent-foreground/10 backdrop-blur-sm rounded-xl mx-auto mb-3 sm:mb-4">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-gold" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-accent-foreground mb-1 sm:mb-2">35M+</div>
              <div className="text-sm sm:text-base text-accent-foreground/70">Nomads Need Mortgages</div>
            </div>
          </div>
          
          {/* Traction Badge */}
          <div className="mt-6 sm:mt-8 text-center px-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent-foreground/10 backdrop-blur-sm rounded-full text-sm text-accent-foreground/80">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              32 units funded across Peru & Brazil
            </span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-accent-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-accent-foreground/30 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

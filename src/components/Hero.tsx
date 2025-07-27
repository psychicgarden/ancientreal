import { Button } from "@/components/ui/button";
import { ArrowRight, Home, TrendingUp, Shield } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
const Hero = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url(${heroImage})`
    }}>
        <div className="absolute inset-0 bg-gradient-hero/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">

          {/* Main Headline */}
          <h1 className="text-accent-foreground mb-6">
            The World's First
            <br />
            <span className="bg-gradient-to-r from-gold to-gold/80 bg-clip-text text-transparent">
              Decentralized Nation
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-accent-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed md:text-xl">50 Million digital nomads seeking homeownership abroad and can't get a mortgage. 
We Solve That.</p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              Start Investing
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              View Properties
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-accent-foreground/10 backdrop-blur-sm rounded-xl mx-auto mb-4">
                <Home className="w-8 h-8 text-gold" />
              </div>
              <div className="text-3xl font-bold text-accent-foreground mb-2">500+</div>
              <div className="text-accent-foreground/70">Premium Properties</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-accent-foreground/10 backdrop-blur-sm rounded-xl mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gold" />
              </div>
              <div className="text-3xl font-bold text-accent-foreground mb-2">12.5%</div>
              <div className="text-accent-foreground/70">Average Returns</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-accent-foreground/10 backdrop-blur-sm rounded-xl mx-auto mb-4">
                <Shield className="w-8 h-8 text-gold" />
              </div>
              <div className="text-3xl font-bold text-accent-foreground mb-2">$2B+</div>
              <div className="text-accent-foreground/70">Assets Managed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-accent-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-accent-foreground/30 rounded-full mt-2"></div>
        </div>
      </div>
    </section>;
};
export default Hero;
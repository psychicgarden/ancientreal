import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url(${heroImage})`
      }}>
        <div className="absolute inset-0 bg-gradient-hero/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8 text-center">
        <div className="max-w-6xl mx-auto">

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-accent-foreground mb-6">
            Get Mortgages in the World's
            <br />
            <span className="bg-gradient-to-r from-gold to-gold/80 bg-clip-text text-transparent">
              Fastest-Growing Markets
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-accent-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            12% appreciation in Mexico vs 4% in NYC. Same mortgage process, better returns.
          </p>

          {/* Comparison Chart */}
          <div className="bg-accent-foreground/10 backdrop-blur-sm rounded-2xl p-8 mb-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-accent-foreground/60 mr-2" />
                  <h3 className="text-2xl font-bold text-accent-foreground">NYC Real Estate</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-3xl font-bold text-accent-foreground">$800,000</div>
                    <div className="text-accent-foreground/70">avg price</div>
                  </div>
                  <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-3xl font-bold text-accent-foreground">4%</div>
                    <div className="text-accent-foreground/70">annual growth</div>
                  </div>
                  <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-3xl font-bold text-accent-foreground">$160,000</div>
                    <div className="text-accent-foreground/70">down payment</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-gold mr-2" />
                  <h3 className="text-2xl font-bold text-accent-foreground">Mazunte, Mexico</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-3xl font-bold text-accent-foreground">$150,000</div>
                    <div className="text-accent-foreground/70">avg price</div>
                  </div>
                  <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-3xl font-bold text-gold">12%</div>
                    <div className="text-accent-foreground/70">annual growth</div>
                  </div>
                  <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-3xl font-bold text-accent-foreground">$30,000</div>
                    <div className="text-accent-foreground/70">down payment</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              Get Pre-Approved for Global Mortgage
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              See Market Comparison Report
            </Button>
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
import { Button } from "@/components/ui/button";
import { PieChart, Home, Calculator, TrendingUp, Shield, Clock } from "lucide-react";

const InvestmentOptions = () => {
  return (
    <section id="invest" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="mb-6">
            Two Ways to 
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Invest</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you want to start small with fractional ownership or purchase immediately, 
            we have the perfect investment solution for your goals.
          </p>
        </div>

        {/* Investment Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Fractional Investment */}
          <div className="bg-gradient-card rounded-2xl shadow-card border border-border/50 p-8 lg:p-12">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mr-4">
                <PieChart className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Fractional Ownership</h3>
                <p className="text-muted-foreground">Start with as little as $100</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mr-3 mt-1">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Low Barrier to Entry</h4>
                  <p className="text-muted-foreground text-sm">
                    Own shares in premium properties without needing massive capital
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mr-3 mt-1">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Diversified Portfolio</h4>
                  <p className="text-muted-foreground text-sm">
                    Spread risk across multiple properties and markets
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mr-3 mt-1">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Passive Income</h4>
                  <p className="text-muted-foreground text-sm">
                    Receive monthly rental income proportional to your ownership
                  </p>
                </div>
              </div>
            </div>

            <Button variant="default" size="lg" className="w-full">
              Start Fractional Investing
            </Button>
          </div>

          {/* Instant Purchase */}
          <div className="bg-gradient-card rounded-2xl shadow-card border border-border/50 p-8 lg:p-12">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-accent rounded-xl flex items-center justify-center mr-4">
                <Home className="w-8 h-8 text-accent-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Instant Purchase</h3>
                <p className="text-muted-foreground">Own the entire property with 20% down</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center mr-3 mt-1">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Smart Mortgage</h4>
                  <p className="text-muted-foreground text-sm">
                    AI-powered instant approval with competitive rates
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center mr-3 mt-1">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Full Ownership</h4>
                  <p className="text-muted-foreground text-sm">
                    Complete control and all rental income comes to you
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center mr-3 mt-1">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Rapid Closing</h4>
                  <p className="text-muted-foreground text-sm">
                    Close in as little as 14 days with our streamlined process
                  </p>
                </div>
              </div>
            </div>

            <Button variant="luxury" size="lg" className="w-full">
              Get Pre-Approved
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-gold" />
            </div>
            <h4 className="font-semibold mb-2">SEC Regulated</h4>
            <p className="text-muted-foreground text-sm">
              Fully compliant with securities regulations
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-gold" />
            </div>
            <h4 className="font-semibold mb-2">Transparent Fees</h4>
            <p className="text-muted-foreground text-sm">
              No hidden costs, clear fee structure
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gold" />
            </div>
            <h4 className="font-semibold mb-2">24/7 Support</h4>
            <p className="text-muted-foreground text-sm">
              Expert support whenever you need it
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentOptions;
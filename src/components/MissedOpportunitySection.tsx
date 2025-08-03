import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calculator } from "lucide-react";

const MissedOpportunitySection = () => {
  return (
    <section className="py-8 px-6">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* Elegant Header */}
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-light mb-8 tracking-tight">
              The Mathematics of
              <br />
              <span className="font-normal text-gold">Modern Nomadism</span>
            </h2>
            <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
              Every decade, 50 million nomads collectively spend $216,000 on rent.
              <br />
              We transform that into $467,000 in real estate equity.
            </p>
          </div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            
            {/* Traditional Path */}
            <Card className="bg-background/60 backdrop-blur-sm border-border/50 overflow-hidden">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-light mb-2 text-muted-foreground">Traditional Path</h3>
                  <div className="h-px bg-gradient-to-r from-muted-foreground/20 to-transparent"></div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-light">Monthly Rent</span>
                    <span className="text-2xl font-light">$1,800</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-light">Decade Total</span>
                    <span className="text-2xl font-light">$216,000</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-muted-foreground/10 to-transparent my-6"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-light">Equity Built</span>
                    <span className="text-3xl font-light text-muted-foreground">$0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ancient Path */}
            <Card className="bg-background/60 backdrop-blur-sm border-gold/20 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent"></div>
              <CardContent className="p-8 relative">
                <div className="mb-6">
                  <h3 className="text-2xl font-light mb-2 text-gold">Ancient Path</h3>
                  <div className="h-px bg-gradient-to-r from-gold/30 to-transparent"></div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-light">Monthly Payment</span>
                    <span className="text-2xl font-light">$1,456</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-light">Decade Total</span>
                    <span className="text-2xl font-light">$204,720</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-gold/20 to-transparent my-6"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-light">Property Value</span>
                    <span className="text-3xl font-light text-gold">$467,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Elegant Stats */}
          <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-12 mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-light mb-4">The Difference</h3>
              <p className="text-lg text-muted-foreground font-light">
                Identical monthly commitment. Generational wealth outcome.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="text-4xl font-light text-gold mb-2">$30K</div>
                <div className="text-sm text-muted-foreground font-light tracking-wide uppercase">Down Payment</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-light text-gold mb-2">$467K</div>
                <div className="text-sm text-muted-foreground font-light tracking-wide uppercase">Final Equity</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-light text-gold mb-2">181%</div>
                <div className="text-sm text-muted-foreground font-light tracking-wide uppercase">Total Return</div>
              </div>
            </div>
          </div>

          {/* Minimal CTA */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button variant="outline" size="lg" className="font-light text-base px-8 py-4">
                <Calculator className="w-4 h-4 mr-3" />
                Calculate Returns
              </Button>
              <Button size="lg" className="font-light text-base px-8 py-4">
                <TrendingUp className="w-4 h-4 mr-3" />
                Explore Properties
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MissedOpportunitySection;
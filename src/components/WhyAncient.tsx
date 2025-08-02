import { Check, X } from "lucide-react";

const WhyAncient = () => {
  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            Why You Can't Get These Mortgages Elsewhere
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Americans are locked out of high-growth international real estate markets. We provide access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Problems */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4 text-red-500">Traditional Approach</h3>
            
            <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-foreground">US banks don't offer mortgages for foreign properties</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Traditional lenders won't finance international real estate purchases
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-foreground">Setting up international legal structures is expensive</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Costs $15K-50K+ in legal fees and requires local expertise
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-foreground">Individual investors can't access wholesale deals</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Best properties go to institutional buyers with deep connections
                </div>
              </div>
            </div>
          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4 text-green-500">Ancient Solution</h3>
            
            <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-foreground">Ancient handles legal structure</div>
                <div className="text-sm text-muted-foreground mt-1">
                  We set up and manage all international legal entities for you
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-foreground">Direct access to high-growth markets</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Curated properties in 8-12% growth markets vs 4% in the US
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-foreground">Tokenized ownership & liquidity</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Buy and sell your mortgage position anytime through blockchain
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center p-6 bg-gradient-card rounded-2xl">
          <h3 className="text-xl font-semibold mb-2">The Bottom Line</h3>
          <p className="text-lg text-muted-foreground">
            Why settle for expensive, slow-growth US markets when you can access 12% growth markets 
            with the same mortgage qualification process?
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyAncient;
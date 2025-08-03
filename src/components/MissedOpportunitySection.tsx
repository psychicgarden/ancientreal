import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Home, Calculator } from "lucide-react";

const MissedOpportunitySection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The Missed{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                $216K
              </span>{" "}
              Opportunity
            </h2>
            <div className="bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-accent/20 mb-8">
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">50M nomads</span> burn{" "}
                <span className="font-semibold text-red-500">$216K in rent</span> every decade.
                <br />
                <span className="font-semibold text-foreground">Ancient</span> flips that into{" "}
                <span className="font-semibold text-green-500">$467K+ net equity</span>.
              </p>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Why flush money down the drain when you could be building generational wealth? 
              Our smart contract mortgages turn your rent payments into property ownership.
            </p>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Traditional Renting */}
            <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <DollarSign className="h-6 w-6" />
                  Traditional Nomad Path
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Rent:</span>
                    <span className="font-semibold text-red-600">$1,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">10-Year Total:</span>
                    <span className="font-semibold text-red-600">$216,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Equity Built:</span>
                    <span className="font-bold text-red-700">$0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ownership:</span>
                    <span className="font-bold text-red-700">Nothing</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-red-200 dark:border-red-800">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-700">💸</div>
                    <div className="text-sm text-red-600 font-medium">Money Gone Forever</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ancient Mortgage */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Home className="h-6 w-6" />
                  Ancient Mortgage Path
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Payment:</span>
                    <span className="font-semibold text-green-600">$1,456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">10-Year Total:</span>
                    <span className="font-semibold text-green-600">$204,720</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property Value:</span>
                    <span className="font-bold text-green-700">$467,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your Equity:</span>
                    <span className="font-bold text-green-700">$467,000</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-green-200 dark:border-green-800">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">🏡</div>
                    <div className="text-sm text-green-600 font-medium">Full Ownership + Equity</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Net Difference */}
          <div className="bg-gradient-to-r from-gold/10 to-primary/10 p-8 rounded-2xl border border-gold/20 mb-12">
            <h3 className="text-2xl font-bold mb-4">
              The{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                $467K+ Difference
              </span>
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              Same monthly expense. Completely different financial outcome.
              <br />
              <strong>Plus you own a home in paradise.</strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gold">$30K</div>
                <div className="text-sm text-muted-foreground">Down Payment</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold">$467K</div>
                <div className="text-sm text-muted-foreground">Property Value (Year 10)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold">181%</div>
                <div className="text-sm text-muted-foreground">Total ROI</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4">
              <Calculator className="w-5 h-5 mr-2" />
              Calculate Your Savings
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              <TrendingUp className="w-5 h-5 mr-2" />
              View Properties
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissedOpportunitySection;
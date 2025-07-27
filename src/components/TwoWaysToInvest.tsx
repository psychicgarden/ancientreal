import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, DollarSign, PieChart, Home, Zap } from "lucide-react";

const TwoWaysToInvest = () => {
  return (
    <section className="py-16 px-6 bg-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Two Ways to Invest
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you want to start small with fractional ownership or purchase immediately, we have the perfect investment solution for your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fractional Ownership */}
          <Card className="bg-gradient-card border-accent/20 p-8">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <PieChart className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl mb-2">Fractional Ownership</CardTitle>
              <CardDescription className="text-lg">Start with as little as $100</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Low Barrier to Entry</h4>
                    <p className="text-sm text-muted-foreground">Own shares in premium properties without needing massive capital</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PieChart className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Diversified Portfolio</h4>
                    <p className="text-sm text-muted-foreground">Spread risk across multiple properties and markets</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Passive Income</h4>
                    <p className="text-sm text-muted-foreground">Receive monthly rental income proportional to your ownership</p>
                  </div>
                </div>
              </div>
              <Button className="w-full" size="lg">
                Start Fractional Investing
              </Button>
            </CardContent>
          </Card>

          {/* Instant Purchase */}
          <Card className="bg-gradient-card border-accent/20 p-8">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl mb-2">Instant Purchase</CardTitle>
              <CardDescription className="text-lg">Own the entire property with 20% down</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Smart Mortgage</h4>
                    <p className="text-sm text-muted-foreground">AI-powered instant approval with competitive rates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Full Ownership</h4>
                    <p className="text-sm text-muted-foreground">Complete control and all rental income comes to you</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Rapid Closing</h4>
                    <p className="text-sm text-muted-foreground">Close in as little as 14 days with our streamlined process</p>
                  </div>
                </div>
              </div>
              <Button className="w-full" size="lg" variant="luxury">
                Get Pre-Approved
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TwoWaysToInvest;
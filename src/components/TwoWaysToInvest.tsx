import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, DollarSign, Home } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeader from "@/components/SectionHeader";
const TwoWaysToInvest = () => {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-6 lg:px-8">
        <SectionHeader
          title="Two Ways to Invest"
          subtitle="Choose your investment approach that matches your goals and lifestyle"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
          {/* Property Investment */}
          <Card className="p-8 border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Home className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Property Investment</CardTitle>
              <CardDescription className="text-lg">
                Own fractions of premium real estate properties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  Fractional ownership starting from $100
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  Passive rental income distribution
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  Property appreciation potential
                </li>
              </ul>
              <Button asChild className="w-full mt-6">
                <Link to="/investor-portal">
                  Explore Properties
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Financial Products */}
          <Card className="p-8 border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Financial Products</CardTitle>
              <CardDescription className="text-lg">
                Leverage your portfolio with DeFi solutions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  Collateral-backed lending
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  Yield farming opportunities
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  Staking rewards up to 12% APY
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full mt-6">
                <Link to="/banking">
                  Explore DeFi
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
export default TwoWaysToInvest;
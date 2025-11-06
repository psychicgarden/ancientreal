import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, TrendingUp, Shield, Wallet, Zap, ArrowRight, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function MobileDemo() {
  const [monthlyBudget, setMonthlyBudget] = useState(1800);
  
  const mortgagePayment = Math.round(monthlyBudget * 0.81);
  const decadeRent = monthlyBudget * 120;
  const decadeMortgage = mortgagePayment * 120;
  const propertyValue = Math.round(decadeMortgage * 1.635);
  const wealthDifference = decadeRent + propertyValue;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Mobile Hero */}
      <section className="relative px-4 pt-8 pb-12 text-center">
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
          Demo Mode
        </Badge>
        <h1 className="text-3xl font-bold mb-3 leading-tight">
          Stop Paying Rent.
          <br />
          <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Start Building Wealth.
          </span>
        </h1>
        <p className="text-muted-foreground mb-6 text-sm max-w-md mx-auto">
          50M digital nomads can't get mortgages abroad. We solve that with blockchain.
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8 max-w-md mx-auto">
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 border border-border/30">
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-xs text-muted-foreground">Properties</div>
          </div>
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 border border-border/30">
            <div className="text-2xl font-bold text-primary">8.5%</div>
            <div className="text-xs text-muted-foreground">Avg Return</div>
          </div>
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 border border-border/30">
            <div className="text-2xl font-bold text-primary">$3.2M</div>
            <div className="text-xs text-muted-foreground">Managed</div>
          </div>
        </div>

        <Button size="lg" className="w-full max-w-md" asChild>
          <Link to="/investor-portal">
            View Properties <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </section>

      {/* Interactive Calculator */}
      <section className="px-4 pb-12">
        <Card className="bg-card/50 backdrop-blur-sm border-border/30 max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Your Wealth Calculator</h2>
            </div>
            
            <div className="mb-6">
              <label className="text-sm text-muted-foreground mb-2 block">
                Monthly Budget: ${monthlyBudget.toLocaleString()}
              </label>
              <input
                type="range"
                min="1000"
                max="3000"
                step="100"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-4">
              {/* Traditional Path */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="text-xs font-semibold text-red-400 mb-2">❌ Traditional Rent</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">10 Years</span>
                    <span className="font-semibold">${decadeRent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Equity Built</span>
                    <span className="font-semibold text-red-400">$0</span>
                  </div>
                </div>
              </div>

              {/* Ancient Path */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="text-xs font-semibold text-green-400 mb-2">✅ Ancient Mortgage</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Monthly Payment</span>
                    <span className="font-semibold">${mortgagePayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Property Value</span>
                    <span className="font-semibold text-green-400">${propertyValue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Difference */}
              <div className="bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg p-4 text-center">
                <div className="text-xs opacity-90 mb-1">Total Wealth Created</div>
                <div className="text-3xl font-bold">${Math.round(wealthDifference / 1000)}K+</div>
                <div className="text-xs opacity-80 mt-1">over 10 years</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* How It Works */}
      <section className="px-4 pb-12">
        <h2 className="text-xl font-bold text-center mb-6">Three Ways to Invest</h2>
        
        <div className="space-y-4 max-w-md mx-auto">
          {/* Ancient Savings */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/30 hover:border-green-500/50 transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold">Ancient Savings</h3>
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">7.5-8.5%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Ultra-liquid yield. Withdraw anytime, no penalties.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center text-xs">
                      <Zap className="w-3 h-3 mr-1 text-green-500" />
                      Instant access
                    </div>
                    <div className="flex items-center text-xs">
                      <Shield className="w-3 h-3 mr-1 text-green-500" />
                      Insured
                    </div>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4" size="sm" asChild>
                <Link to="/banking">Start Earning</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Property Development */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/30 hover:border-blue-500/50 transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold">Development</h3>
                    <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">12-15%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Active projects with higher returns. 6-18 month lock-ups.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center text-xs">
                      <TrendingUp className="w-3 h-3 mr-1 text-blue-500" />
                      Higher yields
                    </div>
                    <div className="flex items-center text-xs">
                      <Shield className="w-3 h-3 mr-1 text-blue-500" />
                      Vetted
                    </div>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4" size="sm" variant="outline" asChild>
                <Link to="/developers">Browse Projects</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Village Citizenship */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/30 hover:border-purple-500/50 transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold">Own Property</h3>
                    <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">Own+Earn</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Buy property abroad. Get mortgage financing. Earn rental income.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center text-xs">
                      <Home className="w-3 h-3 mr-1 text-purple-500" />
                      Real ownership
                    </div>
                    <div className="flex items-center text-xs">
                      <Wallet className="w-3 h-3 mr-1 text-purple-500" />
                      Passive income
                    </div>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4" size="sm" variant="outline" asChild>
                <Link to="/investor-portal">View Properties</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="px-4 pb-12">
        <div className="max-w-md mx-auto bg-card/30 backdrop-blur-sm border border-border/30 rounded-lg p-6">
          <h3 className="font-bold mb-4 text-center">Built on Trust</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Shield className="w-4 h-4 text-primary flex-shrink-0" />
              <span>Smart contracts audited by CertiK</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="w-4 h-4 text-primary flex-shrink-0" />
              <span>Legal structures in Mexico & Nevis</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="w-4 h-4 text-primary flex-shrink-0" />
              <span>First-lien mortgage protection</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="w-4 h-4 text-primary flex-shrink-0" />
              <span>Insurance fund coverage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 pb-12">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Build Wealth?</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Join thousands of digital nomads owning property worldwide
          </p>
          <Button size="lg" className="w-full mb-3" asChild>
            <Link to="/investor-portal">Explore Properties</Link>
          </Button>
          <Button size="lg" className="w-full" variant="outline" asChild>
            <Link to="/banking">Start Earning 8.5%</Link>
          </Button>
        </div>
      </section>

      {/* Footer Note */}
      <div className="px-4 pb-8 text-center">
        <p className="text-xs text-muted-foreground">
          This is a demo version. All figures are projections.
        </p>
      </div>
    </div>
  );
}

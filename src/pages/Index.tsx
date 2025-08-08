import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedInvestments from "@/components/FeaturedInvestments";
import MissedOpportunitySection from "@/components/MissedOpportunitySection";
import TwoWaysToInvest from "@/components/TwoWaysToInvest";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Home, TrendingUp, Shield, ArrowRight, Zap, Wallet, Lock, Unlock, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
const Index = () => {
  return <div className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedInvestments />
      <MissedOpportunitySection />
      <TwoWaysToInvest />
      
      {/* Three-Tier Banking Portal */}
      <section className="bg-gradient-to-br from-background to-muted/10 py-[40px] animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-normal mb-4">Choose Your Investment Strategy</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Three complementary approaches to wealth building designed for different risk tolerances and goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* Ancient Savings */}
            <Card className="relative overflow-hidden bg-card/60 backdrop-blur-sm border border-border/40 hover:border-primary/40 transition-all duration-300 hover:shadow-luxury group animate-fade-in hover-scale">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-secondary shadow-card">
                  <Wallet className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-2xl">Ancient Savings</CardTitle>
                <CardDescription>Ultra-liquid, risk-free yield</CardDescription>
                <div className="text-3xl font-bold text-primary mt-2">7.5% - 8.5%</div>
                <Badge variant="secondary" className="w-fit mx-auto mt-2 bg-primary/10 text-foreground border border-primary/20">
                  <Unlock className="w-3 h-3 mr-1" />
                  Ultra Liquid
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Zap className="w-4 h-4 mr-2 text-primary" />
                    Instant withdrawals, no penalties
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="w-4 h-4 mr-2 text-primary" />
                    Backed by first-lien mortgages
                  </div>
                  <div className="flex items-center text-sm">
                    <Home className="w-4 h-4 mr-2 text-primary" />
                    One-click home purchase transfers
                  </div>
                  <div className="flex items-center text-sm">
                    <Lock className="w-4 h-4 mr-2 text-primary" />
                    Insurance fund protection
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border/30">
                  <div className="text-sm text-muted-foreground mb-2">Current Pool Status</div>
                  <Progress value={75} className="mb-2 h-2" />
                  <div className="text-xs text-muted-foreground">$2.4M available for mortgages</div>
                </div>

                <Button className="w-full mt-6 group-hover:scale-105 transition-transform" asChild>
                  <Link to="/banking">
                    Start Earning <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Property Development */}
            <Card className="relative overflow-hidden bg-card/60 backdrop-blur-sm border border-border/40 hover:border-accent/40 transition-all duration-300 hover:shadow-luxury group animate-fade-in hover-scale">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-primary shadow-card">
                  <TrendingUp className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">Property Development</CardTitle>
                <CardDescription>Active investment opportunities</CardDescription>
                <div className="text-3xl font-bold text-primary mt-2">12% - 15%</div>
                <Badge variant="secondary" className="w-fit mx-auto mt-2 bg-accent/10 text-foreground border border-accent/20">
                  <Clock className="w-3 h-3 mr-1" />
                  6-18 Months
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                    Higher projected returns
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2 text-primary" />
                    Fractional project investment
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    Project-based lock-ups
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="w-4 h-4 mr-2 text-primary" />
                    Due diligence required
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border/30">
                  <div className="text-sm text-muted-foreground mb-2">Active Projects</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Mazunte Villa Complex</span>
                      <span className="text-primary">87% funded</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Tulum Eco Resort</span>
                      <span className="text-muted-foreground">43% funded</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-6 group-hover:scale-105 transition-transform" variant="outline" asChild>
                  <Link to="/investor">
                    Browse Projects <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Village Citizenship */}
            <Card className="relative overflow-hidden bg-card/60 backdrop-blur-sm border border-border/40 hover:border-secondary/40 transition-all duration-300 hover:shadow-luxury group animate-fade-in hover-scale">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-accent shadow-card">
                  <Home className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-2xl">Village Citizenship</CardTitle>
                <CardDescription>Property ownership + community</CardDescription>
                <div className="text-3xl font-bold bg-gradient-to-r from-gold to-gold/80 bg-clip-text text-transparent mt-2">Own + Earn</div>
                <Badge variant="secondary" className="w-fit mx-auto mt-2 bg-secondary/20 text-foreground border border-secondary/40">
                  <Lock className="w-3 h-3 mr-1" />
                  Long-term
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Home className="w-4 h-4 mr-2 text-primary" />
                    Actual property ownership
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                    Property appreciation
                  </div>
                  <div className="flex items-center text-sm">
                    <Wallet className="w-4 h-4 mr-2 text-primary" />
                    Rental income distribution
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2 text-primary" />
                    Exclusive community access
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border/30">
                  <div className="text-sm text-muted-foreground mb-2">Available Properties</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Beachfront Villas</span>
                      <span className="text-primary">From $180K</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Jungle Lofts</span>
                      <span className="text-primary">From $95K</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-6 group-hover:scale-105 transition-transform" variant="outline" asChild>
                  <Link to="/developers">
                    Explore Properties <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>;
};
export default Index;
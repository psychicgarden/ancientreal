import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedInvestments from "@/components/FeaturedInvestments";


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Home, TrendingUp, Shield, ArrowRight, Zap, Wallet, Lock, Unlock, Clock, Users, Building2, Target, DollarSign, Globe, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeader from "@/components/SectionHeader";
import Footer from "@/components/Footer";
const Index = () => {
  return <div className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedInvestments />
      
      {/* The Mathematics of Modern Nomadism */}
      <section className="py-20 bg-gradient-to-br from-muted/20 to-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              The Mathematics of Modern Nomadism
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              Every decade the average digital nomad burns 216K on dead rent.<br />
              We transform that into $285,750 in real estate equity.
            </p>
          </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl p-6">
            <h4 className="text-xl font-bold mb-4 text-red-400">Traditional Path</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Monthly Rent</span>
                <span className="text-lg font-semibold">$1,800</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Decade Total</span>
                <span className="text-lg font-semibold">$216,000</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Equity Built</span>
                <span className="text-lg font-semibold text-red-400">$0</span>
              </div>
            </div>
          </div>

          <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl p-6">
            <h4 className="text-xl font-bold mb-4 text-green-400">Ancient Path</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Monthly Payment</span>
                <span className="text-lg font-semibold">$1,456</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Decade Total</span>
                <span className="text-lg font-semibold">$174,720</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Property Value</span>
                <span className="text-lg font-semibold text-green-400">$285,750</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-8 rounded-lg mb-8">
            <h3 className="text-2xl font-bold mb-4">The Difference</h3>
            <p className="text-xl mb-6">Stop burning money on rent. Start building generational wealth.</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm opacity-90 uppercase tracking-wide">Avoided Dead Rent</div>
                <div className="text-3xl font-bold">$216K</div>
              </div>
              <div>
                <div className="text-sm opacity-90 uppercase tracking-wide">Property Equity Gained</div>
                <div className="text-3xl font-bold">$286K</div>
              </div>
              <div>
                <div className="text-sm opacity-90 uppercase tracking-wide">Total Wealth Creation</div>
                <div className="text-3xl font-bold">$502K+</div>
              </div>
            </div>
            <p className="text-sm opacity-90 mt-4 max-w-2xl mx-auto">
              Get both the property equity AND avoid throwing away rent money. Your monthly payment builds wealth instead of enriching landlords.
            </p>
          </div>
          
          <Button size="lg" className="px-8 py-4 text-lg">
            Calculate Returns
          </Button>
        </div>
      </div>
    </section>

      {/* Infrastructure Investment Overview */}
      <section className="py-20 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Infrastructure Investment Overview"
            subtitle="The foundation for building a $827M revenue platform by year 10"
          />
          
          {/* Big Picture Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-primary mb-1">$7M</div>
              <div className="text-sm text-muted-foreground">Total Infrastructure Investment</div>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">7,500</div>
              <div className="text-sm text-muted-foreground">Year 10 Target Homes</div>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">2M</div>
              <div className="text-sm text-muted-foreground">Target Community Members</div>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">$827M</div>
              <div className="text-sm text-muted-foreground">Year 10 Annual Revenue</div>
            </div>
          </div>

          {/* Investment Breakdown */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">Why $7M Infrastructure Investment</h3>
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Legal & Compliance */}
              <Card className="bg-card/50 backdrop-blur-sm border border-border/30">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Legal & Compliance Foundation</CardTitle>
                  <div className="text-2xl font-bold text-blue-600">$2.45M</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Multi-jurisdiction incorporation</span>
                    <span className="text-muted-foreground">$850K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Regulatory compliance framework</span>
                    <span className="text-muted-foreground">$650K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Insurance & risk management</span>
                    <span className="text-muted-foreground">$450K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Legal documentation & templates</span>
                    <span className="text-muted-foreground">$500K</span>
                  </div>
                </CardContent>
              </Card>

              {/* Platform Technology */}
              <Card className="bg-card/50 backdrop-blur-sm border border-border/30">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Platform Technology</CardTitle>
                  <div className="text-2xl font-bold text-green-600">$1.8M</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Smart contract development</span>
                    <span className="text-muted-foreground">$750K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Platform development & UI/UX</span>
                    <span className="text-muted-foreground">$600K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Security audits & testing</span>
                    <span className="text-muted-foreground">$250K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Infrastructure & hosting</span>
                    <span className="text-muted-foreground">$200K</span>
                  </div>
                </CardContent>
              </Card>

              {/* Market & Operations */}
              <Card className="bg-card/50 backdrop-blur-sm border border-border/30">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Market & Operations</CardTitle>
                  <div className="text-2xl font-bold text-purple-600">$2.75M</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Property acquisition & development</span>
                    <span className="text-muted-foreground">$1.2M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Marketing & community building</span>
                    <span className="text-muted-foreground">$800K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Operations & management</span>
                    <span className="text-muted-foreground">$450K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Partnership development</span>
                    <span className="text-muted-foreground">$300K</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Three-Phase Evolution */}
      <section className="py-20 bg-gradient-to-br from-muted/20 to-muted/40">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="From Engine → Ecosystem: 3-Phase Evolution"
            subtitle="Strategic roadmap from proof of concept to network state"
          />
          
          <div className="max-w-6xl mx-auto">
            {/* Evolution Flow */}
            <div className="flex items-center justify-center mb-16">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-2 rounded-lg font-semibold">
                  Proof Engine
                </div>
                <ChevronRight className="w-6 h-6 text-muted-foreground" />
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold">
                  Developer Platform
                </div>
                <ChevronRight className="w-6 h-6 text-muted-foreground" />
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold">
                  Network State
                </div>
              </div>
            </div>

            {/* Phase Cards */}
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Phase 1: Proof Engine */}
              <Card className="bg-card/50 backdrop-blur-sm border border-border/30 hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-primary/10 text-primary">Phase 1</Badge>
                    <div className="text-sm text-muted-foreground">Years 0-3</div>
                  </div>
                  <CardTitle className="text-xl">Proof Engine</CardTitle>
                  <CardDescription>Validate the model with strategic property flips</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm">4 strategic property flips demonstrating model viability</div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm">$7M infrastructure investment deployed</div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm">Legal framework established across 3 jurisdictions</div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm">Core platform and smart contracts launched</div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border/30">
                    <div className="text-sm font-medium mb-2">Key Metrics</div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>• 100+ early investors</div>
                      <div>• $2M+ in property transactions</div>
                      <div>• Regulatory approval in key markets</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phase 2: Platform Scale */}
              <Card className="bg-card/50 backdrop-blur-sm border border-border/30 hover:border-green-500/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-green-500/10 text-green-600">Phase 2</Badge>
                    <div className="text-sm text-muted-foreground">Years 3-7</div>
                  </div>
                  <CardTitle className="text-xl">Platform Scale</CardTitle>
                  <CardDescription>Open platform to developers and scale operations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm">Developer platform launch with API access</div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm">Mortgage platform for community members</div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm">50+ developer partnerships established</div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm">Expansion to 5+ countries</div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border/30">
                    <div className="text-sm font-medium mb-2">Key Metrics</div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>• 10,000+ community members</div>
                      <div>• $50M+ in property transactions</div>
                      <div>• 500+ properties in network</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phase 3: Network State */}
              <Card className="bg-card/50 backdrop-blur-sm border border-border/30 hover:border-blue-500/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-blue-500/10 text-blue-600">Phase 3</Badge>
                    <div className="text-sm text-muted-foreground">Years 7-10</div>
                  </div>
                  <CardTitle className="text-xl">Network State</CardTitle>
                  <CardDescription>Achieve network state status with global reach</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm">7,500 homes across 6+ countries</div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm">2M+ community members globally</div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm">$827M annual revenue achieved</div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm">Self-governing community protocols</div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border/30">
                    <div className="text-sm font-medium mb-2">Key Metrics</div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>• Network state recognition</div>
                      <div>• $5B+ in managed assets</div>
                      <div>• Global governance model</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Three-Tier Banking Portal */}
      <section className="bg-gradient-to-br from-background to-muted/10 py-[40px]">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Choose Your Investment Strategy"
            subtitle="Three complementary approaches to wealth building designed for different risk tolerances and goals."
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* Ancient Savings */}
            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border border-border/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Ancient Savings</CardTitle>
                <CardDescription>Ultra-liquid, risk-free yield</CardDescription>
                <div className="text-3xl font-bold text-green-600 mt-2">7.5% - 8.5%</div>
                <Badge variant="secondary" className="w-fit mx-auto mt-2 bg-green-500/10 text-green-600">
                  <Unlock className="w-3 h-3 mr-1" />
                  Ultra Liquid
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Zap className="w-4 h-4 mr-2 text-green-500" />
                    Instant withdrawals, no penalties
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="w-4 h-4 mr-2 text-green-500" />
                    Backed by first-lien mortgages
                  </div>
                  <div className="flex items-center text-sm">
                    <Home className="w-4 h-4 mr-2 text-green-500" />
                    One-click home purchase transfers
                  </div>
                  <div className="flex items-center text-sm">
                    <Lock className="w-4 h-4 mr-2 text-green-500" />
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
            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border border-border/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Property Development</CardTitle>
                <CardDescription>Active investment opportunities</CardDescription>
                <div className="text-3xl font-bold text-blue-600 mt-2">12% - 15%</div>
                <Badge variant="secondary" className="w-fit mx-auto mt-2 bg-blue-500/10 text-blue-600">
                  <Clock className="w-3 h-3 mr-1" />
                  6-18 Months
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                    Higher projected returns
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2 text-blue-500" />
                    Fractional project investment
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    Project-based lock-ups
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="w-4 h-4 mr-2 text-blue-500" />
                    Due diligence required
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border/30">
                  <div className="text-sm text-muted-foreground mb-2">Active Projects</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Mazunte Villa Complex</span>
                      <span className="text-green-600">87% funded</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Tulum Eco Resort</span>
                      <span className="text-blue-600">43% funded</span>
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
            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border border-border/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Village Citizenship</CardTitle>
                <CardDescription>Property ownership + community</CardDescription>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-violet-600 bg-clip-text text-transparent mt-2">Own + Earn</div>
                <Badge variant="secondary" className="w-fit mx-auto mt-2 bg-purple-500/10 text-purple-600">
                  <Lock className="w-3 h-3 mr-1" />
                  Long-term
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Home className="w-4 h-4 mr-2 text-purple-500" />
                    Actual property ownership
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 mr-2 text-purple-500" />
                    Property appreciation
                  </div>
                  <div className="flex items-center text-sm">
                    <Wallet className="w-4 h-4 mr-2 text-purple-500" />
                    Rental income distribution
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2 text-purple-500" />
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
      <Footer />
    </div>;
};
export default Index;
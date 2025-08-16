import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyMap from "@/components/PropertyMap";
import SectionHeader from "@/components/SectionHeader";
import { TrendingUp, Globe, Building, MapPin, DollarSign, BarChart3, Shield, Clock, Home, Users } from "lucide-react";

// Business model data
const locations = [
  {
    id: "mazunte",
    name: "Mazunte, Mexico",
    country: "Mexico",
    cost: "$460,000",
    units: 4,
    revenue: "$810,000",
    legalStructure: "Mexican SAPI de CV",
    image: "/src/assets/villa-mexico.jpg",
    phase: "Flip 1 - Starting Point"
  },
  {
    id: "bahia",
    name: "Bahia, Brazil", 
    country: "Brazil",
    cost: "$575,000",
    units: 5,
    revenue: "$1,012,500",
    legalStructure: "Brazilian LTDA",
    image: "/src/assets/villa-bahia.jpg",
    phase: "Flip 2A"
  },
  {
    id: "corfu",
    name: "Corfu, Greece",
    country: "Greece", 
    cost: "$690,000",
    units: 6,
    revenue: "$1,215,000",
    legalStructure: "Greek IKE",
    image: "/src/assets/villa-corfu-greece.jpg",
    phase: "Flip 2B"
  },
  {
    id: "mallorca",
    name: "Mallorca, Spain",
    country: "Spain",
    cost: "$805,000", 
    units: 7,
    revenue: "$1,417,500",
    legalStructure: "Spanish SL",
    image: "/src/assets/coworking-mallorca.jpg",
    phase: "Flip 3A"
  },
  {
    id: "thailand",
    name: "Koh Phangan, Thailand",
    country: "Thailand",
    cost: "$632,500",
    units: 5.5,
    revenue: "$1,113,750",
    legalStructure: "Thai Limited Company",
    image: "/src/assets/bali-jungle-resort.jpg",
    phase: "Flip 3B"
  },
  {
    id: "turkey",
    name: "Cappadocia, Turkey", 
    country: "Turkey",
    cost: "$575,000",
    units: 5,
    revenue: "$1,012,500",
    legalStructure: "Turkish Limited Company",
    image: "/src/assets/desert-oasis-morocco.jpg",
    phase: "Flip 4"
  }
];

const BusinessModel = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-background via-muted/20 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-6 bg-primary/10 text-primary border-primary/20">
            <Globe className="w-4 h-4 mr-2" />
            Global Development Strategy
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Ancient Development Flywheel
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            Self-funding construction across 6 strategic locations using a proven financial flywheel model
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">$2.75M</div>
              <div className="text-sm text-muted-foreground">Initial Investment</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">$24.53M</div>
              <div className="text-sm text-muted-foreground">Total Revenue (10 years)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gold mb-2">9x ROI</div>
              <div className="text-sm text-muted-foreground">Return Multiple</div>
            </div>
          </div>
          
          <Button size="lg" className="px-8 py-4 text-lg" asChild>
            <a href="/investor-portal">
              Explore Investment Opportunities
            </a>
          </Button>
        </div>
      </section>

      {/* Interactive Global Map Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Global Development Locations"
            subtitle="Six strategically chosen locations for maximum ROI and legal compliance"
            className="mb-12"
          />
          
          <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl p-6 mb-8">
            <PropertyMap />
          </div>
          
          <div className="text-center">
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Each location has been carefully selected for its legal framework, tourism potential, 
              and construction cost efficiency. Click on any location above to see detailed investment metrics.
            </p>
          </div>
        </div>
      </section>

      {/* Financial Flow Animation */}
      <section className="py-20 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="The Development Flywheel"
            subtitle="How construction sales fund the next phase, creating exponential growth"
            className="mb-12"
          />
          
          <div className="relative max-w-6xl mx-auto">
            {/* Flow Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <Card className="relative bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">Initial Capital</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">$2.75M</div>
                  <p className="text-sm text-muted-foreground">Starting investment for first construction</p>
                </CardContent>
              </Card>

              <Card className="relative bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Construction</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">4 Units</div>
                  <p className="text-sm text-muted-foreground">Built in Mazunte, Mexico</p>
                </CardContent>
              </Card>

              <Card className="relative bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Sales Revenue</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">$810K</div>
                  <p className="text-sm text-muted-foreground">Down payments received</p>
                </CardContent>
              </Card>

              <Card className="relative bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Reinvestment</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">$2.435M</div>
                  <p className="text-sm text-muted-foreground">Available for next phases</p>
                </CardContent>
              </Card>
            </div>

            {/* Flow arrows */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            
            {/* Final Results */}
            <Card className="bg-gradient-to-r from-gold/10 to-gold/5 border-gold/30">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gold">Final Flywheel Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-xl font-bold text-green-600 mb-1">$371K</div>
                    <div className="text-sm text-muted-foreground">Cash Surplus</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-primary mb-1">$453.6K</div>
                    <div className="text-sm text-muted-foreground">Platform Fees</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gold mb-1">32.5 Units</div>
                    <div className="text-sm text-muted-foreground">Total Properties Built</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Location Showcase Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Development Locations"
            subtitle="Each location features unique advantages and proven legal frameworks"
            className="mb-12"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.map((location, index) => (
              <Card key={location.id} className="overflow-hidden bg-card/50 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-300 group">
                <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge variant="outline" className="mb-2 bg-background/80 text-foreground">
                      {location.phase}
                    </Badge>
                    <h3 className="text-xl font-bold text-white">{location.name}</h3>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground mb-1">Investment</div>
                        <div className="font-semibold">{location.cost}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">Units</div>
                        <div className="font-semibold">{location.units}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">Revenue</div>
                        <div className="font-semibold text-green-600">{location.revenue}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">ROI</div>
                        <div className="font-semibold text-primary">
                          {Math.round((parseInt(location.revenue.replace(/[$,]/g, '')) / parseInt(location.cost.replace(/[$,]/g, '')) - 1) * 100)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border/30">
                      <div className="text-sm">
                        <div className="text-muted-foreground mb-1">Legal Structure</div>
                        <div className="font-medium">{location.legalStructure}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Framework Section */}
      <section className="py-20 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Legal Compliance Framework"
            subtitle="Comprehensive due diligence and regulatory compliance across all jurisdictions"
            className="mb-12"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/30">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle>SPV Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Each location operates through its own Special Purpose Vehicle, ensuring legal compliance and investor protection.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Local incorporation per country
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Nevis holding company structure
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Clear ownership through NFTs
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border border-border/30">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Land Acquisition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Strategic land purchases with full title verification and construction permits secured upfront.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Due diligence completed
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Construction permits ready
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Tourism zone compliance
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border border-border/30">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Regulatory Research</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Extensive research into local regulations, foreign ownership laws, and tourism development requirements.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Foreign ownership verified
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Local legal counsel retained
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Tourism licensing secured
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Country-Specific Compliance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((location) => (
                <div key={location.id} className="text-center">
                  <div className="text-lg font-semibold mb-2">{location.country}</div>
                  <div className="text-sm text-muted-foreground mb-3">{location.legalStructure}</div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                    ✓ Compliant
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Streams Breakdown */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Revenue Streams"
            subtitle="Multiple income sources creating sustainable long-term returns"
            className="mb-12"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Platform Fees</CardTitle>
                <div className="text-2xl font-bold text-green-600">$453.6K</div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Immediate revenue from construction and sales platform fees
                </p>
                <Progress value={100} className="mb-2" />
                <div className="text-xs text-center text-muted-foreground">Immediate liquidity</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Mortgage Interest</CardTitle>
                <div className="text-2xl font-bold text-blue-600">$7.46M</div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Steady income from property financing over 10 years
                </p>
                <Progress value={75} className="mb-2" />
                <div className="text-xs text-center text-muted-foreground">10-year stream</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gold/10 to-gold/5 border-gold/30">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle>ARW Appreciation</CardTitle>
                <div className="text-2xl font-bold text-gold">$16.62M</div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Long-term appreciation from Ancient Real World token
                </p>
                <Progress value={60} className="mb-2" />
                <div className="text-xs text-center text-muted-foreground">Long-term growth</div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-primary/10 to-gold/10 border border-primary/20 rounded-xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Total Value Creation</h3>
              <div className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
                $24.53M
              </div>
              <p className="text-muted-foreground">
                From $2.75M initial investment over 10 years, representing a 9x return multiple 
                and demonstrating the power of the development flywheel model.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the Flywheel?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Become part of the Ancient development strategy and benefit from our proven global expansion model.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-4 text-lg" asChild>
              <a href="/investor-portal">
                Start Investing
              </a>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg" asChild>
              <a href="/legal-portal">
                View Legal Documents
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BusinessModel;
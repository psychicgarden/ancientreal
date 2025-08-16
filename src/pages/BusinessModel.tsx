import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, MapPin, DollarSign, Building, Globe, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import property images
import villaTulum from "@/assets/villa-tulum.jpg";
import beachChalet from "@/assets/beach-chalet.jpg";
import villaEriceira from "@/assets/villa-ericeira-portugal.jpg";
import villaGreece from "@/assets/villa-greece.jpg";
import villaBali from "@/assets/villa-bali.jpg";
import penthouseMexico from "@/assets/penthouse-mexico.jpg";
import ecoSmartCity from "@/assets/eco-smart-city.jpg";
const flywheelData = [{
  flip: "Flip 1",
  location: "Mazunte, Mexico",
  flag: "🇲🇽",
  units: 15,
  buildCost: 1.125,
  salesPrice: 2.025,
  cashIn: 0.81,
  remaining: 2.435,
  platformFee: 60.75,
  image: villaTulum,
  structure: "Mexican SAPI + Fideicomiso"
}, {
  flip: "Flip 2",
  location: "Bahia, Brazil",
  flag: "🇧🇷",
  units: 21,
  buildCost: 1.575,
  salesPrice: 2.835,
  cashIn: 1.107,
  remaining: 1.967,
  platformFee: 85.05,
  image: beachChalet,
  structure: "Brazilian LTDA"
}, {
  flip: "Flip 3A",
  location: "Corfu, Greece",
  flag: "🇬🇷",
  units: 16,
  buildCost: 1.2,
  salesPrice: 2.16,
  cashIn: 0.864,
  remaining: 1.631,
  platformFee: 64.8,
  image: villaGreece,
  structure: "Greek IKE SPV"
}, {
  flip: "Flip 3B",
  location: "Mallorca, Spain",
  flag: "🇪🇸",
  units: 15,
  buildCost: 1.125,
  salesPrice: 2.025,
  cashIn: 0.837,
  remaining: 1.343,
  platformFee: 60.75,
  image: villaEriceira,
  structure: "Spanish SL"
}, {
  flip: "Flip 4A",
  location: "Koh Phangan, Thailand",
  flag: "🇹🇭",
  units: 25,
  buildCost: 1.875,
  salesPrice: 3.375,
  cashIn: 1.323,
  remaining: 0.923,
  platformFee: 101.25,
  image: villaBali,
  structure: "30+30 Leasehold"
}, {
  flip: "Flip 4B",
  location: "Antalya, Turkey",
  flag: "🇹🇷",
  units: 20,
  buildCost: 1.5,
  salesPrice: 2.7,
  cashIn: 1.08,
  remaining: 0.371,
  platformFee: 81,
  image: penthouseMexico,
  structure: "Turkish SPV"
}];
const revenueStreams = [{
  title: "Platform Fees",
  amount: "$453.6K",
  description: "Infrastructure revenue for serving nomad economy",
  timeline: "Immediate capture",
  icon: "🏛"
}, {
  title: "Mortgage Interest",
  amount: "$7.46M",
  description: "8% yield serving the $250B cross-border lending void",
  timeline: "10-year stream",
  icon: "🌐"
}, {
  title: "ARW Appreciation",
  amount: "$16.62M",
  description: "Capturing nomad wealth lost to rent into property equity",
  timeline: "10-year capture",
  icon: "🚀"
}];
const landAcquisition = [{
  country: "Mexico",
  budget: "$270K",
  structure: "Bank Fideicomiso via SAPI",
  risk: "Ejido exclusion critical"
}, {
  country: "Brazil",
  budget: "$230K",
  structure: "Brazilian LTDA",
  risk: "Environmental approvals"
}, {
  country: "Greece",
  budget: "$360K",
  structure: "Greek IKE SPV",
  risk: "Coastal restrictions"
}, {
  country: "Spain",
  budget: "$400K",
  structure: "Spanish SL",
  risk: "8-10% transfer costs"
}, {
  country: "Thailand",
  budget: "$280K",
  structure: "30+30 Leasehold",
  risk: "Foreign ownership limits"
}, {
  country: "Turkey",
  budget: "$260K",
  structure: "Turkish SPV",
  risk: "Military zone clearance"
}];
const BusinessModel = () => {
  const navigate = useNavigate();
  const totalPlatformFees = flywheelData.reduce((sum, flip) => sum + flip.platformFee, 0);
  return <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section with Backdrop */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Backdrop Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={ecoSmartCity} 
            alt="Luxury eco village" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/20" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 bg-background/20 backdrop-blur-md text-foreground px-8 py-4 rounded-full mb-8 border border-border/30 shadow-luxury">
            <div className="text-2xl">🏛</div>
            <span className="font-semibold text-lg tracking-wide">Ancient: The World's First Network State</span>
          </div>
          
          {/* Main Headlines */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/95 to-foreground/80 bg-clip-text text-transparent leading-tight">
            Building Infrastructure<br />
            <span className="text-primary">for a Borderless World</span>
          </h1>
          
          {/* Market Reality Section */}
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary/90">
              The Market Reality
            </h2>
            <div className="space-y-4 text-lg md:text-xl text-foreground/80 leading-relaxed">
              <p>
                50 million high-earning nomads burn nearly <strong className="text-primary font-bold">$900B annually on rent</strong> because they cannot access global mortgages. We've built the only platform that converts that "dead spend" into fractional, on-chain deeds of dream properties.
              </p>
            </div>
            
            {/* Closing Statement */}
            <div className="mt-8 p-6 bg-background/30 backdrop-blur-sm rounded-2xl border border-border/20">
              <blockquote className="text-xl md:text-2xl font-medium text-foreground/90 italic">
                "Borders wrote the last chapter of property; code writes the next."
              </blockquote>
            </div>
          </div>

          {/* Elegant Metrics Row */}
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground mb-2">$24.53M</div>
              <div className="text-muted-foreground text-sm uppercase tracking-wider">Total Returns</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground mb-2">112</div>
              <div className="text-muted-foreground text-sm uppercase tracking-wider">Units Built</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground mb-2">6</div>
              <div className="text-muted-foreground text-sm uppercase tracking-wider">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground mb-2">$250B</div>
              <div className="text-muted-foreground text-sm uppercase tracking-wider">Market Void</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Now Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              🌪 Perfect Storm: <span className="text-primary">Why Now?</span>
            </h2>
            <div className="max-w-4xl mx-auto text-xl text-muted-foreground space-y-4">
              <p>
                <strong className="text-primary text-2xl">🌎 100M+ Digital Nomads by 2030, Zero Mortgage Infrastructure</strong>
              </p>
              
              
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[{
            icon: "📈",
            title: "Digital-Nomad Boom",
            stat: "50M → 100M+",
            desc: "6× growth since 2019, accelerating toward 100M+ by 2030"
          }, {
            icon: "🧳",
            title: "Massive Pipeline",
            stat: "35M+",
            desc: "North-American & European workers intend to go nomadic within two years"
          }, {
            icon: "💻",
            title: "Remote Work Default",
            stat: "80%",
            desc: "White-collar staff work hybrid/remote, severing income from geography"
          }, {
            icon: "🏠",
            title: "Affordability Crisis",
            stat: "8× Income",
            desc: "Median home prices vs. household income—worst ratio in four decades"
          }, {
            icon: "🕰",
            title: "Delayed Homeownership",
            stat: "29 → 36",
            desc: "U.S. first-time-buyer age climbed 7 years in a decade"
          }, {
            icon: "💰",
            title: "Millennial Capital",
            stat: "$5T Liquid",
            desc: "Massive wealth, yet <50% own homes due to geographic constraints"
          }, {
            icon: "⚖",
            title: "Tokenized Real Estate",
            stat: "$310M → $1.4T",
            desc: "Market forecast to surge 4.5× by 2030"
          }, {
            icon: "🗺",
            title: "Visa Tailwinds",
            stat: "50+ Countries",
            desc: "Issue Digital-Nomad Visas (from just 6 in 2019)"
          }, {
            icon: "💳",
            title: "Cross-border Void",
            stat: "$250B",
            desc: "Capital nomads want but banks refuse to lend"
          }].map(trend => <Card key={trend.title} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-card transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">{trend.icon}</div>
                  <div className="text-2xl font-bold text-primary mb-2">{trend.stat}</div>
                  <h3 className="font-semibold mb-2">{trend.title}</h3>
                  <p className="text-sm text-muted-foreground">{trend.desc}</p>
                </CardContent>
              </Card>)}
          </div>

          <Card className="bg-gradient-accent/10 border-accent/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">The Market Reality</h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-4xl mx-auto">
                Millions of high-earning nomads burn nearly <strong className="text-accent">$1 trillion annually on rent</strong> because they cannot access global mortgages. 
                We've built the only platform that converts that "dead spend" into fractional, on-chain deeds of dream properties.
              </p>
              <div className="text-xl font-medium text-accent">
                Borders wrote the last chapter of property; code writes the next.
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Business Model Hero */}
      <section className="relative py-20 px-4 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 text-lg px-6 py-2">
            Development Flywheel Model
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            6 Locations, 4 Flips, 9× ROI
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Building mortgage infrastructure for 100M+ nomads through strategic real estate development flywheel
          </p>
          
          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground">$2.75M</div>
                <div className="text-sm text-muted-foreground">Initial Capital</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <Building className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground">112</div>
                <div className="text-sm text-muted-foreground">Total Units</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground">6</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground">$24.53M</div>
                <div className="text-sm text-muted-foreground">10-Year Capture</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Flywheel Flow */}
      <section className="py-20 px-4 bg-background/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">The Development Flywheel</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Each flip generates cash to fund the next, creating momentum through strategic geographic sequencing
            </p>
          </div>

          <div className="space-y-8">
            {flywheelData.map((flip, index) => <Card key={flip.flip} className="bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-3 gap-0">
                    {/* Image */}
                    <div className="relative h-64 md:h-auto">
                      <img src={flip.image} alt={flip.location} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent md:hidden" />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="text-lg">
                          {flip.flag} {flip.flip}
                        </Badge>
                      </div>
                    </div>

                    {/* Financial Data */}
                    <div className="p-8 space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{flip.location}</h3>
                        <p className="text-muted-foreground">{flip.units} Units • {flip.structure}</p>
                      </div>
                      
                      {/* Per-Unit Economics */}
                      <div className="bg-background/50 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground mb-2">Per-Unit Economics</div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-muted-foreground">Build Cost</div>
                            <div className="font-semibold">$75K/unit</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Sale Price</div>
                            <div className="font-semibold">$135K/unit</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Total Economics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Total Build Cost</div>
                          <div className="text-lg font-semibold">${flip.buildCost}M</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Total Sales Price</div>
                          <div className="text-lg font-semibold">${flip.salesPrice}M</div>
                        </div>
                      </div>

                      {/* Cash In Breakdown */}
                      <div className="bg-primary/5 rounded-lg p-3">
                        <div className="text-sm font-medium text-foreground mb-2">Cash In Breakdown</div>
                        <div className="space-y-1 text-sm">
                          {(() => {
                        const financedUnits = Math.floor(flip.units * 0.8); // 80% financed
                        const cashUnits = flip.units - financedUnits;
                        const financedCash = financedUnits * 135 * 0.2; // 20% down payments
                        const cashPurchases = cashUnits * 135; // full cash purchases
                        return <>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">{financedUnits} financed (20% down):</span>
                                  <span className="font-mono font-semibold">${financedCash.toFixed(0)}K</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">{cashUnits} cash purchases:</span>
                                  <span className="font-mono font-semibold">${cashPurchases.toFixed(0)}K</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">Platform fee (3%):</span>
                                  <span className="font-mono font-semibold">${flip.platformFee}K</span>
                                </div>
                                <div className="border-t pt-1.5 mt-1.5 flex justify-between items-center">
                                  <span className="font-semibold text-foreground">Total Cash In:</span>
                                  <span className="font-mono text-lg font-bold text-primary">${flip.cashIn}M</span>
                                </div>
                              </>;
                      })()}
                        </div>
                      </div>

                      
                    </div>

                    {/* Flow Indicator */}
                    <div className="p-8 flex flex-col justify-center items-center border-l border-border/50">
                      <div className="text-center mb-4">
                        <div className="text-sm text-muted-foreground">Remaining Budget</div>
                        <div className="text-2xl font-bold">${flip.remaining}M</div>
                      </div>
                      {index < flywheelData.length - 1 && <ArrowRight className="w-6 h-6 text-primary" />}
                      {index === flywheelData.length - 1 && <Badge variant="outline" className="text-primary border-primary">
                          Final: $371K Surplus
                        </Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>

          {/* Summary */}
          <Card className="mt-12 bg-gradient-primary/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Flywheel Summary</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-primary">${totalPlatformFees}K</div>
                  <div className="text-sm text-muted-foreground">Total Platform Fees</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">$371K</div>
                  <div className="text-sm text-muted-foreground">Cash Surplus</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">112</div>
                  <div className="text-sm text-muted-foreground">Units Built</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Revenue Model Deep Dive */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Closing the $250B Financing Void</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Three revenue streams that transform nomad rent-burn into investable real estate infrastructure
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {revenueStreams.map(stream => <Card key={stream.title} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-luxury transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">{stream.icon}</div>
                  <div className="text-3xl font-bold text-primary mb-2">{stream.amount}</div>
                  <h3 className="text-xl font-semibold mb-3">{stream.title}</h3>
                  <p className="text-muted-foreground mb-4">{stream.description}</p>
                  <Badge variant="outline">{stream.timeline}</Badge>
                </CardContent>
              </Card>)}
          </div>

          <Card className="bg-gradient-secondary/10 border-secondary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Total System Economics</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Mortgage Portfolio</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Total mortgages originated: $9.324M</li>
                    <li>• Annual yield at 8%: $746K/year</li>
                    <li>• 10-year interest income: $7.46M</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">ARW Appreciation Model</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Each $135K unit → $380K (2.81× over 10 years)</li>
                    <li>• Total appreciation: $33.24M</li>
                    <li>• Ancient's 50% share: $16.62M</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 p-6 bg-primary/10 rounded-lg text-center">
                <div className="text-4xl font-bold text-primary mb-2">$24.53M</div>
                <div className="text-lg">Total 10-Year System Capture</div>
                <div className="text-sm text-muted-foreground mt-2">9× ROI vs. $2.75M initial allocation</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Land Acquisition Playbook */}
      <section className="py-20 px-4 bg-background/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Land Acquisition Framework</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Coordinated international land purchases with proper legal structures and risk mitigation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {landAcquisition.map(country => <Card key={country.country} className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{country.country}</h3>
                    <Badge variant="secondary">{country.budget}</Badge>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Legal Structure</div>
                      <div className="text-sm font-medium">{country.structure}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Key Risk</div>
                      <div className="text-sm font-medium">{country.risk}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-6">Universal Safeguards</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <span>SPV per site for clean balance sheets</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <span>Option contracts with minimum cash exposure</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <span>Permit-contingent closings</span>
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <span>Escrow for all deposits</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <span>Title insurance where available</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <span>7-10% contingency buffer</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 p-4 bg-primary/10 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">≈$2.0M</div>
                <div className="text-sm text-muted-foreground">Total Land Acquisition Budget (All 6 Sites)</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center bg-gradient-primary/5">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join the Post-City Revolution
            </h2>
            <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
              Ancient isn't another booking app—it's the mortgage rail, the deed registry, and the town square 
              for a post-city civilization.
            </p>
            <div className="text-lg font-medium text-accent mb-8">
              🌍 Borderless Mortgages, Regenerative Villages
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={() => navigate('/investor-portal')} className="text-lg px-8 py-6">
              Access Investor Portal
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/portfolio')} className="text-lg px-8 py-6">
              Explore Properties
              <Globe className="ml-2 w-5 h-5" />
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-muted-foreground">
            Building infrastructure for 100M+ digital nomads, one village at a time
          </div>
        </div>
      </section>
    </div>;
};
export default BusinessModel;

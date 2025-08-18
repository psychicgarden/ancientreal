import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, TrendingUp, MapPin, DollarSign, Building, Globe, Shield, Code, Target, Rocket, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PlatformAssessment from "@/components/PlatformAssessment";

// Import property images
import villaTulum from "@/assets/villa-tulum.jpg";
import beachChalet from "@/assets/beach-chalet.jpg";
import villaEriceira from "@/assets/villa-ericeira-portugal.jpg";
import villaGreece from "@/assets/villa-greece.jpg";
import villaBali from "@/assets/villa-bali.jpg";
import penthouseMexico from "@/assets/penthouse-mexico.jpg";
import ecoSmartCity from "@/assets/eco-smart-city.jpg";

const flywheelData = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  }
];

const revenueStreams = [
  {
    title: "Platform Fees",
    amount: "$453.6K",
    description: "Infrastructure revenue for serving nomad economy",
    timeline: "Immediate capture",
    icon: "🏛"
  },
  {
    title: "Mortgage Interest",
    amount: "$7.46M",
    description: "8% yield serving the $250B cross-border lending void",
    timeline: "10-year stream",
    icon: "🌐"
  },
  {
    title: "ARW Appreciation",
    amount: "$16.62M",
    description: "Capturing nomad wealth lost to rent into property equity",
    timeline: "10-year capture",
    icon: "🚀"
  }
];

const landAcquisition = [
  {
    country: "Mexico",
    budget: "$270K",
    structure: "Bank Fideicomiso via SAPI",
    risk: "Ejido exclusion critical"
  },
  {
    country: "Brazil",
    budget: "$230K",
    structure: "Brazilian LTDA",
    risk: "Environmental approvals"
  },
  {
    country: "Greece",
    budget: "$360K",
    structure: "Greek IKE SPV",
    risk: "Coastal restrictions"
  },
  {
    country: "Spain",
    budget: "$400K",
    structure: "Spanish SL",
    risk: "8-10% transfer costs"
  },
  {
    country: "Thailand",
    budget: "$280K",
    structure: "30+30 Leasehold",
    risk: "Foreign ownership limits"
  },
  {
    country: "Turkey",
    budget: "$260K",
    structure: "Turkish SPV",
    risk: "Military zone clearance"
  }
];

const BusinessModel = () => {
  const navigate = useNavigate();
  const totalPlatformFees = flywheelData.reduce((sum, flip) => sum + flip.platformFee, 0);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Wide Banner Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src="/src/assets/eco-smart-city.jpg" alt="Eco Smart City Vision" className="w-full h-full object-cover filter brightness-[0.4] contrast-[1.3] saturate-[1.2]" />
          {/* Dramatic Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
        
        {/* ANCIENT branding top-left */}
        <div className="absolute top-8 left-8 z-20">
          <h3 className="text-2xl lg:text-4xl font-light text-white/95 tracking-[0.3em] uppercase">
            ANCIENT
          </h3>
          <p className="text-sm lg:text-base font-light text-white/80 tracking-wide mt-2">
            The World's First Decentralized State
          </p>
        </div>
        
        {/* Centered Main Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center mt-24 lg:mt-32">
          {/* Main Hero Text - Two Lines as Requested */}
          <div className="space-y-4 mb-12">
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] tracking-tight">
              <span className="block text-white drop-shadow-2xl">Building Infrastructure</span>
              <span className="block bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl">for a Borderless World</span>
            </h1>
          </div>
          
          {/* Value Proposition - Positioned Lower */}
          <div className="max-w-3xl mx-auto mt-16">
            <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 p-6 lg:p-8 shadow-2xl">
              <p className="text-lg lg:text-xl xl:text-2xl font-light leading-relaxed text-white mb-6">
                50 million nomads burn <span className="font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">$900B annually</span> on dead rent.
              </p>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mb-6"></div>
              <p className="text-base lg:text-lg text-white/90 leading-relaxed font-light">
                We convert that into fractional, on-chain deeds of dream properties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Now Section */}
      <section className="px-4 bg-background py-[50px]">
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
            {[
              {
                icon: "📈",
                title: "Digital-Nomad Boom",
                stat: "50M → 100M+",
                desc: "6× growth since 2019, accelerating toward 100M+ by 2030"
              },
              {
                icon: "🧳",
                title: "Massive Pipeline",
                stat: "35M+",
                desc: "North-American & European workers intend to go nomadic within two years"
              },
              {
                icon: "💻",
                title: "Remote Work Default",
                stat: "80%",
                desc: "White-collar staff work hybrid/remote, severing income from geography"
              },
              {
                icon: "🏠",
                title: "Affordability Crisis",
                stat: "8× Income",
                desc: "Median home prices vs. household income—worst ratio in four decades"
              },
              {
                icon: "🕰",
                title: "Delayed Homeownership",
                stat: "29 → 36",
                desc: "U.S. first-time-buyer age climbed 7 years in a decade"
              },
              {
                icon: "💰",
                title: "Millennial Capital",
                stat: "$5T Liquid",
                desc: "Massive wealth, yet <50% own homes due to geographic constraints"
              },
              {
                icon: "⚖",
                title: "Tokenized Real Estate",
                stat: "$310M → $1.4T",
                desc: "Market forecast to surge 4.5× by 2030"
              },
              {
                icon: "🗺",
                title: "Visa Tailwinds",
                stat: "50+ Countries",
                desc: "Issue Digital-Nomad Visas (from just 6 in 2019)"
              },
              {
                icon: "💳",
                title: "Cross-border Void",
                stat: "$250B",
                desc: "Capital nomads want but banks refuse to lend"
              }
            ].map(trend => (
              <Card key={trend.title} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-card transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">{trend.icon}</div>
                  <div className="text-2xl font-bold text-primary mb-2">{trend.stat}</div>
                  <h3 className="font-semibold mb-2">{trend.title}</h3>
                  <p className="text-sm text-muted-foreground">{trend.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Business Model Content with Tabs */}
      <section className="px-4 bg-background py-[50px]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-6 text-lg px-6 py-2">
              Development Flywheel Model
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              6 Locations, 4 Flips, 9× ROI
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              Borders wrote the last chapter of property; code writes the next
            </p>
          </div>

          {/* Tabbed Content */}
          <Tabs defaultValue="revenue-model" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="revenue-model">Revenue Model</TabsTrigger>
              <TabsTrigger value="platform-assessment">Platform Assessment</TabsTrigger>
              <TabsTrigger value="budget-breakdown">Budget Breakdown</TabsTrigger>
              <TabsTrigger value="legal-structuring">Legal Structuring</TabsTrigger>
            </TabsList>

            <TabsContent value="revenue-model">

              {/* Flywheel Flow */}
              <div>
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4">The Development Flywheel</h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Each flip generates cash to fund the next, creating momentum through strategic geographic sequencing
                  </p>
                </div>

                <div className="space-y-8">
                  {flywheelData.map((flip, index) => (
                    <Card key={flip.flip} className="bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden">
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
                                  return (
                                    <>
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
                                    </>
                                  );
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
                            
                            {index < flywheelData.length - 1 && (
                              <div className="flex flex-col items-center">
                                <div className="text-sm text-muted-foreground mb-2">Funds Next Flip</div>
                                <ArrowRight className="w-8 h-8 text-primary rotate-90 md:rotate-0" />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Revenue Summary */}
                <div className="mt-16 text-center">
                  <h3 className="text-3xl font-bold mb-8">10-Year Revenue Capture</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {revenueStreams.map((stream, index) => (
                      <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl mb-3">{stream.icon}</div>
                          <h4 className="font-semibold text-lg mb-2">{stream.title}</h4>
                          <div className="text-2xl font-bold text-primary mb-2">{stream.amount}</div>
                          <p className="text-sm text-muted-foreground mb-1">{stream.description}</p>
                          <p className="text-xs text-muted-foreground">{stream.timeline}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-8 p-6 bg-primary/10 rounded-lg">
                    <div className="text-3xl font-bold text-primary">$24.53M</div>
                    <div className="text-sm text-muted-foreground">Total 10-Year Revenue Capture</div>
                  </div>
                </div>
              </div>

              {/* Infrastructure Investment Overview */}
              <div className="mb-16 mt-16">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">Infrastructure Investment Overview</h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    The foundation for building a $827M revenue platform by year 10
                  </p>
                </div>

                {/* Big Picture Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto">
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardContent className="p-6 text-center">
                      <DollarSign className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-2xl font-bold text-foreground">$7M</div>
                      <div className="text-sm text-muted-foreground">Total Infrastructure Investment</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardContent className="p-6 text-center">
                      <Building className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-2xl font-bold text-foreground">7,500</div>
                      <div className="text-sm text-muted-foreground">Year 10 Target Homes</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardContent className="p-6 text-center">
                      <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-2xl font-bold text-foreground">2M</div>
                      <div className="text-sm text-muted-foreground">Target Community Members</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-2xl font-bold text-foreground">$827M</div>
                      <div className="text-sm text-muted-foreground">Year 10 Annual Revenue</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Infrastructure Investment Breakdown */}
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-2xl font-bold text-center mb-8">Why $7M Infrastructure Investment</h3>
                  <div className="grid md:grid-cols-3 gap-8">
                    
                    {/* Legal & Compliance */}
                    <Card className="bg-card/50 backdrop-blur-sm border border-border/30">
                      <CardContent className="p-8">
                        <div className="text-center mb-6">
                          <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                          <h4 className="text-xl font-bold mb-2">Legal & Compliance Foundation</h4>
                          <div className="text-2xl font-bold text-primary">$2.45M</div>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span>Multi-jurisdiction incorporation</span>
                            <span className="text-muted-foreground">$850K</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Regulatory compliance framework</span>
                            <span className="text-muted-foreground">$650K</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Insurance & risk management</span>
                            <span className="text-muted-foreground">$450K</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Legal documentation & templates</span>
                            <span className="text-muted-foreground">$500K</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Platform Technology */}
                    <Card className="bg-card/50 backdrop-blur-sm border border-border/30">
                      <CardContent className="p-8">
                        <div className="text-center mb-6">
                          <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
                          <h4 className="text-xl font-bold mb-2">Platform Technology</h4>
                          <div className="text-2xl font-bold text-primary">$1.8M</div>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span>Smart contract development</span>
                            <span className="text-muted-foreground">$750K</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Platform development & UI/UX</span>
                            <span className="text-muted-foreground">$600K</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Security audits & testing</span>
                            <span className="text-muted-foreground">$250K</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Infrastructure & hosting</span>
                            <span className="text-muted-foreground">$200K</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Market & Operations */}
                    <Card className="bg-card/50 backdrop-blur-sm border border-border/30">
                      <CardContent className="p-8">
                        <div className="text-center mb-6">
                          <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                          <h4 className="text-xl font-bold mb-2">Market & Operations</h4>
                          <div className="text-2xl font-bold text-primary">$2.75M</div>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span>Property acquisition & development</span>
                            <span className="text-muted-foreground">$1.2M</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Marketing & community building</span>
                            <span className="text-muted-foreground">$800K</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Operations & management</span>
                            <span className="text-muted-foreground">$450K</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Partnership development</span>
                            <span className="text-muted-foreground">$300K</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Three-Phase Evolution */}
              <div className="mb-16">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">From Engine → Ecosystem: 3-Phase Evolution</h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Strategic roadmap from proof of concept to network state
                  </p>
                </div>
                
                <div className="max-w-6xl mx-auto">
                  {/* Evolution Flow */}
                  <div className="flex items-center justify-center mb-16">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-2 rounded-lg font-semibold">
                        Proof Engine
                      </div>
                      <ArrowRight className="w-6 h-6 text-muted-foreground" />
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold">
                        Developer Platform
                      </div>
                      <ArrowRight className="w-6 h-6 text-muted-foreground" />
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold">
                        Network State
                      </div>
                    </div>
                  </div>

                  {/* Phase Cards */}
                  <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* Phase 1: Proof Engine */}
                    <Card className="bg-card/50 backdrop-blur-sm border border-border/30 hover:border-primary/50 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <Badge className="bg-primary/10 text-primary">Phase 1</Badge>
                          <div className="text-sm text-muted-foreground">Years 0-3</div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Proof Engine</h3>
                        <p className="text-muted-foreground mb-4">Validate the model with strategic property flips</p>
                        
                        <div className="space-y-3 mb-4">
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
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <Badge className="bg-green-500/10 text-green-600">Phase 2</Badge>
                          <div className="text-sm text-muted-foreground">Years 3-7</div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Platform Scale</h3>
                        <p className="text-muted-foreground mb-4">Open platform to developers and scale operations</p>
                        
                        <div className="space-y-3 mb-4">
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
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <Badge className="bg-blue-500/10 text-blue-600">Phase 3</Badge>
                          <div className="text-sm text-muted-foreground">Years 7-10</div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Network State</h3>
                        <p className="text-muted-foreground mb-4">Achieve network state status with global reach</p>
                        
                        <div className="space-y-3 mb-4">
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
            </TabsContent>

            <TabsContent value="platform-assessment">
              <PlatformAssessment />
            </TabsContent>

            <TabsContent value="budget-breakdown" className="space-y-8">
              {/* Executive Summary */}
              <Card className="p-8 bg-gradient-card border-none shadow-luxury">
                <div className="text-center space-y-4 mb-8">
                  <h2 className="text-3xl font-bold">Real Estate Investment Fund - Use of Funds Walkthrough</h2>
                  <h3 className="text-2xl text-primary">36-Month Capital Deployment & Recycling Strategy</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Card className="p-4 bg-gradient-primary text-primary-foreground border-none">
                    <div className="space-y-2">
                      <p className="text-sm opacity-90">Initial Investment</p>
                      <p className="text-2xl font-bold">$7.00M</p>
                    </div>
                  </Card>
                  <Card className="p-4 bg-gradient-secondary text-secondary-foreground border-none">
                    <div className="space-y-2">
                      <p className="text-sm opacity-90">Total Capital Deployed</p>
                      <p className="text-2xl font-bold">$6.93M</p>
                      <p className="text-xs opacity-75">over 36 months</p>
                    </div>
                  </Card>
                  <Card className="p-4 bg-gradient-accent text-accent-foreground border-none">
                    <div className="space-y-2">
                      <p className="text-sm opacity-90">Capital Recycled</p>
                      <p className="text-2xl font-bold">$2.76M</p>
                      <p className="text-xs opacity-75">from presales & closings</p>
                    </div>
                  </Card>
                  <Card className="p-4 bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))] border-none">
                    <div className="space-y-2">
                      <p className="text-sm opacity-90">Final Treasury Balance</p>
                      <p className="text-2xl font-bold">$2.94M</p>
                      <p className="text-xs opacity-75">42% retained</p>
                    </div>
                  </Card>
                  <Card className="p-4 bg-destructive text-destructive-foreground border-none">
                    <div className="space-y-2">
                      <p className="text-sm opacity-90">Peak Capital at Risk</p>
                      <p className="text-2xl font-bold">$4.06M</p>
                      <p className="text-xs opacity-75">58% of original</p>
                    </div>
                  </Card>
                </div>
              </Card>

              {/* Year-based Sub-Tabs for Complete 36-Month Timeline */}
              <Card className="p-8 bg-gradient-card border-none shadow-luxury">
                <Tabs defaultValue="year-1" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="year-1">Year 1: Foundation & Mexico</TabsTrigger>
                    <TabsTrigger value="year-2">Year 2: Brazil & Spain Entry</TabsTrigger>
                    <TabsTrigger value="year-3">Year 3: Multi-Market Expansion</TabsTrigger>
                  </TabsList>

                  {/* Year 1 Tab */}
                  <TabsContent value="year-1" className="space-y-8">
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-primary">Year 1: Foundation & Mexico Launch</h3>
                      
                      {/* Q1 - Infrastructure & Legal Framework */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold">Q1 - Infrastructure & Legal Framework</h4>
                        <p className="text-lg font-medium text-accent">Tranche A-C: $620K Total Outflow</p>
                        
                        {/* Month 1 - Tranche A */}
                        <Card className="p-6 bg-background/50 border border-primary/20">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="text-lg font-semibold">Month 1 - Tranche A ($150K)</h5>
                              <div className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                                INVESTOR PROTECTION ACTIVATED
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">Gate Requirements: ParentCo live, Nevis banking established, legal counsel retained</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h6 className="font-medium">Use of Funds</h6>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between"><span>Nevis ParentCo Setup</span><span>$4K</span></div>
                                  <div className="flex justify-between"><span>US Securities Counsel</span><span>$35K</span></div>
                                  <div className="flex justify-between"><span>Audit & Portal Onboarding</span><span>$20K</span></div>
                                  <div className="flex justify-between"><span>Mexico SAPI SPV</span><span>$10K</span></div>
                                  <div className="flex justify-between"><span>Banking Infrastructure</span><span>$8K</span></div>
                                  <div className="flex justify-between"><span>Smart Contract Development</span><span>$50K</span></div>
                                  <div className="flex justify-between"><span>Security Audit</span><span>$8K</span></div>
                                  <div className="flex justify-between"><span>SaaS/Operations</span><span>$5K</span></div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h6 className="font-medium">Purpose & Protection</h6>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div>Corporate structure & KYC</div>
                                  <div>Reg CF/D compliance</div>
                                  <div>Funding platform setup</div>
                                  <div>Legal entity formation</div>
                                  <div>Multi-currency accounts</div>
                                  <div>Mortgage + ARW + multisig</div>
                                  <div>Contract security review</div>
                                  <div>Dataroom, e-sign, compliance</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-border">
                              <span className="font-medium">Running Balance:</span>
                              <span className="text-lg font-bold text-accent">$7.00M - $140K = $6.86M</span>
                            </div>
                          </div>
                        </Card>

                        {/* Month 2 - Tranche B */}
                        <Card className="p-6 bg-background/50 border border-primary/20">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="text-lg font-semibold">Month 2 - Tranche B ($120K)</h5>
                              <div className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                                ESCROW PROTECTION
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">Gate Requirements: Mexico counsel engaged, Mazunte shortlisted</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h6 className="font-medium">Use of Funds</h6>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between"><span>Oaxaca Site Scouting</span><span>$8K</span></div>
                                  <div className="flex justify-between"><span>Mazunte LOI Escrow</span><span>$25K</span></div>
                                  <div className="flex justify-between"><span>Due Diligence</span><span>$7K</span></div>
                                  <div className="flex justify-between"><span>Fideicomiso Application</span><span>$6K</span></div>
                                  <div className="flex justify-between"><span>Platform Development</span><span>$45K</span></div>
                                  <div className="flex justify-between"><span>Legal & Admin</span><span>$19K</span></div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h6 className="font-medium">Purpose & Protection</h6>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div>Soil/utilities/drone survey</div>
                                  <div>10% deposit on $250K land</div>
                                  <div>Title/zoning/environmental</div>
                                  <div>Foreign ownership structure</div>
                                  <div>KYC/AML + payment systems</div>
                                  <div>Translations, filings, buffer</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-border">
                              <span className="font-medium">Running Balance:</span>
                              <span className="text-lg font-bold text-accent">$6.86M - $110K = $6.75M</span>
                            </div>
                          </div>
                        </Card>

                        {/* Month 4 - Tranche C */}
                        <Card className="p-6 bg-background/50 border border-primary/20">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="text-lg font-semibold">Month 4 - Tranche C ($350K)</h5>
                              <div className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium">
                                MILESTONE GATE
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">Gate Requirements: Mazunte DD cleared, permits in process</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h6 className="font-medium">Use of Funds</h6>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between"><span>Mazunte Land Final</span><span>$225K</span></div>
                                  <div className="flex justify-between"><span>Closing Costs</span><span>$15K</span></div>
                                  <div className="flex justify-between"><span>Architecture & Engineering</span><span>$10K</span></div>
                                  <div className="flex justify-between"><span>Local Team Setup</span><span>$15K</span></div>
                                  <div className="flex justify-between"><span>Marketing Preparation</span><span>$20K</span></div>
                                  <div className="flex justify-between"><span>Operations & Buffer</span><span>$45K</span></div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h6 className="font-medium">Purpose & Protection</h6>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div>Property acquisition</div>
                                  <div>Notary and legal fees</div>
                                  <div>Schematic design</div>
                                  <div>Community liaison, first hires</div>
                                  <div>Presale materials</div>
                                  <div>Travel, admin, contingency</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-border">
                              <span className="font-medium">Running Balance:</span>
                              <span className="text-lg font-bold text-accent">$6.75M - $330K = $6.42M</span>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Q2 - Mazunte Construction Launch */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold">Q2 - Mazunte Construction Launch</h4>
                        <p className="text-lg font-medium text-accent">Tranche D-E: $650K Total Outflow</p>

                        {/* Month 6 - Tranche D */}
                        <Card className="p-6 bg-background/50 border border-primary/20">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="text-lg font-semibold">Month 6 - Tranche D ($400K)</h5>
                              <div className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                                CONSTRUCTION GATE
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">Gate Requirements: Mazunte permits issued, construction license obtained</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h6 className="font-medium">Use of Funds</h6>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between"><span>Site Preparation</span><span>$150K</span></div>
                                  <div className="flex justify-between"><span>Structural Frame Deposit</span><span>$100K</span></div>
                                  <div className="flex justify-between"><span>Detailed Engineering</span><span>$15K</span></div>
                                  <div className="flex justify-between"><span>Project Management</span><span>$20K</span></div>
                                  <div className="flex justify-between"><span>Marketing Launch</span><span>$30K</span></div>
                                  <div className="flex justify-between"><span>Insurance & Compliance</span><span>$10K</span></div>
                                  <div className="flex justify-between"><span>Operations Buffer</span><span>$45K</span></div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h6 className="font-medium">Purpose & Protection</h6>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div>Foundations and infrastructure</div>
                                  <div>Construction milestone payment</div>
                                  <div>Final drawings and permits</div>
                                  <div>PM and engineer onboarding</div>
                                  <div>Content creation and campaigns</div>
                                  <div>Project insurance and legal</div>
                                  <div>Admin, travel, contingency</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-border">
                              <span className="font-medium">Running Balance:</span>
                              <span className="text-lg font-bold text-accent">$6.42M - $390K = $6.03M</span>
                            </div>
                          </div>
                        </Card>

                        {/* Month 9 - Tranche E */}
                        <Card className="p-6 bg-background/50 border border-primary/20">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="text-lg font-semibold">Month 9 - Tranche E ($250K)</h5>
                              <div className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                                EXPANSION GATE
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">Gate Requirements: Bahia LOI executed, Mazunte 30% complete</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h6 className="font-medium">Use of Funds</h6>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between"><span>Bahia LOI Escrow</span><span>$25K</span></div>
                                  <div className="flex justify-between"><span>Bahia Due Diligence</span><span>$10K</span></div>
                                  <div className="flex justify-between"><span>Brazil LTDA Formation</span><span>$7K</span></div>
                                  <div className="flex justify-between"><span>Mazunte Build Phase 2</span><span>$150K</span></div>
                                  <div className="flex justify-between"><span>Brazil Marketing Setup</span><span>$10K</span></div>
                                  <div className="flex justify-between"><span>Legal & Operations</span><span>$38K</span></div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h6 className="font-medium">Purpose & Protection</h6>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div>Brazil property deposit</div>
                                  <div>Title, environmental, survey</div>
                                  <div>Legal entity setup</div>
                                  <div>Walls and utilities installation</div>
                                  <div>Market preparation</div>
                                  <div>Filings, travel, buffer</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-border">
                              <span className="font-medium">Running Balance:</span>
                              <span className="text-lg font-bold text-accent">$6.03M - $240K = $5.79M</span>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Q3-Q4 - Mazunte Presales & Bahia Acquisition */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold">Q3-Q4 - Mazunte Presales & Bahia Acquisition</h4>
                        <p className="text-lg font-medium text-accent">Tranche F: $400K Outflow | First Inflows: $385K</p>

                        {/* Month 12 - Tranche F */}
                        <Card className="p-6 bg-background/50 border border-green-500/20">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="text-lg font-semibold">Month 12 - Tranche F ($400K)</h5>
                              <div className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">
                                FIRST CASH INFLOWS
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">Gate Requirements: Mazunte presales launched, Bahia DD cleared</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h6 className="font-medium">Use of Funds</h6>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between"><span>Bahia Land Acquisition</span><span>$225K</span></div>
                                  <div className="flex justify-between"><span>Brazil Closing Costs</span><span>$15K</span></div>
                                  <div className="flex justify-between"><span>Bahia Architecture</span><span>$20K</span></div>
                                  <div className="flex justify-between"><span>Mazunte Build Phase 3</span><span>$100K</span></div>
                                  <div className="flex justify-between"><span>Mazunte Marketing</span><span>$20K</span></div>
                                  <div className="flex justify-between"><span>Staffing</span><span>$10K</span></div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h6 className="font-medium">Major Inflows - Mazunte Presales Begin</h6>
                                <div className="space-y-1 text-sm text-green-600">
                                  <div className="flex justify-between"><span>Down payments (12 financed units)</span><span>+$108K</span></div>
                                  <div className="flex justify-between"><span>Platform fees (15 units)</span><span>+$20.25K</span></div>
                                  <div className="flex justify-between font-medium"><span>Total Inflow</span><span>+$128.25K</span></div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-border">
                              <span className="font-medium">Net Cash Flow:</span>
                              <span className="text-lg font-bold text-green-600">-$390K + $128.25K = -$261.75K</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Running Balance:</span>
                              <span className="text-lg font-bold text-accent">$5.79M - $261.75K = $5.53M</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Year 2 Tab */}
                  <TabsContent value="year-2" className="space-y-8">
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-primary">Year 2: Brazil Development & Spain Entry</h3>
                      
                      {/* Continued Mazunte Inflows */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold">Continued Mazunte Inflows (Months 13-14)</h4>
                        <p className="text-lg font-medium text-green-600">Inflow Only: $256.5K Total</p>
                        
                        <Card className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-500/20">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h6 className="font-medium">Month 13 Inflows</h6>
                                <div className="text-sm text-green-600">$128.25K (Mazunte presales tranche 2)</div>
                              </div>
                              <div className="space-y-2">
                                <h6 className="font-medium">Month 14 Inflows</h6>
                                <div className="text-sm text-green-600">$128.25K (Mazunte presales tranche 3)</div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-green-200 dark:border-green-800">
                              <span className="font-medium">Running Balance After Month 14:</span>
                              <span className="text-lg font-bold text-accent">$5.53M + $256.5K = $5.78M</span>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Q1 Year 2 - Bahia Construction Launch */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold">Q1 Year 2 - Bahia Construction Launch</h4>
                        <p className="text-lg font-medium text-accent">Tranche G: $450K Outflow</p>

                        {/* Month 15 - Tranche G */}
                        <Card className="p-6 bg-background/50 border border-primary/20">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="text-lg font-semibold">Month 15 - Tranche G ($450K)</h5>
                              <div className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                                BAHIA CONSTRUCTION
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">Gate Requirements: Bahia permits approved</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h6 className="font-medium">Use of Funds</h6>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between"><span>Bahia Site Preparation</span><span>$150K</span></div>
                                  <div className="flex justify-between"><span>Bahia Frame Deposit</span><span>$100K</span></div>
                                  <div className="flex justify-between"><span>Mazunte Finishes Phase 1</span><span>$150K</span></div>
                                  <div className="flex justify-between"><span>Brazil Marketing</span><span>$20K</span></div>
                                  <div className="flex justify-between"><span>Operations</span><span>$10K</span></div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h6 className="font-medium">Purpose & Protection</h6>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div>Foundation and infrastructure</div>
                                  <div>Construction milestone</div>
                                  <div>Interior completion</div>
                                  <div>Presale preparation</div>
                                  <div>Admin and management</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-border">
                              <span className="font-medium">Running Balance:</span>
                              <span className="text-lg font-bold text-accent">$5.78M - $430K = $5.35M</span>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Q2 Year 2 - First Property Completion */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold">Q2 Year 2 - First Property Completion</h4>
                        <p className="text-lg font-medium text-accent">Tranche H: $500K Outflow | Major Inflows: $534K</p>

                        {/* Month 18 - Tranche H */}
                        <Card className="p-6 bg-background/50 border border-green-500/20">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="text-lg font-semibold">Month 18 - Tranche H ($500K)</h5>
                              <div className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">
                                MAZUNTE COMPLETION
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">Gate Requirements: Bahia 30% built, Mazunte handovers begin</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h6 className="font-medium">Use of Funds</h6>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between"><span>Bahia Phase 2 Construction</span><span>$200K</span></div>
                                  <div className="flex justify-between"><span>Mazunte Final Fit-Out</span><span>$150K</span></div>
                                  <div className="flex justify-between"><span>Spain Market Entry</span><span>$70K</span></div>
                                  <div className="flex justify-between"><span>Marketing & Operations</span><span>$60K</span></div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h6 className="font-medium">Major Inflows - Mazunte Completion</h6>
                                <div className="space-y-1 text-sm text-green-600">
                                  <div className="flex justify-between"><span>Cash buyer closings (3 units)</span><span>+$405K</span></div>
                                  <div className="flex justify-between"><span>Bahia presales begin</span><span>+$129.26K</span></div>
                                  <div className="flex justify-between font-medium"><span>Total Inflow</span><span>+$534.26K</span></div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-border">
                              <span className="font-medium">Net Cash Flow:</span>
                              <span className="text-lg font-bold text-green-600">-$480K + $534.26K = +$54.26K</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Running Balance:</span>
                              <span className="text-lg font-bold text-accent">$5.35M + $54.26K = $5.40M</span>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Bahia Presales Momentum */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold">Bahia Presales Momentum (Months 19-21)</h4>
                        <p className="text-lg font-medium text-green-600">Inflow Only: $387.79K Total</p>
                        
                        <Card className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-500/20">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <h6 className="font-medium">Month 19</h6>
                                <div className="text-sm text-green-600">$129.26K (Bahia tranche 2)</div>
                              </div>
                              <div className="space-y-2">
                                <h6 className="font-medium">Month 20</h6>
                                <div className="text-sm text-green-600">$129.26K (Bahia tranche 3)</div>
                              </div>
                              <div className="space-y-2">
                                <h6 className="font-medium">Month 21</h6>
                                <div className="text-sm text-green-600">$129.26K (Bahia tranche 4)</div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-green-200 dark:border-green-800">
                              <span className="font-medium">Running Balance After Month 21:</span>
                              <span className="text-lg font-bold text-accent">$5.40M + $387.79K = $5.79M</span>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Q3 Year 2 - Spain Market Entry */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold">Q3 Year 2 - Spain Market Entry</h4>
                        <p className="text-lg font-medium text-accent">Tranche I: $550K Outflow</p>

                        {/* Month 21 - Tranche I */}
                        <Card className="p-6 bg-background/50 border border-primary/20">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="text-lg font-semibold">Month 21 - Tranche I ($550K)</h5>
                              <div className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                                SPAIN ENTRY
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">Gate Requirements: Spain LOIs signed, Bahia presales launched</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h6 className="font-medium">Use of Funds</h6>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between"><span>Spain LOI Deposits</span><span>$65K</span></div>
                                  <div className="flex justify-between"><span>Bahia Roof & Interiors</span><span>$200K</span></div>
                                  <div className="flex justify-between"><span>Spain SPV Formation</span><span>$40K</span></div>
                                  <div className="flex justify-between"><span>Platform Upgrade</span><span>$150K</span></div>
                                  <div className="flex justify-between"><span>Operations Buffer</span><span>$75K</span></div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h6 className="font-medium">Purpose & Protection</h6>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div>2 property deposits</div>
                                  <div>Construction progress</div>
                                  <div>Legal entity setup</div>
                                  <div>Secondary market + ARW resale</div>
                                  <div>Multi-market management</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-border">
                              <span className="font-medium">Running Balance:</span>
                              <span className="text-lg font-bold text-accent">$5.79M - $530K = $5.39M</span>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Q4 Year 2 - Spain Land Acquisition */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold">Q4 Year 2 - Spain Land Acquisition</h4>
                        <p className="text-lg font-medium text-accent">Tranche J: $600K Outflow</p>

                        {/* Month 24 - Tranche J */}
                        <Card className="p-6 bg-background/50 border border-primary/20">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="text-lg font-semibold">Month 24 - Tranche J ($600K)</h5>
                              <div className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium">
                                SPAIN ACQUISITION
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">Gate Requirements: Bahia 60% built, Spain DD cleared</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h6 className="font-medium">Use of Funds</h6>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between"><span>Spain Land Acquisitions</span><span>$500K</span></div>
                                  <div className="flex justify-between"><span>Spain Closing Costs</span><span>$25K</span></div>
                                  <div className="flex justify-between"><span>Bahia Interior Work</span><span>$20K</span></div>
                                  <div className="flex justify-between"><span>Spain Design & Permits</span><span>$25K</span></div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h6 className="font-medium">Purpose & Protection</h6>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div>2 property purchases</div>
                                  <div>Notary and legal fees</div>
                                  <div>Finishing touches</div>
                                  <div>Schematic and licensing</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-border">
                              <span className="font-medium">Running Balance:</span>
                              <span className="text-lg font-bold text-accent">$5.39M - $570K = $4.82M</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Year 3 Tab */}
                  <TabsContent value="year-3" className="space-y-8">
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-primary">Year 3: Multi-Market Expansion</h3>
                      
                      {/* Q1 Year 3 - Spain Construction Launch */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold">Q1 Year 3 - Spain Construction Launch</h4>
                        <p className="text-lg font-medium text-accent">Tranche K: $700K Outflow</p>

                        {/* Month 27 - Tranche K */}
                        <Card className="p-6 bg-background/50 border border-primary/20">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="text-lg font-semibold">Month 27 - Tranche K ($700K)</h5>
                              <div className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                                SPAIN CONSTRUCTION
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">Gate Requirements: Spain permits issued</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h6 className="font-medium">Use of Funds</h6>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between"><span>Spain Site Preparation</span><span>$250K</span></div>
                                  <div className="flex justify-between"><span>Spain Frame Deposits</span><span>$200K</span></div>
                                  <div className="flex justify-between"><span>Bahia Finishes Phase 2</span><span>$150K</span></div>
                                  <div className="flex justify-between"><span>Spain Marketing</span><span>$50K</span></div>
                                  <div className="flex justify-between"><span>Operations</span><span>$20K</span></div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h6 className="font-medium">Purpose & Protection</h6>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div>Foundations across 2 sites</div>
                                  <div>Construction milestones</div>
                                  <div>Completion preparation</div>
                                  <div>Presale launch</div>
                                  <div>Multi-market coordination</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-border">
                              <span className="font-medium">Running Balance:</span>
                              <span className="text-lg font-bold text-accent">$4.82M - $670K = $4.15M</span>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Q2 Year 3 - Second Property Completion */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold">Q2 Year 3 - Second Property Completion</h4>
                        <p className="text-lg font-medium text-accent">Tranche L: $800K Outflow | Major Inflows: $675K</p>

                        {/* Month 30 - Tranche L */}
                        <Card className="p-6 bg-background/50 border border-orange-500/20">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="text-lg font-semibold">Month 30 - Tranche L ($800K)</h5>
                              <div className="px-3 py-1 bg-orange-600 text-white rounded-full text-sm font-medium">
                                PEAK CAPITAL AT RISK
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">Gate Requirements: Spain 30% built, Greece scouting underway</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h6 className="font-medium">Use of Funds</h6>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between"><span>Spain Construction Phase 2</span><span>$350K</span></div>
                                  <div className="flex justify-between"><span>Spain Interiors Phase 1</span><span>$150K</span></div>
                                  <div className="flex justify-between"><span>Greece Market Entry</span><span>$60K</span></div>
                                  <div className="flex justify-between"><span>Platform DAO Tools</span><span>$100K</span></div>
                                  <div className="flex justify-between"><span>Operations Scale-Up</span><span>$100K</span></div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h6 className="font-medium">Major Inflows - Bahia Completion</h6>
                                <div className="space-y-1 text-sm text-green-600">
                                  <div className="flex justify-between"><span>Cash buyer closings (5 units)</span><span>+$675K</span></div>
                                  <div className="flex justify-between font-medium"><span>Total Inflow</span><span>+$675K</span></div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-border">
                              <span className="font-medium">Net Cash Flow:</span>
                              <span className="text-lg font-bold text-orange-600">-$760K + $675K = -$85K</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Running Balance:</span>
                              <span className="text-lg font-bold text-orange-600">$4.15M - $85K = $4.06M</span>
                            </div>
                            <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg">
                              <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                                ⚠️ This represents the peak capital at risk: $7.00M - $4.06M = $2.94M net deployment
                              </p>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Q3 Year 3 - Greece Entry & EU Presales */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold">Q3 Year 3 - Greece Entry & EU Presales</h4>
                        <p className="text-lg font-medium text-accent">Tranche M: $900K Outflow | EU Presales Begin: $193K</p>

                        {/* Month 33 - Tranche M */}
                        <Card className="p-6 bg-background/50 border border-green-500/20">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="text-lg font-semibold">Month 33 - Tranche M ($900K)</h5>
                              <div className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">
                                EU PRESALES START
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">Gate Requirements: Corfu & Mallorca presales launched</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h6 className="font-medium">Use of Funds</h6>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between"><span>Greece LOI Deposits & SPV</span><span>$80K</span></div>
                                  <div className="flex justify-between"><span>Spain Roof & Interiors</span><span>$400K</span></div>
                                  <div className="flex justify-between"><span>Global Marketing Push</span><span>$150K</span></div>
                                  <div className="flex justify-between"><span>Operations Scale</span><span>$240K</span></div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h6 className="font-medium">EU Presales Launch</h6>
                                <div className="space-y-1 text-sm text-green-600">
                                  <div className="flex justify-between"><span>Corfu down payments + fees</span><span>+$97.2K</span></div>
                                  <div className="flex justify-between"><span>Mallorca down payments + fees</span><span>+$96.19K</span></div>
                                  <div className="flex justify-between font-medium"><span>Total EU Presales (Tranche 1)</span><span>+$193.39K</span></div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-border">
                              <span className="font-medium">Net Cash Flow:</span>
                              <span className="text-lg font-bold text-red-600">-$870K + $193.39K = -$676.61K</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Running Balance:</span>
                              <span className="text-lg font-bold text-accent">$4.06M - $676.61K = $3.38M</span>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* EU Presales Momentum */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold">EU Presales Momentum (Months 34-35)</h4>
                        <p className="text-lg font-medium text-green-600">Inflows Only: $386.78K Total</p>
                        
                        <Card className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-500/20">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h6 className="font-medium">Month 34</h6>
                                <div className="text-sm text-green-600">$193.39K (EU presales tranche 2)</div>
                              </div>
                              <div className="space-y-2">
                                <h6 className="font-medium">Month 35</h6>
                                <div className="text-sm text-green-600">$193.39K (EU presales tranche 3)</div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-green-200 dark:border-green-800">
                              <span className="font-medium">Running Balance After Month 35:</span>
                              <span className="text-lg font-bold text-accent">$3.38M + $386.78K = $3.77M</span>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Q4 Year 3 - Greece Land Acquisition */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold">Q4 Year 3 - Greece Land Acquisition</h4>
                        <p className="text-lg font-medium text-accent">Final Tranche N: $1.05M Outflow | EU Presales Complete: $193K</p>

                        {/* Month 36 - Tranche N */}
                        <Card className="p-6 bg-background/50 border border-gold/20">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="text-lg font-semibold">Month 36 - Tranche N ($1.05M)</h5>
                              <div className="px-3 py-1 bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))] rounded-full text-sm font-medium">
                                36-MONTH COMPLETION
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">Gate Requirements: Spain 60% built, Greece DD cleared</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h6 className="font-medium">Use of Funds</h6>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between"><span>Greece Land Acquisitions</span><span>$500K</span></div>
                                  <div className="flex justify-between"><span>Spain Final Interiors</span><span>$300K</span></div>
                                  <div className="flex justify-between"><span>Greece Licensing</span><span>$40K</span></div>
                                  <div className="flex justify-between"><span>Operations Reserve</span><span>$180K</span></div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h6 className="font-medium">Final EU Presales</h6>
                                <div className="space-y-1 text-sm text-green-600">
                                  <div className="flex justify-between"><span>EU presales tranche 4</span><span>+$193.39K</span></div>
                                  <div className="flex justify-between font-medium"><span>Total Final Inflow</span><span>+$193.39K</span></div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-border">
                              <span className="font-medium">Net Cash Flow:</span>
                              <span className="text-lg font-bold text-red-600">-$1,020K + $193.39K = -$826.61K</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Final Running Balance:</span>
                              <span className="text-lg font-bold text-[hsl(var(--gold))]">$3.77M - $826.61K = $2.94M</span>
                            </div>
                            <div className="bg-[hsl(var(--gold))]/10 p-3 rounded-lg border border-[hsl(var(--gold))]/20">
                              <p className="text-sm font-medium text-[hsl(var(--gold))]">
                                🎯 36-Month Goal Achieved: $2.94M final treasury balance (42% of original investment preserved)
                              </p>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>

              {/* 36-Month Summary & Analysis */}
              <Card className="p-8 bg-gradient-card border-none shadow-luxury">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">36-Month Summary & Capital Recycling Analysis</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Total Capital Flows */}
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold">Total Capital Flows</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse bg-background/50 rounded-lg overflow-hidden">
                          <thead>
                            <tr className="bg-primary text-primary-foreground">
                              <th className="text-left p-4 font-semibold">Category</th>
                              <th className="text-left p-4 font-semibold">Amount</th>
                              <th className="text-left p-4 font-semibold">% of Initial</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-border/50 bg-muted/30">
                              <td className="p-4 font-bold">Initial Investment</td>
                              <td className="p-4">$7.00M</td>
                              <td className="p-4">100%</td>
                            </tr>
                            <tr className="border-b border-border/50 bg-background/50">
                              <td className="p-4">Total Outflows</td>
                              <td className="p-4">$6.93M</td>
                              <td className="p-4">99%</td>
                            </tr>
                            <tr className="border-b border-border/50 bg-muted/30">
                              <td className="p-4">Total Inflows</td>
                              <td className="p-4 text-accent font-medium">$2.76M</td>
                              <td className="p-4">39%</td>
                            </tr>
                            <tr className="border-b border-border/50 bg-background/50">
                              <td className="p-4 font-bold">Final Treasury</td>
                              <td className="p-4 text-[hsl(var(--gold))] font-bold">$2.94M</td>
                              <td className="p-4">42%</td>
                            </tr>
                            <tr className="bg-accent/20">
                              <td className="p-4 font-bold">Net Capital Deployed</td>
                              <td className="p-4 font-bold">$4.06M</td>
                              <td className="p-4">58%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Property-by-Property Capital Recycling */}
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold">Property-by-Property Capital Recycling</h4>
                      <div className="space-y-3">
                        <Card className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-500/20">
                          <div className="space-y-2">
                            <h6 className="font-semibold text-green-700 dark:text-green-300">Mazunte (Mexico) - COMPLETED & FULLY REALIZED</h6>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>Total Investment: $1.365M</div>
                              <div className="text-green-600 font-medium">Total Returns: $789.75K</div>
                            </div>
                            <p className="text-xs text-green-600">100% built, handed over, all cash flows realized</p>
                          </div>
                        </Card>
                        
                        <Card className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-500/20">
                          <div className="space-y-2">
                            <h6 className="font-semibold text-green-700 dark:text-green-300">Bahia (Brazil) - COMPLETED & FULLY REALIZED</h6>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>Total Investment: $1.815M</div>
                              <div className="text-green-600 font-medium">Total Returns: $1,192.05K</div>
                            </div>
                            <p className="text-xs text-green-600">100% built, handed over, all cash flows realized</p>
                          </div>
                        </Card>
                        
                        <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-500/20">
                          <div className="space-y-2">
                            <h6 className="font-semibold text-blue-700 dark:text-blue-300">Spain (Mallorca) - 60% COMPLETE, PRESALES LIVE</h6>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>Investment: $1.200M</div>
                              <div className="text-blue-600 font-medium">Returns Captured: $789.75K</div>
                            </div>
                            <p className="text-xs text-blue-600">Pending Returns: $405K (cash closings post-36 months)</p>
                          </div>
                        </Card>
                        
                        <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-500/20">
                          <div className="space-y-2">
                            <h6 className="font-semibold text-yellow-700 dark:text-yellow-300">Greece (Corfu) - PRESALES LIVE, CONSTRUCTION READY</h6>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>Investment: $580K</div>
                              <div className="text-yellow-600 font-medium">Returns Captured: $928.80K</div>
                            </div>
                            <p className="text-xs text-yellow-600">Pending Returns: $540K (cash closings post-36 months)</p>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </div>

                  {/* Post-36 Month Sustainability Model */}
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">Post-36 Month Sustainability Model</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-6 bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))]/20">
                        <div className="space-y-4">
                          <h5 className="font-semibold text-[hsl(var(--gold))]">Immediate Pipeline (Months 37-60)</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Available Capital:</span>
                              <span className="font-medium">$2.94M treasury</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Pending EU Cash Closings:</span>
                              <span className="font-medium">+$945K</span>
                            </div>
                            <div className="flex justify-between font-semibold border-t pt-2">
                              <span>Total Available:</span>
                              <span className="text-[hsl(var(--gold))]">$3.89M</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-6 bg-accent/10 border border-accent/20">
                        <div className="space-y-4">
                          <h5 className="font-semibold text-accent">Thailand & Turkey Launch (Self-Funded)</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Thailand Investment Required:</span>
                              <span>~$2.0M</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Turkey Investment Required:</span>
                              <span>~$1.5M</span>
                            </div>
                            <div className="flex justify-between font-semibold border-t pt-2">
                              <span>Total Need vs. Available:</span>
                              <span className="text-green-600">$390K buffer</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* Capital Efficiency Metrics */}
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">Capital Efficiency Metrics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card className="p-4 text-center bg-gradient-primary text-primary-foreground border-none">
                        <div className="space-y-2">
                          <p className="text-2xl font-bold">39%</p>
                          <p className="text-sm opacity-90">Capital Recycling Rate</p>
                        </div>
                      </Card>
                      <Card className="p-4 text-center bg-gradient-secondary text-secondary-foreground border-none">
                        <div className="space-y-2">
                          <p className="text-2xl font-bold">58%</p>
                          <p className="text-sm opacity-90">Peak Capital Utilization</p>
                        </div>
                      </Card>
                      <Card className="p-4 text-center bg-gradient-accent text-accent-foreground border-none">
                        <div className="space-y-2">
                          <p className="text-2xl font-bold">42%</p>
                          <p className="text-sm opacity-90">Treasury Preservation</p>
                        </div>
                      </Card>
                      <Card className="p-4 text-center bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))] border-none">
                        <div className="space-y-2">
                          <p className="text-2xl font-bold">Month 36</p>
                          <p className="text-sm opacity-90">Self-Funding Achievement</p>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Risk Mitigation & Controls */}
              <Card className="p-8 bg-gradient-card border-none shadow-luxury">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Risk Mitigation & Controls</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold">Gated Capital Release System</h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">Milestone-Based Tranches</p>
                            <p className="text-sm text-muted-foreground">Capital only released upon verified completion of gates</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">Third-Party Verification</p>
                            <p className="text-sm text-muted-foreground">Bank statements and documentation required for each gate</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">Multisig Controls</p>
                            <p className="text-sm text-muted-foreground">ParentCo + investor representative approval for {'>'}$100K tranches</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold">Presale Risk Management</h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">Escrowed LOIs</p>
                            <p className="text-sm text-muted-foreground">Permit-contingent closings prevent stranded deposits</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">Conservative Timing</p>
                            <p className="text-sm text-muted-foreground">3-4 month presale windows built into cash flow projections</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">Platform Fee Acceleration</p>
                            <p className="text-sm text-muted-foreground">3% fees captured immediately at contract signing</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold">Cash Flow Protection</h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">Treasury Centralization</p>
                            <p className="text-sm text-muted-foreground">All inflows route through ParentCo (not individual SPVs)</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">Waterfall Structure</p>
                            <p className="text-sm text-muted-foreground">Systematic upstream of cash from SPVs to fund next developments</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">Operations Buffer</p>
                            <p className="text-sm text-muted-foreground">6-month runway maintained at completion of 36-month period</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold">Market Diversification</h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-[hsl(var(--gold))] rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">Geographic Spread</p>
                            <p className="text-sm text-muted-foreground">6 countries across 3 continents</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-[hsl(var(--gold))] rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">Construction Staging</p>
                            <p className="text-sm text-muted-foreground">Never more than 2 major builds simultaneously</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-[hsl(var(--gold))] rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">Currency Hedging</p>
                            <p className="text-sm text-muted-foreground">Multi-currency banking infrastructure established</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Conclusion */}
              <Card className="p-8 bg-gradient-card border-none shadow-luxury">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Conclusion</h3>
                  
                  <div className="bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))]/20 p-6 rounded-lg">
                    <p className="text-lg mb-4">
                      The $7.0M investment creates a self-sustaining real estate development platform that:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))] rounded-full flex items-center justify-center text-sm font-bold">1</div>
                          <div>
                            <p className="font-semibold">Preserves Capital</p>
                            <p className="text-sm text-muted-foreground">Only deploys 58% of initial investment at peak utilization</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))] rounded-full flex items-center justify-center text-sm font-bold">2</div>
                          <div>
                            <p className="font-semibold">Generates Returns</p>
                            <p className="text-sm text-muted-foreground">$2.76M in recycled capital within 36 months</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))] rounded-full flex items-center justify-center text-sm font-bold">3</div>
                          <div>
                            <p className="font-semibold">Achieves Scale</p>
                            <p className="text-sm text-muted-foreground">112 units across 6 countries with $15.12M total revenue potential</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))] rounded-full flex items-center justify-center text-sm font-bold">4</div>
                          <div>
                            <p className="font-semibold">Enables Growth</p>
                            <p className="text-sm text-muted-foreground">Self-funding model for subsequent developments (Thailand/Turkey)</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))] rounded-full flex items-center justify-center text-sm font-bold">5</div>
                          <div>
                            <p className="font-semibold">Maintains Liquidity</p>
                            <p className="text-sm text-muted-foreground">$2.94M treasury balance at 36-month completion</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-[hsl(var(--gold))]/20 rounded-lg border border-[hsl(var(--gold))]/30">
                      <p className="text-sm font-medium text-center">
                        The sequential funding model, supported by aggressive presale strategies and platform fee capture, demonstrates that a relatively modest initial investment can support a global real estate development portfolio through disciplined capital recycling and milestone-gated deployment.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="legal-structuring">
              <div className="space-y-8">
                {/* Executive Summary */}
                <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Shield className="w-8 h-8 text-primary" />
                      <h3 className="text-3xl font-bold">Legal & Regulatory Proofing</h3>
                    </div>
                    <h4 className="text-xl font-semibold mb-4 text-primary">Global Real Estate Tokenization Structure</h4>
                    <div className="bg-background/80 rounded-xl p-6 backdrop-blur-sm">
                      <h5 className="font-semibold mb-3">Executive Summary: Proven Legal Framework</h5>
                      <p className="text-muted-foreground leading-relaxed">
                        Ancient Real Estate operates using the same battle-tested legal structure as $500M+ Tether Gold (XAUT) and leading tokenized real estate platforms globally. 
                        Our model doesn't replace property law—it modernizes ownership records, cash flow distribution, and governance through blockchain technology while maintaining full legal compliance.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Industry Leaders */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    🏛️ Core Legal Structure: The SPV Model
                  </h3>
                  <p className="text-muted-foreground mb-6">How Industry Leaders Structure Tokenization</p>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {[
                      {
                        name: "Tether Gold (XAUT)",
                        aum: "$500M+ AUM",
                        structure: [
                          "Physical gold stored in Swiss vaults",
                          "Tether International Limited (SPV) holds legal title", 
                          "XAUT tokens represent beneficial ownership claims",
                          "Switzerland doesn't recognize blockchain tokens as legal gold title"
                        ],
                        result: "Fully functional, legally compliant, institutionally trusted"
                      },
                      {
                        name: "RealT",
                        aum: "$100M+ U.S. Properties",
                        structure: [
                          "Properties owned by individual LLCs (SPVs)",
                          "Token holders own membership interests in LLCs",
                          "No direct deed tokenization"
                        ],
                        result: "Regulatory compliant across all U.S. states"
                      },
                      {
                        name: "Reental",
                        aum: "€32.5M European Assets",
                        structure: [
                          "Spanish properties held by SPV entities",
                          "Tokens represent economic rights, not deeds",
                          "Over 22,500 verified investors"
                        ],
                        result: "Operating successfully across Spain, Mexico, U.S., and LatAm"
                      }
                    ].map((platform, index) => (
                      <Card key={index} className="bg-card/50 border-border/50">
                        <CardContent className="p-6">
                          <div className="text-lg font-bold text-primary mb-2">{platform.name}</div>
                          <Badge variant="outline" className="mb-4">{platform.aum}</Badge>
                          <div className="space-y-2 mb-4">
                            {platform.structure.map((item, i) => (
                              <div key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                            <div className="text-sm font-medium text-green-800 dark:text-green-400">
                              Result: {platform.result}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Ancient's Structure */}
                  <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold mb-4">Ancient's Enhanced Structure</h4>
                      <div className="text-center">
                        <div className="space-y-4">
                          <div className="bg-primary/10 rounded-lg p-4">
                            <div className="font-semibold">Nevis Holding Company (Master Entity)</div>
                          </div>
                          <div className="text-2xl text-primary">↓</div>
                          <div className="bg-secondary/10 rounded-lg p-4">
                            <div className="font-semibold">Country-Specific SPVs (Property Holders)</div>
                          </div>
                          <div className="text-2xl text-primary">↓</div>
                          <div className="bg-accent/10 rounded-lg p-4">
                            <div className="font-semibold">Tokenized Beneficial Ownership (ERC-20/ERC-3643)</div>
                          </div>
                          <div className="text-2xl text-primary">↓</div>
                          <div className="bg-muted/50 rounded-lg p-4">
                            <div className="font-semibold">Smart Contract Automation (Cash Flow, Governance, Exits)</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 grid md:grid-cols-2 gap-4">
                        {[
                          "Bulletproof Legal Chain: Nevis → Local SPV → Property Title",
                          "Regulatory Arbitrage: Optimal jurisdiction selection per market",
                          "Institutional Grade: Same structure used by billion-dollar assets",
                          "Full Transparency: On-chain ownership records and cash flows",
                          "Automated Compliance: Smart contracts handle distributions and governance"
                        ].map((advantage, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-green-500">✅</span>
                            <span>{advantage}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Country-Specific Compliance */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    🌍 Country-Specific Regulatory Compliance
                  </h3>
                  
                  <div className="space-y-6">
                    {[
                      {
                        country: "🇲🇽 Mexico (Mazunte Project)",
                        structure: "Mexican SPV (Sociedad Anónima de Capital Variable - S.A. de C.V.)",
                        regulations: [
                          "CNBV (National Banking and Securities Commission): S.A. de C.V. shares are regulated securities",
                          "Property Registry: Company holds registered title at Registro Público de la Propiedad",
                          "Foreign Investment: Compliant with Foreign Investment Law (Ley de Inversión Extranjera)",
                          "AMIB Compliance: Mexican Securities Market Association standards",
                          "Golden Visa Alternative: Path to permanent residency through investment",
                          "Tax Optimization: Favorable corporate tax structure for international investors"
                        ],
                        comparable: "Multiple international real estate platforms operate successfully in Mexico using identical SPV structures, with Tulum real estate appreciation of 300%+ over recent years"
                      },
                      {
                        country: "🇧🇷 Brazil (Bahia Project)",
                        structure: "Brazilian LTDA (Limited Liability Company)",
                        regulations: [
                          "CVM (Securities Commission): LTDA quotas qualify as securities under Brazilian law",
                          "Property Law: LTDA holds registered property title at local cartório",
                          "Foreign Investment: Compliant with Lei 4.131/62 for foreign capital",
                          "Token Classification: Represents LTDA quotas, not direct property rights",
                          "Tax Optimization: LTDA structure provides favorable corporate tax treatment"
                        ],
                        comparable: "Terram tokenized R$50M+ Brazilian real estate using identical SPV structures"
                      },
                      {
                        country: "🇬🇷 Greece (Corfu Project)",
                        structure: "Greek IKE (Private Company)",
                        regulations: [
                          "HCMC (Hellenic Capital Market Commission): IKE shares are recognized securities",
                          "Property Registry: IKE registered as legal property owner",
                          "Golden Visa Compliance: Structure supports Greece's €250K residency program",
                          "EU MiCA Preparation: Forward-compatible with upcoming EU token regulations",
                          "Tax Benefits: Greek IKE enjoys competitive corporate tax rates (24%)"
                        ],
                        comparable: "Greece actively promotes blockchain innovation through regulatory sandbox programs"
                      },
                      {
                        country: "🇪🇸 Spain (Mallorca Project)",
                        structure: "Spanish SL (Sociedad Limitada)",
                        regulations: [
                          "CNMV (Securities Market Commission): SL participaciones are established securities",
                          "Property Registration: SL holds registered title at Registro de la Propiedad",
                          "EU Passporting: Structure enables future EU-wide token distribution",
                          "MiCA Compliance: Spain leads EU's Markets in Crypto-Assets regulation",
                          "Golden Visa Alignment: €500K investment threshold compatibility"
                        ],
                        comparable: "Reental operates identical SL structures across Spain with €32.5M in assets"
                      },
                      {
                        country: "🇹🇭 Thailand (Koh Phangan Project)",
                        structure: "30+30 Year Leasehold via Thai SPV",
                        regulations: [
                          "SEC Thailand: Company shares classified as securities under Thai law",
                          "Land Department: Thai company holds registered leasehold rights",
                          "Foreign Ownership: Compliant with 49% foreign ownership limits via nominee structure",
                          "BOI Benefits: Potential Board of Investment incentives for tech innovation",
                          "Renewable Structure: 30+30 year leases provide 60-year economic rights"
                        ],
                        comparable: "Multiple international developers use identical leasehold SPV structures in Thailand"
                      },
                      {
                        country: "🇹🇷 Turkey (Antalya Project)",
                        structure: "Turkish SPV (Limited Şirket)",
                        regulations: [
                          "CMB (Capital Markets Board): Company shares are regulated securities",
                          "Land Registry: Turkish company holds tapu (property title)",
                          "Citizenship Program: €400K investment qualifies for Turkish citizenship",
                          "Strategic Location: Bridge between European and Asian markets",
                          "Currency Hedge: Turkish lira depreciation benefits foreign investors"
                        ],
                        comparable: "Turkey's citizenship-by-investment program adds significant value proposition"
                      }
                    ].map((jurisdiction, index) => (
                      <Card key={index} className="bg-card/50 border-border/50">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="text-2xl font-bold text-primary">{jurisdiction.country}</div>
                          </div>
                          <div className="mb-4">
                            <div className="text-sm text-muted-foreground">Legal Structure</div>
                            <div className="font-semibold">{jurisdiction.structure}</div>
                          </div>
                          <div className="mb-4">
                            <div className="text-sm text-muted-foreground mb-2">Regulatory Framework</div>
                            <div className="space-y-2">
                              {jurisdiction.regulations.map((reg, i) => (
                                <div key={i} className="text-sm flex items-start gap-2">
                                  <span className="text-primary">•</span>
                                  <span>{reg}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                            <div className="text-sm text-blue-800 dark:text-blue-400">
                              <strong>Market Precedent:</strong> {jurisdiction.comparable}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Competitive Advantage Matrix */}
                <div>
                  <h3 className="text-2xl font-bold mb-6">📊 Competitive Advantage Matrix</h3>
                  <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-6">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left p-3">Platform</th>
                              <th className="text-left p-3">AUM/Market Cap</th>
                              <th className="text-left p-3">Legal Structure</th>
                              <th className="text-left p-3">Token Standard</th>
                              <th className="text-left p-3">Regulatory Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { platform: "Tether Gold", aum: "$500M+", structure: "Swiss SPV", token: "ERC-20", status: "Fully Compliant" },
                              { platform: "RealT", aum: "$100M+", structure: "U.S. LLCs", token: "ERC-20", status: "SEC Compliant" },
                              { platform: "Reental", aum: "€32.5M", structure: "Spanish SPVs", token: "Proprietary", status: "EU Compliant" },
                              { platform: "Ancient", aum: "$24.5M Projected", structure: "Multi-Jurisdiction SPVs", token: "ERC-20/ERC-3643", status: "Enhanced Compliance" }
                            ].map((row, i) => (
                              <tr key={i} className={`border-b border-border/50 ${row.platform === "Ancient" ? "bg-primary/5" : ""}`}>
                                <td className="p-3 font-semibold">{row.platform}</td>
                                <td className="p-3">{row.aum}</td>
                                <td className="p-3">{row.structure}</td>
                                <td className="p-3">{row.token}</td>
                                <td className="p-3">{row.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Revenue Model Validation */}
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6 text-green-800 dark:text-green-400">🚀 Revenue Model Validation</h3>
                    <div className="text-xl font-bold mb-4">10-Year Projected Returns: $24.53M Total</div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-white dark:bg-background/50 rounded-lg p-4 border border-green-200 dark:border-green-800">
                        <div className="text-lg font-semibold text-green-800 dark:text-green-400 mb-2">Platform Fees (Immediate): $453.6K</div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div>• 3% transaction fee on all sales</div>
                          <div>• Competitive with traditional real estate commissions (6%)</div>
                          <div>• Lower than Reental's 4-5% fee structure</div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-background/50 rounded-lg p-4 border border-green-200 dark:border-green-800">
                        <div className="text-lg font-semibold text-green-800 dark:text-green-400 mb-2">Mortgage Interest (10-Year Stream): $7.46M</div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div>• 8% yield on financed properties</div>
                          <div>• Addresses $250B cross-border lending gap</div>
                          <div>• Higher returns than traditional banking (2-4%)</div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-background/50 rounded-lg p-4 border border-green-200 dark:border-green-800">
                        <div className="text-lg font-semibold text-green-800 dark:text-green-400 mb-2">Property Appreciation (10-Year Capture): $16.62M</div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div>• Based on historical emerging market performance</div>
                          <div>• Conservative compared to Tulum's 300%+ appreciation</div>
                          <div>• Captures nomad wealth typically lost to rent</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bottom Line */}
                <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      🔒 Bottom Line: Battle-Tested Legal Innovation
                    </h3>
                    <p className="text-lg mb-6">
                      Ancient Real Estate doesn't reinvent property law—we modernize it. Our legal structure mirrors billion-dollar assets like Tether Gold while providing enhanced investor protections through:
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      {[
                        "Proven SPV Framework: Same structure as industry leaders",
                        "Multi-Jurisdiction Optimization: Legal arbitrage for maximum protection", 
                        "Institutional Compliance: Ready for traditional finance integration",
                        "Transparent Operations: Blockchain eliminates opacity and manual errors",
                        "Automated Governance: Smart contracts reduce counterparty risk"
                      ].map((point, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-primary">✅</span>
                          <span className="font-medium">{point}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-background/80 rounded-lg p-6 backdrop-blur-sm">
                      <p className="text-center font-medium text-lg">
                        We're not early-stage experimenters—we're applying proven legal frameworks to high-growth emerging markets with institutional-grade execution.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
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
    </div>
  );
};

export default BusinessModel;
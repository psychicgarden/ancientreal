import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, TrendingUp, MapPin, DollarSign, Building, Globe, Shield } from "lucide-react";
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
            </TabsContent>

            <TabsContent value="platform-assessment">
              <PlatformAssessment />
            </TabsContent>

            <TabsContent value="budget-breakdown" className="space-y-8">
              {/* Use of Funds Executive Summary */}
              <div className="bg-gradient-to-br from-primary/10 to-secondary/5 rounded-xl p-8 border border-primary/20">
                <h3 className="text-3xl font-bold mb-6 text-primary">Use of Funds Executive Summary</h3>
                <div className="grid md:grid-cols-4 gap-6 mb-6">
                  <div className="bg-background/80 backdrop-blur rounded-lg p-6 border border-primary/20">
                    <div className="text-3xl font-bold text-primary mb-2">$7.00M</div>
                    <div className="text-sm font-medium text-muted-foreground">Initial Capital Raise</div>
                    <div className="text-xs text-muted-foreground mt-1">100% allocation target</div>
                  </div>
                  <div className="bg-background/80 backdrop-blur rounded-lg p-6 border border-secondary/20">
                    <div className="text-3xl font-bold text-secondary mb-2">$6.93M</div>
                    <div className="text-sm font-medium text-muted-foreground">Total Deployed</div>
                    <div className="text-xs text-muted-foreground mt-1">Over 36 months</div>
                  </div>
                  <div className="bg-background/80 backdrop-blur rounded-lg p-6 border border-accent/20">
                    <div className="text-3xl font-bold text-accent mb-2">$2.76M</div>
                    <div className="text-sm font-medium text-muted-foreground">Capital Recycled</div>
                    <div className="text-xs text-muted-foreground mt-1">39% recycling rate</div>
                  </div>
                  <div className="bg-background/80 backdrop-blur rounded-lg p-6 border border-blue-500/20">
                    <div className="text-3xl font-bold text-blue-600 mb-2">$2.94M</div>
                    <div className="text-sm font-medium text-muted-foreground">Final Treasury</div>
                    <div className="text-xs text-green-600 mt-1 font-medium">42% preserved</div>
                  </div>
                </div>
                <div className="bg-background/60 rounded-lg p-4 border border-orange-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-orange-600">Peak Capital at Risk: $4.06M</div>
                      <div className="text-sm text-muted-foreground">Maximum 58% of initial capital deployed simultaneously</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-accent">Self-Funding Achieved</div>
                      <div className="text-xs text-muted-foreground">Month 36 onwards</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Initiation Requirements - Investor Protection */}
              <div className="bg-card rounded-xl p-8 border border-border shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="text-2xl font-bold text-primary">Project Initiation Requirements</h3>
                  <div className="ml-auto px-3 py-1 bg-green-500/20 text-green-700 text-sm font-medium rounded-full border border-green-500/30">
                    INVESTOR PROTECTION ACTIVATED
                  </div>
                </div>
                
                <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="font-medium text-amber-800 dark:text-amber-200 mb-2">🔒 Capital Protection Framework</div>
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    All capital releases are gated by milestone completion with third-party verification. 
                    No funds deploy until each protection point is satisfied.
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border border-border rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">1</span>
                      </div>
                      <h4 className="text-lg font-semibold">Pre-Launch Gate Requirements</h4>
                      <div className="ml-auto px-2 py-1 bg-blue-500/20 text-blue-700 text-xs font-medium rounded border border-blue-500/30">
                        VESTING POINT
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Nevis ParentCo incorporation complete</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Multi-currency banking established</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>US securities counsel retained</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Smart contracts audited & deployed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>KYC/AML compliance portal live</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Mexico SAPI SPV formation</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                      <div className="text-sm font-medium text-green-800 dark:text-green-200">
                        🛡️ Protection: No capital deploys until ALL requirements verified by third parties
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
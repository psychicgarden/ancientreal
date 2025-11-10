import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowRight, TrendingUp, MapPin, DollarSign, Building, Globe, Shield, Code, Target, Rocket, Building2, BarChart3, Zap, Network, Menu, Home, Users, Briefcase, CreditCard, Plane, Code2, FileText, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart, PieChart, Pie, Cell } from "recharts";
import SectionHeader from "@/components/SectionHeader";
import PlatformAssessment from "@/components/PlatformAssessment";
import { MortgageOptionsCalculator } from "@/components/MortgageOptionsCalculator";
import { ScenarioComparison } from "@/components/ScenarioComparison";
import { SensitivityDashboard } from "@/components/SensitivityDashboard";
import { MortgageOnlySensitivityDashboard } from "@/components/MortgageOnlySensitivityDashboard";
import { StrategicRecommendations } from "@/components/StrategicRecommendations";
import { getCurrentScenario, getAggressiveScenario, getTieredScenario, getAcceleratedScenario, getHybridScenario, calculateDevelopmentFlywheel } from "@/lib/revenueScenarios";

// Import property images
import villaTulum from "@/assets/villa-tulum.jpg";
import beachChalet from "@/assets/beach-chalet.jpg";
import villaEriceira from "@/assets/villa-ericeira-portugal.jpg";
import villaGreece from "@/assets/villa-greece.jpg";
import villaBali from "@/assets/villa-bali.jpg";
import penthouseMexico from "@/assets/penthouse-mexico.jpg";
import ecoSmartCity from "@/assets/eco-smart-city.jpg";

// Calculate dynamic flywheel data with rolling budget
const INITIAL_CAPITAL = 2.75; // $2.75M initial capital

const calculateFlywheelWithBudget = () => {
  const flywheel = calculateDevelopmentFlywheel();
  const images = [villaTulum, beachChalet, villaGreece, villaEriceira, villaBali, penthouseMexico];
  const locations = [
    { name: "Mazunte, Mexico", flag: "🇲🇽", structure: "Mexican SAPI + Fideicomiso" },
    { name: "Bahia, Brazil", flag: "🇧🇷", structure: "Brazilian LTDA" },
    { name: "Corfu, Greece", flag: "🇬🇷", structure: "Greek IKE SPV" },
    { name: "Mallorca, Spain", flag: "🇪🇸", structure: "Spanish SL" },
    { name: "Koh Phangan, Thailand", flag: "🇹🇭", structure: "30+30 Leasehold" },
    { name: "Antalya, Turkey", flag: "🇹🇷", structure: "Turkish SPV" }
  ];
  
  const prices = [135000, 138000, 141000, 144000, 147000, 150000];
  
  let remainingBudget = INITIAL_CAPITAL;
  
  return flywheel.flips.map((flip, idx) => {
    const buildCostM = flip.buildCost / 1_000_000;
    const immediateCashM = flip.immediateCash / 1_000_000;
    
    // Calculate remaining budget BEFORE this flip
    const budgetBefore = remainingBudget;
    
    // Update remaining budget: subtract build cost, add immediate cash
    remainingBudget = remainingBudget - buildCostM + immediateCashM;
    
    return {
      flip: flip.flip,
      location: locations[idx].name,
      flag: locations[idx].flag,
      units: flip.units,
      pricePerUnit: prices[idx],
      buildCost: buildCostM,
      salesPrice: flip.grossSales / 1_000_000,
      cashIn: immediateCashM,
      remaining: remainingBudget,
      platformFee: flip.platformFees / 1_000,
      image: images[idx],
      structure: locations[idx].structure,
      downPayments: flip.downPayments / 1_000_000,
      cashSales: flip.cashSales / 1_000_000,
      deferredPrincipal: flip.deferredPrincipal / 1_000_000
    };
  });
};

const flywheelData = calculateFlywheelWithBudget();
// Dynamic Pricing: $135k → $150k across 6 flips
const dynamicPricingBreakdown = [
  { flip: "Flip 1", units: 15, avgPrice: 135000, platformFee: 70875 },
  { flip: "Flip 2", units: 21, avgPrice: 138000, platformFee: 101871 },
  { flip: "Flip 3A", units: 16, avgPrice: 141000, platformFee: 78912 },
  { flip: "Flip 3B", units: 15, avgPrice: 144000, platformFee: 75600 },
  { flip: "Flip 4A", units: 25, avgPrice: 147000, platformFee: 128625 },
  { flip: "Flip 4B", units: 20, avgPrice: 150000, platformFee: 105000 }
];

const totalDynamicRevenue = 20.64; // Million (with 11.5% APR)

// Calculate 15-year cash flow waterfall
const generateCashFlowData = () => {
  const data = [];
  let cumulativeRevenue = 0;
  
  // Platform fees come in Year 0-1 (during property sales)
  const platformFeesY0 = 0.561; // $561K in millions
  
  // Annual interest payments (evenly distributed over 15 years)
  const annualInterest = 11.32 / 15; // ~$755K per year with 11.5% APR
  
  // Appreciation hits at Year 15
  const appreciationY15 = 8.76; // $8.76M
  
  for (let year = 0; year <= 15; year++) {
    let platformFees = 0;
    let interest = 0;
    let appreciation = 0;
    
    if (year === 0) {
      platformFees = platformFeesY0;
    }
    
    if (year >= 1 && year <= 15) {
      interest = annualInterest;
    }
    
    if (year === 15) {
      appreciation = appreciationY15;
    }
    
    const yearlyRevenue = platformFees + interest + appreciation;
    cumulativeRevenue += yearlyRevenue;
    
    // Calculate IRR at this point (simplified)
    const yearsElapsed = year || 0.5;
    const irr = ((cumulativeRevenue / 2.75) ** (1 / yearsElapsed) - 1) * 100;
    
    data.push({
      year: year === 0 ? "Y0" : `Y${year}`,
      platformFees: platformFees,
      interest: interest,
      appreciation: appreciation,
      total: yearlyRevenue,
      cumulative: cumulativeRevenue,
      irr: Math.min(irr, 25) // Cap at 25% for visualization
    });
  }
  
  return data;
};

const cashFlowData = generateCashFlowData();

const revenueStreams = [{
  title: "Platform Fees",
  amount: "$561K",
  description: "Infrastructure revenue (dynamic pricing: $135k→$150k)",
  timeline: "Immediate capture",
  icon: "🏛"
}, {
  title: "Mortgage Interest",
  amount: "$11.32M",
  description: "11.5% APR yield over 15-year term (weighted avg pricing)",
  timeline: "15-year stream",
  icon: "🌐"
}, {
  title: "Property Appreciation (30% SAM)",
  amount: "$8.76M",
  description: "30% share of 7% annual appreciation at year 15",
  timeline: "15-year capture",
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
  const currentScenario = getCurrentScenario();
  const acceleratedScenario = getAcceleratedScenario();
  const hybridScenario = getHybridScenario();
  return <div className="min-h-screen bg-gradient-subtle">
      {/* Navigation Menu */}
      <div className="fixed top-4 right-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 shadow-lg"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open navigation menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 bg-background/95 backdrop-blur-sm border-border/50 shadow-xl"
            sideOffset={8}
          >
            <DropdownMenuLabel className="font-semibold">Navigate to</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => navigate("/")} className="cursor-pointer">
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate("/investor-portal")} className="cursor-pointer">
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Investment Access</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate("/portfolio")} className="cursor-pointer">
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Portfolio</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate("/banking")} className="cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Banking</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => navigate("/traveler")} className="cursor-pointer">
              <Plane className="mr-2 h-4 w-4" />
              <span>Traveler Portal</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate("/community")} className="cursor-pointer">
              <Users className="mr-2 h-4 w-4" />
              <span>Community</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate("/developers")} className="cursor-pointer">
              <Code2 className="mr-2 h-4 w-4" />
              <span>Developers</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => navigate("/legal-portal")} className="cursor-pointer">
              <FileText className="mr-2 h-4 w-4" />
              <span>Legal Portal</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate("/test")} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Smart Contract Test</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Wide Banner Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src={ecoSmartCity} alt="Eco Smart City Vision" className="w-full h-full object-cover filter brightness-[0.4] contrast-[1.3] saturate-[1.2]" />
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
            {[{
            icon: "📈",
            title: "Digital-Nomad Boom",
            stat: "50M → 100M+",
            desc: "6× growth since 2019, accelerating toward 100M+ by 2030"
          }, {
            icon: "⚖",
            title: "Tokenized Real Estate",
            stat: "$310M → $1.4T by 2030",
            desc: "Real-estate RWAs have 4X'd in the past 18 months."
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
            icon: "🏛",
            title: "Institutional Scale-Up",
            stat: "$5M → $1B+",
            desc: "BlackRock's BUIDL Fund, launched Mar 2024, surpassed $1B AUM in under 12 months—a 200× growth, signaling rapid institutional adoption."
          }, {
            icon: "🗺",
            title: "Visas & Tokenization Take Off",
            stat: "50+ Countries",
            desc: "Nomad visas have exploded from 6 to 66+ nations since 2019. At the same time, real estate tokenization has moved from pilots to legal frameworks in the US, UK, EU, UAE, Singapore, Switzerland, Mexico, Brazil, India—with new markets opening monthly."
          }, {
            icon: "💸",
            title: "Global Mortgage Blackout",
            stat: "$750B",
            desc: "If just 10% of 50M digital nomads wanted $150K homes, that's a $750B TAM with a $250B immediate gap. Legacy banks leave the most mobile workforce locked out."
          }].map(trend => <Card key={trend.title} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-card transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">{trend.icon}</div>
                  <div className="text-2xl font-bold text-primary mb-2">{trend.stat}</div>
                  <h3 className="text-3xl font-semibold mb-2">{trend.title}</h3>
                  <p className="text-sm text-muted-foreground">{trend.desc}</p>
                </CardContent>
              </Card>)}
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
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="revenue-model">Revenue Model</TabsTrigger>
              <TabsTrigger value="product-comparison">Product Comparison</TabsTrigger>
              <TabsTrigger value="platform-assessment">Platform Assessment</TabsTrigger>
              <TabsTrigger value="budget-breakdown">Budget Breakdown</TabsTrigger>
              <TabsTrigger value="legal-structuring">Legal Structuring</TabsTrigger>
              <TabsTrigger value="buyers-journey">Buyer's Journey</TabsTrigger>
            </TabsList>

            <TabsContent value="revenue-model">

              {/* Stats Overview */}
              <div className="grid grid-cols-4 gap-6 mb-16">
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
                    <Target className="w-8 h-8 text-primary mx-auto mb-3" />
                    <div className="text-2xl font-bold text-foreground">6</div>
                    <div className="text-sm text-muted-foreground">Countries</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6 text-center">
                    <DollarSign className="w-8 h-8 text-primary mx-auto mb-3" />
                    <div className="text-2xl font-bold text-foreground">$20.64M</div>
                    <div className="text-sm text-muted-foreground">15-Year Revenue (11.5% APR)</div>
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
                                  <div className="font-semibold">${(flip.pricePerUnit / 1000).toFixed(0)}K/unit</div>
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
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">{Math.floor(flip.units * 0.8)} financed (20% down):</span>
                                  <span className="font-mono font-semibold">${(flip.downPayments * 1000).toFixed(0)}K</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">{flip.units - Math.floor(flip.units * 0.8)} cash purchases:</span>
                                  <span className="font-mono font-semibold">${(flip.cashSales * 1000).toFixed(0)}K</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">Platform fee (3.5%):</span>
                                  <span className="font-mono font-semibold">${flip.platformFee.toFixed(3)}K</span>
                                </div>
                                <div className="border-t pt-1.5 mt-1.5 flex justify-between items-center">
                                  <span className="font-semibold text-foreground">Total Cash In:</span>
                                  <span className="font-mono text-lg font-bold text-primary">${flip.cashIn.toFixed(3)}M</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Flow Indicator */}
                          <div className="p-8 flex flex-col justify-center items-center border-l border-border/50">
                            <div className="text-center mb-4">
                              <div className="text-sm text-muted-foreground">Remaining Budget</div>
                              <div className="text-2xl font-bold">${flip.remaining}M</div>
                            </div>
                            
                            {index < flywheelData.length - 1 && <div className="flex flex-col items-center">
                                <div className="text-sm text-muted-foreground mb-2">Funds Next Flip</div>
                                <ArrowRight className="w-8 h-8 text-primary rotate-90 md:rotate-0" />
                              </div>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>)}
                </div>

              {/* Clean Revenue Model Showcase */}
              <div className="mb-16">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">$20.64M Revenue Model</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Three revenue streams, dynamic pricing strategy, 11.5% APR, 23-26% IRR
                  </p>
                </div>
                
                {/* Revenue Breakdown Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardContent className="p-8">
                      <div className="text-center space-y-4">
                        <div className="text-5xl">🏛</div>
                        <div>
                          <div className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Platform Fees</div>
                          <div className="text-4xl font-bold text-primary mb-3">$561K</div>
                          <p className="text-sm text-muted-foreground">3.5% infrastructure fee on all sales</p>
                        </div>
                        <div className="bg-background/50 rounded-lg p-3 text-sm">
                          <div className="text-muted-foreground">Immediate capture</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardContent className="p-8">
                      <div className="text-center space-y-4">
                        <div className="text-5xl">🌐</div>
                        <div>
                          <div className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Mortgage Interest</div>
                          <div className="text-4xl font-bold text-primary mb-3">$11.32M</div>
                          <p className="text-sm text-muted-foreground">11.5% APR on 15-year mortgages</p>
                        </div>
                        <div className="bg-background/50 rounded-lg p-3 text-sm">
                          <div className="text-muted-foreground">15-year revenue stream</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardContent className="p-8">
                      <div className="text-center space-y-4">
                        <div className="text-5xl">🚀</div>
                        <div>
                          <div className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Appreciation Share</div>
                          <div className="text-4xl font-bold text-primary mb-3">$8.76M</div>
                          <p className="text-sm text-muted-foreground">30% SAM at 7% annual growth</p>
                        </div>
                        <div className="bg-background/50 rounded-lg p-3 text-sm">
                          <div className="text-muted-foreground">Year 15 capture</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Total Revenue Card */}
                <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30 border-2 mb-12">
                  <CardContent className="p-10">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground uppercase tracking-widest mb-3">15-Year Total Revenue</div>
                      <div className="text-6xl font-bold text-primary mb-4">$20.64M</div>
                      <div className="flex items-center justify-center gap-8 text-sm">
                        <div>
                          <span className="text-muted-foreground">IRR:</span>
                          <span className="font-bold ml-2">23-26%</span>
                        </div>
                        <div className="h-4 w-px bg-border"></div>
                        <div>
                          <span className="text-muted-foreground">Cash Multiple:</span>
                          <span className="font-bold ml-2">6.9×</span>
                        </div>
                        <div className="h-4 w-px bg-border"></div>
                        <div>
                          <span className="text-muted-foreground">112 Units:</span>
                          <span className="font-bold ml-2">6 Locations</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Dynamic Pricing Strategy */}
                <Card className="bg-card/80 backdrop-blur-sm border-border/50 mb-8">
                  <CardContent className="p-8">
                    <div className="mb-8">
                      <div className="inline-flex items-center space-x-2 mb-4">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary"></div>
                        <div className="text-sm font-medium text-primary uppercase tracking-wider">Pricing Strategy</div>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary"></div>
                      </div>
                      <h3 className="text-3xl font-bold mb-3">Dynamic Pricing: $135k → $150k</h3>
                      <p className="text-lg text-muted-foreground">
                        Strategic $3k escalation per flip captures market growth and creates buyer urgency
                      </p>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-border">
                            <th className="text-left py-4 px-4 font-semibold">Flip</th>
                            <th className="text-left py-4 px-4 font-semibold">Units</th>
                            <th className="text-right py-4 px-4 font-semibold">Price</th>
                            <th className="text-right py-4 px-4 font-semibold">Platform Fee</th>
                            <th className="text-right py-4 px-4 font-semibold">Gross Sales</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dynamicPricingBreakdown.map((flip, idx) => (
                            <tr key={idx} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                              <td className="py-4 px-4 font-semibold">{flip.flip}</td>
                              <td className="py-4 px-4">{flip.units}</td>
                              <td className="py-4 px-4 text-right font-mono">${(flip.avgPrice / 1000).toFixed(0)}k</td>
                              <td className="py-4 px-4 text-right font-mono text-primary">${(flip.platformFee / 1000).toFixed(1)}k</td>
                              <td className="py-4 px-4 text-right font-mono font-semibold">${((flip.units * flip.avgPrice) / 1000000).toFixed(2)}M</td>
                            </tr>
                          ))}
                          <tr className="font-bold bg-primary/5 border-t-2 border-primary/20">
                            <td className="py-4 px-4 text-lg">TOTAL</td>
                            <td className="py-4 px-4 text-lg">112</td>
                            <td className="py-4 px-4 text-right font-mono text-lg">$143k avg</td>
                            <td className="py-4 px-4 text-right font-mono text-primary text-lg">$560.9K</td>
                            <td className="py-4 px-4 text-right font-mono text-primary text-lg">$16.02M</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>


                {/* Key Value Propositions */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardContent className="p-6">
                      <div className="text-3xl mb-3">⚡</div>
                      <h4 className="font-bold text-lg mb-2">Urgency Driver</h4>
                      <p className="text-sm text-muted-foreground">Early buyers save $15k+ vs. later flips, accelerating conversion velocity</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardContent className="p-6">
                      <div className="text-3xl mb-3">📈</div>
                      <h4 className="font-bold text-lg mb-2">Market Reality</h4>
                      <p className="text-sm text-muted-foreground">Pricing reflects 18-month construction inflation and land appreciation</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardContent className="p-6">
                      <div className="text-3xl mb-3">🤝</div>
                      <h4 className="font-bold text-lg mb-2">Competitive SAM</h4>
                      <p className="text-sm text-muted-foreground">30% SAM vs. 50% industry standard = buyers keep 70% appreciation</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Scenario Comparison Section */}
              <div className="mb-16 mt-20">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center space-x-2 mb-4">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary"></div>
                    <div className="text-sm font-medium text-primary uppercase tracking-wider">Revenue Optimization</div>
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary"></div>
                  </div>
                  <h2 className="text-4xl font-bold mb-4">Revenue Strategy: Conservative, Aggressive, or Tiered?</h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Three distinct paths to profitability - choose based on market positioning and growth speed
                  </p>
                </div>

                <ScenarioComparison scenarios={[currentScenario, getAggressiveScenario(), getTieredScenario()]} />
              </div>

              {/* Sensitivity Dashboard - SAM Model */}
              <div className="mb-16">
                <SensitivityDashboard />
              </div>

              {/* Mortgage-Only Dashboard */}
              <div className="mb-16">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Conservative Alternative</h2>
                  <p className="text-lg text-muted-foreground">
                    For buyers who prefer traditional mortgages without shared appreciation
                  </p>
                </div>
                <MortgageOnlySensitivityDashboard />
              </div>

              {/* Strategic Recommendations */}
              <div className="mb-16">
                <StrategicRecommendations />
              </div>
              </div>

              {/* From Engine → Ecosystem: 3-Phase Evolution */}
              <div className="mb-16 mt-20">
                {/* Enhanced Section Header */}
                <div className="text-center mb-16">
                  <div className="inline-flex items-center space-x-2 mb-4">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary"></div>
                    <div className="text-sm font-medium text-primary uppercase tracking-wider">Evolution</div>
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary"></div>
                  </div>
                  <h2 className="text-4xl font-bold mb-4">From Engine → Ecosystem: 3-Phase Evolution</h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Strategic roadmap from proof of concept to network state
                  </p>
                </div>
                
                <div className="max-w-6xl mx-auto space-y-16">
                  {/* Three-Phase Evolution Cards */}
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Phase 1: Proof Engine */}
                    <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                      <CardContent className="p-8">
                        <div className="text-center space-y-4">
                          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                            <Zap className="w-10 h-10 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold mb-2">Proof Engine</h3>
                            <div className="text-lg text-primary font-semibold">Years 0-3</div>
                          </div>
                          <div className="space-y-3 text-left">
                            <div className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm">4 strategic property flips prove demand</span>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm">$15.86M revenue validates business model</span>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm">Build foundational community & systems</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Phase 2: Developer Platform */}
                    <Card className="relative overflow-hidden border-2 border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-500/10">
                      <CardContent className="p-8">
                        <div className="text-center space-y-4">
                          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                            <Network className="w-10 h-10 text-green-500" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold mb-2">Developer Platform</h3>
                            <div className="text-lg text-green-500 font-semibold">$7M Investment</div>
                          </div>
                          <div className="space-y-3 text-left">
                            <div className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm">Technology platform & legal framework</span>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm">Enable thousands of developers globally</span>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm">Financing tools & community systems</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Phase 3: Network State */}
                    <Card className="relative overflow-hidden border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
                      <CardContent className="p-8">
                        <div className="text-center space-y-4">
                          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                            <Globe className="w-10 h-10 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold mb-2">Network State</h3>
                            <div className="text-lg text-blue-500 font-semibold">Years 3-10</div>
                          </div>
                          <div className="space-y-3 text-left">
                            <div className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm">7,500 properties serving 2M nomads</span>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm">$827M annual revenue at scale</span>
                            </div>
                             <div className="flex items-start space-x-3">
                               <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm">Global nomad infrastructure network</span>
                             </div>
                             <div className="flex items-start space-x-3">
                               <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                               <span className="text-sm">Decentralized governance & citizenship model</span>
                             </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                   {/* Evolution Flow Visual */}
                   <div className="relative">
                     <div className="flex items-center justify-center space-x-8">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-2">$15.86M</div>
                          <div className="text-sm text-muted-foreground">Boutique Development (30% SAM)</div>
                        </div>
                       
                       <div className="flex items-center space-x-2">
                         <ArrowRight className="w-6 h-6 text-muted-foreground" />
                         <div className="text-sm font-medium text-primary">$7M Platform</div>
                         <ArrowRight className="w-6 h-6 text-muted-foreground" />
                       </div>
                       
                       <div className="text-center">
                         <div className="text-3xl font-bold text-blue-500 mb-2">$827M</div>
                         <div className="text-sm text-muted-foreground">Platform Economics</div>
                       </div>
                     </div>
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
                            
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-border/30">
                          <div className="text-sm font-medium mb-2">Key Metrics</div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            
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

            <TabsContent value="product-comparison">
              <MortgageOptionsCalculator />
            </TabsContent>

            <TabsContent value="platform-assessment">
              <PlatformAssessment />
            </TabsContent>

            <TabsContent value="budget-breakdown" className="space-y-8">
              {/* New Header - Investor Protection Focused */}
              <div className="text-center space-y-4 mb-8">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Low-Risk, Milestone-Gated Deployment
                </h2>
                <h3 className="text-2xl text-muted-foreground">
                  Only $150K Needed to Launch
                </h3>
                <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
                  Progressive capital deployment with investor protection gates at every phase
                </p>
              </div>


              {/* Three-Phase Funnel Overview */}
              <Card className="p-6 bg-gradient-card border-none shadow-luxury">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Progressive Capital Deployment — Investor Risk Minimized</h3>
                  <p className="text-sm text-muted-foreground">Start small, scale smart — each phase unlocks only after milestone gates are achieved</p>
                </div>

                {/* Funnel Visual */}
                <div className="space-y-4 max-w-4xl mx-auto">
                  {/* Phase 1 - Foundation */}
                  <Card className="p-5 bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                        <h4 className="text-xl font-bold text-green-600">Phase 1 — Foundation</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">$150K (2%)</div>
                        <div className="text-sm text-green-600 font-medium">Max Risk: $150K</div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium mb-2">Deployment Focus:</div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Legal, banking, compliance setup</li>
                          <li>• ParentCo + Mexico SPV formed</li>
                          <li>• Platform audit + onboarding</li>
                        </ul>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2">Milestone Gates:</div>
                        <ul className="text-sm text-green-600 space-y-1">
                          <li>✅ ParentCo live</li>
                          <li>✅ Nevis banking established</li>
                          <li>✅ Legal counsel retained</li>
                        </ul>
                      </div>
                    </div>
                  </Card>

                  {/* Phase 2 - Market Entry */}
                  <Card className="p-5 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                        <h4 className="text-xl font-bold text-yellow-600">Phase 2 — Market Entry</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-600">$470K (7%)</div>
                        <div className="text-sm text-yellow-600 font-medium">Max Risk: $620K total</div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium mb-2">Deployment Focus:</div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Mexico land deposits</li>
                          <li>• Marketing + presales campaigns</li>
                          <li>• Operations runway</li>
                        </ul>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2">Milestone Gates:</div>
                        <ul className="text-sm text-yellow-600 space-y-1">
                          <li>✅ First land acquisition completed</li>
                          <li>✅ Presales campaign launched</li>
                          <li>✅ Marketing partnerships established</li>
                          <li>✅ Operations team hired</li>
                        </ul>
                      </div>
                    </div>
                  </Card>

                  {/* Phase 3 - Multi-Market Rollout */}
                  <Card className="p-5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                        <h4 className="text-xl font-bold text-blue-600">Phase 3 — Multi-Market Rollout</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">$6.38M (91%)</div>
                        <div className="text-sm text-blue-600 font-medium">Max Risk: $4.06M (protected by recycling)</div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium mb-2">Deployment Focus:</div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Brazil, Spain, Greece expansion</li>
                          <li>• Construction & builds</li>
                          <li>• Multi-market scaling</li>
                        </ul>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2">Milestone Gates:</div>
                        <ul className="text-sm text-blue-600 space-y-1">
                          <li>✅ Treasury recycling active</li>
                          <li>✅ Multi-market validation</li>
                          <li>✅ Regulatory cleared</li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                </div>
              </Card>


              {/* Year-based Sub-Tabs for Complete 36-Month Timeline */}
              <Card className="p-8 bg-gradient-card border-none shadow-luxury">
                <Tabs defaultValue="overall-funds" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-8">
                    <TabsTrigger value="overall-funds">Overall Use of Funds</TabsTrigger>
                    <TabsTrigger value="year-1">Year 1: Foundation & Mexico</TabsTrigger>
                    <TabsTrigger value="year-2">Year 2: Brazil & Spain Entry</TabsTrigger>
                    <TabsTrigger value="year-3">Year 3: Multi-Market Expansion</TabsTrigger>
                  </TabsList>

                  {/* Overall Use of Funds Tab */}
                  <TabsContent value="overall-funds" className="space-y-8">
                    <div className="space-y-8">
                      {/* Header */}
                      <div className="relative p-8 bg-gradient-to-br from-[hsl(var(--gold))]/10 via-[hsl(var(--accent))]/5 to-transparent border border-[hsl(var(--gold))]/20 rounded-xl shadow-luxury">
                        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--gold))]/5 to-transparent rounded-xl"></div>
                        <div className="relative flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--accent))] rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-3xl">📊</span>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--foreground))] to-[hsl(var(--muted-foreground))] bg-clip-text text-transparent">
                              Core Expenditure Breakdown — $7.00M Total
                            </h3>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/40 to-transparent"></div>
                      </div>

                      {/* Core Expenditure Categories */}
                      <div className="grid gap-6">
                        {/* 1. Land & Build */}
                        <Card className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xl font-bold text-green-700 dark:text-green-400">1. Land & Build</h4>
                              <span className="text-2xl font-bold text-green-600">$5.10M</span>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                              <div className="flex justify-between">
                                <span>$2.00M →</span>
                                <span>Land acquisitions (6 coastal plots)</span>
                              </div>
                              <div className="flex justify-between">
                                <span>$2.75M →</span>
                                <span>Construction + finishes for first resort</span>
                              </div>
                              <div className="flex justify-between">
                                <span>$350K →</span>
                                <span>Land & construction buffer (raised from $200K for overruns, opportunistic land grabs, or upgrades)</span>
                              </div>
                            </div>
                          </div>
                        </Card>

                        {/* 2. Legal / Permits / Compliance */}
                        <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/5 border border-blue-500/20">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xl font-bold text-blue-700 dark:text-blue-400">2. Legal / Permits / Compliance</h4>
                              <span className="text-2xl font-bold text-blue-600">$450K</span>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div className="flex justify-between">
                                <span>$100K →</span>
                                <span>Counsel retainers (Mexico, Brazil, Spain, Greece)</span>
                              </div>
                              <div className="flex justify-between">
                                <span>$120K →</span>
                                <span>Entity setups (SPVs, fideicomiso trusts, HoldingCos, DAO structuring)</span>
                              </div>
                              <div className="flex justify-between">
                                <span>$110K →</span>
                                <span>Closings, filings, notary & cross-border structuring</span>
                              </div>
                              <div className="flex justify-between">
                                <span>$120K →</span>
                                <span>Licensing, insurance, compliance renewals (with $25K added buffer baked in)</span>
                              </div>
                            </div>
                          </div>
                        </Card>

                        {/* 3. Platform & Smart Contracts */}
                        <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-violet-500/5 border border-purple-500/20">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xl font-bold text-purple-700 dark:text-purple-400">3. Platform & Smart Contracts</h4>
                              <span className="text-2xl font-bold text-purple-600">$655K</span>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div className="flex justify-between">
                                <span>$360K →</span>
                                <span>CTO hire (3 years comp; full build + oversight)</span>
                              </div>
                              <div className="flex justify-between">
                                <span>$45K →</span>
                                <span>Compliance + KYC/AML integrations</span>
                              </div>
                              <div className="flex justify-between">
                                <span>$125K →</span>
                                <span>Secondary market & liquidity features (boosted for robustness)</span>
                              </div>
                              <div className="flex justify-between">
                                <span>$125K →</span>
                                <span>DAO & governance tooling (boosted for full functionality)</span>
                              </div>
                            </div>
                          </div>
                        </Card>

                        {/* 4. Marketing & Sales */}
                        <Card className="p-6 bg-gradient-to-r from-orange-500/10 to-red-500/5 border border-orange-500/20">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xl font-bold text-orange-700 dark:text-orange-400">4. Marketing & Sales</h4>
                              <span className="text-2xl font-bold text-orange-600">$260K</span>
                            </div>
                            <div className="mb-2 text-sm text-muted-foreground">(spread across 36 months, lean but global-capable)</div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                              <div className="flex justify-between">
                                <span>$50K →</span>
                                <span>Brand development + launch campaigns</span>
                              </div>
                              <div className="flex justify-between">
                                <span>$40K →</span>
                                <span>Mazunte presale push</span>
                              </div>
                              <div className="flex justify-between">
                                <span>$80K →</span>
                                <span>Bahia presale + multi-market rollouts</span>
                              </div>
                              <div className="flex justify-between">
                                <span>$50K →</span>
                                <span>Global campaign (Spain + Greece + cross-market)</span>
                              </div>
                              <div className="flex justify-between">
                                <span>$40K →</span>
                                <span>Content, PR, digital ad buys</span>
                              </div>
                            </div>
                          </div>
                        </Card>

                        {/* 5. Operations / Buffers / PM */}
                        <Card className="p-6 bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border border-amber-500/20">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xl font-bold text-amber-700 dark:text-amber-400">5. Operations / Buffers / PM</h4>
                              <span className="text-2xl font-bold text-amber-600">$680K</span>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                              <div className="flex justify-between">
                                <span>$150K →</span>
                                <span>Core PM salary + founder stipend</span>
                              </div>
                              <div className="flex justify-between">
                                <span>$120K →</span>
                                <span>Local PMs / staff across 4 sites</span>
                              </div>
                              <div className="flex justify-between">
                                <span>$90K →</span>
                                <span>Travel & site planning</span>
                              </div>
                              <div className="flex justify-between">
                                <span>$70K →</span>
                                <span>SaaS, platform hosting, admin stack</span>
                              </div>
                              <div className="flex justify-between">
                                <span>$60K →</span>
                                <span>Advisory, accounting, audit</span>
                              </div>
                              <div className="flex justify-between">
                                <span>$190K →</span>
                                <span>Treasury buffers (6-month reserves to smooth cashflow)</span>
                              </div>
                            </div>
                          </div>
                        </Card>

                        {/* 6. Liquidity Pool Stake */}
                        <Card className="p-6 bg-gradient-to-r from-teal-500/10 to-cyan-500/5 border border-teal-500/20">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xl font-bold text-teal-700 dark:text-teal-400">6. Liquidity Pool Stake</h4>
                              <span className="text-2xl font-bold text-teal-600">$185K</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Locked + staked for investor confidence and liquidity depth
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Clean Totals */}
                      <Card className="p-8 bg-gradient-to-r from-[hsl(var(--gold))]/20 to-[hsl(var(--accent))]/10 border border-[hsl(var(--gold))]/30">
                        <div className="space-y-6">
                          <div className="flex items-center space-x-3 mb-6">
                            <span className="text-2xl">✅</span>
                            <h3 className="text-2xl font-bold text-[hsl(var(--gold))]">Clean Totals</h3>
                          </div>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="flex justify-between">
                              <span>Land & Build:</span>
                              <span className="font-bold text-green-600">$5.10M</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Legal / Permits / Compliance:</span>
                              <span className="font-bold text-blue-600">$450K</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Platform & Smart Contracts:</span>
                              <span className="font-bold text-purple-600">$655K</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Marketing & Sales:</span>
                              <span className="font-bold text-orange-600">$260K</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Operations / Buffers / PM:</span>
                              <span className="font-bold text-amber-600">$680K</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Liquidity Pool Stake:</span>
                              <span className="font-bold text-teal-600">$185K</span>
                            </div>
                          </div>
                          <div className="border-t pt-4">
                            <div className="flex justify-between text-xl">
                              <span className="font-bold">Overall:</span>
                              <span className="font-bold text-[hsl(var(--gold))]">$7.00M</span>
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Why This Version Wins */}
                      <Card className="p-8 bg-gradient-to-r from-emerald-500/10 to-green-500/5 border border-emerald-500/20">
                        <div className="space-y-6">
                          <div className="flex items-center space-x-3 mb-6">
                            <span className="text-2xl">💡</span>
                            <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">Why This Version Wins</h3>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-sm">✓</span>
                              </div>
                              <div>
                                <span className="font-semibold">Legal reserve:</span> Strong enough to absorb multi-jurisdiction complexity without being bloated.
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-sm">✓</span>
                              </div>
                              <div>
                                <span className="font-semibold">Construction buffer:</span> Upgraded, giving you protection against inflation and room to pounce on land or material opportunities.
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-sm">✓</span>
                              </div>
                              <div>
                                <span className="font-semibold">Platform:</span> Fully funded, no risk of underbuilding the tech.
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-sm">✓</span>
                              </div>
                              <div>
                                <span className="font-semibold">Operations:</span> Lean and steady, with a healthy treasury buffer.
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-sm">✓</span>
                              </div>
                              <div>
                                <span className="font-semibold">Liquidity:</span> The $185K stake shows investors you're serious about DeFi alignment.
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </TabsContent>

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
                                  <div className="flex justify-between"><span>Executive Travel & Setup</span><span>$10K</span></div>
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
                                  <div>On-ground setup & relationship building</div>
                                  <div>Dataroom, e-sign, compliance</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-border">
                              <span className="font-medium">Running Balance:</span>
                              <span className="text-lg font-bold text-accent">$7.00M - $150K = $6.85M</span>
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

              {/* How The Money Actually Moves */}
              <Card className="p-8 bg-gradient-card border-none shadow-luxury">
                <div className="space-y-8">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold">How The Money Actually Moves</h3>
                    <p className="text-muted-foreground">Here's the month-by-month walkthrough so you can see how $7.0M gets used, recycled, and ends with $2.94M treasury while peak capital at risk is only $4.06M.</p>
                  </div>

                  {/* Treasury Ledger */}
                  <div className="space-y-6">
                    <div className="relative p-8 bg-gradient-to-br from-[hsl(var(--gold))]/10 via-[hsl(var(--accent))]/5 to-transparent border border-[hsl(var(--gold))]/20 rounded-xl shadow-luxury">
                      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--gold))]/5 to-transparent rounded-xl"></div>
                      <div className="relative flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--accent))] rounded-2xl flex items-center justify-center shadow-lg">
                          <BarChart3 className="w-8 h-8 text-[hsl(var(--gold-foreground))]" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--foreground))] to-[hsl(var(--muted-foreground))] bg-clip-text text-transparent">
                            The Treasury Ledger
                          </h4>
                          <p className="text-lg text-[hsl(var(--gold))] font-medium tracking-wide">
                            Key Milestones & Capital Flow
                          </p>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/40 to-transparent"></div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse bg-background/50 rounded-lg overflow-hidden">
                        <thead>
                          <tr className="bg-muted">
                            <th className="p-4 text-left font-semibold">Month</th>
                            <th className="p-4 text-left font-semibold">Milestone</th>
                            <th className="p-4 text-left font-semibold">Cash Change</th>
                            <th className="p-4 text-left font-semibold">Treasury After</th>
                            <th className="p-4 text-left font-semibold">Capital at Risk</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-muted/50">
                            <td className="p-4">Start</td>
                            <td className="p-4">Initial Investment</td>
                            <td className="p-4">—</td>
                            <td className="p-4 font-bold text-orange-600">$7.00M</td>
                            <td className="p-4">$0.00M</td>
                          </tr>
                          <tr className="border-b border-muted/50">
                            <td className="p-4">M1-M11</td>
                            <td className="p-4">Legal, Platform, Mexico Setup</td>
                            <td className="p-4 text-red-600">-$1.21M</td>
                            <td className="p-4">$5.79M</td>
                            <td className="p-4">$1.21M</td>
                          </tr>
                          <tr className="border-b border-muted/50">
                            <td className="p-4">M12-M14</td>
                            <td className="p-4">First Presales Begin (Mazunte)</td>
                            <td className="p-4 text-green-600">+$0.257M</td>
                            <td className="p-4">$5.78M</td>
                            <td className="p-4">$1.22M</td>
                          </tr>
                          <tr className="border-b border-muted/50">
                            <td className="p-4">M15-M21</td>
                            <td className="p-4">Brazil Build + Bahia Presales</td>
                            <td className="p-4 text-green-600">+$0.442M</td>
                            <td className="p-4">$5.39M</td>
                            <td className="p-4">$1.61M</td>
                          </tr>
                          <tr className="border-b border-muted/50">
                            <td className="p-4">M21-M30</td>
                            <td className="p-4">Spain Entry + More Presales</td>
                            <td className="p-4 text-green-600">+$0.67M</td>
                            <td className="p-4">$4.06M</td>
                            <td className="p-4">$2.94M</td>
                          </tr>
                          <tr className="border-b border-muted/50 bg-red-50 dark:bg-red-950/20">
                            <td className="p-4 font-bold">M36</td>
                            <td className="p-4 font-bold">Peak Capital at Risk</td>
                            <td className="p-4 text-red-600 font-bold">-$0.827M</td>
                            <td className="p-4 font-bold">$2.94M</td>
                            <td className="p-4 font-bold text-red-600">$4.06M</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Cash Recycling Details */}
                  <div className="space-y-6">
                    <h4 className="text-xl font-bold">Where The $2.76M Recycled Comes From</h4>
                    <p className="text-muted-foreground">Cash flows back into the treasury from presales and closings throughout the 36 months:</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="font-medium">M12: Mazunte presales start</div>
                        <div className="text-green-600">+$128K</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">M18: Mazunte cash closings</div>
                        <div className="text-green-600">+$534K</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">M19-21: Bahia presales 2-4</div>
                        <div className="text-green-600">+$388K</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">M30: Bahia cash closings</div>
                        <div className="text-green-600">+$675K</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">M34-35: EU presales 2-3</div>
                        <div className="text-green-600">+$387K</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">M36: EU presales 4</div>
                        <div className="text-green-600">+$193K</div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-xl font-bold text-green-700 dark:text-green-400">
                        Total Inflows (Capital Recycled): <span className="text-green-600">$2.76M</span>
                      </div>
                    </div>
                  </div>


                  {/* Plain English Takeaway */}
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
                    <h4 className="text-xl font-bold text-amber-800 dark:text-amber-400 mb-4">Plain English Takeaway</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <div>
                          We put the $7M to work across land, builds, legal, platform, and marketing—but as soon as presales and closings hit, cash flows back into the fund and gets reused.
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <div>
                          Because of that recycling, the most we ever have exposed at one time is $4.06M, not the full $7M.
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <div>
                          By Month 36 we still have $2.94M cash in treasury, plus multiple markets completed or underway, and we roll that cash into Thailand/Turkey without needing a new raise.
                        </div>
                      </div>
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
                    {[{
                    name: "Tether Gold (XAUT)",
                    aum: "$500M+ AUM",
                    structure: ["Physical gold stored in Swiss vaults", "Tether International Limited (SPV) holds legal title", "XAUT tokens represent beneficial ownership claims", "Switzerland doesn't recognize blockchain tokens as legal gold title"],
                    result: "Fully functional, legally compliant, institutionally trusted"
                  }, {
                    name: "RealT",
                    aum: "$100M+ U.S. Properties",
                    structure: ["Properties owned by individual LLCs (SPVs)", "Token holders own membership interests in LLCs", "No direct deed tokenization"],
                    result: "Regulatory compliant across all U.S. states"
                  }, {
                    name: "Reental",
                    aum: "€32.5M European Assets",
                    structure: ["Spanish properties held by SPV entities", "Tokens represent economic rights, not deeds", "Over 22,500 verified investors"],
                    result: "Operating successfully across Spain, Mexico, U.S., and LatAm"
                  }].map((platform, index) => <Card key={index} className="bg-card/50 border-border/50">
                        <CardContent className="p-6">
                          <div className="text-lg font-bold text-primary mb-2">{platform.name}</div>
                          <Badge variant="outline" className="mb-4">{platform.aum}</Badge>
                          <div className="space-y-2 mb-4">
                            {platform.structure.map((item, i) => <div key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>{item}</span>
                              </div>)}
                          </div>
                          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                            <div className="text-sm font-medium text-green-800 dark:text-green-400">
                              Result: {platform.result}
                            </div>
                          </div>
                        </CardContent>
                      </Card>)}
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
                        {["Bulletproof Legal Chain: Nevis → Local SPV → Property Title", "Regulatory Arbitrage: Optimal jurisdiction selection per market", "Institutional Grade: Same structure used by billion-dollar assets", "Full Transparency: On-chain ownership records and cash flows", "Automated Compliance: Smart contracts handle distributions and governance"].map((advantage, i) => <div key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-green-500">✅</span>
                            <span>{advantage}</span>
                          </div>)}
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
                    {[{
                    country: "🇲🇽 Mexico (Mazunte Project)",
                    structure: "Mexican SPV (Sociedad Anónima de Capital Variable - S.A. de C.V.)",
                    regulations: ["CNBV (National Banking and Securities Commission): S.A. de C.V. shares are regulated securities", "Property Registry: Company holds registered title at Registro Público de la Propiedad", "Foreign Investment: Compliant with Foreign Investment Law (Ley de Inversión Extranjera)", "AMIB Compliance: Mexican Securities Market Association standards", "Golden Visa Alternative: Path to permanent residency through investment", "Tax Optimization: Favorable corporate tax structure for international investors"],
                    comparable: "Multiple international real estate platforms operate successfully in Mexico using identical SPV structures, with Tulum real estate appreciation of 300%+ over recent years"
                  }, {
                    country: "🇧🇷 Brazil (Bahia Project)",
                    structure: "Brazilian LTDA (Limited Liability Company)",
                    regulations: ["CVM (Securities Commission): LTDA quotas qualify as securities under Brazilian law", "Property Law: LTDA holds registered property title at local cartório", "Foreign Investment: Compliant with Lei 4.131/62 for foreign capital", "Token Classification: Represents LTDA quotas, not direct property rights", "Tax Optimization: LTDA structure provides favorable corporate tax treatment"],
                    comparable: "Terram tokenized R$50M+ Brazilian real estate using identical SPV structures"
                  }, {
                    country: "🇬🇷 Greece (Corfu Project)",
                    structure: "Greek IKE (Private Company)",
                    regulations: ["HCMC (Hellenic Capital Market Commission): IKE shares are recognized securities", "Property Registry: IKE registered as legal property owner", "Golden Visa Compliance: Structure supports Greece's €250K residency program", "EU MiCA Preparation: Forward-compatible with upcoming EU token regulations", "Tax Benefits: Greek IKE enjoys competitive corporate tax rates (24%)"],
                    comparable: "Greece actively promotes blockchain innovation through regulatory sandbox programs"
                  }, {
                    country: "🇪🇸 Spain (Mallorca Project)",
                    structure: "Spanish SL (Sociedad Limitada)",
                    regulations: ["CNMV (Securities Market Commission): SL participaciones are established securities", "Property Registration: SL holds registered title at Registro de la Propiedad", "EU Passporting: Structure enables future EU-wide token distribution", "MiCA Compliance: Spain leads EU's Markets in Crypto-Assets regulation", "Golden Visa Alignment: €500K investment threshold compatibility"],
                    comparable: "Reental operates identical SL structures across Spain with €32.5M in assets"
                  }, {
                    country: "🇹🇭 Thailand (Koh Phangan Project)",
                    structure: "30+30 Year Leasehold via Thai SPV",
                    regulations: ["SEC Thailand: Company shares classified as securities under Thai law", "Land Department: Thai company holds registered leasehold rights", "Foreign Ownership: Compliant with 49% foreign ownership limits via nominee structure", "BOI Benefits: Potential Board of Investment incentives for tech innovation", "Renewable Structure: 30+30 year leases provide 60-year economic rights"],
                    comparable: "Multiple international developers use identical leasehold SPV structures in Thailand"
                  }, {
                    country: "🇹🇷 Turkey (Antalya Project)",
                    structure: "Turkish SPV (Limited Şirket)",
                    regulations: ["CMB (Capital Markets Board): Company shares are regulated securities", "Land Registry: Turkish company holds tapu (property title)", "Citizenship Program: €400K investment qualifies for Turkish citizenship", "Strategic Location: Bridge between European and Asian markets", "Currency Hedge: Turkish lira depreciation benefits foreign investors"],
                    comparable: "Turkey's citizenship-by-investment program adds significant value proposition"
                  }].map((jurisdiction, index) => <Card key={index} className="bg-card/50 border-border/50">
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
                              {jurisdiction.regulations.map((reg, i) => <div key={i} className="text-sm flex items-start gap-2">
                                  <span className="text-primary">•</span>
                                  <span>{reg}</span>
                                </div>)}
                            </div>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                            <div className="text-sm text-blue-800 dark:text-blue-400">
                              <strong>Market Precedent:</strong> {jurisdiction.comparable}
                            </div>
                          </div>
                        </CardContent>
                      </Card>)}
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
                            {[{
                            platform: "Tether Gold",
                            aum: "$500M+",
                            structure: "Swiss SPV",
                            token: "ERC-20",
                            status: "Fully Compliant"
                          }, {
                            platform: "RealT",
                            aum: "$100M+",
                            structure: "U.S. LLCs",
                            token: "ERC-20",
                            status: "SEC Compliant"
                          }, {
                            platform: "Reental",
                            aum: "€32.5M",
                            structure: "Spanish SPVs",
                            token: "Proprietary",
                            status: "EU Compliant"
                          }, {
                            platform: "Ancient",
                            aum: "$24.5M Projected",
                            structure: "Multi-Jurisdiction SPVs",
                            token: "ERC-20/ERC-3643",
                            status: "Enhanced Compliance"
                          }].map((row, i) => <tr key={i} className={`border-b border-border/50 ${row.platform === "Ancient" ? "bg-primary/5" : ""}`}>
                                <td className="p-3 font-semibold">{row.platform}</td>
                                <td className="p-3">{row.aum}</td>
                                <td className="p-3">{row.structure}</td>
                                <td className="p-3">{row.token}</td>
                                <td className="p-3">{row.status}</td>
                              </tr>)}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>


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
                      {["Proven SPV Framework: Same structure as industry leaders", "Multi-Jurisdiction Optimization: Legal arbitrage for maximum protection", "Institutional Compliance: Ready for traditional finance integration", "Transparent Operations: Blockchain eliminates opacity and manual errors", "Automated Governance: Smart contracts reduce counterparty risk"].map((point, i) => <div key={i} className="flex items-start gap-2">
                          <span className="text-primary">✅</span>
                          <span className="font-medium">{point}</span>
                        </div>)}
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

            <TabsContent value="buyers-journey">
              <div className="space-y-8">
                {/* Header */}
                <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Home className="w-8 h-8 text-primary" />
                      <h3 className="text-3xl font-bold">Buyer's Journey: A 360° Wealth Model</h3>
                    </div>
                    <p className="text-xl text-muted-foreground mb-6">
                      Our model is designed to create a clear, 10-year path to wealth creation for all participants. Here is a step-by-step walkthrough of the journey for each stakeholder, based on a property with an initial value of $150,000.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-primary/5 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-primary">11x ROI</div>
                        <div className="text-sm text-muted-foreground">Buyer Returns</div>
                      </div>
                      <div className="bg-accent/5 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-accent">9.8% IRR</div>
                        <div className="text-sm text-muted-foreground">Lending Pool</div>
                      </div>
                      <div className="bg-secondary/5 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-secondary">$113.1K</div>
                        <div className="text-sm text-muted-foreground">Platform Revenue</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Buyer's Journey */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Users className="w-8 h-8 text-blue-600" />
                      <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-400">1. The Buyer's Journey: From Renter to Owner</h3>
                    </div>
                    <p className="text-lg mb-6 text-blue-700 dark:text-blue-300">
                      This is the core experience, transforming a renter into a global property owner.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Step 1 */}
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-6 border border-blue-200/50">
                        <div className="text-center mb-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">1</span>
                          </div>
                          <h4 className="font-bold text-lg mb-2">Initial Purchase</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Home Price:</span>
                            <span className="font-bold">$150,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Down Payment (20%):</span>
                            <span className="font-bold text-primary">$30,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Mortgage:</span>
                            <span className="font-bold">$120,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Monthly Payment:</span>
                            <span className="font-bold">~$1,456</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            Fixed 8% interest over 10 years
                          </div>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-6 border border-blue-200/50">
                        <div className="text-center mb-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">2</span>
                          </div>
                          <h4 className="font-bold text-lg mb-2">10-Year Journey</h4>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl mb-2">📈</div>
                          <p className="text-sm">
                            For the next 10 years, you make fixed monthly payments, building equity with each one. At the end of the term, the mortgage is fully paid off.
                          </p>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-6 border border-blue-200/50">
                        <div className="text-center mb-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">3</span>
                          </div>
                          <h4 className="font-bold text-lg mb-2">Year 10 Event</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="text-center mb-3">
                            <div className="text-lg font-bold text-primary">$421,500</div>
                            <div className="text-xs text-muted-foreground">Appraised Value</div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span>50% to You:</span>
                              <span className="font-bold text-green-600">$135,750</span>
                            </div>
                            <div className="flex justify-between">
                              <span>40% to Platform:</span>
                              <span className="font-bold">$108,600</span>
                            </div>
                            <div className="flex justify-between">
                              <span>10% to Lenders:</span>
                              <span className="font-bold">$27,150</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Step 4 */}
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-6 border border-blue-200/50">
                        <div className="text-center mb-4">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-green-600 dark:text-green-400 font-bold text-lg">4</span>
                          </div>
                          <h4 className="font-bold text-lg mb-2">Wealth Summary</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Initial Investment:</span>
                            <span className="font-bold">$30,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Equity Year 10:</span>
                            <span className="font-bold text-green-600">~$339,000</span>
                          </div>
                          <div className="flex justify-between border-t pt-2 mt-3">
                            <span>Return on Investment:</span>
                            <span className="font-bold text-primary text-lg">Over 11x</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-green-100 dark:bg-green-900/20 rounded-lg p-4">
                      <p className="text-center font-medium text-green-800 dark:text-green-400">
                        🏡 Transform what would have been rent into a powerful financial asset
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Lending Pool Journey */}
                <Card className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200 dark:border-purple-800">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <DollarSign className="w-8 h-8 text-purple-600" />
                      <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-400">2. The Lending Pool's Journey: Secure, High-Yield Returns</h3>
                    </div>
                    <p className="text-lg mb-6 text-purple-700 dark:text-purple-300">
                      The lending pool provides the capital for the mortgage and receives a steady, secure return plus an equity bonus.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-white/50 dark:bg-black/20 rounded-lg p-6">
                          <h4 className="font-bold text-lg mb-4 text-purple-700 dark:text-purple-400">Investment Details</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span>Mortgage Lent:</span>
                              <span className="font-bold">$120,000</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Interest Earned (10 Years):</span>
                              <span className="font-bold text-green-600">$54,712</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Appreciation Bonus:</span>
                              <span className="font-bold text-green-600">$27,150</span>
                            </div>
                            <div className="border-t pt-3">
                              <div className="flex justify-between">
                                <span className="font-bold">Total Return:</span>
                                <span className="font-bold text-primary text-lg">$81,862</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-white/50 dark:bg-black/20 rounded-lg p-6">
                          <h4 className="font-bold text-lg mb-4 text-purple-700 dark:text-purple-400">Performance Metrics</h4>
                          <div className="space-y-4">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-green-600">+68%</div>
                              <div className="text-sm text-muted-foreground">Gross ROI</div>
                            </div>
                            <div className="text-center">
                              <div className="text-3xl font-bold text-primary">9.8%</div>
                              <div className="text-sm text-muted-foreground">Annualized IRR (10 yrs)</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-purple-100 dark:bg-purple-900/20 rounded-lg p-4">
                          <p className="text-center font-medium text-purple-800 dark:text-purple-400">
                            💰 Stable, high-yield returns that consistently outperform traditional financial products like REITs and bonds
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Platform Journey */}
                <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Building2 className="w-8 h-8 text-orange-600" />
                      <h3 className="text-2xl font-bold text-orange-800 dark:text-orange-400">3. Ancient LLC's Journey: The Platform</h3>
                    </div>
                    <p className="text-lg mb-6 text-orange-700 dark:text-orange-300">
                      The platform's revenue is directly tied to the success of the properties, creating a performance-based, long-term cash flow engine.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-6 text-center">
                        <div className="text-3xl mb-3">📈</div>
                        <div className="text-2xl font-bold text-orange-600">$108,600</div>
                        <div className="text-sm text-muted-foreground mb-2">Appreciation Share at Year 10</div>
                        <div className="text-xs text-orange-600">40% of property appreciation</div>
                      </div>

                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-6 text-center">
                        <div className="text-3xl mb-3">🏛️</div>
                        <div className="text-2xl font-bold text-orange-600">$4,500</div>
                        <div className="text-sm text-muted-foreground mb-2">Platform Fee</div>
                        <div className="text-xs text-orange-600">3% of property value</div>
                      </div>

                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-6 text-center">
                        <div className="text-3xl mb-3">💰</div>
                        <div className="text-2xl font-bold text-primary">$113,100</div>
                        <div className="text-sm text-muted-foreground mb-2">Total Revenue Per Unit</div>
                        <div className="text-xs text-primary">Performance-based model</div>
                      </div>
                    </div>

                    <div className="mt-6 bg-orange-100 dark:bg-orange-900/20 rounded-lg p-4">
                      <p className="text-center font-medium text-orange-800 dark:text-orange-400">
                        🚀 This model allows Ancient to generate significant, non-speculative revenue that can be reinvested to scale the development of new projects globally
                      </p>
                    </div>

                    <div className="mt-6 grid md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4">
                        <h4 className="font-bold mb-2">Scalable Revenue Model</h4>
                        <p className="text-sm text-muted-foreground">Revenue directly tied to property success, creating sustainable growth</p>
                      </div>
                      <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-lg p-4">
                        <h4 className="font-bold mb-2">Global Expansion Fund</h4>
                        <p className="text-sm text-muted-foreground">Reinvest platform revenue to develop new villages worldwide</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary */}
                <Card className="bg-gradient-to-r from-gold/10 to-primary/10 border-gold/20">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-4">The Complete Wealth Ecosystem</h3>
                      <p className="text-lg text-muted-foreground mb-6">
                        A win-win-win model where buyers build wealth, lenders earn stable returns, and the platform scales sustainably
                      </p>
                      
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white/50 dark:bg-black/20 rounded-lg p-6">
                          <div className="text-3xl mb-2">🏠</div>
                          <div className="text-xl font-bold text-primary">Buyers</div>
                          <div className="text-sm text-muted-foreground">Transform rent into equity</div>
                          <div className="text-lg font-bold mt-2">11x ROI</div>
                        </div>
                        
                        <div className="bg-white/50 dark:bg-black/20 rounded-lg p-6">
                          <div className="text-3xl mb-2">💎</div>
                          <div className="text-xl font-bold text-accent">Lenders</div>
                          <div className="text-sm text-muted-foreground">Secure, high-yield returns</div>
                          <div className="text-lg font-bold mt-2">9.8% IRR</div>
                        </div>
                        
                        <div className="bg-white/50 dark:bg-black/20 rounded-lg p-6">
                          <div className="text-3xl mb-2">🚀</div>
                          <div className="text-xl font-bold text-secondary">Platform</div>
                          <div className="text-sm text-muted-foreground">Performance-based revenue</div>
                          <div className="text-lg font-bold mt-2">$113K/unit</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Investor Return Scenarios */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Investor Return Scenarios</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Conservative modeling across different execution speeds with detailed valuation analysis
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <Card className="bg-card/30 backdrop-blur-sm border-border/30">
              <CardContent className="p-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/30">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Scenario</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Volume Hit</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Year-10 Revenue</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Valuation Multiple</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Company EV</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Your 50%</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/20">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🐻</span>
                            <div>
                              <div className="font-medium">Bear</div>
                              <div className="text-sm text-muted-foreground italic">(50% of plan)</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="font-medium">~2,500 homes</div>
                          <div className="text-sm text-muted-foreground">1 M users</div>
                        </td>
                        <td className="text-center py-4 px-4 font-medium">$410 M</td>
                        <td className="text-center py-4 px-4 font-medium">10 x</td>
                        <td className="text-center py-4 px-4 font-bold text-foreground">$4.1 B</td>
                        <td className="text-center py-4 px-4 font-bold text-primary">$2.0 B</td>
                      </tr>
                      <tr className="border-b border-border/20 bg-primary/5">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🟢</span>
                            <div>
                              <div className="font-medium text-primary">Base</div>
                              <div className="text-sm text-muted-foreground italic">(road-map hit)</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="font-medium">~5,000 homes</div>
                          <div className="text-sm text-muted-foreground">2 M users</div>
                        </td>
                        <td className="text-center py-4 px-4 font-medium">$827 M</td>
                        <td className="text-center py-4 px-4 font-medium">13 x</td>
                        <td className="text-center py-4 px-4 font-bold text-primary">$10.8 B</td>
                        <td className="text-center py-4 px-4 font-bold text-primary">$5.4 B</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🚀</span>
                            <div>
                              <div className="font-medium">Bull</div>
                              <div className="text-sm text-muted-foreground italic">(150% of plan)</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="font-medium">~7,500 homes</div>
                          <div className="text-sm text-muted-foreground">3 M users</div>
                        </td>
                        <td className="text-center py-4 px-4 font-medium">$1.24 B</td>
                        <td className="text-center py-4 px-4 font-medium">14 x</td>
                        <td className="text-center py-4 px-4 font-bold text-foreground">$17.4 B</td>
                        <td className="text-center py-4 px-4 font-bold text-primary">$8.7 B</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
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
              Access Investment Portal
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
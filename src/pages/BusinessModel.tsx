import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowRight, TrendingUp, MapPin, DollarSign, Building, Globe, Shield, Code, Target, Rocket, Building2, BarChart3, Zap, Network, Menu, Home, Users, Briefcase, CreditCard, Plane, Code2, FileText, Settings, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart, PieChart, Pie, Cell } from "recharts";
import SectionHeader from "@/components/SectionHeader";
import TechDueDiligence from "@/components/TechDueDiligence";
import TenYearProjection from "@/components/TenYearProjection";
import ReturnProfile from "@/components/ReturnProfile";
import SixFlipRoadmap from "@/components/SixFlipRoadmap";
import { MortgageOptionsCalculator } from "@/components/MortgageOptionsCalculator";
import { ScenarioComparison } from "@/components/ScenarioComparison";
import { SensitivityDashboard } from "@/components/SensitivityDashboard";
import { MortgageOnlySensitivityDashboard } from "@/components/MortgageOnlySensitivityDashboard";
import { StrategicRecommendations } from "@/components/StrategicRecommendations";
import { getCurrentScenario, getAggressiveScenario, getTieredScenario, getAcceleratedScenario, getHybridScenario, calculateDevelopmentFlywheel, getCashOptimizedScenario, getMortgageHeavyScenario, getHelocStrategyScenario } from "@/lib/revenueScenarios";
import { ProductComparison } from "@/components/ProductComparison";
import VCPitchDeck from "@/components/VCPitchDeck";
import CashFirstStrategy from "@/components/CashFirstStrategy";
import CompetitiveLandscape from "@/components/CompetitiveLandscape";
import DevCoFinCoModel from "@/components/DevCoFinCoModel";
import MarketFailure from "@/components/MarketFailure";
import TractionTrilogy from "@/components/TractionTrilogy";
import UnfairUnitEconomics from "@/components/UnfairUnitEconomics";
import KillSwitch from "@/components/KillSwitch";
import AWSPitch from "@/components/AWSPitch";
import FinCoLiquidityPool from "@/components/FinCoLiquidityPool";
import { LegalRegulatoryProofing } from "@/components/LegalRegulatoryProofing";

// Import property images
import villaTulum from "@/assets/villa-tulum.jpg";
import beachChalet from "@/assets/beach-chalet.jpg";
import villaEriceira from "@/assets/villa-ericeira-portugal.jpg";
import villaGreece from "@/assets/villa-greece.jpg";
import villaBali from "@/assets/villa-bali.jpg";
import penthouseMexico from "@/assets/penthouse-mexico.jpg";
import ecoSmartCity from "@/assets/eco-smart-city.jpg";

// Calculate dynamic flywheel data with Two-Pocket Model
// DevCo receives 100% gross sales from FinCo at closing
const INITIAL_CAPITAL = 1.9; // $1.9M seed investment (DevCo only)

const calculateFlywheelWithBudget = () => {
  const flywheel = calculateDevelopmentFlywheel();
  const images = [villaTulum, beachChalet, villaGreece, villaEriceira, villaBali, penthouseMexico];
  const locations = [
    { name: "Pisac, Peru", flag: "🇵🇪", structure: "Peruvian SAC + Reserva de Dominio" },
    { name: "Bahia, Brazil", flag: "🇧🇷", structure: "Brazilian LTDA + Alienação Fiduciária" },
    { name: "Corfu, Greece", flag: "🇬🇷", structure: "Greek IKE SPV" },
    { name: "Koh Phangan, Thailand", flag: "🇹🇭", structure: "30+30 Leasehold" },
    { name: "Mazunte, Mexico", flag: "🇲🇽", structure: "Mexican SAPI + Fideicomiso" },
    { name: "Antalya, Turkey", flag: "🇹🇷", structure: "Turkish SPV" }
  ];
  
  const prices = [135000, 145000, 165000, 110000, 250000, 160000]; // Canonical: Peru→Brazil→Greece→Thailand→Mexico→Turkey
  
  let runningCapital = INITIAL_CAPITAL;
  
  return flywheel.flips.map((flip, idx) => {
    const buildCostM = flip.buildCost / 1_000_000;
    const grossSalesM = flip.grossSales / 1_000_000;
    
    // TWO-POCKET MODEL: DevCo receives 100% gross sales from FinCo at closing
    // FinCo handles mortgages separately with its own capital pool
    const netProfitM = grossSalesM - buildCostM;
    
    // Capital compounds: start with seed, add net profit each flip
    runningCapital = runningCapital + netProfitM;
    
    return {
      flip: flip.flip,
      location: locations[idx].name,
      flag: locations[idx].flag,
      units: flip.units,
      pricePerUnit: prices[idx],
      buildCost: buildCostM,
      salesPrice: grossSalesM,
      grossSales: grossSalesM, // 100% from FinCo at closing
      netProfit: netProfitM,
      runningCapital: runningCapital,
      platformFee: flip.platformFees / 1_000,
      image: images[idx],
      structure: locations[idx].structure,
      // Legacy fields for compatibility
      cashIn: flip.immediateCash / 1_000_000,
      remaining: runningCapital,
      downPayments: flip.downPayments / 1_000_000,
      cashSales: flip.cashSales / 1_000_000,
      deferredPrincipal: flip.deferredPrincipal / 1_000_000
    };
  });
};

const flywheelData = calculateFlywheelWithBudget();
const flywheel = calculateDevelopmentFlywheel();

// Calculate total units and revenue from canonical model
const totalUnits = flywheel.flips.reduce((sum, f) => sum + f.units, 0); // 147 units
const totalGrossSales = flywheel.totalGrossSales / 1_000_000; // in millions
const totalPlatformFees = flywheel.totalPlatformFees / 1_000_000; // in millions
const avgPrice = totalGrossSales / totalUnits * 1_000_000; // average price per unit

// Calculate revenue components from canonical model
const platformFeesY0 = totalPlatformFees; // $0.82M from 147 units

// Mortgage Interest: Use proper amortization formula, not simple interest
// Calculate total interest from mortgages using monthly payment formula
let totalMortgageInterest = 0;
let totalLoanAmount = 0;

flywheel.flips.forEach((flip) => {
  const financedUnits = Math.floor(flip.units * 0.80); // 80% financed
  const avgPrice = flip.grossSales / flip.units;
  const loanAmount = avgPrice * 0.80 * financedUnits; // 80% LTV per unit
  
  // Monthly payment calculation: P * [r(1+r)^n] / [(1+r)^n - 1]
  const monthlyRate = 0.10 / 12; // 10% APR
  const numPayments = 15 * 12; // 180 months
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  const totalPaid = monthlyPayment * numPayments;
  const interestPaid = totalPaid - loanAmount;
  
  totalMortgageInterest += interestPaid;
  totalLoanAmount += loanAmount;
});

const annualInterest = totalMortgageInterest / 15 / 1_000_000; // Convert to millions

// SAM Appreciation: 15% of 7% annual appreciation over 15 years
const finalValueForSAM = totalUnits * avgPrice * Math.pow(1.07, 15);
const totalAppreciationForSAM = finalValueForSAM - (totalUnits * avgPrice);
const appreciationY15 = (totalAppreciationForSAM * 0.15) / 1_000_000; // 15% SAM share

// Revenue over 15 years (Platform Fees + Interest + Appreciation)
const totalDynamicRevenue = platformFeesY0 + (totalMortgageInterest / 1_000_000) + appreciationY15; // Should be ~$24.50M

// Calculate 15-year cash flow waterfall
const generateCashFlowData = () => {
  const data = [];
  let cumulativeRevenue = 0;
  
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
  amount: `$${totalPlatformFees.toFixed(2)}M`,
  description: "3.5% fee on all sales (147 units, canonical pricing)",
  timeline: "Immediate capture",
  icon: "🏛"
}, {
  title: "Mortgage Interest",
  amount: `$${(totalMortgageInterest / 1_000_000).toFixed(2)}M`,
  description: "10% APR yield over 15-year term on financed units",
  timeline: "15-year stream",
  icon: "🌐"
}, {
  title: "Property Appreciation (15% SAM)",
  amount: `$${appreciationY15.toFixed(2)}M`,
  description: "15% share of 7% annual appreciation at Year 15",
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
  // Remove shadowing - use global totalPlatformFees from line 110
  const currentScenario = getCurrentScenario();
  const acceleratedScenario = getAcceleratedScenario();
  const hybridScenario = getHybridScenario();
  const cashOptimizedScenario = getCashOptimizedScenario();
  const mortgageHeavyScenario = getMortgageHeavyScenario();
  const helocStrategyScenario = getHelocStrategyScenario();
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
            ANCIENT PROTOCOL
          </h3>
          <p className="text-sm lg:text-base font-light text-white/80 tracking-wide mt-2">
            The "Stripe for Mortgage" Protocol
          </p>
        </div>
        
        {/* Centered Main Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center mt-24 lg:mt-32">
          {/* Main Hero Text */}
          <div className="space-y-4 mb-12">
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] tracking-tight">
              <span className="block text-white drop-shadow-2xl">Hardware-Enabled</span>
              <span className="block bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl">Mortgage Network</span>
            </h1>
          </div>
          
          {/* Value Proposition - Positioned Lower */}
          <div className="max-w-3xl mx-auto mt-16">
            <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 p-6 lg:p-8 shadow-2xl">
              <p className="text-lg lg:text-xl xl:text-2xl font-light leading-relaxed text-white mb-6">
                Connecting <span className="font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">$1T in trapped crypto wealth</span> with{" "}
                <span className="font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">35M credit-invisible Global Nomads</span>
              </p>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mb-6"></div>
              <p className="text-base lg:text-lg text-white/90 leading-relaxed font-light">
                We build the homes ("Hardware") to launch the credit engine ("Software"). <span className="text-green-400 font-semibold">12 operational units</span> generating <span className="text-green-400 font-semibold">18.75% Net Yields</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Failure Section */}
      <MarketFailure />

      {/* Traction Trilogy Section */}
      <TractionTrilogy />

      {/* Unfair Unit Economics Section */}
      <UnfairUnitEconomics />

      {/* Kill Switch Risk Management Section */}
      <KillSwitch />

      {/* AWS Pitch Section */}
      <AWSPitch />

      {/* 6 Flip Roadmap - The Hardware Engine */}
      <SixFlipRoadmap />

      {/* 10-Year Financial Projection */}
      <TenYearProjection />

      {/* Return Profile for Investors */}
      <ReturnProfile />

      {/* Business Model Content with Tabs */}
      <section className="px-4 bg-background py-[50px]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-6 text-lg px-6 py-2">
              Investment Thesis
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              The Math is Done. The Risk is Clear.
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              147 homes. $12M+ profit. 6 legal structures. The only question: do you want in?
            </p>
          </div>

          {/* CTA Section Before Deep Dive */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 border-2 mb-16">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold mb-4">Ready to Dive Deeper?</h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Schedule a call to discuss the investment opportunity or download the complete pitch deck.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Call
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <FileText className="w-5 h-5 mr-2" />
                  Download Deck
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Deep Dive Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary"></div>
              <div className="text-sm font-medium text-primary uppercase tracking-wider">Explore the Details</div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary"></div>
            </div>
            <h2 className="text-4xl font-bold">Optional Deep Dives</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Additional documentation for investors who want comprehensive details on specific areas.
            </p>
          </div>

          {/* Tabbed Content */}
          <Tabs defaultValue="competition" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="competition" className="text-xs lg:text-sm">Competition</TabsTrigger>
              <TabsTrigger value="two-pocket-model" className="text-xs lg:text-sm">Two-Pocket Model</TabsTrigger>
              <TabsTrigger value="revenue-model" className="text-xs lg:text-sm">Revenue</TabsTrigger>
              <TabsTrigger value="tech-legal" className="text-xs lg:text-sm">Tech & Legal</TabsTrigger>
              <TabsTrigger value="budget-breakdown" className="text-xs lg:text-sm">Budget</TabsTrigger>
              <TabsTrigger value="buyers-journey" className="text-xs lg:text-sm">Buyer Journey</TabsTrigger>
            </TabsList>

            {/* Competition Tab */}
            <TabsContent value="competition">
              <CompetitiveLandscape />
            </TabsContent>

            {/* Two-Pocket Model Tab (formerly Tiered Portfolio) */}
            <TabsContent value="two-pocket-model">
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <Badge variant="outline" className="mb-4">
                    Two-Pocket Engine
                  </Badge>
                  <h2 className="text-4xl font-bold mb-4">
                    DevCo Builds Fast. FinCo Holds Mortgages. IRR Protected.
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Originate-to-Distribute model: 40/60 Cash-Heavy → 10/90 Debt Scale → Securitization
                  </p>
                </div>

                {/* DevCo/FinCo Two-Pocket Model */}
                <DevCoFinCoModel />

                {/* FinCo Liquidity Pool - Mortgage Capital */}
                <FinCoLiquidityPool />

                {/* Cash First Strategy Component */}
                <CashFirstStrategy />

              
              </div>
            </TabsContent>

            <TabsContent value="revenue-model">

              {/* Stats Overview */}
              <div className="grid grid-cols-4 gap-6 mb-16">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
                    <div className="text-2xl font-bold text-foreground">$1.9M</div>
                    <div className="text-sm text-muted-foreground">DevCo Seed Capital</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6 text-center">
                    <Building className="w-8 h-8 text-primary mx-auto mb-3" />
                    <div className="text-2xl font-bold text-foreground">{totalUnits}</div>
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
                    <div className="text-2xl font-bold text-foreground">${totalDynamicRevenue}M</div>
                    <div className="text-sm text-muted-foreground">15-Year Revenue</div>
                  </CardContent>
                </Card>
              </div>

              {/* Flywheel Flow */}
              <div>
                <div className="text-center mb-16">
                  <Badge variant="outline" className="mb-4 border-emerald-500/50 text-emerald-400">
                    Two-Pocket Model
                  </Badge>
                  <h2 className="text-4xl font-bold mb-4">The Development Flywheel</h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    DevCo receives 100% gross sales from FinCo at closing. Capital compounds from $1.9M → $12M+ across 6 flips.
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

                            {/* Two-Pocket Model: DevCo receives 100% from FinCo */}
                            <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                              <div className="text-sm font-medium text-emerald-400 mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                DevCo receives 100% from FinCo at Closing
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">Gross Sales ({flip.units} units):</span>
                                  <span className="font-mono font-semibold text-foreground">${flip.grossSales?.toFixed(2) || flip.salesPrice?.toFixed(2)}M</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">Build Cost:</span>
                                  <span className="font-mono font-semibold text-muted-foreground">-${flip.buildCost.toFixed(2)}M</span>
                                </div>
                                <div className="border-t border-emerald-500/30 pt-1.5 mt-1.5 flex justify-between items-center">
                                  <span className="font-semibold text-foreground">Net Profit to DevCo:</span>
                                  <span className="font-mono text-lg font-bold text-emerald-500">+${flip.netProfit?.toFixed(2) || (flip.salesPrice - flip.buildCost).toFixed(2)}M</span>
                                </div>
                              </div>
                              <div className="mt-3 text-xs text-muted-foreground bg-background/50 rounded p-2">
                                💡 FinCo (DeFi stakers) provides mortgage capital separately at 7% yield
                              </div>
                            </div>
                          </div>

                          {/* Flow Indicator */}
                          <div className="p-8 flex flex-col justify-center items-center border-l border-border/50">
                            <div className="text-center mb-4">
                              <div className="text-sm text-muted-foreground">Running Capital</div>
                              <div className="text-3xl font-bold text-emerald-500">${flip.runningCapital?.toFixed(2) || flip.remaining?.toFixed(2)}M</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Started with $1.9M seed
                              </div>
                            </div>
                            
                            {index < flywheelData.length - 1 && <div className="flex flex-col items-center">
                                <div className="text-sm text-muted-foreground mb-2">Funds Next Flip</div>
                                <ArrowRight className="w-8 h-8 text-emerald-500 rotate-90 md:rotate-0" />
                              </div>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>)}
                </div>

              {/* Clean Revenue Model Showcase */}
              <div className="mb-16 mt-24">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">${totalDynamicRevenue}M Revenue Model</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Three revenue streams across {totalUnits} units in 6 countries, 23-26% IRR
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
                          <div className="text-4xl font-bold text-primary mb-3">${totalPlatformFees.toFixed(2)}M</div>
                          <p className="text-sm text-muted-foreground">3.5% infrastructure fee on all sales</p>
                        </div>
                        <div className="bg-background/50 rounded-lg p-3 text-sm">
                          <div className="text-muted-foreground">Immediate capture (Years 0-6)</div>
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
                          <div className="text-4xl font-bold text-primary mb-3">$13.50M</div>
                          <p className="text-sm text-muted-foreground">10% APR on 15-year mortgages</p>
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
                          <div className="text-sm text-muted-foreground uppercase tracking-wide mb-2">SAM Appreciation (15%)</div>
                          <div className="text-4xl font-bold text-primary mb-3">$10.18M</div>
                          <p className="text-sm text-muted-foreground">15% share of 7% annual appreciation at exit</p>
                        </div>
                        <div className="bg-background/50 rounded-lg p-3 text-sm">
                          <div className="text-muted-foreground">15-year capture (Year 15 exit)</div>
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
                      <div className="text-6xl font-bold text-primary mb-4">${totalDynamicRevenue}M</div>
                      <div className="flex items-center justify-center gap-8 text-sm">
                        <div>
                          <span className="text-muted-foreground">IRR:</span>
                          <span className="font-bold ml-2">23-26%</span>
                        </div>
                        <div className="h-4 w-px bg-border"></div>
                        <div>
                          <span className="text-muted-foreground">Cash Multiple:</span>
                          <span className="font-bold ml-2">7.2×</span>
                        </div>
                        <div className="h-4 w-px bg-border"></div>
                        <div>
                          <span className="text-muted-foreground">{totalUnits} Units:</span>
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
                      <h3 className="text-3xl font-bold mb-3">Geographic Pricing Strategy</h3>
                      <p className="text-lg text-muted-foreground">
                        Market-based pricing across 6 locations: $110K (Thailand) → $250K (Mexico luxury)
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
                          {flywheel.flips.map((flip, idx) => (
                            <tr key={idx} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                              <td className="py-4 px-4 font-semibold">{flip.flip}</td>
                              <td className="py-4 px-4">{flip.units}</td>
                              <td className="py-4 px-4 text-right font-mono">${(flip.grossSales / flip.units / 1000).toFixed(0)}k</td>
                              <td className="py-4 px-4 text-right font-mono text-primary">${(flip.platformFees / 1000).toFixed(1)}k</td>
                              <td className="py-4 px-4 text-right font-mono font-semibold">${(flip.grossSales / 1000000).toFixed(2)}M</td>
                            </tr>
                          ))}
                          <tr className="font-bold bg-primary/5 border-t-2 border-primary/20">
                            <td className="py-4 px-4 text-lg">TOTAL</td>
                            <td className="py-4 px-4 text-lg">{totalUnits}</td>
                            <td className="py-4 px-4 text-right font-mono text-lg">${(avgPrice / 1000).toFixed(0)}k avg</td>
                            <td className="py-4 px-4 text-right font-mono text-primary text-lg">${totalPlatformFees.toFixed(2)}M</td>
                            <td className="py-4 px-4 text-right font-mono text-primary text-lg">${totalGrossSales.toFixed(2)}M</td>
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

            {/* Tech & Legal Tab (merged Tech DD + Legal Structuring) */}
            <TabsContent value="tech-legal">
              <div className="space-y-12">
                {/* Tech Due Diligence Section */}
                <div>
                  <div className="text-center mb-8">
                    <Badge variant="outline" className="mb-4">
                      Technical Architecture
                    </Badge>
                    <h2 className="text-4xl font-bold mb-4">
                      Tech Due Diligence
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                      Platform assessment and technical architecture review
                    </p>
                  </div>
                  <TechDueDiligence />
                </div>

                {/* Divider */}
                <div className="relative py-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <div className="bg-background px-4">
                      <Badge variant="outline">Legal Framework</Badge>
                    </div>
                  </div>
                </div>

                {/* Legal & Regulatory Proofing - Comprehensive Country-by-Country Analysis */}
                <LegalRegulatoryProofing />
              </div>
            </TabsContent>

            <TabsContent value="budget-breakdown" className="space-y-8">
              {/* New Header - Investor Protection Focused */}
              <div className="text-center space-y-4 mb-8">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  $1.9M Seed Raise: Floor & Ceiling Strategy
                </h2>
                <h3 className="text-2xl text-muted-foreground">
                  79% Hard Assets (Floor Protection) + 21% Tech & Legal (Upside)
                </h3>
                <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
                  Venture Staking structure: $5M BTC collateral → $1.9M USDC → 15% equity + profit share
                </p>
              </div>


              {/* Three-Phase Funnel Overview */}
              <Card className="p-6 bg-gradient-card border-none shadow-luxury">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Use of Funds — $1.9M Total</h3>
                  <p className="text-sm text-muted-foreground">Floor (Hard Assets) + Ceiling (Tech/Legal) investor protection structure</p>
                </div>

                {/* Funnel Visual */}
                <div className="space-y-4 max-w-4xl mx-auto">
                  {/* Hard Assets - Floor */}
                  <Card className="p-5 bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                        <h4 className="text-xl font-bold text-green-600">Hard Assets — "Floor" Protection</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">$1.50M (79%)</div>
                        <div className="text-sm text-green-600 font-medium">Downside Protection</div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium mb-2">Deployment Focus:</div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Land acquisition (Peru coastal plots)</li>
                          <li>• Construction (15 Genesis units)</li>
                          <li>• Debt-free real estate backing</li>
                        </ul>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2">Investor Confidence:</div>
                        <ul className="text-sm text-green-600 space-y-1">
                          <li>✅ Tangible asset collateral</li>
                          <li>✅ Real estate appreciation potential</li>
                          <li>✅ Liquidation value protection</li>
                        </ul>
                      </div>
                    </div>
                  </Card>

                  {/* Tech & Legal - Ceiling */}
                  <Card className="p-5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                        <h4 className="text-xl font-bold text-blue-600">Tech & Legal — "Ceiling" Upside</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">$400K (21%)</div>
                        <div className="text-sm text-blue-600 font-medium">Venture Upside</div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium mb-2">Deployment Focus:</div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Multi-jurisdiction SPV structures</li>
                          <li>• Protocol engineering (OCCR, NFTs)</li>
                          <li>• Legal rails (Title Retention, SAM)</li>
                        </ul>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2">Value Creation:</div>
                        <ul className="text-sm text-blue-600 space-y-1">
                          <li>✅ Infinite scalability via software</li>
                          <li>✅ 20x fintech valuation multiple</li>
                          <li>✅ Global credit data licensing</li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                </div>
              </Card>


              {/* Year-based Sub-Tabs for Complete 36-Month Timeline */}
              <Card className="p-8 bg-gradient-card border-none shadow-luxury">
                <Tabs defaultValue="overall-funds" className="w-full">
                  <TabsList className="grid w-full grid-cols-1 mb-8">
                    <TabsTrigger value="overall-funds">Use of Funds Breakdown</TabsTrigger>
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
                              Core Expenditure Breakdown — $1.9M Total
                            </h3>
                            <p className="text-muted-foreground">Floor/Ceiling Structure: 79% Hard Assets + 21% Tech/Legal</p>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/40 to-transparent"></div>
                      </div>

                      {/* Core Expenditure Categories */}
                      <div className="grid gap-6">
                        {/* 1. Hard Assets (Floor) */}
                        <Card className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xl font-bold text-green-700 dark:text-green-400">1. Hard Assets — "Floor" (79%)</h4>
                              <span className="text-2xl font-bold text-green-600">$1.50M</span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div className="flex justify-between">
                                <span>$900K →</span>
                                <span>Land acquisition (Peru coastal plots, 15 units)</span>
                              </div>
                              <div className="flex justify-between">
                                <span>$600K →</span>
                                <span>Construction (Genesis flip, $75K build cost x 8 initial units)</span>
                              </div>
                            </div>
                            <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                              <div className="text-sm font-medium text-green-600">Investor Protection:</div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Debt-free real estate backing the loan. If project fails, investors own tangible coastal land + partial construction with liquidation value.
                              </p>
                            </div>
                          </div>
                        </Card>

                        {/* 2. Tech & Legal (Ceiling) */}
                        <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/5 border border-blue-500/20">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xl font-bold text-blue-700 dark:text-blue-400">2. Tech & Legal — "Ceiling" (21%)</h4>
                              <span className="text-2xl font-bold text-blue-600">$400K</span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="font-medium mb-2">Legal & Compliance ($200K):</div>
                                <ul className="space-y-1 text-muted-foreground">
                                  <li>• $80K → Multi-jurisdiction SPV setup (Peru, Nevis, Mexico)</li>
                                  <li>• $60K → Title Retention legal structures</li>
                                  <li>• $40K → Banking, compliance, insurance</li>
                                  <li>• $20K → Notary, filings, closings</li>
                                </ul>
                              </div>
                              <div>
                                <div className="font-medium mb-2">Protocol Engineering ($200K):</div>
                                <ul className="space-y-1 text-muted-foreground">
                                  <li>• $100K → OCCR credit score engine</li>
                                  <li>• $50K → Title-Wrapper NFT development</li>
                                  <li>• $30K → SAM smart contracts</li>
                                  <li>• $20K → Platform integrations (KYC, payments)</li>
                                </ul>
                              </div>
                            </div>
                            <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                              <div className="text-sm font-medium text-blue-600">Venture Upside:</div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Software rails enable infinite scaling without additional capital. 20x fintech multiple on protocol revenue vs real estate comps.
                              </p>
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
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex justify-between">
                              <span>Hard Assets (Floor):</span>
                              <span className="font-bold text-green-600">$1.50M</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tech & Legal (Ceiling):</span>
                              <span className="font-bold text-blue-600">$400K</span>
                            </div>
                          </div>
                          <div className="border-t pt-4">
                            <div className="flex justify-between text-xl">
                              <span className="font-bold">Total Seed Raise:</span>
                              <span className="font-bold text-[hsl(var(--gold))]">$1.9M</span>
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Why This Structure Wins */}
                      <Card className="p-8 bg-gradient-to-r from-emerald-500/10 to-green-500/5 border border-emerald-500/20">
                        <div className="space-y-6">
                          <div className="flex items-center space-x-3 mb-6">
                            <span className="text-2xl">💡</span>
                            <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">Why Floor/Ceiling Structure Works</h3>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-sm">✓</span>
                              </div>
                              <div>
                                <span className="font-semibold">Zero Risk Capital:</span> Investors pledge $5M BTC (never sold, no tax event) to borrow $1.9M USDC at 35% LTV. Full BTC returned at loan repayment.
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-sm">✓</span>
                              </div>
                              <div>
                                <span className="font-semibold">Downside Protected:</span> 79% allocation to hard assets means investors own debt-free coastal land even if protocol fails.
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-sm">✓</span>
                              </div>
                              <div>
                                <span className="font-semibold">Upside Unlimited:</span> 21% to tech creates software rails for infinite scaling, justifying 20x fintech valuation multiple vs real estate comps.
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-sm">✓</span>
                              </div>
                              <div>
                                <span className="font-semibold">Dual Returns:</span> 15% equity in OpCo (tech) + 15% profit share from PropCo (real estate), addressing both base case and bull case outcomes.
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
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
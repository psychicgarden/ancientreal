import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
import VCExitScenarios from "@/components/VCExitScenarios";

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
  const locations = [{
    name: "Pisac, Peru",
    flag: "🇵🇪",
    structure: "Peruvian SAC + Reserva de Dominio"
  }, {
    name: "Bahia, Brazil",
    flag: "🇧🇷",
    structure: "Brazilian LTDA + Alienação Fiduciária"
  }, {
    name: "Corfu, Greece",
    flag: "🇬🇷",
    structure: "Greek IKE SPV"
  }, {
    name: "Koh Phangan, Thailand",
    flag: "🇹🇭",
    structure: "30+30 Leasehold"
  }, {
    name: "Mazunte, Mexico",
    flag: "🇲🇽",
    structure: "Mexican SAPI + Fideicomiso"
  }, {
    name: "Antalya, Turkey",
    flag: "🇹🇷",
    structure: "Turkish SPV"
  }];
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
      grossSales: grossSalesM,
      // 100% from FinCo at closing
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
flywheel.flips.forEach(flip => {
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
const totalAppreciationForSAM = finalValueForSAM - totalUnits * avgPrice;
const appreciationY15 = totalAppreciationForSAM * 0.15 / 1_000_000; // 15% SAM share

// Revenue over 15 years (Platform Fees + Interest + Appreciation)
const totalDynamicRevenue = platformFeesY0 + totalMortgageInterest / 1_000_000 + appreciationY15; // Should be ~$24.50M

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
            <Button variant="outline" size="icon" className="h-12 w-12 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 shadow-lg">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open navigation menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-sm border-border/50 shadow-xl" sideOffset={8}>
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
              <span className="block text-white drop-shadow-2xl">The RWA Mortgage Rail</span>
              <span className="block bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl">for the Borderless Economy</span>
            </h1>
          </div>
          
          {/* Value Proposition - Positioned Lower */}
          <div className="max-w-3xl mx-auto mt-16">
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 px-6 py-4 shadow-2xl">
              <p className="text-base lg:text-lg font-light leading-relaxed text-white/90">
                <span className="font-semibold text-orange-400">50M nomads</span> burn <span className="font-semibold text-red-400">$900B/year</span> on dead rent. We convert that into <span className="font-semibold text-emerald-400">fractional, on-chain deeds</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AWS Pitch Section - The 30-Second Elevator Pitch */}
      <AWSPitch />

      {/* Market Failure Section */}
      <MarketFailure />

      {/* Traction Trilogy Section */}
      <TractionTrilogy />

      {/* VC Exit Scenarios - What's In It For Investors */}
      <VCExitScenarios />

      {/* Unfair Unit Economics Section */}
      <UnfairUnitEconomics />

      {/* Kill Switch Risk Management Section */}
      <KillSwitch />

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
              Beyond the Headlines
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              You've Seen the What. Want the How?
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              Due diligence materials, technical architecture, and competitor analysis below.
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
                          {flywheel.flips.map((flip, idx) => <tr key={idx} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                              <td className="py-4 px-4 font-semibold">{flip.flip}</td>
                              <td className="py-4 px-4">{flip.units}</td>
                              <td className="py-4 px-4 text-right font-mono">${(flip.grossSales / flip.units / 1000).toFixed(0)}k</td>
                              <td className="py-4 px-4 text-right font-mono text-primary">${(flip.platformFees / 1000).toFixed(1)}k</td>
                              <td className="py-4 px-4 text-right font-mono font-semibold">${(flip.grossSales / 1000000).toFixed(2)}M</td>
                            </tr>)}
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
                            <div className="text-sm">10,000+ homes financed across 6+ countries</div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="text-sm">$225M annual protocol revenue</div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="text-sm">OCCR data licensing dominates revenue</div>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-border/30">
                          <div className="text-sm font-medium mb-2">Key Metrics</div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div>• $1.5B+ GMV financed</div>
                            <div>• 20× fintech valuation multiple</div>
                            <div>• Global credit bureau status</div>
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
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Partner Units</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Year-10 Revenue</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Multiple</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Company EV</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Your 15%</th>
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
                          <div className="font-medium">5,000 units</div>
                        </td>
                        <td className="text-center py-4 px-4 font-medium">$112M</td>
                        <td className="text-center py-4 px-4 font-medium">15×</td>
                        <td className="text-center py-4 px-4 font-bold text-foreground">$1.7B</td>
                        <td className="text-center py-4 px-4 font-bold text-primary">$255M</td>
                      </tr>
                      <tr className="border-b border-border/20 bg-primary/5">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🟢</span>
                            <div>
                              <div className="font-medium text-primary">Base</div>
                              <div className="text-sm text-muted-foreground italic">(roadmap hit)</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="font-medium">10,000 units</div>
                        </td>
                        <td className="text-center py-4 px-4 font-medium">$225M</td>
                        <td className="text-center py-4 px-4 font-medium">20×</td>
                        <td className="text-center py-4 px-4 font-bold text-primary">$4.5B</td>
                        <td className="text-center py-4 px-4 font-bold text-primary">$675M</td>
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
                          <div className="font-medium">15,000 units</div>
                        </td>
                        <td className="text-center py-4 px-4 font-medium">$338M</td>
                        <td className="text-center py-4 px-4 font-medium">20×</td>
                        <td className="text-center py-4 px-4 font-bold text-foreground">$6.8B</td>
                        <td className="text-center py-4 px-4 font-bold text-primary">$1.0B</td>
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
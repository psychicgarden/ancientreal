import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowRight, TrendingUp, MapPin, DollarSign, Building, Globe, Shield, Code, Target, Rocket, Building2, BarChart3, Zap, Network, Menu, Home, Users, Briefcase, CreditCard, Plane, Code2, FileText, Settings, Calendar, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart, PieChart, Pie, Cell } from "recharts";
import SectionHeader from "@/components/SectionHeader";
import TechDueDiligence from "@/components/TechDueDiligence";
import TenYearProjection from "@/components/TenYearProjection";
import ReturnProfile from "@/components/ReturnProfile";
import SixFlipRoadmap from "@/components/SixFlipRoadmap";
import StrategyRoadmap from "@/components/StrategyRoadmap";
import SeedFundedRoadmap from "@/components/SeedFundedRoadmap";
import InstitutionalCapitalTimeline from "@/components/InstitutionalCapitalTimeline";
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
import CapitalStackExplainer from "@/components/CapitalStackExplainer";
import VentureStakingExplainer from "@/components/VentureStakingExplainer";
import ModelAssumptions from "@/components/ModelAssumptions";
import PhaseEvolution from "@/components/PhaseEvolution";

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

// SEED-FUNDED MODEL: 32 units across 2 flips (Peru + Brazil)
const seedFundedUnits = 32; // 15 Peru + 17 Brazil
const seedGrossSales = 4.49; // $2.03M Peru + $2.47M Brazil
const seedPlatformFees = 0.135; // 3% of $4.49M
const seedAvgPrice = 140000; // ($135K + $145K) / 2

// Seed-phase mortgage calculations (only 2 flips)
// 80% of units financed = ~26 mortgages
const seedFinancedUnits = Math.floor(seedFundedUnits * 0.80); // 26 mortgages
const seedLoanPerUnit = seedAvgPrice * 0.80; // 80% LTV = $112K average loan
const seedTotalLoanBook = seedFinancedUnits * seedLoanPerUnit; // ~$2.91M mortgage book

// Calculate NIM: 3% spread on mortgage book over 15 years
// Using simplified average balance method (mortgages amortize, so average ~50% of original over life)
const avgOutstandingBalance = seedTotalLoanBook * 0.55; // Average balance over 15 years
const seedAnnualNIM = avgOutstandingBalance * 0.03; // 3% annual spread
const seedTotalNIM = seedAnnualNIM * 15 / 1_000_000; // Total NIM over 15 years in millions (~$720K)

// Seed-phase totals
const totalPlatformFees = seedPlatformFees; // $135K
const totalNIM = seedTotalNIM; // ~$0.72M
const totalDynamicRevenue = totalPlatformFees + totalNIM; // ~$0.86M

// Legacy variables for compatibility
const totalUnits = seedFundedUnits;
const totalGrossSales = seedGrossSales;
const avgPrice = seedAvgPrice;
const annualNIM = seedAnnualNIM / 1_000_000;
const platformFeesY0 = seedPlatformFees;

// Calculate 15-year cash flow waterfall (Platform Fees + NIM only)
const generateCashFlowData = () => {
  const data = [];
  let cumulativeRevenue = 0;
  for (let year = 0; year <= 15; year++) {
    let platformFees = 0;
    let nim = 0;
    if (year === 0) {
      platformFees = platformFeesY0;
    }
    if (year >= 1 && year <= 15) {
      nim = annualNIM;
    }
    const yearlyRevenue = platformFees + nim;
    cumulativeRevenue += yearlyRevenue;

    // Calculate IRR at this point (simplified)
    const yearsElapsed = year || 0.5;
    const irr = ((cumulativeRevenue / 1.9) ** (1 / yearsElapsed) - 1) * 100;
    data.push({
      year: year === 0 ? "Y0" : `Y${year}`,
      platformFees: platformFees,
      nim: nim,
      total: yearlyRevenue,
      cumulative: cumulativeRevenue,
      irr: Math.min(irr, 30) // Cap at 30% for visualization
    });
  }
  return data;
};
const cashFlowData = generateCashFlowData();
const revenueStreams = [{
  title: "Platform Fees",
  amount: `$${(seedPlatformFees * 1000).toFixed(0)}K`,
  description: "3% fee on seed-funded sales (32 units)",
  timeline: "Immediate capture (Years 1-2)",
  icon: "🏛"
}, {
  title: "Net Interest Margin (3% NIM)",
  amount: `$${(totalNIM * 1000).toFixed(0)}K`,
  description: "3% spread on $2.9M mortgage book",
  timeline: "15-year recurring stream",
  icon: "💰"
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

      {/* Strategy Roadmap - Phased Growth Plan */}
      <StrategyRoadmap />

      {/* Phase Evolution - From Engine to Ecosystem */}
      <PhaseEvolution />

      {/* Traction Trilogy Section */}
      <TractionTrilogy />

      {/* VC Exit Scenarios - What's In It For Investors */}
      <VCExitScenarios />

      {/* Return Profile for Investors - Moved to tabs for deeper dive */}
      {/* <ReturnProfile /> */}

      {/* Business Model Content with Tabs */}
      <section className="px-4 bg-background py-[50px]">
        <div className="max-w-7xl mx-auto">
          

          {/* CTA Section Before Deep Dive */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 border-2 mb-16">
            
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
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 lg:w-fit lg:mx-auto mb-8 gap-1">
              <TabsTrigger value="competition" className="text-xs lg:text-sm">Competition</TabsTrigger>
              <TabsTrigger value="unit-economics" className="text-xs lg:text-sm">Unit Economics</TabsTrigger>
              <TabsTrigger value="risk-management" className="text-xs lg:text-sm">Risk Management</TabsTrigger>
              <TabsTrigger value="financial-model" className="text-xs lg:text-sm">Financial Model</TabsTrigger>
              <TabsTrigger value="two-pocket-model" className="text-xs lg:text-sm">Two-Pocket</TabsTrigger>
              <TabsTrigger value="revenue-development" className="text-xs lg:text-sm">Revenue</TabsTrigger>
              <TabsTrigger value="legal" className="text-xs lg:text-sm">Legal</TabsTrigger>
              <TabsTrigger value="tech" className="text-xs lg:text-sm">Tech</TabsTrigger>
            </TabsList>

            {/* Competition Tab - Moved from main scroll */}
            <TabsContent value="competition">
              <CompetitiveLandscape />
            </TabsContent>

            {/* Unit Economics Tab - Moved from main scroll */}
            <TabsContent value="unit-economics">
              <UnfairUnitEconomics />
            </TabsContent>

            {/* Risk Management Tab - Moved from main scroll */}
            <TabsContent value="risk-management">
              <KillSwitch />
            </TabsContent>

            {/* Financial Model Tab - Combined 10-Year + Capital Stack */}
            <TabsContent value="financial-model">
              <div className="space-y-12">
                <TenYearProjection />
                <CapitalStackExplainer />
              </div>
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

            <TabsContent value="revenue-development">

              {/* Profit Recycling Flywheel - 2 Flips Only */}
              <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 mb-12 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <RefreshCw className="h-5 w-5 text-green-500" />
                    <span className="font-bold text-green-500">Seed Phase Capital Recycling</span>
                    <Badge variant="outline" className="ml-2 border-green-500/50 text-green-400">2 Flips</Badge>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-base px-4 py-2">$1.9M Seed</Badge>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-base px-4 py-2">Flip 1 Peru: +$0.9M</Badge>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-base px-4 py-2">Flip 2 Brazil: +$1.19M</Badge>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    <Badge className="bg-emerald-500/30 text-emerald-300 border-emerald-500/50 font-bold text-base px-4 py-2">$4.0M Treasury</Badge>
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    $1.9M Seed funds Flip 1. <span className="text-green-500 font-semibold">Recycled Profits</span> fund Flip 2. <span className="text-primary font-semibold">$4M Treasury</span> enables platform pivot.
                  </p>
                </CardContent>
              </Card>

              {/* Stats Overview - 2 Flips Only */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
                    <div className="text-2xl font-bold text-foreground">$1.9M</div>
                    <div className="text-sm text-muted-foreground">Seed Capital</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6 text-center">
                    <Building className="w-8 h-8 text-primary mx-auto mb-3" />
                    <div className="text-2xl font-bold text-foreground">32</div>
                    <div className="text-sm text-muted-foreground">Seed Phase Units</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6 text-center">
                    <Target className="w-8 h-8 text-primary mx-auto mb-3" />
                    <div className="text-2xl font-bold text-foreground">2</div>
                    <div className="text-sm text-muted-foreground">Countries (Peru + Brazil)</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6 text-center">
                    <DollarSign className="w-8 h-8 text-primary mx-auto mb-3" />
                    <div className="text-2xl font-bold text-foreground">$4.0M</div>
                    <div className="text-sm text-muted-foreground">Final Treasury</div>
                  </CardContent>
                </Card>
              </div>

              {/* Flywheel Flow - 2 Flips Only */}
              <div>
                <div className="text-center mb-16">
                  <Badge variant="outline" className="mb-4 border-emerald-500/50 text-emerald-400">
                    Seed Phase (2 Flips)
                  </Badge>
                  <h2 className="text-4xl font-bold mb-4">The Development Flywheel</h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    DevCo receives 100% gross sales from FinCo at closing. Capital compounds from $1.9M → $4M across 2 flips.
                  </p>
                </div>

                <div className="space-y-8">
                  {flywheelData.slice(0, 2).map((flip, index) => <Card key={flip.flip} className="bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden">
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
              </div>

              {/* Clean Revenue Model Showcase */}
              <div className="mb-16 mt-24">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">Seed Phase Revenue Model</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    32 units generate ~$860K protocol revenue. Platform scaling unlocks millions more.
                  </p>
                </div>

                {/* VC-Friendly NIM Explanation */}
                <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/30 border-2 mb-12">
                  <CardContent className="p-10">
                    <div className="text-center mb-8">
                      <Badge variant="outline" className="mb-4 border-emerald-500/50 text-emerald-400 text-lg px-4 py-1">
                        The Ancient Mortgage Spread Model
                      </Badge>
                      <h3 className="text-3xl font-bold mb-2">Crystal Clear Economics for VCs</h3>
                    </div>
                    
                    <div className="max-w-3xl mx-auto">
                      <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-background/50 rounded-xl p-6 text-center border border-border/50">
                          <div className="text-4xl mb-3">🏦</div>
                          <div className="text-sm text-muted-foreground uppercase tracking-wide mb-2">DeFi Stakers Provide</div>
                          <div className="text-3xl font-bold text-emerald-500">7% Yield</div>
                          <div className="text-sm text-muted-foreground mt-2">They fund the mortgage pool</div>
                        </div>
                        
                        <div className="bg-background/50 rounded-xl p-6 text-center border border-border/50">
                          <div className="text-4xl mb-3">🏠</div>
                          <div className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Buyers Pay</div>
                          <div className="text-3xl font-bold text-primary">10% APR</div>
                          <div className="text-sm text-muted-foreground mt-2">Fixed 15-year mortgage</div>
                        </div>
                        
                        <div className="bg-emerald-500/10 rounded-xl p-6 text-center border-2 border-emerald-500/30">
                          <div className="text-4xl mb-3">💰</div>
                          <div className="text-sm text-emerald-400 uppercase tracking-wide mb-2">Ancient Keeps</div>
                          <div className="text-3xl font-bold text-emerald-400">3% NIM</div>
                          <div className="text-sm text-emerald-400/80 mt-2">Pure profit spread</div>
                        </div>
                      </div>
                      
                      <div className="bg-background/30 rounded-lg p-4 text-center">
                        <p className="text-lg">
                          <span className="text-muted-foreground">No appreciation sharing.</span>
                          <span className="font-semibold text-foreground ml-2">Buyers keep 100% of their home value growth.</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Revenue Breakdown Cards - 2 Streams */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardContent className="p-8">
                      <div className="text-center space-y-4">
                        <div className="text-5xl">🏛</div>
                        <div>
                          <div className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Platform Fees</div>
                          <div className="text-4xl font-bold text-primary mb-3">${(totalPlatformFees * 1000).toFixed(0)}K</div>
                          <p className="text-sm text-muted-foreground">3% fee on 32 seed-phase units</p>
                        </div>
                        <div className="bg-background/50 rounded-lg p-3 text-sm">
                          <div className="text-muted-foreground">Captured immediately at closing (Years 1-2)</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
                    <CardContent className="p-8">
                      <div className="text-center space-y-4">
                        <div className="text-5xl">💰</div>
                        <div>
                          <div className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Net Interest Margin (3% NIM)</div>
                          <div className="text-4xl font-bold text-emerald-500 mb-3">${(totalNIM * 1000).toFixed(0)}K</div>
                          <p className="text-sm text-muted-foreground">3% spread on $2.9M mortgage book</p>
                        </div>
                        <div className="bg-background/50 rounded-lg p-3 text-sm">
                          <div className="text-muted-foreground">~26 mortgages over 15 years</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Total Revenue Card */}
                <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30 border-2 mb-12">
                  <CardContent className="p-10">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground uppercase tracking-widest mb-3">Seed Phase 15-Year Protocol Revenue</div>
                      <div className="text-6xl font-bold text-primary mb-4">${(totalDynamicRevenue * 1000).toFixed(0)}K</div>
                      <div className="flex items-center justify-center gap-8 text-sm flex-wrap">
                        <div>
                          <span className="text-muted-foreground">Platform Fees:</span>
                          <span className="font-bold ml-2">${(totalPlatformFees * 1000).toFixed(0)}K</span>
                        </div>
                        <div className="h-4 w-px bg-border hidden md:block"></div>
                        <div>
                          <span className="text-muted-foreground">NIM (3% spread):</span>
                          <span className="font-bold ml-2">${(totalNIM * 1000).toFixed(0)}K</span>
                        </div>
                        <div className="h-4 w-px bg-border hidden md:block"></div>
                        <div>
                          <span className="text-muted-foreground">32 Units:</span>
                          <span className="font-bold ml-2">2 Countries (Peru + Brazil)</span>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-muted-foreground">
                        Note: This is seed-phase only. Platform scaling adds developer partnerships revenue.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

                {/* Seed-Funded Pricing Strategy - 2 Flips Only */}
                <Card className="bg-card/80 backdrop-blur-sm border-border/50 mb-8">
                  <CardContent className="p-8">
                    <div className="mb-8">
                      <div className="inline-flex items-center space-x-2 mb-4">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary"></div>
                        <div className="text-sm font-medium text-primary uppercase tracking-wider">Seed Phase</div>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary"></div>
                      </div>
                      <h3 className="text-3xl font-bold mb-3">Seed-Funded Development</h3>
                      <p className="text-lg text-muted-foreground">
                        $1.9M seed capital funds 2 flips: Peru ($135K) + Brazil ($145K)
                      </p>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-border">
                            <th className="text-left py-4 px-4 font-semibold">Flip</th>
                            <th className="text-left py-4 px-4 font-semibold">Location</th>
                            <th className="text-left py-4 px-4 font-semibold">Units</th>
                            <th className="text-right py-4 px-4 font-semibold">Price</th>
                            <th className="text-right py-4 px-4 font-semibold">Platform Fee (3%)</th>
                            <th className="text-right py-4 px-4 font-semibold">Gross Sales</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                            <td className="py-4 px-4 font-semibold">Flip 1</td>
                            <td className="py-4 px-4">🇵🇪 Pisac, Peru</td>
                            <td className="py-4 px-4">15</td>
                            <td className="py-4 px-4 text-right font-mono">$135k</td>
                            <td className="py-4 px-4 text-right font-mono text-primary">$60.8k</td>
                            <td className="py-4 px-4 text-right font-mono font-semibold">$2.03M</td>
                          </tr>
                          <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                            <td className="py-4 px-4 font-semibold">Flip 2</td>
                            <td className="py-4 px-4">🇧🇷 Bahia, Brazil</td>
                            <td className="py-4 px-4">17</td>
                            <td className="py-4 px-4 text-right font-mono">$145k</td>
                            <td className="py-4 px-4 text-right font-mono text-primary">$73.9k</td>
                            <td className="py-4 px-4 text-right font-mono font-semibold">$2.47M</td>
                          </tr>
                          <tr className="font-bold bg-primary/5 border-t-2 border-primary/20">
                            <td className="py-4 px-4 text-lg" colSpan={2}>SEED PHASE TOTAL</td>
                            <td className="py-4 px-4 text-lg">32</td>
                            <td className="py-4 px-4 text-right font-mono text-lg">$140k avg</td>
                            <td className="py-4 px-4 text-right font-mono text-primary text-lg">$134.7k</td>
                            <td className="py-4 px-4 text-right font-mono text-primary text-lg">$4.49M</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>


              {/* Sensitivity Dashboard */}
              <div className="mb-16">
                <SensitivityDashboard />
              </div>

              {/* Mortgage-Only Dashboard */}
              <div className="mb-16">
                <MortgageOnlySensitivityDashboard />
              </div>

              {/* Strategic Recommendations */}
              <div className="mb-16">
                <StrategicRecommendations />
              </div>



            </TabsContent>


            {/* Legal Tab - The Defensible Moat */}
            <TabsContent value="legal">
              <LegalRegulatoryProofing />
            </TabsContent>

            {/* Tech Tab */}
            <TabsContent value="tech">
              <TechDueDiligence />
            </TabsContent>

          </Tabs>
        </div>
      </section>

      {/* Investor Return Scenarios - Removed as VCExitScenarios covers this */}


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
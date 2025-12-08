import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowRight, TrendingUp, DollarSign, Building, Globe, Menu, Home, Users, Briefcase, CreditCard, Plane, Code2, FileText, Settings, BarChart3, Rocket, Scale, Cpu, RefreshCw, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Core section components
import AWSPitch from "@/components/AWSPitch";
import MarketFailure from "@/components/MarketFailure";
import TractionTrilogy from "@/components/TractionTrilogy";
import TheDealSection from "@/components/TheDealSection";
import VCExitScenarios from "@/components/VCExitScenarios";
import UnfairUnitEconomics from "@/components/UnfairUnitEconomics";
import KillSwitch from "@/components/KillSwitch";
import TenYearProjection from "@/components/TenYearProjection";
import TeamSection from "@/components/TeamSection";

// Tab content components
import CompetitiveLandscape from "@/components/CompetitiveLandscape";
import TwoProductMortgage from "@/components/TwoProductMortgage";
import SeedFundedRoadmap from "@/components/SeedFundedRoadmap";
import DevCoFinCoModel from "@/components/DevCoFinCoModel";
import FinCoLiquidityPool from "@/components/FinCoLiquidityPool";
import CashFirstStrategy from "@/components/CashFirstStrategy";
import TechDueDiligence from "@/components/TechDueDiligence";
import { LegalRegulatoryProofing } from "@/components/LegalRegulatoryProofing";
import ModelAssumptions from "@/components/ModelAssumptions";
import SixFlipRoadmap from "@/components/SixFlipRoadmap";
import PerfectStorm from "@/components/PerfectStorm";

// Import property images
import ecoSmartCity from "@/assets/eco-smart-city.jpg";

const BusinessModel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Navigation Menu */}
      <div className="fixed top-6 right-6 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-11 w-11 bg-black/40 backdrop-blur-md border-white/20 hover:bg-black/60 shadow-xl">
              <Menu className="h-5 w-5 text-white" />
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
            <DropdownMenuItem onClick={() => navigate("/pitch-deck")} className="cursor-pointer">
              <Rocket className="mr-2 h-4 w-4" />
              <span>Pitch Deck</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* SECTION 1: Hero - Tightened & Refined */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={ecoSmartCity} alt="Eco Smart City Vision" className="w-full h-full object-cover filter brightness-[0.5] contrast-[1.15] saturate-[1.1]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        </div>
        
        {/* Top Left Branding - Tightened */}
        <div className="absolute top-8 left-8 lg:top-10 lg:left-10 z-20">
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/80 font-medium mb-1">
            Ancient Protocol
          </p>
          <p className="text-sm tracking-[0.05em] text-amber-300/90 italic">
            The Stripe for Global Mortgages
          </p>
        </div>
        
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
          {/* Main Headline - Two Lines, Tighter */}
          <h1 className="font-playfair leading-[1.08] mb-8">
            <span className="block text-4xl sm:text-5xl lg:text-6xl font-light tracking-[0.01em] text-white mb-3">
              The World's First
            </span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl font-medium italic tracking-[-0.02em] text-amber-100">
              Borderless Mortgage Network
            </span>
          </h1>
          
          {/* Subheadline - Condensed */}
          <p className="text-lg lg:text-xl text-white/75 leading-relaxed max-w-2xl mx-auto mb-10 font-light">
            80 million digital nomads burn <span className="text-amber-300 font-medium">$900B+</span> annually on dead rent.
            <br className="hidden sm:block" />
            <span className="text-white/90 font-normal">We convert that into liquid, on-chain homeownership.</span>
          </p>
          
          {/* Emotional Line */}
          <p className="text-base lg:text-lg italic text-amber-200/80 mb-10 font-light">
            The financial rails banks never could build.
          </p>
          
          {/* CTAs - Tighter */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-base px-8 py-5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-semibold shadow-2xl border-0" onClick={() => navigate("/pitch-deck")}>
              <Rocket className="mr-2 h-5 w-5" />
              View Pitch Deck
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 py-5 border-amber-300/40 text-amber-100 hover:bg-amber-300/10" onClick={() => navigate("/investor-portal")}>
              <Briefcase className="mr-2 h-5 w-5" />
              Investment Access
            </Button>
          </div>
          
          {/* Quiet Proof - More Visible */}
          <p className="text-base text-white/60 tracking-[0.08em] font-light">
            12 homes live  •  19% realized returns  •  Revenue-generating assets
          </p>
        </div>
      </section>

      {/* SECTION 2: Traction First (Proof) */}
      <TractionTrilogy />

      {/* SECTION 3: Market Failure - Why This Matters */}
      <MarketFailure />

      {/* SECTION 4: AWS Pitch - Our Solution */}
      <AWSPitch />

      {/* SECTION 5: The Deal */}
      <TheDealSection />

      {/* SECTION 6: VC Exit Scenarios - What You Get */}
      <VCExitScenarios />

      {/* SECTION 7: Unit Economics + Kill Switch */}
      <div className="py-8">
        <UnfairUnitEconomics />
        <KillSwitch />
      </div>

      {/* SECTION 8: 10-Year Projection */}
      <TenYearProjection />

      {/* SECTION 9: Team */}
      <TeamSection />

      {/* CTA Section - Updated Copy */}
      <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-amber-500/50 text-amber-500">
            Ready to Invest?
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the Borderless Economy
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            $1.9M SAFE at $12M Cap — 15% equity in the world's first global mortgage protocol.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 bg-amber-500 hover:bg-amber-400 text-amber-950 font-semibold" onClick={() => navigate("/pitch-deck")}>
              <Rocket className="mr-2 h-5 w-5" />
              View Pitch Deck
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate("/investor-portal")}>
              <Briefcase className="mr-2 h-5 w-5" />
              Investor Portal
            </Button>
          </div>
        </div>
      </section>

      {/* Deep Dive Tabs - Due Diligence Section */}
      <section className="px-4 bg-muted/10 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Deep Dive Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary"></div>
              <Badge variant="outline" className="text-sm font-medium text-primary uppercase tracking-wider border-primary/50">
                Due Diligence
              </Badge>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary"></div>
            </div>
            <h2 className="text-3xl font-bold mb-2">Deep Dive Documentation</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive details for investors who want to explore specific areas.
            </p>
          </div>

          {/* Tabbed Content */}
          <Tabs defaultValue="competition" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 lg:w-fit lg:mx-auto mb-8 gap-1">
              <TabsTrigger value="competition" className="text-xs lg:text-sm">
                <Globe className="h-4 w-4 mr-1 hidden sm:inline" />
                Competition
              </TabsTrigger>
              <TabsTrigger value="mortgages" className="text-xs lg:text-sm">
                <Building className="h-4 w-4 mr-1 hidden sm:inline" />
                Mortgages
              </TabsTrigger>
              <TabsTrigger value="roadmap" className="text-xs lg:text-sm">
                <Target className="h-4 w-4 mr-1 hidden sm:inline" />
                Roadmap
              </TabsTrigger>
              <TabsTrigger value="model" className="text-xs lg:text-sm">
                <RefreshCw className="h-4 w-4 mr-1 hidden sm:inline" />
                Model
              </TabsTrigger>
              <TabsTrigger value="legal" className="text-xs lg:text-sm">
                <Scale className="h-4 w-4 mr-1 hidden sm:inline" />
                Legal
              </TabsTrigger>
              <TabsTrigger value="tech" className="text-xs lg:text-sm">
                <Cpu className="h-4 w-4 mr-1 hidden sm:inline" />
                Tech
              </TabsTrigger>
              <TabsTrigger value="market" className="text-xs lg:text-sm">
                <TrendingUp className="h-4 w-4 mr-1 hidden sm:inline" />
                Market
              </TabsTrigger>
            </TabsList>

            {/* Competition Tab */}
            <TabsContent value="competition">
              <CompetitiveLandscape />
            </TabsContent>

            {/* Mortgages Tab */}
            <TabsContent value="mortgages">
              <TwoProductMortgage />
            </TabsContent>

            {/* Roadmap Tab */}
            <TabsContent value="roadmap">
              <div className="space-y-8">
                <SeedFundedRoadmap />
                <SixFlipRoadmap />
              </div>
            </TabsContent>

            {/* Model Tab - Two-Pocket, FinCo, Cash Strategy */}
            <TabsContent value="model">
              <div className="space-y-8">
                <DevCoFinCoModel />
                <FinCoLiquidityPool />
                <CashFirstStrategy />
                <ModelAssumptions />
              </div>
            </TabsContent>

            {/* Legal Tab */}
            <TabsContent value="legal">
              <LegalRegulatoryProofing />
            </TabsContent>

            {/* Tech Tab */}
            <TabsContent value="tech">
              <TechDueDiligence />
            </TabsContent>

            {/* Market Tab - PerfectStorm moved here */}
            <TabsContent value="market">
              <PerfectStorm />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-background border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Ancient Protocol. Building the infrastructure for borderless real estate ownership.</p>
        </div>
      </footer>
    </div>
  );
};

export default BusinessModel;
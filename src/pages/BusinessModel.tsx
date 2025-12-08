import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowRight, Menu, Home, Users, Briefcase, CreditCard, Plane, Code2, FileText, BarChart3, Rocket, Scale, Cpu, RefreshCw, Target, TrendingUp, Globe, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";

// New deck-aligned components
import TheProblem from "@/components/TheProblem";
import WhatAncientDoes from "@/components/WhatAncientDoes";
import DataLaboratory from "@/components/DataLaboratory";
import The32HomeDataset from "@/components/The32HomeDataset";
import RepaymentDataFlow from "@/components/RepaymentDataFlow";
import SimpleBusinessModel from "@/components/SimpleBusinessModel";
import CompetitorMoat from "@/components/CompetitorMoat";
import ScalingPath from "@/components/ScalingPath";
import TheAsk from "@/components/TheAsk";
import TeamSection from "@/components/TeamSection";

// Deep dive tab components
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
    <div className="min-h-screen bg-background">
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

      {/* SECTION 1: Hero - Deck Slide 1 */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={ecoSmartCity} alt="Ancient Property" className="w-full h-full object-cover filter brightness-[0.45] contrast-[1.1]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        </div>
        
        {/* Top Left Branding */}
        <div className="absolute top-8 left-8 lg:top-10 lg:left-10 z-20">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            ANCIENT
          </h1>
        </div>
        
        <div className="relative z-10 w-full max-w-3xl mx-auto px-6 text-center">
          {/* Main Tagline */}
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 leading-relaxed mb-8 font-light">
            Mortgage infrastructure for a borderless world.
          </p>
          
          {/* Value Prop */}
          <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-2xl mx-auto mb-12">
            Digital nomads can finally buy homes in Latin America and begin building an onchain credit score.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="text-base px-8 py-5 bg-white text-black hover:bg-white/90 font-semibold shadow-2xl" onClick={() => navigate("/pitch-deck")}>
              <Rocket className="mr-2 h-5 w-5" />
              View Pitch Deck
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 py-5 border-white/30 text-white hover:bg-white/10" onClick={() => navigate("/investor-portal")}>
              <Briefcase className="mr-2 h-5 w-5" />
              Investment Access
            </Button>
          </div>
          
          {/* Quiet Proof */}
          <p className="text-sm text-white/50 tracking-wide">
            12 homes live  •  19% realized returns  •  Revenue-generating assets
          </p>
        </div>
      </section>

      {/* SECTION 2: The Problem (Deck Slide 2) */}
      <TheProblem />

      {/* SECTION 3: What Ancient Does (Deck Slide 3) */}
      <WhatAncientDoes />

      {/* SECTION 4: Why Real Estate (Deck Slide 4) */}
      <DataLaboratory />

      {/* SECTION 5: The 32-Home Dataset (Deck Slide 5) */}
      <The32HomeDataset />

      {/* SECTION 6: What the Data Looks Like (Deck Slide 6) */}
      <RepaymentDataFlow />

      {/* SECTION 7: Business Model (Deck Slide 9) */}
      <SimpleBusinessModel />

      {/* SECTION 8: Competitor Moat (Deck Slide 10) */}
      <CompetitorMoat />

      {/* SECTION 9: Scaling Path (Deck Slide 12) */}
      <ScalingPath />

      {/* SECTION 10: Team (Deck Slide 13) */}
      <TeamSection />

      {/* SECTION 11: The Ask (Deck Slide 14) */}
      <TheAsk />

      {/* Closing CTA (Deck Slide 15) */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            ANCIENT
          </h2>
          <p className="text-xl text-muted-foreground mb-2">
            The first mortgage rails for people who live internationally.
          </p>
          <p className="text-2xl font-medium text-primary mb-8">
            Live anywhere. Own everywhere.
          </p>
          <p className="text-lg text-muted-foreground mb-10">
            Start building a global credit record today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" onClick={() => navigate("/pitch-deck")}>
              <Rocket className="mr-2 h-5 w-5" />
              View Pitch Deck
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate("/investor-portal")}>
              <Briefcase className="mr-2 h-5 w-5" />
              Contact Us
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

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowRight, Menu, Home, Users, Briefcase, CreditCard, Plane, Code2, FileText, BarChart3, Rocket, Scale, Cpu, RefreshCw, Target, TrendingUp, Globe, Building, DollarSign, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Core page components (cleaner old flow)
import PerfectStorm from "@/components/PerfectStorm";
import { DevelopmentFlywheel } from "@/components/DevelopmentFlywheel";
import VCExitScenarios from "@/components/VCExitScenarios";
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
import SimpleBusinessModel from "@/components/SimpleBusinessModel";
import ScalingPath from "@/components/ScalingPath";

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

      {/* HERO SECTION - Clean Original Style */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={ecoSmartCity} alt="Ancient Property" className="w-full h-full object-cover filter brightness-[0.35] contrast-[1.1]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/40" />
        </div>
        
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
          {/* Logo/Brand */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-4">
            ANCIENT
          </h1>
          
          {/* Tagline */}
          <p className="text-lg md:text-xl text-white/60 mb-8 font-light tracking-wide">
            The World's First Decentralized State
          </p>
          
          {/* Main Headline */}
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Building Infrastructure
            <br />
            <span className="text-primary">for a Borderless World</span>
          </h2>
          
          {/* Value Prop */}
          <p className="text-base md:text-xl text-white/80 leading-relaxed max-w-3xl mx-auto mb-10">
            50 million nomads burn $900B annually on dead rent.
            <br className="hidden md:block" />
            <span className="block mt-2">We convert that into fractional, on-chain deeds of dream properties.</span>
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="text-lg px-10 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-2xl" onClick={() => navigate("/pitch-deck")}>
              <Rocket className="mr-2 h-5 w-5" />
              View Pitch Deck
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm" onClick={() => navigate("/investor-portal")}>
              <Briefcase className="mr-2 h-5 w-5" />
              Investment Access
            </Button>
          </div>
          
          {/* Quiet Proof Stats */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-white/60 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              12 homes live
            </span>
            <span>•</span>
            <span>19% realized returns</span>
            <span>•</span>
            <span>Revenue-generating assets</span>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/30 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* PERFECT STORM - Why Now */}
      <PerfectStorm />

      {/* DEVELOPMENT FLYWHEEL - Flip Economics */}
      <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary" />
              <Badge variant="outline" className="text-sm font-medium text-primary uppercase tracking-wider border-primary/50">
                Development Model
              </Badge>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Development Flywheel Model
            </h2>
            <p className="text-xl text-muted-foreground">
              2 Locations, 2 Flips, 32 Units — Seed-Funded Capital Recycling
            </p>
          </div>
          
          {/* Summary Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-card/50 border border-border/50 rounded-xl p-5 text-center">
              <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl md:text-3xl font-bold text-primary">$1.9M</p>
              <p className="text-sm text-muted-foreground">Initial Capital</p>
            </div>
            <div className="bg-card/50 border border-border/50 rounded-xl p-5 text-center">
              <Home className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl md:text-3xl font-bold text-emerald-500">32</p>
              <p className="text-sm text-muted-foreground">Total Units</p>
            </div>
            <div className="bg-card/50 border border-border/50 rounded-xl p-5 text-center">
              <Globe className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl md:text-3xl font-bold text-blue-500">2</p>
              <p className="text-sm text-muted-foreground">Countries</p>
            </div>
            <div className="bg-card/50 border border-border/50 rounded-xl p-5 text-center">
              <TrendingUp className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl md:text-3xl font-bold text-purple-500">$24.5M</p>
              <p className="text-sm text-muted-foreground">10-Year Capture</p>
            </div>
          </div>
          
          {/* Flywheel Component */}
          <DevelopmentFlywheel />
        </div>
      </section>

      {/* 10-YEAR REVENUE CAPTURE */}
      <section className="py-16 px-4 bg-muted/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">10-Year Revenue Capture</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Platform Fees */}
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-2xl p-6 text-center">
              <Building className="h-10 w-10 text-blue-500 mx-auto mb-4" />
              <p className="text-lg font-semibold text-blue-400 mb-2">Platform Fees</p>
              <p className="text-4xl font-bold text-white mb-2">$0.82M</p>
              <p className="text-sm text-muted-foreground">Infrastructure revenue for serving nomad economy</p>
              <Badge className="mt-4 bg-blue-500/20 text-blue-400 border-blue-500/30">Immediate capture</Badge>
            </div>
            
            {/* Mortgage Interest */}
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl p-6 text-center">
              <Globe className="h-10 w-10 text-purple-500 mx-auto mb-4" />
              <p className="text-lg font-semibold text-purple-400 mb-2">Mortgage Interest</p>
              <p className="text-4xl font-bold text-white mb-2">$13.5M</p>
              <p className="text-sm text-muted-foreground">10% yield serving the $250B cross-border lending void</p>
              <Badge className="mt-4 bg-purple-500/20 text-purple-400 border-purple-500/30">10-year stream</Badge>
            </div>
            
            {/* SAM Appreciation */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-center">
              <Sparkles className="h-10 w-10 text-emerald-500 mx-auto mb-4" />
              <p className="text-lg font-semibold text-emerald-400 mb-2">SAM Appreciation</p>
              <p className="text-4xl font-bold text-white mb-2">$10.2M</p>
              <p className="text-sm text-muted-foreground">Capturing nomad wealth lost to rent into property equity</p>
              <Badge className="mt-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">10-year capture</Badge>
            </div>
          </div>
          
          {/* Total */}
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-2xl p-8 text-center">
            <p className="text-lg text-muted-foreground mb-2">Total 10-Year Revenue Capture</p>
            <p className="text-5xl md:text-6xl font-bold text-primary">$24.53M</p>
          </div>
        </div>
      </section>

      {/* SCALING PATH - Evolution */}
      <ScalingPath />

      {/* INVESTOR RETURN SCENARIOS */}
      <VCExitScenarios />

      {/* TEAM SECTION */}
      <TeamSection />

      {/* Closing CTA */}
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
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary" />
              <Badge variant="outline" className="text-sm font-medium text-primary uppercase tracking-wider border-primary/50">
                Due Diligence
              </Badge>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Deep Dive Documentation</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive details for investors who want to explore specific areas.
            </p>
          </div>

          {/* Tabbed Content */}
          <Tabs defaultValue="roadmap" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 lg:w-fit lg:mx-auto mb-8 gap-1">
              <TabsTrigger value="roadmap" className="text-xs lg:text-sm">
                <Target className="h-4 w-4 mr-1 hidden sm:inline" />
                Roadmap
              </TabsTrigger>
              <TabsTrigger value="revenue" className="text-xs lg:text-sm">
                <DollarSign className="h-4 w-4 mr-1 hidden sm:inline" />
                Revenue
              </TabsTrigger>
              <TabsTrigger value="competition" className="text-xs lg:text-sm">
                <Globe className="h-4 w-4 mr-1 hidden sm:inline" />
                Competition
              </TabsTrigger>
              <TabsTrigger value="mortgages" className="text-xs lg:text-sm">
                <Building className="h-4 w-4 mr-1 hidden sm:inline" />
                Mortgages
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
            </TabsList>

            {/* Roadmap Tab */}
            <TabsContent value="roadmap">
              <div className="space-y-8">
                <SeedFundedRoadmap />
                <SixFlipRoadmap />
              </div>
            </TabsContent>

            {/* Revenue Tab */}
            <TabsContent value="revenue">
              <SimpleBusinessModel />
            </TabsContent>

            {/* Competition Tab */}
            <TabsContent value="competition">
              <CompetitiveLandscape />
            </TabsContent>

            {/* Mortgages Tab */}
            <TabsContent value="mortgages">
              <TwoProductMortgage />
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

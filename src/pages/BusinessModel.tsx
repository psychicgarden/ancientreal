import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TechDueDiligence from "@/components/TechDueDiligence";
import TenYearProjection from "@/components/TenYearProjection";
import SeedFundedRoadmap from "@/components/SeedFundedRoadmap";
import InstitutionalCapitalTimeline from "@/components/InstitutionalCapitalTimeline";
import CashFirstStrategy from "@/components/CashFirstStrategy";
import CompetitiveLandscape from "@/components/CompetitiveLandscape";
import DevCoFinCoModel from "@/components/DevCoFinCoModel";
import MarketFailure from "@/components/MarketFailure";
import StrategyRoadmap from "@/components/StrategyRoadmap";
import TractionTrilogy from "@/components/TractionTrilogy";
import UnfairUnitEconomics from "@/components/UnfairUnitEconomics";
import KillSwitch from "@/components/KillSwitch";
import AWSPitch from "@/components/AWSPitch";
import FinCoLiquidityPool from "@/components/FinCoLiquidityPool";
import { LegalRegulatoryProofing } from "@/components/LegalRegulatoryProofing";
import VCExitScenarios from "@/components/VCExitScenarios";
import CapitalStackExplainer from "@/components/CapitalStackExplainer";
import ModelAssumptions from "@/components/ModelAssumptions";
import CoreMetrics from "@/components/CoreMetrics";
import Hero from "@/components/Hero";

const BusinessModel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <Hero />

      {/* AWS Pitch Section - The 30-Second Elevator Pitch */}
      <AWSPitch />

      {/* Market Failure Section */}
      <MarketFailure />

      {/* Strategy Roadmap - From Lab to Global Standard */}
      <StrategyRoadmap />

      {/* Traction Trilogy Section */}
      <TractionTrilogy />

      {/* VC Exit Scenarios - What's In It For Investors */}
      <VCExitScenarios />

      {/* Core Metrics - Combined Unit Economics + Kill Switch */}
      <CoreMetrics />

      {/* Business Model Content with Tabs */}
      <section className="px-4 bg-background py-[50px]">
        <div className="max-w-7xl mx-auto">

          {/* Deep Dive Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary"></div>
              <div className="text-sm font-medium text-primary uppercase tracking-wider">Due Diligence</div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary"></div>
            </div>
            <h2 className="text-4xl font-bold">Deep Dives</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Comprehensive details for investors who want to explore specific areas.
            </p>
          </div>

          {/* Consolidated 4-Tab Structure */}
          <Tabs defaultValue="the-model" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:mx-auto mb-8">
              <TabsTrigger value="the-model" className="text-xs lg:text-sm">The Model</TabsTrigger>
              <TabsTrigger value="the-deal" className="text-xs lg:text-sm">The Deal</TabsTrigger>
              <TabsTrigger value="risk-legal" className="text-xs lg:text-sm">Risk & Legal</TabsTrigger>
              <TabsTrigger value="tech-competition" className="text-xs lg:text-sm">Tech & Competition</TabsTrigger>
            </TabsList>

            {/* The Model Tab - Two-Pocket + Capital Stack + FinCo */}
            <TabsContent value="the-model">
              <div className="space-y-12">
                <DevCoFinCoModel />
                <FinCoLiquidityPool />
                <CashFirstStrategy />
                <CapitalStackExplainer />
              </div>
            </TabsContent>

            {/* The Deal Tab - Roadmap + 10-Year */}
            <TabsContent value="the-deal">
              <div className="space-y-12">
                <SeedFundedRoadmap />
                <TenYearProjection />
                <InstitutionalCapitalTimeline />
              </div>
            </TabsContent>

            {/* Risk & Legal Tab - Kill Switch + Legal + Assumptions */}
            <TabsContent value="risk-legal">
              <div className="space-y-12">
                <UnfairUnitEconomics />
                <KillSwitch />
                <LegalRegulatoryProofing />
                <ModelAssumptions />
              </div>
            </TabsContent>

            {/* Tech & Competition Tab */}
            <TabsContent value="tech-competition">
              <div className="space-y-12">
                <TechDueDiligence />
                <CompetitiveLandscape />
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
    </div>
  );
};

export default BusinessModel;

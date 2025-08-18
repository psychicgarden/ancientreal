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

const flywheelData = [{
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}];

const revenueStreams = [{
  title: "Platform Fees",
  amount: "$453.6K",
  description: "Infrastructure revenue for serving nomad economy",
  timeline: "Immediate capture",
  icon: "🏛"
}, {
  title: "Mortgage Interest",
  amount: "$7.46M",
  description: "8% yield serving the $250B cross-border lending void",
  timeline: "10-year stream",
  icon: "🌐"
}, {
  title: "ARW Appreciation",
  amount: "$16.62M",
  description: "Capturing nomad wealth lost to rent into property equity",
  timeline: "10-year capture",
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

      {/* How The Money Actually Moves */}
      <section className="px-4 bg-gradient-to-br from-slate-50 to-zinc-50 dark:from-slate-950/50 dark:to-zinc-950/50 py-[50px]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold text-lg mb-6">
              📊 The Treasury Ledger (Key Milestones)
            </div>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Here's the month-by-month walkthrough so you can see how $7.0M gets used, recycled, and ends with $2.94M treasury while peak capital at risk is only $4.06M.
            </p>
          </div>

          {/* Sophisticated Treasury Cards Layout */}
          <div className="space-y-6">
            {/* Header Card */}
            <Card className="bg-gradient-to-r from-slate-900 to-zinc-900 text-white border-slate-700 overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-5 gap-0">
                  <div className="p-4 bg-gradient-to-br from-slate-800 to-slate-900 border-r border-slate-700">
                    <div className="text-xs font-medium text-slate-300 uppercase tracking-wider">Timeline</div>
                    <div className="text-sm font-bold mt-1">Month</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border-r border-slate-700">
                    <div className="text-xs font-medium text-blue-200 uppercase tracking-wider">Milestone</div>
                    <div className="text-sm font-bold mt-1 text-blue-100">Key Achievement</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border-r border-slate-700">
                    <div className="text-xs font-medium text-emerald-200 uppercase tracking-wider">Cash Flow</div>
                    <div className="text-sm font-bold mt-1 text-emerald-100">Change</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-amber-900/50 to-orange-900/50 border-r border-slate-700">
                    <div className="text-xs font-medium text-amber-200 uppercase tracking-wider">Treasury</div>
                    <div className="text-sm font-bold mt-1 text-amber-100">Balance After</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-red-900/50 to-pink-900/50">
                    <div className="text-xs font-medium text-red-200 uppercase tracking-wider">Risk Exposure</div>
                    <div className="text-sm font-bold mt-1 text-red-100">Capital at Risk</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Treasury Data Cards */}
            {[
              {
                month: "Start",
                milestone: "Initial Investment",
                cashChange: "—",
                treasuryAfter: "$7.00M",
                capitalAtRisk: "$0.00M",
                isPositive: null,
                isStart: true
              },
              {
                month: "M1-M11",
                milestone: "Legal, Platform, Mexico Setup",
                cashChange: "-$1.21M",
                treasuryAfter: "$5.79M", 
                capitalAtRisk: "$1.21M",
                isPositive: false
              },
              {
                month: "M12-M14",
                milestone: "First Presales Begin (Mazunte)",
                cashChange: "+$0.257M",
                treasuryAfter: "$5.78M",
                capitalAtRisk: "$1.22M", 
                isPositive: true
              },
              {
                month: "M15-M21",
                milestone: "Brazil Build + Bahia Presales",
                cashChange: "+$0.442M",
                treasuryAfter: "$5.39M",
                capitalAtRisk: "$1.61M",
                isPositive: true
              },
              {
                month: "M21-M30",
                milestone: "Spain Entry + More Presales",
                cashChange: "+$0.67M",
                treasuryAfter: "$4.06M",
                capitalAtRisk: "$2.94M",
                isPositive: true
              },
              {
                month: "M36",
                milestone: "Peak Capital at Risk",
                cashChange: "-$0.827M",
                treasuryAfter: "$2.94M",
                capitalAtRisk: "$4.06M",
                isPositive: false,
                isPeak: true
              }
            ].map((row, index) => (
              <Card key={index} className={`transition-all duration-300 hover:shadow-xl overflow-hidden ${
                row.isStart ? 'bg-gradient-to-r from-slate-900 to-zinc-900 border-slate-700 text-white' :
                row.isPeak ? 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border-red-200 dark:border-red-800' :
                'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'
              }`}>
                <CardContent className="p-0">
                  <div className="grid grid-cols-5 gap-0">
                    {/* Month */}
                    <div className={`p-4 border-r ${
                      row.isStart ? 'border-slate-600' : 
                      row.isPeak ? 'border-red-200 dark:border-red-800' : 
                      'border-slate-200 dark:border-slate-700'
                    }`}>
                      <div className={`text-xs font-medium uppercase tracking-wider mb-1 ${
                        row.isStart ? 'text-slate-300' : 'text-muted-foreground'
                      }`}>
                        Timeline
                      </div>
                      <div className={`text-sm font-bold ${
                        row.isStart ? 'text-white' : 
                        row.isPeak ? 'text-red-700 dark:text-red-300' : 
                        'text-foreground'
                      }`}>
                        {row.month}
                      </div>
                    </div>

                    {/* Milestone */}
                    <div className={`p-4 border-r ${
                      row.isStart ? 'border-slate-600' : 
                      row.isPeak ? 'border-red-200 dark:border-red-800' : 
                      'border-slate-200 dark:border-slate-700'
                    }`}>
                      <div className={`text-xs font-medium uppercase tracking-wider mb-1 ${
                        row.isStart ? 'text-blue-200' : 'text-blue-600 dark:text-blue-400'
                      }`}>
                        Milestone
                      </div>
                      <div className={`text-sm font-semibold leading-tight ${
                        row.isStart ? 'text-blue-100' : 
                        row.isPeak ? 'text-red-700 dark:text-red-300' : 
                        'text-blue-700 dark:text-blue-300'
                      }`}>
                        {row.milestone}
                      </div>
                    </div>

                    {/* Cash Change */}
                    <div className={`p-4 border-r ${
                      row.isStart ? 'border-slate-600' : 
                      row.isPeak ? 'border-red-200 dark:border-red-800' : 
                      'border-slate-200 dark:border-slate-700'
                    }`}>
                      <div className={`text-xs font-medium uppercase tracking-wider mb-1 ${
                        row.isStart ? 'text-emerald-200' : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        Cash Flow
                      </div>
                      <div className={`text-lg font-bold font-mono ${
                        row.isStart ? 'text-emerald-100' :
                        row.isPositive === true ? 'text-emerald-600 dark:text-emerald-400' :
                        row.isPositive === false ? 'text-red-600 dark:text-red-400' :
                        'text-slate-600 dark:text-slate-400'
                      }`}>
                        {row.cashChange}
                      </div>
                    </div>

                    {/* Treasury After */}
                    <div className={`p-4 border-r ${
                      row.isStart ? 'border-slate-600' : 
                      row.isPeak ? 'border-red-200 dark:border-red-800' : 
                      'border-slate-200 dark:border-slate-700'
                    }`}>
                      <div className={`text-xs font-medium uppercase tracking-wider mb-1 ${
                        row.isStart ? 'text-amber-200' : 'text-amber-600 dark:text-amber-400'
                      }`}>
                        Treasury
                      </div>
                      <div className={`text-lg font-bold font-mono ${
                        row.isStart ? 'text-amber-100' : 
                        row.treasuryAfter === '$7.00M' ? 'text-amber-600 dark:text-amber-400' :
                        'text-orange-600 dark:text-orange-400'
                      }`}>
                        {row.treasuryAfter}
                      </div>
                    </div>

                    {/* Capital at Risk */}
                    <div className="p-4">
                      <div className={`text-xs font-medium uppercase tracking-wider mb-1 ${
                        row.isStart ? 'text-red-200' : 'text-red-600 dark:text-red-400'
                      }`}>
                        Risk Exposure
                      </div>
                      <div className={`text-lg font-bold font-mono ${
                        row.isStart ? 'text-red-100' :
                        row.capitalAtRisk === '$4.06M' ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/50 px-2 py-1 rounded' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {row.capitalAtRisk}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Insights */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">$2.94M</div>
                <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Final Treasury Balance</div>
                <div className="text-xs text-muted-foreground mt-1">42% capital preservation</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-orange-700 dark:text-orange-300 mb-2">$4.06M</div>
                <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">Peak Risk Exposure</div>
                <div className="text-xs text-muted-foreground mt-1">Only 58% of initial capital</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">36 Months</div>
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Capital Recycling Period</div>
                <div className="text-xs text-muted-foreground mt-1">Self-sustaining model</div>
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
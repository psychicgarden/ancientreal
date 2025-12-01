import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Globe, Menu, Home, Users, Briefcase, CreditCard, Plane, Code2, FileText, Settings, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TenYearProjection from "@/components/TenYearProjection";
import ReturnProfile from "@/components/ReturnProfile";
import SixFlipRoadmap from "@/components/SixFlipRoadmap";
import MarketFailure from "@/components/MarketFailure";
import TractionTrilogy from "@/components/TractionTrilogy";
import UnfairUnitEconomics from "@/components/UnfairUnitEconomics";
import KillSwitch from "@/components/KillSwitch";
import AWSPitch from "@/components/AWSPitch";
import VCPitchDeck from "@/components/VCPitchDeck";
import CompetitiveLandscape from "@/components/CompetitiveLandscape";
import { ProductComparison } from "@/components/ProductComparison";
import DevCoFinCoModel from "@/components/DevCoFinCoModel";
import FinCoLiquidityPool from "@/components/FinCoLiquidityPool";
import TechDueDiligence from "@/components/TechDueDiligence";

// Import property images
import ecoSmartCity from "@/assets/eco-smart-city.jpg";

const BusinessModel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
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

      {/* Deep Dive Tabs Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4">Deep Dive</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              The Complete Picture
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore the full business model, competitive landscape, revenue streams, and technical architecture
            </p>
          </div>
          
          <Tabs defaultValue="vc-pitch" className="w-full">
            <TabsList className="w-full justify-start mb-8 bg-muted/50 p-1 flex-wrap h-auto">
              <TabsTrigger value="vc-pitch" className="flex-1 min-w-[120px]">VC Pitch</TabsTrigger>
              <TabsTrigger value="competition" className="flex-1 min-w-[120px]">Competition</TabsTrigger>
              <TabsTrigger value="three-paths" className="flex-1 min-w-[120px]">Three Paths</TabsTrigger>
              <TabsTrigger value="revenue" className="flex-1 min-w-[120px]">Revenue Model</TabsTrigger>
              <TabsTrigger value="tech" className="flex-1 min-w-[120px]">Tech Due Diligence</TabsTrigger>
              <TabsTrigger value="budget-legal" className="flex-1 min-w-[120px]">Budget & Legal</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vc-pitch" className="mt-0">
              <VCPitchDeck />
            </TabsContent>
            
            <TabsContent value="competition" className="mt-0">
              <CompetitiveLandscape />
            </TabsContent>
            
            <TabsContent value="three-paths" className="mt-0">
              <ProductComparison />
            </TabsContent>
            
            <TabsContent value="revenue" className="mt-0">
              <div className="space-y-8">
                <DevCoFinCoModel />
                <FinCoLiquidityPool />
              </div>
            </TabsContent>
            
            <TabsContent value="tech" className="mt-0">
              <TechDueDiligence />
            </TabsContent>
            
            <TabsContent value="budget-legal" className="mt-0">
              <div className="space-y-8">
                <div className="bg-card rounded-xl border border-border p-8">
                  <h3 className="text-2xl font-bold mb-6">Use of Funds: $1.9M Seed</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 rounded-lg p-3">
                          <span className="text-2xl font-bold text-primary">79%</span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Hard Assets ($1.50M)</h4>
                          <p className="text-sm text-muted-foreground">Land acquisition and construction. The "Floor" - downside protection via debt-free real estate backing the loan.</p>
                          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                            <li>• Land Acquisition: $300K</li>
                            <li>• Construction: $1,125K</li>
                            <li>• Permits & Legal: $75K</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-accent/10 rounded-lg p-3">
                          <span className="text-2xl font-bold text-accent">21%</span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Tech & Legal ($400K)</h4>
                          <p className="text-sm text-muted-foreground">Protocol engineering and multi-jurisdiction SPV setup. The "Ceiling" - venture upside from fintech scaling.</p>
                          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                            <li>• Protocol Engineering: $200K</li>
                            <li>• Legal Structure (Peru SPV): $100K</li>
                            <li>• Operations & Marketing: $100K</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-xl border border-border p-8">
                  <h3 className="text-2xl font-bold mb-6">Legal Structure</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">OpCo: Ancient Protocol Inc</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        The tech company housing software, brand, and credit algorithms. Valued at 20× revenue where VCs invest for equity.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• Delaware C-Corp</li>
                        <li>• IP & Protocol ownership</li>
                        <li>• OCCR credit algorithm</li>
                        <li>• VC equity investment vehicle</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">PropCo: Liquidity Pool</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        The asset fund holding title deeds to properties, funded by whale Bitcoin staking for yield and security at 1× net asset value.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• Peru: SAC (Title Retention)</li>
                        <li>• Deed registry on-chain</li>
                        <li>• Mortgage NFT issuance</li>
                        <li>• DeFi staker funding</li>
                      </ul>
                    </div>
                  </div>
                </div>
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

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, ChevronRight, Home, Maximize2, Minimize2,
  Bitcoin, CreditCard, DollarSign, Shield, TrendingUp, Users,
  Layers, Database, Globe, Building, Target, Rocket
} from "lucide-react";
import { Link } from "react-router-dom";
import EngineACalculator from "@/components/pitch/EngineACalculator";
import EngineBCalculator from "@/components/pitch/EngineBCalculator";
import VCReturnCalculator from "@/components/pitch/VCReturnCalculator";

const slides = [
  { id: 1, title: "Title", type: "title" },
  { id: 2, title: "Why This Matters", type: "content" },
  { id: 3, title: "The Core Problem", type: "problem" },
  { id: 4, title: "The Solution", type: "solution" },
  { id: 5, title: "Revenue Model", type: "revenue" },
  { id: 6, title: "The Tech Play", type: "tech" },
  { id: 7, title: "The Endgame", type: "endgame" },
  { id: 8, title: "Traction", type: "traction" },
  { id: 9, title: "Our Moat", type: "moat" },
  { id: 10, title: "Investment Structure", type: "investment" },
  { id: 11, title: "VC Returns", type: "calculator" },
  { id: 12, title: "Engine A Calculator", type: "engineA" },
  { id: 13, title: "Engine B Calculator", type: "engineB" },
  { id: 14, title: "Team", type: "team" },
  { id: 15, title: "Closing", type: "closing" },
];

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
    }
  }, []);

  const nextSlide = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide]);
  const prevSlide = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "Escape") {
        setIsFullscreen(false);
      } else if (e.key === "f" || e.key === "F") {
        setIsFullscreen(!isFullscreen);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, isFullscreen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const renderSlide = () => {
    const slide = slides[currentSlide];
    
    switch (slide.type) {
      case "title":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-background via-background to-primary/10">
            <Badge variant="outline" className="mb-4 text-primary border-primary">
              CONFIDENTIAL INVESTOR MATERIALS
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-6">
              ANCIENT
            </h1>
            <h2 className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-8">
              Global Mortgages Powered by Crypto Collateral & On-Chain Credit
            </h2>
            <p className="text-sm md:text-base text-muted-foreground/70 max-w-2xl">
              The Infrastructure That Connects a $1T Crypto Economy to a $300T Real Estate Market
            </p>
          </div>
        );

      case "content":
        return (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <h2 className="text-4xl font-bold mb-12">Why This Matters</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl">
              {[
                { value: "$300T", label: "Global Real Estate", icon: Building },
                { value: "$1T+", label: "Crypto Liquidity", icon: Bitcoin },
                { value: "100M", label: "Digital Nomads (2030)", icon: Globe },
                { value: "ZERO", label: "Global Mortgage Rails", icon: Layers },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <item.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <div className="text-4xl font-bold text-primary mb-2">{item.value}</div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case "problem":
        return (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <h2 className="text-4xl font-bold mb-12">The Core Problem</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
              <div className="bg-red-500/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
                  <Building className="h-6 w-6" /> Banks Fail Because
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>✗ No local credit history accepted</li>
                  <li>✗ Cross-border compliance nightmare</li>
                  <li>✗ Won't touch crypto wealth</li>
                  <li>✗ 3-6 month approval process</li>
                </ul>
              </div>
              <div className="bg-orange-500/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-orange-500 mb-4 flex items-center gap-2">
                  <Bitcoin className="h-6 w-6" /> DeFi Fails Because
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>✗ Wallet balance ≠ creditworthiness</li>
                  <li>✗ No legal recourse for defaults</li>
                  <li>✗ Can't enforce title transfer</li>
                  <li>✗ Collateral liquidation only</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "solution":
        return (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <h2 className="text-4xl font-bold mb-12">The Solution: Two Engines</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
              <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/10 rounded-xl p-6 border border-orange-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <Bitcoin className="h-8 w-8 text-orange-500" />
                  <div>
                    <h3 className="text-xl font-bold">Engine A: HODL Home</h3>
                    <p className="text-sm text-muted-foreground">For crypto whales</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    Stake BTC/ETH/TAO as collateral
                  </li>
                  <li className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    0% interest mortgage
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Keep 100% of crypto upside
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-xl p-6 border border-blue-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="h-8 w-8 text-blue-500" />
                  <div>
                    <h3 className="text-xl font-bold">Engine B: Credit Home</h3>
                    <p className="text-sm text-muted-foreground">For global nomads</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    10-20% down payment
                  </li>
                  <li className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    10% fixed on-chain mortgage
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Build OCCR credit score
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "revenue":
        return (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <h2 className="text-4xl font-bold mb-8">Revenue Model: 6 Streams</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl">
              {[
                { name: "Mortgage Interest Spread", value: "4%", desc: "Borrow 6%, Lend 10%" },
                { name: "Developer Fee", value: "5%", desc: "On third-party integrations" },
                { name: "Buyer Fee", value: "3%", desc: "On property purchases" },
                { name: "Servicing Fees", value: "20-30yr", desc: "Recurring on payments" },
                { name: "OCCR Data Licensing", value: "Future", desc: "Borderless credit data" },
                { name: "Construction Margin", value: "48%", desc: "Bootstrapping phase" },
              ].map((item, i) => (
                <div key={i} className="bg-card/50 rounded-lg p-4 border border-border/50">
                  <div className="text-2xl font-bold text-primary mb-1">{item.value}</div>
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case "tech":
        return (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <h2 className="text-4xl font-bold mb-8">The Tech Play</h2>
            <div className="max-w-4xl">
              <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Layers className="h-6 w-6 text-primary" />
                  Title-Wrapper NFT
                </h3>
                <p className="text-muted-foreground mb-4">
                  Each property becomes an NFT containing three components:
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-background/50 rounded p-3">
                    <div className="font-bold text-primary">SPV Legal Deed</div>
                    <div className="text-xs text-muted-foreground">Ownership wrapper</div>
                  </div>
                  <div className="bg-background/50 rounded p-3">
                    <div className="font-bold text-primary">Mortgage Ledger</div>
                    <div className="text-xs text-muted-foreground">Debt tracking</div>
                  </div>
                  <div className="bg-background/50 rounded p-3">
                    <div className="font-bold text-primary">Payment Stream</div>
                    <div className="text-xs text-muted-foreground">Tokenized cash flow</div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Badge className="text-lg px-4 py-2">
                  Mortgages become standardized, tradable, and composable
                </Badge>
              </div>
            </div>
          </div>
        );

      case "endgame":
        return (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <h2 className="text-4xl font-bold mb-8">The Endgame</h2>
            <div className="max-w-4xl text-center">
              <h3 className="text-2xl font-bold text-primary mb-6">Ancient Credit Fund</h3>
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="bg-card/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Mortgage NFTs</div>
                </div>
                <ChevronRight className="h-6 w-6 text-primary" />
                <div className="bg-card/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Bundle into Bonds</div>
                </div>
                <ChevronRight className="h-6 w-6 text-primary" />
                <div className="bg-primary/20 rounded-lg p-4 border border-primary">
                  <div className="text-sm font-bold text-primary">Yield-Bearing Tokens</div>
                </div>
              </div>
              <p className="text-xl text-muted-foreground mb-6">
                "The BlackRock of crypto mortgage bonds"
              </p>
              <div className="flex justify-center gap-4">
                {["MakerDAO", "Aave", "Treasuries"].map((name) => (
                  <Badge key={name} variant="outline">{name}</Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case "traction":
        return (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <h2 className="text-4xl font-bold mb-12">Traction</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl">
              {[
                { value: "12", label: "Units Live", sub: "$75K net/year" },
                { value: "16", label: "Unit Complex", sub: "Under construction" },
                { value: "100%", label: "Supply Chain", sub: "Fully executed" },
                { value: "Real", label: "Revenue", sub: "Renters & buyers" },
              ].map((item, i) => (
                <div key={i} className="text-center bg-card/50 rounded-xl p-6">
                  <div className="text-4xl font-bold text-primary mb-2">{item.value}</div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case "moat":
        return (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <h2 className="text-4xl font-bold mb-8">Why This Cannot Be Forked</h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
              {[
                { icon: Building, text: "Real-world developer/operator" },
                { icon: Shield, text: "Title escrow enforcement system" },
                { icon: CreditCard, text: "OCCR credit primitive" },
                { icon: Users, text: "Developer partnerships" },
                { icon: Database, text: "Mortgage compliance framework" },
                { icon: Target, text: "Construction + operational moat" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-green-500/10 rounded-lg p-4">
                  <item.icon className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "investment":
        return (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <h2 className="text-4xl font-bold mb-8">BTC-Staked Investment Structure</h2>
            <div className="max-w-4xl">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-orange-500/10 rounded-xl p-6 border border-orange-500/30">
                  <h3 className="font-bold text-lg mb-4 text-orange-500">VC Deposits</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• $5M in BTC as collateral</li>
                    <li>• No capital deployed</li>
                    <li>• No tax event</li>
                    <li>• No downside risk</li>
                  </ul>
                </div>
                <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/30">
                  <h3 className="font-bold text-lg mb-4 text-green-500">VC Receives</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• 15% equity stake</li>
                    <li>• 15% profit share (Flips 1-6)</li>
                    <li>• 100% BTC returned</li>
                    <li>• Infinite ROI potential</li>
                  </ul>
                </div>
              </div>
              <div className="bg-primary/10 rounded-xl p-4 text-center">
                <p className="font-medium">Ancient receives: <span className="text-primary">$1.9M working capital</span> at zero debt</p>
              </div>
            </div>
          </div>
        );

      case "calculator":
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 overflow-y-auto">
            <h2 className="text-3xl font-bold mb-6">VC Return Calculator</h2>
            <div className="w-full max-w-2xl">
              <VCReturnCalculator />
            </div>
          </div>
        );

      case "engineA":
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 overflow-y-auto">
            <h2 className="text-3xl font-bold mb-6">Engine A: HODL Home</h2>
            <div className="w-full max-w-2xl">
              <EngineACalculator />
            </div>
          </div>
        );

      case "engineB":
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 overflow-y-auto">
            <h2 className="text-3xl font-bold mb-6">Engine B: Credit Home</h2>
            <div className="w-full max-w-2xl">
              <EngineBCalculator />
            </div>
          </div>
        );

      case "team":
        return (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <h2 className="text-4xl font-bold mb-12">Team</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl">
              {[
                { name: "Brady Williams", role: "CEO", desc: "Developer/operator, 12 units, Web3-native" },
                { name: "Beau", role: "Institutional Advisor", desc: "Van Metre, 6,000+ units" },
                { name: "Engineering", role: "Team", desc: "Full-stack Web3 development" },
              ].map((member, i) => (
                <div key={i} className="text-center bg-card/50 rounded-xl p-6">
                  <div className="w-20 h-20 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <div className="font-bold text-lg">{member.name}</div>
                  <div className="text-primary text-sm">{member.role}</div>
                  <div className="text-xs text-muted-foreground mt-2">{member.desc}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case "closing":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-background via-background to-primary/10">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-8">
              ANCIENT
            </h1>
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl text-lg mb-8">
              <div className="text-muted-foreground">Mortgages-as-Code</div>
              <div className="text-muted-foreground">Property-as-Protocol</div>
              <div className="text-muted-foreground">Credit-as-Liquidity</div>
              <div className="text-muted-foreground">A Financial System with No Borders</div>
            </div>
            <Badge className="text-lg px-6 py-2">
              <Rocket className="h-5 w-5 mr-2" />
              Let's Build the Future of Real Estate Finance
            </Badge>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-background ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur border-b border-border/50 px-4 py-2 flex items-center justify-between">
        <Link to="/business-model">
          <Button variant="ghost" size="sm">
            <Home className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {currentSlide + 1} / {slides.length}
          </span>
          <span className="text-sm font-medium">{slides[currentSlide].title}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden md:block">
            ← → to navigate • F for fullscreen
          </span>
          <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="pt-14 pb-20 h-screen">
        {renderSlide()}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur border-t border-border/50 px-4 py-3">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <Button 
            variant="outline" 
            onClick={prevSlide} 
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {/* Slide indicators */}
          <div className="flex gap-1 overflow-x-auto max-w-[50vw] px-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-2 h-2 rounded-full transition-all flex-shrink-0 ${
                  i === currentSlide 
                    ? 'bg-primary w-4' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
          
          <Button 
            onClick={nextSlide} 
            disabled={currentSlide === slides.length - 1}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

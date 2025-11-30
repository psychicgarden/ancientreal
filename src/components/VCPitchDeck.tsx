import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  Building2, 
  Wallet, 
  TrendingUp, 
  Shield, 
  Users, 
  Rocket,
  Bitcoin,
  CreditCard,
  Database,
  Lock,
  Zap,
  Target,
  Award,
  DollarSign,
  BarChart3,
  PieChart,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Maximize2,
  Presentation
} from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const SLIDES = [
  { id: 1, title: "Title" },
  { id: 2, title: "Why This Matters" },
  { id: 3, title: "The Problem" },
  { id: 4, title: "The Solution" },
  { id: 5, title: "Revenue Model" },
  { id: 6, title: "Tech Play" },
  { id: 7, title: "Endgame" },
  { id: 8, title: "Traction" },
  { id: 9, title: "Moat" },
  { id: 10, title: "Competitive" },
  { id: 11, title: "Investment" },
  { id: 12, title: "Compounding" },
  { id: 13, title: "Returns" },
  { id: 14, title: "Use of Funds" },
  { id: 15, title: "Team" },
  { id: 16, title: "Closing" },
];

const compoundingData = [
  { flip: "Flip 1", profit: 0.75, cumulative: 0.75, homes: 15 },
  { flip: "Flip 2", profit: 1.0, cumulative: 1.75, homes: 35 },
  { flip: "Flip 3", profit: 1.3, cumulative: 3.05, homes: 50 },
  { flip: "Flip 4", profit: 2.0, cumulative: 5.05, homes: 70 },
  { flip: "Flip 5", profit: 3.0, cumulative: 8.05, homes: 90 },
  { flip: "Flip 6", profit: 4.5, cumulative: 12.55, homes: 100 },
];

const useOfFundsData = [
  { name: "Construction", value: 70, color: "hsl(var(--primary))" },
  { name: "Protocol Engineering", value: 20, color: "hsl(var(--chart-2))" },
  { name: "Legal & SPV", value: 10, color: "hsl(var(--chart-3))" },
];

export default function VCPitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextSlide = () => setCurrentSlide((s) => Math.min(s + 1, 16));
  const prevSlide = () => setCurrentSlide((s) => Math.max(s - 1, 1));

  const renderSlide = () => {
    switch (currentSlide) {
      case 1:
        return <Slide1Title />;
      case 2:
        return <Slide2WhyMatters />;
      case 3:
        return <Slide3Problem />;
      case 4:
        return <Slide4Solution />;
      case 5:
        return <Slide5Revenue />;
      case 6:
        return <Slide6TechPlay />;
      case 7:
        return <Slide7Endgame />;
      case 8:
        return <Slide8Traction />;
      case 9:
        return <Slide9Moat />;
      case 10:
        return <Slide10Competitive />;
      case 11:
        return <Slide11Investment />;
      case 12:
        return <Slide12Compounding />;
      case 13:
        return <Slide13Returns />;
      case 14:
        return <Slide14UseOfFunds />;
      case 15:
        return <Slide15Team />;
      case 16:
        return <Slide16Closing />;
      default:
        return <Slide1Title />;
    }
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* Slide Container */}
      <div className={`bg-gradient-to-br from-background via-background to-muted/20 rounded-2xl border border-border/50 overflow-hidden ${isFullscreen ? 'h-full' : 'min-h-[600px]'}`}>
        {/* Slide Content */}
        <div className="p-8 lg:p-12 min-h-[550px] flex flex-col">
          {renderSlide()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-8 py-4 border-t border-border/30 bg-muted/20">
          <Button
            variant="ghost"
            onClick={prevSlide}
            disabled={currentSlide === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {/* Slide Indicators */}
          <div className="flex items-center gap-2">
            {SLIDES.map((slide) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(slide.id)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === slide.id
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link to="/pitch-deck">
              <Button variant="outline" size="sm" className="gap-2">
                <Presentation className="h-4 w-4" />
                Present
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={nextSlide}
              disabled={currentSlide === 16}
              className="gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Slide Counter */}
      <div className="text-center mt-4 text-muted-foreground text-sm">
        Slide {currentSlide} of 16: {SLIDES[currentSlide - 1].title}
      </div>
    </div>
  );
}

// ============ SLIDE COMPONENTS ============

function Slide1Title() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
      <Badge variant="outline" className="text-lg px-6 py-2 border-primary/50">
        🔥 ANCIENT PROTOCOL
      </Badge>
      
      <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
        <span className="bg-gradient-to-r from-primary via-orange-500 to-red-500 bg-clip-text text-transparent">
          Global Mortgages
        </span>
        <br />
        <span className="text-foreground">
          Powered by Crypto Collateral
        </span>
        <br />
        <span className="text-muted-foreground text-3xl lg:text-4xl">
          & On-Chain Credit
        </span>
      </h1>
      
      <div className="max-w-2xl mx-auto pt-8 border-t border-border/50">
        <p className="text-xl text-muted-foreground">
          The Infrastructure That Connects a{" "}
          <span className="text-primary font-bold">$1T Crypto Economy</span> to a{" "}
          <span className="text-primary font-bold">$300T Real Estate Market</span>
        </p>
      </div>
    </div>
  );
}

function Slide2WhyMatters() {
  const stats = [
    { value: "$300T", label: "Global Real Estate", icon: Building2 },
    { value: "$1T+", label: "Crypto Liquidity Idle", icon: Bitcoin },
    { value: "100M", label: "Digital Nomads by 2030", icon: Globe },
    { value: "0", label: "Global Mortgage Rails", icon: XCircle },
    { value: "0", label: "Borderless Credit Systems", icon: XCircle },
    { value: "0", label: "Cross-Country Property Infrastructure", icon: XCircle },
  ];

  return (
    <div className="flex-1 space-y-8">
      <div className="text-center">
        <Badge variant="outline" className="mb-4">Slide 2</Badge>
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why This Matters</h2>
        <p className="text-xl text-muted-foreground">
          Real estate is the world's largest asset class. Crypto is the world's most liquid capital pool.
          <br />
          <span className="text-primary font-semibold">They cannot talk to each other.</span>
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className={`bg-card/50 border-border/50 ${stat.value === "0" ? 'border-destructive/30' : 'border-primary/30'}`}>
            <CardContent className="p-6 text-center">
              <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.value === "0" ? 'text-destructive' : 'text-primary'}`} />
              <div className={`text-3xl font-bold mb-1 ${stat.value === "0" ? 'text-destructive' : 'text-primary'}`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-4">
        <p className="text-lg font-semibold text-primary">
          Ancient is building the missing financial rail.
        </p>
      </div>
    </div>
  );
}

function Slide3Problem() {
  return (
    <div className="flex-1 space-y-8">
      <div className="text-center">
        <Badge variant="outline" className="mb-4">Slide 3</Badge>
        <h2 className="text-3xl lg:text-4xl font-bold mb-2">The Core Problem</h2>
        <p className="text-xl text-destructive font-semibold">
          Banks don't lend cross-border. DeFi can't underwrite real-world loans.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Banks Fail */}
        <Card className="bg-card/50 border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Building2 className="h-5 w-5" />
              Banks Fail Because:
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Nomads have no local credit",
              "Cross-border mortgages = regulatory nightmare",
              "Banks won't touch crypto wealth",
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* DeFi Fails */}
        <Card className="bg-card/50 border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Wallet className="h-5 w-5" />
              DeFi Fails Because:
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Wallet history ≠ real credit",
              "No legal recourse",
              "No claim over real property",
              "No enforcement → no long-term lending",
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="text-center p-6 bg-muted/30 rounded-xl border border-border/50">
        <p className="text-lg font-medium">
          There is <span className="text-destructive font-bold">no trusted way</span> to collateralize crypto into real estate at scale.
        </p>
      </div>
    </div>
  );
}

function Slide4Solution() {
  return (
    <div className="flex-1 space-y-6">
      <div className="text-center">
        <Badge variant="outline" className="mb-4">Slide 4</Badge>
        <h2 className="text-3xl lg:text-4xl font-bold mb-2">The Solution</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          A global mortgage engine that uses crypto as collateral and on-chain repayments as credit data.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Engine A - HODL Home */}
        <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/30">
          <CardHeader>
            <Badge className="w-fit bg-orange-500/20 text-orange-500 border-orange-500/30">
              ENGINE A
            </Badge>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Bitcoin className="h-6 w-6 text-orange-500" />
              HODL Home
            </CardTitle>
            <p className="text-muted-foreground">For Crypto Whales</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: Lock, text: "Stake BTC/ETH/TAO" },
              { icon: DollarSign, text: "Receive 0% interest mortgage" },
              { icon: Shield, text: "No tax event" },
              { icon: TrendingUp, text: "Keep all crypto upside" },
              { icon: Building2, text: "Property via smart-contract title escrow" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-orange-500" />
                <span>{item.text}</span>
              </div>
            ))}
            <div className="pt-4 border-t border-orange-500/20">
              <p className="text-sm text-muted-foreground italic">
                Whales unlock real-estate liquidity without selling crypto.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Engine B - Credit Home */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
          <CardHeader>
            <Badge className="w-fit bg-blue-500/20 text-blue-500 border-blue-500/30">
              ENGINE B
            </Badge>
            <CardTitle className="text-2xl flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-blue-500" />
              Credit Home
            </CardTitle>
            <p className="text-muted-foreground">For Global Nomads</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: Wallet, text: "10–20% down payment" },
              { icon: BarChart3, text: "11% fixed on-chain mortgage" },
              { icon: Database, text: "Payments mint Repayment NFTs" },
              { icon: Award, text: "Build OCCR: On-Chain Credit Report" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-blue-500" />
                <span>{item.text}</span>
              </div>
            ))}
            <div className="pt-4 border-t border-blue-500/20">
              <p className="text-sm text-muted-foreground italic">
                Nomads get a mortgage anywhere on Earth — even with no FICO, no bank history, no local residency.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Slide5Revenue() {
  const streams = [
    { title: "Mortgage Interest Spread", value: "5%", desc: "Borrow at ~6% → lend at 11%", icon: TrendingUp },
    { title: "SAM Appreciation", value: "15%", desc: "15% of property appreciation at exit", icon: Building2 },
    { title: "Buyer Fee", value: "3.5%", desc: "Every buyer financing through Ancient", icon: Users },
    { title: "Servicing Fees", value: "15-30yr", desc: "Recurring revenue on every payment", icon: BarChart3 },
    { title: "OCCR Data Licensing", value: "∞", desc: "World's first borderless credit identity", icon: Database },
    { title: "Construction Margin", value: "48%", desc: "Build ~$90K → sell ~$135K (bootstrapping)", icon: Rocket },
  ];

  return (
    <div className="flex-1 space-y-6">
      <div className="text-center">
        <Badge variant="outline" className="mb-4">Slide 5</Badge>
        <h2 className="text-3xl lg:text-4xl font-bold mb-2">How Ancient Makes Money</h2>
        <p className="text-muted-foreground">
          Pure Fintech / Marketplace / Mortgage business. Not a house builder.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {streams.map((stream, idx) => (
          <Card key={idx} className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
            <CardContent className="p-4">
              <stream.icon className="h-6 w-6 text-primary mb-2" />
              <div className="text-2xl font-bold text-primary">{stream.value}</div>
              <div className="font-semibold text-sm">{stream.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{stream.desc}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-xl p-6 border border-primary/20">
        <p className="text-center text-lg font-medium">
          This is <span className="text-primary font-bold">Stripe + Rocket Mortgage + Airbnb + Plaid</span> — for global real estate.
        </p>
      </div>
    </div>
  );
}

function Slide6TechPlay() {
  return (
    <div className="flex-1 space-y-6">
      <div className="text-center">
        <Badge variant="outline" className="mb-4">Slide 6</Badge>
        <h2 className="text-3xl lg:text-4xl font-bold mb-2">The Tech Play</h2>
        <p className="text-muted-foreground">
          The 15 homes are not the business. They are the <span className="text-primary font-semibold">"Genesis Block"</span> of a global mortgage liquidity protocol.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Title-Wrapper NFT */}
        <Card className="bg-card/50 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Title-Wrapper NFT
            </CardTitle>
            <p className="text-sm text-muted-foreground">Our core primitive</p>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Each home becomes an NFT containing:</p>
            <div className="space-y-2">
              {[
                "SPV legal deed",
                "Mortgage debt ledger",
                "Tokenized payment stream",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Mortgages become: <span className="text-primary">Standardized • Tradable • Composable • Secure • Enforceable</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mortgage-as-a-Service */}
        <Card className="bg-card/50 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Mortgage-as-a-Service (MaaS)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Developers worldwide integrate Ancient directly:</p>
            <div className="space-y-2 text-sm">
              {[
                "Mexico • Costa Rica • Brazil",
                "Spain • Greece • Bali",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Every developer → <span className="text-primary font-bold">5% fee</span></div>
                <div>Every buyer → <span className="text-primary font-bold">3% fee</span></div>
                <div>Every mortgage → <span className="text-primary font-bold">4% spread</span></div>
                <div>Every payment → <span className="text-primary font-bold">servicing $</span></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-muted-foreground">
        This is how Ancient becomes a <span className="text-primary font-bold">multibillion-dollar protocol</span> without building 10,000 homes.
      </div>
    </div>
  );
}

function Slide7Endgame() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-8">
      <Badge variant="outline" className="text-lg px-4 py-1">Slide 7</Badge>
      <h2 className="text-3xl lg:text-5xl font-bold text-center">
        The Endgame:<br />
        <span className="text-primary">The Ancient Credit Fund</span>
      </h2>
      
      <div className="max-w-2xl text-center space-y-4">
        <p className="text-xl text-muted-foreground">
          A decentralized, global mortgage bond market.
        </p>
        
        <div className="bg-card/50 border border-border/50 rounded-xl p-6 space-y-4">
          <p className="font-medium">After 1–2 years:</p>
          <div className="space-y-2 text-left">
            {[
              "Bundle thousands of mortgage NFTs",
              "Issue yield-bearing tokens backed by diversified cross-border mortgages",
              "Sell to MakerDAO, Aave, L1 treasuries, funds, and DAOs seeking real yield",
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-2xl font-bold text-center">
        Ancient becomes the <span className="text-primary">BlackRock of crypto mortgage bonds</span>.
      </div>
    </div>
  );
}

function Slide8Traction() {
  const metrics = [
    { value: "12", label: "Units Live", sublabel: "20% CoC" },
    { value: "16", label: "Unit Complex", sublabel: "Under construction" },
    { value: "✓", label: "Supply Chain", sublabel: "Full pipeline executed" },
    { value: "$$$", label: "Real Revenue", sublabel: "Real renters, real buyers" },
  ];

  return (
    <div className="flex-1 space-y-8">
      <div className="text-center">
        <Badge variant="outline" className="mb-4">Slide 8</Badge>
        <h2 className="text-3xl lg:text-4xl font-bold mb-2">Traction</h2>
        <p className="text-xl text-primary font-semibold">Real, Not Theoretical</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <Card key={idx} className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">{metric.value}</div>
              <div className="font-semibold">{metric.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{metric.sublabel}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center p-8 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-xl border border-primary/20">
        <p className="text-2xl font-bold mb-2">We've already done the hard part.</p>
        <p className="text-lg text-muted-foreground">Now we scale globally.</p>
      </div>
    </div>
  );
}

function Slide9Moat() {
  const moatItems = [
    { icon: Building2, text: "Real-world developer/operator" },
    { icon: Shield, text: "Title escrow enforcement system" },
    { icon: Database, text: "OCCR credit primitive" },
    { icon: Users, text: "Developer partnerships" },
    { icon: Lock, text: "Mortgage compliance framework" },
    { icon: DollarSign, text: "Lending pool & interest spread" },
    { icon: Rocket, text: "Construction + operational moat" },
    { icon: Globe, text: "Multi-jurisdiction property SPVs" },
    { icon: Bitcoin, text: "BTC-staked venture model" },
  ];

  return (
    <div className="flex-1 space-y-6">
      <div className="text-center">
        <Badge variant="outline" className="mb-4">Slide 9</Badge>
        <h2 className="text-3xl lg:text-4xl font-bold mb-2">Why This Cannot Be Forked</h2>
        <p className="text-muted-foreground">
          Ancient owns both the real-world machinery AND the protocol layer.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {moatItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 p-3 bg-card/50 rounded-lg border border-border/50">
            <item.icon className="h-5 w-5 text-primary shrink-0" />
            <span className="text-sm">{item.text}</span>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 pt-4">
        <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20 text-center">
          <XCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-sm">No DeFi protocol has <strong>real-world enforcement</strong></p>
        </div>
        <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20 text-center">
          <XCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-sm">No real-estate company has <strong>crypto liquidity</strong></p>
        </div>
      </div>

      <div className="text-center text-xl font-bold text-primary pt-2">
        Ancient combines both.
      </div>
    </div>
  );
}

function Slide10Competitive() {
  const competitors = [
    { name: "Divvy Homes", raised: "$1.127B", status: "Sold ~$1B", flaw: "US-only, FICO" },
    { name: "Roofstock", raised: "$240M", status: "Stalled", flaw: "No global path" },
    { name: "Lofty AI", raised: "$400K", status: "Small", flaw: "US investors only" },
    { name: "RealT", raised: "Bootstrap", status: "$2M fines", flaw: "Operational chaos" },
  ];

  return (
    <div className="flex-1 space-y-6">
      <div className="text-center">
        <Badge variant="outline" className="mb-4">Slide 10</Badge>
        <h2 className="text-3xl lg:text-4xl font-bold mb-2">
          $1.5B Raised. <span className="text-destructive">All Hit the Same Wall.</span>
        </h2>
        <p className="text-muted-foreground">
          They proved demand exists. Now we serve the other 95%.
        </p>
      </div>

      {/* Competitor Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {competitors.map((comp) => (
          <div 
            key={comp.name}
            className="p-4 bg-card/50 rounded-lg border border-border/50"
          >
            <div className="font-semibold text-sm mb-1">{comp.name}</div>
            <div className="text-lg font-bold text-primary">{comp.raised}</div>
            <div className="text-xs text-muted-foreground mt-1">{comp.status}</div>
            <div className="text-xs text-destructive mt-2 font-medium">⚠ {comp.flaw}</div>
          </div>
        ))}
      </div>

      {/* The Gap */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-destructive/10 border-destructive/30">
          <CardContent className="p-4">
            <h3 className="font-semibold text-destructive mb-2 flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Their Ceiling
            </h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• FICO-dependent = US-only</li>
              <li>• No cross-border enforcement</li>
              <li>• Divvy sold at 50% haircut</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-primary/10 border-primary/30">
          <CardContent className="p-4">
            <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Ancient's Solution
            </h3>
            <ul className="text-sm space-y-1">
              <li>• Title-Retention Protocol</li>
              <li>• OCCR = borderless credit</li>
              <li>• Smart-contract enforcement</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Punchline */}
      <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-xl border border-primary/20">
        <p className="font-bold">We're not the "Divvy for X."</p>
        <p className="text-primary font-bold">We're building what they can't — the global mortgage layer.</p>
      </div>
    </div>
  );
}

function Slide11Investment() {
  return (
    <div className="flex-1 space-y-6">
      <div className="text-center">
        <Badge variant="outline" className="mb-4">Slide 11</Badge>
        <h2 className="text-3xl lg:text-4xl font-bold mb-2">The BTC-Staked Investment</h2>
        <p className="text-primary font-semibold text-lg">VC Cheat Code</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* VC Deposits */}
        <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-xl">VC Deposits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "$5M in BTC as collateral", highlight: true },
              { label: "No capital deployed", highlight: false },
              { label: "No tax event", highlight: false },
              { label: "No downside (collateral returned)", highlight: false },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className={`h-5 w-5 ${item.highlight ? 'text-orange-500' : 'text-muted-foreground'}`} />
                <span className={item.highlight ? 'font-bold text-orange-500' : ''}>{item.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* VC Receives */}
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-xl">VC Receives</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "15% equity in Ancient Protocol",
              "15% of profits from Flips 1–6",
              "All BTC returned",
              "Anchor investor rights",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Ancient Receives:</p>
            <div className="flex justify-center gap-6 text-sm">
              <span><strong className="text-primary">$1.75M</strong> working capital</span>
              <span><strong className="text-primary">Zero</strong> debt</span>
              <span><strong className="text-primary">Minimal</strong> dilution</span>
              <span><strong className="text-primary">Permanent</strong> construction engine</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center p-4 bg-primary/10 rounded-xl">
        <p className="text-lg">
          <span className="font-bold">VC risk = zero.</span>{" "}
          <span className="font-bold text-primary">VC upside = enormous.</span>
        </p>
      </div>
    </div>
  );
}

function Slide12Compounding() {
  return (
    <div className="flex-1 space-y-6">
      <div className="text-center">
        <Badge variant="outline" className="mb-4">Slide 12</Badge>
        <h2 className="text-3xl lg:text-4xl font-bold mb-2">The Compounding Engine</h2>
        <p className="text-muted-foreground">
          Because of Peru margins (~48%), capital snowballs
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={compoundingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="flip" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: number) => [`$${value}M`, '']}
            />
            <Legend />
            <Bar dataKey="profit" name="Profit" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cumulative" name="Cumulative" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
        {compoundingData.map((flip) => (
          <div key={flip.flip} className="text-center p-3 bg-card/50 rounded-lg border border-border/50">
            <div className="text-xs text-muted-foreground">{flip.flip}</div>
            <div className="text-lg font-bold text-primary">${flip.profit}M</div>
            <div className="text-xs text-muted-foreground">{flip.homes} homes</div>
          </div>
        ))}
      </div>

      <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-xl border border-primary/20">
        <p className="text-lg font-medium">
          By Flip 6: <span className="text-primary font-bold">100+ homes</span> • <span className="text-primary font-bold">$10M+ treasury</span> • <span className="text-primary font-bold">Full mortgage dataset</span>
        </p>
        <p className="text-sm text-muted-foreground mt-1">Protocol ready for global developer onboarding</p>
      </div>
    </div>
  );
}

function Slide13Returns() {
  const scenarios = [
    { 
      name: "BEAR", 
      condition: "slow growth + BTC flat",
      profitShare: "$1.6M",
      equityValue: "$15M",
      total: "$16.6M",
      color: "text-yellow-500",
      bg: "from-yellow-500/10 to-yellow-500/5"
    },
    { 
      name: "BASE", 
      condition: "regional expansion + BTC $150K",
      profitShare: "$3.3M",
      equityValue: "$60M",
      total: "$71.6M",
      color: "text-primary",
      bg: "from-primary/10 to-primary/5"
    },
    { 
      name: "BULL", 
      condition: "Ancient becomes mortgage layer for Web3",
      profitShare: "$7M",
      equityValue: "$300M–$450M",
      total: "$321M–$471M",
      color: "text-green-500",
      bg: "from-green-500/10 to-green-500/5"
    },
  ];

  return (
    <div className="flex-1 space-y-6">
      <div className="text-center">
        <Badge variant="outline" className="mb-4">Slide 13</Badge>
        <h2 className="text-3xl lg:text-4xl font-bold mb-2">VC Return Scenarios</h2>
        <p className="text-primary font-semibold">CRUSHING</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {scenarios.map((scenario) => (
          <Card key={scenario.name} className={`bg-gradient-to-br ${scenario.bg} border-border/50`}>
            <CardHeader className="pb-2">
              <Badge variant="outline" className={`w-fit ${scenario.color}`}>{scenario.name}</Badge>
              <p className="text-xs text-muted-foreground">{scenario.condition}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Profit Share</span>
                <span className="font-semibold">{scenario.profitShare}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Equity Value</span>
                <span className="font-semibold">{scenario.equityValue}</span>
              </div>
              <div className="pt-2 border-t border-border/50">
                <div className="flex justify-between">
                  <span className="font-semibold">Total Return</span>
                  <span className={`font-bold ${scenario.color}`}>{scenario.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-card/50 rounded-lg border border-border/50">
          <div className="text-2xl font-bold text-primary">$0</div>
          <div className="text-sm text-muted-foreground">Capital deployed by VC</div>
        </div>
        <div className="p-4 bg-card/50 rounded-lg border border-border/50">
          <div className="text-2xl font-bold text-primary">100%</div>
          <div className="text-sm text-muted-foreground">BTC returned</div>
        </div>
        <div className="p-4 bg-card/50 rounded-lg border border-border/50">
          <div className="text-2xl font-bold text-primary">∞</div>
          <div className="text-sm text-muted-foreground">ROI</div>
        </div>
      </div>
    </div>
  );
}

function Slide14UseOfFunds() {
  return (
    <div className="flex-1 space-y-6">
      <div className="text-center">
        <Badge variant="outline" className="mb-4">Slide 14</Badge>
        <h2 className="text-3xl lg:text-4xl font-bold mb-2">Use of Funds</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPie>
              <Pie
                data={useOfFundsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {useOfFundsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value}%`, '']}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </RechartsPie>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          {[
            { pct: "70%", title: "15-Home Construction", desc: "Validation layer", color: "bg-primary" },
            { pct: "20%", title: "Protocol Engineering", desc: "MaaS, OCCR, title NFTs", color: "bg-[hsl(var(--chart-2))]" },
            { pct: "10%", title: "Legal & SPV Setup", desc: "Multi-country compliance", color: "bg-[hsl(var(--chart-3))]" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 bg-card/50 rounded-lg border border-border/50">
              <div className={`w-4 h-4 rounded ${item.color}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{item.title}</span>
                  <span className="text-primary font-bold">{item.pct}</span>
                </div>
                <span className="text-sm text-muted-foreground">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-muted-foreground">
        This is how we create the global mortgage standard.
      </div>
    </div>
  );
}

function Slide15Team() {
  return (
    <div className="flex-1 space-y-8">
      <div className="text-center">
        <Badge variant="outline" className="mb-4">Slide 15</Badge>
        <h2 className="text-3xl lg:text-4xl font-bold mb-2">Team</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-full flex items-center justify-center">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-1">Brady Williams</h3>
            <Badge className="mb-3">CEO</Badge>
            <p className="text-sm text-muted-foreground">
              Developer/operator of 12 profitable units; cross-border builder; Web3-native.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
              <Building2 className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-1">Beau</h3>
            <Badge variant="secondary" className="mb-3">Institutional Advisor</Badge>
            <p className="text-sm text-muted-foreground">
              Van Metre (6,000+ units); 70-year development pedigree.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center">
              <Zap className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-1">Engineering Team</h3>
            <Badge variant="outline" className="mb-3">Tech</Badge>
            <p className="text-sm text-muted-foreground">
              Smart contracts, tokenized assets, credit scoring, marketplace architecture.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Slide16Closing() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 bg-gradient-to-br from-background via-primary/5 to-background rounded-xl p-8">
      <h1 className="text-4xl lg:text-6xl font-bold">
        <span className="text-primary">Ancient Protocol</span>
      </h1>

      <p className="text-2xl text-muted-foreground">
        The Global Mortgage Layer They Can't Build
      </p>

      <div className="space-y-2 text-xl">
        <p><span className="text-primary font-semibold">Mortgages-as-Code.</span></p>
        <p><span className="text-primary font-semibold">Property-as-Protocol.</span></p>
        <p><span className="text-primary font-semibold">Credit-as-Liquidity.</span></p>
      </div>

      <div className="pt-8 border-t border-border/50 w-full max-w-md">
        <p className="text-2xl font-bold">
          A Financial System with <span className="text-primary">No Borders</span>.
        </p>
      </div>
    </div>
  );
}

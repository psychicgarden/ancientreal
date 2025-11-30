import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingDown, 
  Globe, 
  XCircle, 
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Building2,
  Target
} from "lucide-react";

const COMPETITORS = [
  {
    name: "Divvy Homes",
    raised: "$1.127B",
    peakValuation: "$2B",
    currentStatus: "Sold for ~$1B",
    statusDate: "Jan 2025",
    fatalFlaw: "US-only, FICO-dependent",
    details: "50% haircut from peak. Couldn't expand beyond US banking rails.",
    statusColor: "text-destructive"
  },
  {
    name: "Roofstock",
    raised: "$240M",
    peakValuation: "$1.9B",
    currentStatus: "Active but stalled",
    statusDate: "2024",
    fatalFlaw: "No global expansion path",
    details: "Tied to US SFR market. Zero international presence.",
    statusColor: "text-yellow-500"
  },
  {
    name: "Lofty AI",
    raised: "$400K",
    peakValuation: "$12M",
    currentStatus: "Small player",
    statusDate: "2024",
    fatalFlaw: "US investors only",
    details: "No buyer financing. Fractional ownership, not home buying.",
    statusColor: "text-muted-foreground"
  },
  {
    name: "RealT",
    raised: "Bootstrapped",
    peakValuation: "N/A",
    currentStatus: "$2M+ in fines",
    statusDate: "Ongoing",
    fatalFlaw: "Operational chaos",
    details: "Detroit tax liens, property management failures. Can't scale.",
    statusColor: "text-destructive"
  }
];

const MARKET_INSIGHT = {
  totalRaised: "$1.5B+",
  tamCaptured: "5%",
  tamCapturedLabel: "US only",
  ancientTam: "$300T",
  ancientTamLabel: "Global",
  multiplier: "20x",
  multiplierLabel: "larger opportunity"
};

export default function CompetitiveLandscape() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Badge variant="outline" className="mb-4 text-base px-4 py-1">
          Competitive Intelligence
        </Badge>
        <h2 className="text-3xl lg:text-4xl font-bold mb-3">
          They Proved the Market.{" "}
          <span className="text-primary">They Hit the Ceiling.</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          $1.5B+ raised by US-only players. All hit the same wall: 
          <span className="text-destructive font-semibold"> they can't operate where FICO doesn't exist.</span>
        </p>
      </div>

      {/* Competitor Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COMPETITORS.map((competitor) => (
          <Card 
            key={competitor.name} 
            className="bg-card/50 border-border/50 hover:border-border transition-colors"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{competitor.name}</CardTitle>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${competitor.statusColor}`}
                >
                  {competitor.currentStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Raised</span>
                  <p className="font-bold text-primary">{competitor.raised}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Peak Val</span>
                  <p className="font-semibold">{competitor.peakValuation}</p>
                </div>
              </div>
              
              <div className="pt-2 border-t border-border/50">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <span className="text-sm text-destructive font-medium">
                    {competitor.fatalFlaw}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {competitor.details}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* The Insight Box */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-orange-500/10 border-primary/30">
        <CardContent className="p-6 lg:p-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {/* Combined Raised */}
            <div>
              <div className="text-4xl font-bold text-primary mb-1">
                {MARKET_INSIGHT.totalRaised}
              </div>
              <p className="text-sm text-muted-foreground">
                Combined VC funding
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Divvy + Roofstock + others
              </p>
            </div>

            {/* TAM Captured */}
            <div>
              <div className="text-4xl font-bold text-destructive mb-1">
                {MARKET_INSIGHT.tamCaptured}
              </div>
              <p className="text-sm text-muted-foreground">
                of global TAM captured
              </p>
              <p className="text-xs text-destructive mt-1">
                (US-only = 5% of world)
              </p>
            </div>

            {/* Ancient Opportunity */}
            <div>
              <div className="text-4xl font-bold text-emerald-500 mb-1">
                {MARKET_INSIGHT.multiplier}
              </div>
              <p className="text-sm text-muted-foreground">
                larger addressable market
              </p>
              <p className="text-xs text-emerald-500 mt-1">
                Global nomads = 95% untapped
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Why They Can't Go Global */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Their Limitations */}
        <Card className="bg-card/50 border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Why They Can't Go Global
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "FICO dependency → 0 nomads served",
              "US foreclosure laws → can't export model",
              "No on-chain credit primitives",
              "Divvy's 50% exit proves the ceiling",
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <XCircle className="h-4 w-4 text-destructive shrink-0 mt-1" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Ancient's Advantage */}
        <Card className="bg-card/50 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="h-5 w-5" />
              What Ancient Builds Instead
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Title-Retention Protocol → works everywhere",
              "OCCR = borderless credit identity",
              "Crypto collateral → no bank dependency",
              "Smart-contract enforcement → instant recourse",
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-1" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Line */}
      <div className="text-center p-6 bg-muted/30 rounded-xl border border-border/50">
        <p className="text-lg font-medium">
          Ancient isn't competing with Divvy.{" "}
          <span className="text-primary font-bold">
            We're building what they can't.
          </span>
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          The infrastructure that lets anyone do rent-to-own financing — anywhere on Earth.
        </p>
      </div>
    </div>
  );
}

// Compact version for pitch deck slides
export function CompetitiveLandscapeSlide() {
  return (
    <div className="flex-1 space-y-6">
      <div className="text-center">
        <Badge variant="outline" className="mb-4">Competitive Landscape</Badge>
        <h2 className="text-3xl lg:text-4xl font-bold mb-2">
          $1.5B Raised. <span className="text-destructive">All Hit the Same Wall.</span>
        </h2>
        <p className="text-muted-foreground">
          They proved demand exists. Now we serve the other 95%.
        </p>
      </div>

      {/* Compact Competitor Table */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {COMPETITORS.map((comp) => (
          <div 
            key={comp.name}
            className="p-4 bg-card/50 rounded-lg border border-border/50"
          >
            <div className="font-semibold text-sm mb-1">{comp.name}</div>
            <div className="text-lg font-bold text-primary">{comp.raised}</div>
            <div className={`text-xs ${comp.statusColor} mt-1`}>
              {comp.currentStatus}
            </div>
            <div className="text-xs text-destructive mt-2 font-medium">
              ⚠ {comp.fatalFlaw}
            </div>
          </div>
        ))}
      </div>

      {/* The Gap */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-destructive/10 border-destructive/30">
          <CardContent className="p-4">
            <h3 className="font-semibold text-destructive mb-2">Their Ceiling</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• FICO-dependent = US-only</li>
              <li>• No cross-border enforcement</li>
              <li>• Divvy sold at 50% haircut</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-primary/10 border-primary/30">
          <CardContent className="p-4">
            <h3 className="font-semibold text-primary mb-2">Ancient's Solution</h3>
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
        <p className="font-bold">
          We're not the "Divvy for X."
        </p>
        <p className="text-primary font-bold">
          We're building what they can't — the global mortgage layer.
        </p>
      </div>
    </div>
  );
}

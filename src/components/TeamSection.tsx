import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Code2, TrendingUp, Award, MapPin, CheckCircle2 } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  photo?: string;
  highlights: string[];
  icon: React.ElementType;
  color: string;
}

const team: TeamMember[] = [
  {
    name: "Brady Williams",
    role: "CEO",
    highlights: [
      "12 profitable units in Peru (19.75% yields)",
      "Expert in LATAM construction, permitting, and legal structuring",
      "CEO & Founder of a Top-5 Google-rated retreat center in Peru",
    ],
    icon: Building2,
    color: "text-emerald-400",
  },
  {
    name: "Johnny",
    role: "CMO / Product",
    highlights: [
      "Scaled consumer crypto products across Base & BNB Chain",
      "Cofounder of Breadcrumb (5,800 users, 40+ integrations)",
      "Led SquadSwap BD/Marketing: $750K public raise, #3 DEX on BNB",
      "Winner: Gitcoin/Tezos (tokenomics), Algorand (marketing)",
    ],
    icon: TrendingUp,
    color: "text-blue-400",
  },
  {
    name: "Mehmet Guleryuz",
    role: "CTO",
    highlights: [
      "5+ years building high-performance blockchain infrastructure",
      "Led engineering at Breadcrumb, FloorMarkets Perp DEX, Inverter",
      "Winner: ETHGlobal + Solana Demo Day + Chainlink/Scroll/ENS",
    ],
    icon: Code2,
    color: "text-purple-400",
  },
  {
    name: "Beau (Van Metre)",
    role: "Advisor",
    highlights: [
      "Institutional Grade: From a developer of 6,000+ units",
      "Ensures operations and books are ready for institutional credit lines",
    ],
    icon: Award,
    color: "text-amber-400",
  },
];

export default function TeamSection() {
  return (
    <section className="py-16 px-4 bg-muted/20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-primary/50 text-primary">
            The Team
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Real-World Builders. <span className="text-primary">Protocol Architects.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A team that has already built and operated profitable real estate, 
            combined with deep crypto infrastructure expertise.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {team.map((member) => (
            <Card 
              key={member.name} 
              className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 hover:border-primary/30"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon Avatar */}
                  <div className={`p-3 rounded-xl bg-muted/50 ${member.color}`}>
                    <member.icon className="h-8 w-8" />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold">{member.name}</h3>
                      <Badge variant="secondary" className="text-xs">{member.role}</Badge>
                    </div>
                    
                    {/* Highlights */}
                    <ul className="space-y-2 mt-3">
                      {member.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${member.color}`} />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Traction Proof */}
        <Card className="mt-8 bg-gradient-to-r from-emerald-500/10 to-primary/10 border-emerald-500/30">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-emerald-400" />
              <h3 className="text-xl font-bold">Proof of Execution</h3>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Unlike most crypto projects, we have <span className="text-emerald-400 font-semibold">real buildings generating real yield</span>. 
              12 units live in Peru at 18–20% net yields. This isn't a whitepaper — it's a scale-up.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                12 Units Operational
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                19.75% Net Yields
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                Sacred Valley, Peru
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Home, Database, Globe, ArrowRight, Zap } from "lucide-react";
export default function AWSPitch() {
  return <section className="py-16 px-4 bg-gradient-to-br from-primary/5 via-background to-orange-500/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-primary/50">
            The 30-Second Pitch
          </Badge>
        </div>

        <Card className="bg-gradient-to-r from-primary/10 via-orange-500/10 to-primary/10 border-primary/30 overflow-hidden">
          <CardContent className="p-8 md:p-12">
            {/* Main Pitch */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                We are the{" "}
                <span className="bg-gradient-to-r from-primary via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Amazon Web Services
                </span>
                <br />
                of Real Estate
              </h2>
              
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-center gap-4 text-xl text-muted-foreground">
                  <Server className="h-8 w-8 text-orange-500" />
                  <span>Amazon built physical servers</span>
                  <ArrowRight className="h-6 w-6" />
                  <span>to sell the <span className="text-orange-500 font-semibold">Cloud</span></span>
                </div>
                
                <div className="flex items-center justify-center gap-4 text-xl text-muted-foreground">
                  <Home className="h-8 w-8 text-primary" />
                  <span>We build physical Homes</span>
                  <ArrowRight className="h-6 w-6" />
                  <span>to sell the <span className="text-primary font-semibold">Global Credit Score</span></span>
                </div>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-12">
              {[{
              label: "Units Live",
              value: "12",
              icon: Home,
              color: "text-green-500"
            }, {
              label: "Returns",
              value: "20%+",
              icon: Zap,
              color: "text-primary"
            }, {
              label: "Raise",
              value: "$1.9M",
              icon: Database,
              color: "text-orange-500"
            }, {
              label: "Margins",
              value: "80%",
              icon: Globe,
              color: "text-blue-500"
            }].map(stat => <div key={stat.label} className="text-center p-4 bg-background/50 rounded-xl">
                  <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>)}
            </div>

            {/* Pitch Script */}
            <div className="bg-background/80 rounded-xl p-6 md:p-8 border border-border/50">
              <p className="text-lg md:text-xl leading-relaxed text-foreground">
                "We are the physical entry point to the world's first <span className="text-primary font-bold">On-Chain Credit Bureau</span>.
              </p>
              <p className="text-lg md:text-xl leading-relaxed text-foreground mt-4">
                Banks require credit history. <span className="text-orange-500 font-bold">Nomads don't have one.</span> Crypto can't use one.
                So we built the missing piece—<span className="text-primary font-bold">the repayment engine</span>.
              </p>
              <p className="text-lg md:text-xl leading-relaxed text-foreground mt-4">
                <span className="text-green-500 font-bold">12 operational units</span> generating <span className="text-primary font-bold">20% real yields</span>.
                <span className="text-orange-500 font-bold">$1.9M raise</span> to expand our high-margin, fully owned construction pipeline.
                <span className="text-green-500 font-bold">Zero foreclosure risk</span> because we retain legal title end-to-end.
              </p>
              <p className="text-lg md:text-xl leading-relaxed text-foreground mt-4">
                We build the houses <span className="text-muted-foreground">(the hardware)</span>. The users build repayment history <span className="text-muted-foreground">(the data)</span>.
                Together, they create the <span className="text-primary font-bold">Global Credit Score</span>—a new identity layer for <span className="text-orange-500 font-bold">100M mobile workers</span>.
              </p>
              <p className="text-xl md:text-2xl font-semibold text-primary mt-6">
                Ancient Protocol — Building hard assets to power digital finance."
              </p>
            </div>

            {/* Tagline */}
            <div className="mt-8 text-center">
              <p className="text-2xl font-bold text-muted-foreground">
                <span className="text-primary">ANCIENT PROTOCOL</span>
              </p>
              <p className="text-lg text-muted-foreground italic mt-2">Building the Hardware to Power the Software for the worlds first On Chain Credit Score.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>;
}
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Rocket, Shield, Globe, ArrowRight, Zap } from "lucide-react";

export default function AWSPitch() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-primary/5 via-background to-orange-500/5">
      <div className="max-w-5xl mx-auto">
        <Card className="bg-gradient-to-r from-primary/10 via-orange-500/10 to-primary/10 border-primary/30 overflow-hidden">
          <CardContent className="p-8 md:p-12">
            {/* Main Pitch */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Building the Rails to Become the{" "}
                <span className="bg-gradient-to-r from-primary via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Rocket Mortgage
                </span>
                <br />
                of International Real Estate
              </h2>
              
              {/* Zero Foreclosure Risk - Lead Message */}
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-6 py-3 mb-8">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-lg font-semibold text-green-500">
                  Zero Foreclosure Risk — We Retain Legal Title End-to-End
                </span>
              </div>
              
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-center gap-4 text-xl text-muted-foreground">
                  <Rocket className="h-8 w-8 text-orange-500" />
                  <span>Rocket Mortgage digitized US home loans</span>
                </div>
                
                <div className="flex items-center justify-center gap-4 text-xl text-muted-foreground">
                  <Globe className="h-8 w-8 text-primary" />
                  <span>We're digitizing <span className="text-primary font-semibold">global mortgages</span> for the borderless economy</span>
                </div>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-12">
              {[
                {
                  label: "Units Live",
                  value: "12",
                  icon: Home,
                  color: "text-green-500"
                },
                {
                  label: "Returns",
                  value: "20%+",
                  icon: Zap,
                  color: "text-primary"
                },
                {
                  label: "Raise",
                  value: "$1.9M",
                  icon: Rocket,
                  color: "text-orange-500"
                },
                {
                  label: "ROI",
                  value: "80%",
                  icon: Globe,
                  color: "text-blue-500"
                }
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-background/50 rounded-xl">
                  <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Pitch Script */}
            <div className="bg-background/80 rounded-xl p-6 md:p-8 border border-border/50">
              <p className="text-lg md:text-xl leading-relaxed text-foreground">
                Banks require credit history. <span className="text-orange-500 font-bold">Nomads don't have one.</span> Crypto can't use one.
                So we built the missing piece—<span className="text-primary font-bold">the repayment engine</span>.
              </p>
              <p className="text-lg md:text-xl leading-relaxed text-foreground mt-4">
                Unlike traditional mortgages, <span className="text-green-500 font-bold">we retain legal title until final payment</span>.
                No courts. No foreclosure delays. <span className="text-green-500 font-bold">Zero capital at risk.</span>
              </p>
              <p className="text-lg md:text-xl leading-relaxed text-foreground mt-4">
                <span className="text-green-500 font-bold">12 operational units</span> proving the model at <span className="text-primary font-bold">20% real yields</span>.
                $1.9M to scale the rails globally.
              </p>
              <p className="text-lg md:text-xl leading-relaxed text-foreground mt-4">
                We're not just building houses. We're building <span className="text-primary font-bold">the infrastructure layer</span> that turns real estate into programmable, borderless credit.
              </p>
            </div>

            {/* Tagline */}
            <div className="mt-8 text-center">
              <p className="text-2xl font-bold text-muted-foreground">
                <span className="text-primary">ANCIENT PROTOCOL</span>
              </p>
              <p className="text-lg text-muted-foreground italic mt-2">
                The Rocket Mortgage for the Borderless Economy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

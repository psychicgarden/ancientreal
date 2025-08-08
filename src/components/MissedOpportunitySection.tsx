import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calculator, Clock, Home, Zap } from "lucide-react";
import { useState } from "react";
import SectionHeader from "@/components/SectionHeader";
const MissedOpportunitySection = () => {
  const [activeScenario, setActiveScenario] = useState("rent");
  const scenarios = {
    rent: {
      title: "Keep Renting",
      subtitle: "The status quo",
      monthly: 1800,
      yearlyTotal: 21600,
      tenYearTotal: 216000,
      finalEquity: 0,
      color: "text-red-500",
      bgColor: "from-red-500/10 to-red-500/5"
    },
    ancient: {
      title: "Ancient Path",
      subtitle: "Property ownership",
      monthly: 1456,
      yearlyTotal: 17472,
      tenYearTotal: 174720,
      finalEquity: 467000,
      color: "text-green-500",
      bgColor: "from-green-500/10 to-green-500/5"
    }
  };
  return <section className="px-6 py-[25px]">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          
          <SectionHeader
            title="Your Money, Your Choice"
            subtitle="What if you stopped renting? Every month you choose: build someone else's wealth, or build your own."
          />

          {/* Interactive Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-muted/30 backdrop-blur-sm rounded-2xl p-2 inline-flex gap-2">
              <button onClick={() => setActiveScenario("rent")} className={`px-6 py-3 rounded-xl font-medium transition-all ${activeScenario === "rent" ? "bg-red-500 text-white shadow-lg" : "text-muted-foreground hover:text-foreground"}`}>
                <Home className="w-4 h-4 mr-2 inline" />
                Keep Renting
              </button>
              <button onClick={() => setActiveScenario("ancient")} className={`px-6 py-3 rounded-xl font-medium transition-all ${activeScenario === "ancient" ? "bg-green-500 text-white shadow-lg" : "text-muted-foreground hover:text-foreground"}`}>
                <TrendingUp className="w-4 h-4 mr-2 inline" />
                Start Building Equity
              </button>
            </div>
          </div>

          {/* Dynamic Results Display */}
          <div className="mb-16">
            <Card className={`bg-gradient-to-br ${scenarios[activeScenario].bgColor} border-border/30 overflow-hidden transform transition-all duration-500 scale-105`}>
              <CardContent className="p-12 text-center">
                <div className="mb-8">
                  <h3 className="text-3xl font-light mb-2">{scenarios[activeScenario].title}</h3>
                  <p className="text-lg text-muted-foreground">{scenarios[activeScenario].subtitle}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                  <div>
                    <div className={`text-4xl font-light ${scenarios[activeScenario].color} mb-2`}>
                      ${scenarios[activeScenario].monthly.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground font-light tracking-wide uppercase">Monthly Payment</div>
                  </div>
                  <div>
                    <div className={`text-4xl font-light ${scenarios[activeScenario].color} mb-2`}>
                      ${scenarios[activeScenario].yearlyTotal.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground font-light tracking-wide uppercase">Yearly Total</div>
                  </div>
                  <div>
                    <div className={`text-4xl font-light ${scenarios[activeScenario].color} mb-2`}>
                      ${scenarios[activeScenario].tenYearTotal.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground font-light tracking-wide uppercase">10-Year Total</div>
                  </div>
                  <div>
                    <div className={`text-5xl font-bold ${scenarios[activeScenario].color} mb-2`}>
                      ${scenarios[activeScenario].finalEquity.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground font-light tracking-wide uppercase">Final Equity</div>
                  </div>
                </div>

                {activeScenario === "ancient" && <div className="bg-background/40 backdrop-blur-sm rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-center gap-4 text-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">+$292K</div>
                        <div className="text-xs text-muted-foreground">vs. Renting</div>
                      </div>
                      <div className="w-px h-8 bg-border" />
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">181%</div>
                        <div className="text-xs text-muted-foreground">ROI</div>
                      </div>
                      <div className="w-px h-8 bg-border" />
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gold">$30K</div>
                        <div className="text-xs text-muted-foreground">Down Only</div>
                      </div>
                    </div>
                  </div>}

                <div className="text-lg text-muted-foreground font-light">
                  {activeScenario === "rent" ? "After 10 years: You've paid $216,000 and own nothing. Time to find a new rental." : "After 10 years: You own a $467,000 property. Plus you earned rental income along the way."}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline Visualization */}
          <div className="mb-16">
            <h3 className="text-2xl font-light text-center mb-8">The Path Forward</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <Card className="bg-background/60 backdrop-blur-sm border-border/30">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Today</h4>
                  <p className="text-muted-foreground font-light">
                    Stop the rent cycle. Put down $30K and start building equity instead of burning cash.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background/60 backdrop-blur-sm border-border/30">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Years 1-10</h4>
                  <p className="text-muted-foreground font-light">
                    Pay less monthly than rent. Earn rental income. Build equity. Live in paradise.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background/60 backdrop-blur-sm border-border/30">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Year 10+</h4>
                  <p className="text-muted-foreground font-light">
                    Own a $467K property free and clear. Rent it out or live mortgage-free forever.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          

        </div>
      </div>
    </section>;
};
export default MissedOpportunitySection;
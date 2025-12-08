import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bitcoin, Globe, XCircle, ArrowRight } from "lucide-react";

export default function MarketFailure() {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2">
            The Market Failure
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Two Worlds <span className="text-destructive">Disconnected</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            No bridge exists to connect <span className="text-primary font-semibold">Trapped Crypto Wealth</span> with{" "}
            <span className="text-primary font-semibold">Real World Housing Demand</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Supply Side - Crypto Whales */}
          <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/30">
            <CardHeader>
              <Badge className="w-fit bg-orange-500/20 text-orange-500 border-orange-500/30 mb-2">
                SUPPLY SIDE
              </Badge>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Bitcoin className="h-8 w-8 text-orange-500" />
                The Crypto Whale
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Problem:</p>
                    <p className="text-muted-foreground">Holds millions in BTC/ETH but is "homeless" in the fiat world</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Friction:</p>
                    <p className="text-muted-foreground">Selling crypto triggers massive capital gains tax and loss of upside</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Result:</p>
                    <p className="text-muted-foreground">$1 Trillion sits dormant on-chain, earning low yield</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-orange-500/20">
                <p className="text-3xl font-bold text-orange-500">$1T+</p>
                <p className="text-sm text-muted-foreground">Trapped Crypto Wealth</p>
              </div>
            </CardContent>
          </Card>

          {/* Demand Side - Global Nomads */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <CardHeader>
              <Badge className="w-fit bg-blue-500/20 text-blue-500 border-blue-500/30 mb-2">
                DEMAND SIDE
              </Badge>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Globe className="h-8 w-8 text-blue-500" />
                The Global Nomad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Problem:</p>
                    <p className="text-muted-foreground">Earns high income ($5k-$10k/mo) but has Zero FICO Score</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Friction:</p>
                    <p className="text-muted-foreground">Rejected by legacy banks globally despite strong cash flow</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Result:</p>
                    <p className="text-muted-foreground">A massive, credit-worthy demographic is forced to rent forever</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-blue-500/20">
                <p className="text-3xl font-bold text-blue-500">50M+</p>
                <p className="text-sm text-muted-foreground">Credit-Invisible Global Nomads</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* The Void */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <ArrowRight className="h-12 w-12 text-destructive/30" />
          </div>
          <Card className="bg-gradient-to-r from-destructive/10 via-destructive/20 to-destructive/10 border-destructive/30">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-destructive mb-2">THE VOID</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                There is <span className="text-destructive font-bold">no trusted way</span> to collateralize crypto into real estate at scale.
                No bridge exists to connect <span className="font-semibold">Trapped Crypto Wealth</span> with{" "}
                <span className="font-semibold">Real World Housing Demand</span>.
              </p>
              <div className="mt-6 p-4 bg-background/50 rounded-lg inline-block">
                <p className="text-primary font-bold text-xl">
                  Ancient is building the missing financial rail.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Why Now / Perfect Storm Section */}
        <div className="mt-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              🌪 Perfect Storm: <span className="text-primary">Why Now?</span>
            </h2>
            <div className="max-w-4xl mx-auto text-xl text-muted-foreground">
              <p>
                <strong className="text-primary text-2xl">🌎 100M+ Digital Nomads by 2030, Zero Mortgage Infrastructure</strong>
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[{
              icon: "📈",
              title: "Digital-Nomad Boom",
              stat: "50M → 100M+",
              desc: "6× growth since 2019, accelerating toward 100M+ by 2030"
            }, {
              icon: "⚖",
              title: "Tokenized Real Estate",
              stat: "$310M → $1.4T by 2030",
              desc: "Real-estate RWAs have 4X'd in the past 18 months."
            }, {
              icon: "💻",
              title: "Remote Work Default",
              stat: "80%",
              desc: "White-collar staff work hybrid/remote, severing income from geography"
            }, {
              icon: "🏠",
              title: "Affordability Crisis",
              stat: "8× Income",
              desc: "Median home prices vs. household income—worst ratio in four decades"
            }, {
              icon: "🕰",
              title: "Delayed Homeownership",
              stat: "29 → 36",
              desc: "U.S. first-time-buyer age climbed 7 years in a decade"
            }, {
              icon: "💰",
              title: "Millennial Capital",
              stat: "$5T Liquid",
              desc: "Massive wealth, yet <50% own homes due to geographic constraints"
            }, {
              icon: "🏛",
              title: "Institutional Scale-Up",
              stat: "$5M → $1B+",
              desc: "BlackRock's BUIDL Fund, launched Mar 2024, surpassed $1B AUM in under 12 months—a 200× growth, signaling rapid institutional adoption."
            }, {
              icon: "🗺",
              title: "Visas & Tokenization Take Off",
              stat: "50+ Countries",
              desc: "Nomad visas have exploded from 6 to 66+ nations since 2019. At the same time, real estate tokenization has moved from pilots to legal frameworks in the US, UK, EU, UAE, Singapore, Switzerland, Mexico, Brazil, India—with new markets opening monthly."
            }, {
              icon: "💸",
              title: "Global Mortgage Blackout",
              stat: "$750B",
              desc: "If just 10% of 50M digital nomads wanted $150K homes, that's a $750B TAM with a $250B immediate gap. Legacy banks leave the most mobile workforce locked out."
            }].map(trend => (
              <Card key={trend.title} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">{trend.icon}</div>
                  <div className="text-2xl font-bold text-primary mb-2">{trend.stat}</div>
                  <h3 className="text-lg font-semibold mb-2">{trend.title}</h3>
                  <p className="text-sm text-muted-foreground">{trend.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

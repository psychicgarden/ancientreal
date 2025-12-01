import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Percent, Calendar, Rocket, Shield, ArrowRight } from "lucide-react";

export default function ReturnProfile() {
  return (
    <section className="py-16 px-4 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-green-500/50 text-green-500">
            Investor Returns
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The <span className="text-green-500">Return Profile</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            $1.75M Loan (Staked BTC) + 15% Equity Warrants
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Cash-on-Cash Return */}
          <Card className="bg-card/50 border-border/50 overflow-hidden">
            <CardHeader className="bg-blue-500/10 border-b border-blue-500/20">
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <DollarSign className="h-5 w-5" />
                Cash-on-Cash Return (The Yield)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Annual Distribution</p>
                <p className="text-3xl font-bold text-blue-400">15% of Protocol Profits</p>
                <p className="text-sm text-muted-foreground mt-1">Paid annually while loan is active</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Year 1-3 Payout</span>
                  </div>
                  <span className="font-bold text-green-400">~$400K Total</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Principal Return</span>
                  </div>
                  <span className="font-bold text-primary">$5M BTC by Year 3</span>
                </div>
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-sm text-green-400 font-semibold">
                  ✓ Zero Capital Deployed — BTC never sold, no tax event
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Equity Return */}
          <Card className="bg-card/50 border-border/50 overflow-hidden">
            <CardHeader className="bg-purple-500/10 border-b border-purple-500/20">
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Percent className="h-5 w-5" />
                Equity Return (The Warrants)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Equity Stake</p>
                <p className="text-3xl font-bold text-purple-400">15% of OpCo</p>
                <p className="text-sm text-muted-foreground mt-1">Ancient Protocol Inc.</p>
              </div>

              <div className="space-y-4">
                {/* Year 5 Exit */}
                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Year 5 Exit</Badge>
                    <span className="text-xs text-muted-foreground">Series B/C</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Valuation</p>
                      <p className="text-xl font-bold">$290M</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">15% Stake Value</p>
                      <p className="text-xl font-bold text-green-400">$43.5M</p>
                    </div>
                  </div>
                </div>

                {/* Year 10 Exit */}
                <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Year 10 Exit</Badge>
                    <span className="text-xs text-muted-foreground">IPO/Token</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Valuation</p>
                      <p className="text-xl font-bold">$4.5B</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">15% Stake Value</p>
                      <p className="text-xl font-bold text-green-400">$675M</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Return Scenarios Comparison */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Return Scenarios on Zero Deployed Capital
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Bear Case */}
              <div className="p-6 bg-orange-500/10 border border-orange-500/30 rounded-xl text-center">
                <Badge className="mb-4 bg-orange-500/20 text-orange-400 border-orange-500/30">BEAR</Badge>
                <p className="text-sm text-muted-foreground mb-2">Conservative Exit</p>
                <p className="text-4xl font-bold text-orange-400">$16.6M</p>
                <p className="text-xs text-muted-foreground mt-2">Year 5 @ 3× multiple</p>
              </div>

              {/* Base Case */}
              <div className="p-6 bg-primary/10 border border-primary/30 rounded-xl text-center">
                <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">BASE</Badge>
                <p className="text-sm text-muted-foreground mb-2">Expected Outcome</p>
                <p className="text-4xl font-bold text-primary">$63.3M</p>
                <p className="text-xs text-muted-foreground mt-2">Year 7 @ 15× multiple</p>
              </div>

              {/* Bull Case */}
              <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
                <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30">BULL</Badge>
                <p className="text-sm text-muted-foreground mb-2">Full Protocol Scale</p>
                <p className="text-4xl font-bold text-green-400">$675M+</p>
                <p className="text-xs text-muted-foreground mt-2">Year 10 @ 20× multiple</p>
              </div>
            </div>

            {/* Key Point */}
            <div className="mt-8 p-4 bg-muted/30 rounded-lg flex items-center gap-4">
              <Rocket className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold">The "Venture Staking" Advantage</p>
                <p className="text-sm text-muted-foreground">
                  BTC collateral backs the debt (returned in full). Equity upside is unlimited. 
                  <span className="text-green-400 font-semibold"> Risk: Zero. Upside: Infinite.</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, PieChart, DollarSign, Home, Users, Zap } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { SimpleFractionalProperties } from "@/components/SimpleFractionalProperties";
import { UserFractionalPortfolio } from "@/components/UserFractionalPortfolio";
import { LiquidityTradingHub } from "@/components/LiquidityTradingHub";
import ErrorBoundary from "@/components/ErrorBoundary";


const InvestorPortal = () => {
  const { isConnected } = useWallet();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-32 pb-8 px-6">
        <div className="container mx-auto">
          <Tabs defaultValue="properties" className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Investor Portal
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                Own fractional shares of premium real estate properties and unlock exclusive travel benefits through our tier system.
              </p>

              <TabsList className="grid grid-cols-3 w-fit mx-auto">
                <TabsTrigger value="properties" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Browse Properties
                </TabsTrigger>
                <TabsTrigger value="portfolio" className="flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  My Portfolio
                </TabsTrigger>
                <TabsTrigger value="defi" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  DeFi Trading Hub
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="properties" className="space-y-16">
              {/* Investment Features */}
              <section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-card border-accent/20">
                    <CardHeader>
                      <PieChart className="w-8 h-8 text-gold mb-2" />
                      <CardTitle>Fractional Ownership</CardTitle>
                      <CardDescription>
                        Buy shares starting from just $50 in premium properties
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="bg-gradient-card border-accent/20">
                    <CardHeader>
                      <TrendingUp className="w-8 h-8 text-gold mb-2" />
                      <CardTitle>Monthly Income</CardTitle>
                      <CardDescription>
                        Earn rental income proportional to your ownership percentage
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="bg-gradient-card border-accent/20">
                    <CardHeader>
                      <Users className="w-8 h-8 text-gold mb-2" />
                      <CardTitle>Travel Benefits</CardTitle>
                      <CardDescription>
                        Unlock free stays and exclusive perks through our tier system
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="bg-gradient-card border-accent/20">
                    <CardHeader>
                      <DollarSign className="w-8 h-8 text-gold mb-2" />
                      <CardTitle>Instant Liquidity</CardTitle>
                      <CardDescription>
                        Trade your shares anytime on our secondary marketplace
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </section>

              {/* Available Properties */}
              <section>
                <h2 className="text-3xl font-bold text-center mb-12">Available Properties</h2>
                <SimpleFractionalProperties />
              </section>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-8">
              <UserFractionalPortfolio />
            </TabsContent>


            <TabsContent value="defi">
              <ErrorBoundary>
                <LiquidityTradingHub />
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </div>
      </div>

    </div>
  );
};

export default InvestorPortal;
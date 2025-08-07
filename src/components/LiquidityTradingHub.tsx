import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { EnhancedSecondaryMarketplace } from "@/components/EnhancedSecondaryMarketplace";
import { EnhancedCollateralLending } from "@/components/EnhancedCollateralLending";
import { YieldFarmingDashboard } from "@/components/YieldFarmingDashboard";
import { PeerToPeerTrading } from "@/components/PeerToPeerTrading";
import { SecondaryMarketplace } from "@/components/SecondaryMarketplace";
import { SimpleStaking } from "@/components/SimpleStaking";
import { SimpleBorrowing } from "@/components/SimpleBorrowing";
import { BeginnerPortfolioSummary } from "@/components/BeginnerPortfolioSummary";
import { InvestorTierStatus } from "@/components/InvestorTierStatus";
import { TrendingUp, Handshake, DollarSign, Zap, GraduationCap, Settings } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const LiquidityTradingHub = () => {
  const [isBeginnerMode, setIsBeginnerMode] = useState(true);
  const [activeTab, setActiveTab] = useState(isBeginnerMode ? "overview" : "marketplace");

  // Update active tab when mode changes
  React.useEffect(() => {
    setActiveTab(isBeginnerMode ? "overview" : "marketplace");
  }, [isBeginnerMode]);

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex justify-between items-start">
        <div className="text-center space-y-4 flex-1">
          <h1 className="text-3xl font-bold">
            {isBeginnerMode ? "Property Investment Hub" : "DeFi Trading & Liquidity Hub"}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isBeginnerMode 
              ? "Simple 3-step process: Buy property tokens, stake for income, borrow cash instantly"
              : "Advanced decentralized trading, lending, and yield farming powered by our proprietary smart contracts"
            }
          </p>
          {!isBeginnerMode && (
            <div className="flex justify-center gap-2 flex-wrap">
              <Badge className="bg-green-100 text-green-700">AMM Liquidity Pools</Badge>
              <Badge className="bg-blue-100 text-blue-700">Smart Contract Escrow</Badge>
              <Badge className="bg-purple-100 text-purple-700">Auto-Compounding Yields</Badge>
              <Badge className="bg-orange-100 text-orange-700">Token Collateral Lending</Badge>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3 bg-muted/50 p-3 rounded-lg">
          <GraduationCap className="h-4 w-4" />
          <Label htmlFor="mode-toggle" className="text-sm font-medium">
            {isBeginnerMode ? "Beginner" : "Pro Mode"}
          </Label>
          <Switch
            id="mode-toggle"
            checked={!isBeginnerMode}
            onCheckedChange={(checked) => setIsBeginnerMode(!checked)}
          />
          <Settings className="h-4 w-4" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {isBeginnerMode ? (
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="buy" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Buy Tokens
            </TabsTrigger>
            <TabsTrigger value="stake" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Stake & Earn
            </TabsTrigger>
            <TabsTrigger value="borrow" className="flex items-center gap-2">
              <Handshake className="h-4 w-4" />
              Borrow Cash
            </TabsTrigger>
          </TabsList>
        ) : (
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="lending" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Collateral Lending
            </TabsTrigger>
            <TabsTrigger value="yield-farming" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Yield Farming
            </TabsTrigger>
            <TabsTrigger value="p2p-trading" className="flex items-center gap-2">
              <Handshake className="h-4 w-4" />
              P2P Trading
            </TabsTrigger>
          </TabsList>
        )}

        {/* Beginner Mode Content */}
        {isBeginnerMode && (
          <>
            <TabsContent value="overview">
              <BeginnerPortfolioSummary />
            </TabsContent>

            <TabsContent value="buy">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Buy Tokens</h2>
                  <p className="text-muted-foreground">Peer-to-peer fractional offerings from real property owners. Buy at their listed speculation price and trade exposure to appreciation.</p>
                </div>
                
                {/* Ancient Investor Tier Status in Buy Tokens */}
                <InvestorTierStatus totalInvestmentAmount={75000} className="mb-6" />
                
                <ErrorBoundary>
                  <SecondaryMarketplace />
                </ErrorBoundary>
              </div>
            </TabsContent>

            <TabsContent value="stake">
              <SimpleStaking />
            </TabsContent>

            <TabsContent value="borrow">
              <SimpleBorrowing />
            </TabsContent>
          </>
        )}

        {/* Pro Mode Content */}
        {!isBeginnerMode && (
          <>
            <TabsContent value="marketplace">
              <EnhancedSecondaryMarketplace />
            </TabsContent>

            <TabsContent value="lending">
              <EnhancedCollateralLending />
            </TabsContent>

            <TabsContent value="yield-farming">
              <YieldFarmingDashboard />
            </TabsContent>

            <TabsContent value="p2p-trading">
              <PeerToPeerTrading />
            </TabsContent>
          </>
        )}

        {/* Mode Transition Help */}
        {isBeginnerMode && (
          <div className="text-center p-6 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/30">
            <h3 className="text-lg font-semibold mb-2">Ready for More Advanced Features?</h3>
            <p className="text-muted-foreground mb-4">
              Switch to Pro Mode to access advanced DeFi trading, flash loans, liquidation bots, and more sophisticated tools.
            </p>
            <Button 
              onClick={() => setIsBeginnerMode(false)}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Upgrade to Pro Mode
            </Button>
          </div>
        )}
      </Tabs>
    </div>
  );
};
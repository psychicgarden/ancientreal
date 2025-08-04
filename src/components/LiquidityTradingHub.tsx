import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SecondaryMarketplace } from "@/components/SecondaryMarketplace";
import { CollateralLending } from "@/components/CollateralLending";
import { YieldFarmingDashboard } from "@/components/YieldFarmingDashboard";
import { PeerToPeerTrading } from "@/components/PeerToPeerTrading";
import { TrendingUp, Handshake, DollarSign, Zap } from "lucide-react";

export const LiquidityTradingHub = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">DeFi Trading & Liquidity Hub</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Advanced decentralized trading, lending, and yield farming powered by our proprietary smart contracts
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge className="bg-green-100 text-green-700">AMM Liquidity Pools</Badge>
          <Badge className="bg-blue-100 text-blue-700">Smart Contract Escrow</Badge>
          <Badge className="bg-purple-100 text-purple-700">Auto-Compounding Yields</Badge>
          <Badge className="bg-orange-100 text-orange-700">Token Collateral Lending</Badge>
        </div>
      </div>

      <Tabs defaultValue="marketplace" className="space-y-6">
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

        <TabsContent value="marketplace">
          <SecondaryMarketplace />
        </TabsContent>

        <TabsContent value="lending">
          <CollateralLending />
        </TabsContent>

        <TabsContent value="yield-farming">
          <YieldFarmingDashboard />
        </TabsContent>

        <TabsContent value="p2p-trading">
          <PeerToPeerTrading />
        </TabsContent>
      </Tabs>
    </div>
  );
};
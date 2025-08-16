import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SimpleFractionalProperties } from "@/components/SimpleFractionalProperties";
import { PeerToPeerTrading } from "@/components/PeerToPeerTrading";
import { TrendingUp, Handshake, DollarSign } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const LiquidityTradingHub = () => {
  const [activeTab, setActiveTab] = useState("browse");

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Fractional Property Marketplace</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Own fractional shares of premium travel properties. Earn rental income and unlock exclusive travel benefits through our tier system.
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge className="bg-green-100 text-green-700">Fractional Ownership</Badge>
          <Badge className="bg-blue-100 text-blue-700">Monthly Income</Badge>
          <Badge className="bg-purple-100 text-purple-700">Travel Benefits</Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Browse Properties
          </TabsTrigger>
          <TabsTrigger value="trade" className="flex items-center gap-2">
            <Handshake className="h-4 w-4" />
            Trade Shares
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          <ErrorBoundary>
            <SimpleFractionalProperties />
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="trade">
          <ErrorBoundary>
            <PeerToPeerTrading />
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
};
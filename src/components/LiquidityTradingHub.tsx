import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PropertySharesInterface } from "@/components/PropertySharesInterface";
import { EquityTradingInterface } from "@/components/EquityTradingInterface";
import { MortgageGroupsInterface } from "@/components/MortgageGroupsInterface";
import { BeginnerPortfolioSummary } from "@/components/BeginnerPortfolioSummary";
import { MortgageGroupsExplanation } from "@/components/MortgageGroupsExplanation";
import { SimpleTokenExplanation } from "@/components/SimpleTokenExplanation";
import { TrendingUp, Handshake, DollarSign, Zap, GraduationCap, Settings, Users } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const LiquidityTradingHub = () => {
  const [activeTab, setActiveTab] = useState("groups");


  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Property Investment Hub</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Three ways to invest in real estate: Join mortgage groups, buy individual property shares, or trade equity with other investors.
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge className="bg-green-100 text-green-700">Collective Ownership</Badge>
          <Badge className="bg-blue-100 text-blue-700">Fractional Shares</Badge>
          <Badge className="bg-purple-100 text-purple-700">Peer-to-Peer Trading</Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Join Groups
          </TabsTrigger>
          <TabsTrigger value="shares" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Buy Shares
          </TabsTrigger>
          <TabsTrigger value="trade" className="flex items-center gap-2">
            <Handshake className="h-4 w-4" />
            Trade Equity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="groups">
          <div className="space-y-6">
            <MortgageGroupsExplanation />
            <ErrorBoundary>
              <MortgageGroupsInterface />
            </ErrorBoundary>
          </div>
        </TabsContent>

        <TabsContent value="shares">
          <div className="space-y-6">
            <SimpleTokenExplanation />
            <ErrorBoundary>
              <PropertySharesInterface />
            </ErrorBoundary>
          </div>
        </TabsContent>

        <TabsContent value="trade">
          <ErrorBoundary>
            <EquityTradingInterface />
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
};
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
import { TrendingUp, Handshake, DollarSign, Zap, GraduationCap, Settings, Users, Banknote } from "lucide-react";
import { SafeBorrowing } from "@/components/SafeBorrowing";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const LiquidityTradingHub = () => {
  const [activeTab, setActiveTab] = useState("groups");


  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Property Investment Hub</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Four ways to engage with real estate: Join mortgage groups with 20% down payments, buy individual property shares, trade equity with other investors, or borrow cash against your equity.
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge className="bg-green-100 text-green-700">20% Down Payment Groups</Badge>
          <Badge className="bg-blue-100 text-blue-700">Fractional Shares + Tier Benefits</Badge>
          <Badge className="bg-purple-100 text-purple-700">Peer-to-Peer Trading</Badge>
          <Badge className="bg-orange-100 text-orange-700">Collateral Lending</Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
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
          <TabsTrigger value="borrow" className="flex items-center gap-2">
            <Banknote className="h-4 w-4" />
            Borrow Cash
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

        <TabsContent value="borrow">
          <ErrorBoundary>
            <SafeBorrowing />
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
};
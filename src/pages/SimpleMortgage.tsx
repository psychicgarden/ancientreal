import React from 'react';
import { PropertyInvestmentInterface } from '@/components/PropertyInvestmentInterface';
import { EnhancedMortgageSystem } from '@/components/EnhancedMortgageSystem';
import { KYCAdminInterface } from '@/components/KYCAdminInterface';
import { BusinessModelSummary } from '@/components/BusinessModelSummary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, BarChart3, Shield } from 'lucide-react';

export default function SimpleMortgage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            AncientMortgage Platform
          </h1>
          <p className="text-lg text-muted-foreground">
            Full business model with revenue generation, investor yields, and property NFTs
          </p>
        </div>

        {/* Business Model Summary */}
        <div className="mb-8">
          <BusinessModelSummary />
        </div>

        <Tabs defaultValue="interface" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="interface" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Property Purchase
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Mortgage Dashboard
            </TabsTrigger>
            <TabsTrigger value="kyc" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              KYC Admin
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="interface" className="space-y-6">
            <PropertyInvestmentInterface />
          </TabsContent>
          
          <TabsContent value="dashboard" className="space-y-6">
            <EnhancedMortgageSystem />
          </TabsContent>
          
          <TabsContent value="kyc" className="space-y-6">
            <KYCAdminInterface />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
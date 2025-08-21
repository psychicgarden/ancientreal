import React from 'react';
import { SimpleAvaxMortgageInterface } from '@/components/SimpleAvaxMortgageInterface';
import { SimpleMortgageDashboard } from '@/components/SimpleMortgageDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, BarChart3 } from 'lucide-react';

export default function SimpleMortgage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Fractional Real Estate Investment
          </h1>
          <p className="text-lg text-muted-foreground">
            Own premium real estate through blockchain-powered fractional ownership
          </p>
        </div>

        <Tabs defaultValue="interface" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="interface" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Investment Platform
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Mortgage Dashboard
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="interface" className="space-y-6">
            <SimpleAvaxMortgageInterface />
          </TabsContent>
          
          <TabsContent value="dashboard" className="space-y-6">
            <SimpleMortgageDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
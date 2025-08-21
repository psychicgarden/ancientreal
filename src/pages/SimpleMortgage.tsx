import React from 'react';
import { SimpleAvaxMortgageInterface } from '@/components/SimpleAvaxMortgageInterface';
import { SimpleAvaxMortgageDeployment } from '@/components/SimpleAvaxMortgageDeployment';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Wrench } from 'lucide-react';

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
            <TabsTrigger value="deployment" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Platform Setup
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="interface" className="space-y-6">
            <SimpleAvaxMortgageInterface />
          </TabsContent>
          
          <TabsContent value="deployment" className="space-y-6">
            <SimpleAvaxMortgageDeployment />
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>🏠 Blockchain Real Estate Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span>Fractional ownership of premium properties</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span>Transparent blockchain-secured investments</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span>Direct AVAX payments - no intermediaries</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span>Real-time portfolio tracking</span>
                </div>
                <div className="text-muted-foreground mt-3">
                  <strong>Note:</strong> Investment platform requires blockchain infrastructure deployment for full functionality.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
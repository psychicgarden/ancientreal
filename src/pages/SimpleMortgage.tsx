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
            Simple AVAX Mortgage
          </h1>
          <p className="text-lg text-muted-foreground">
            Native AVAX mortgage payments - no tokens, no approvals, just simple transfers
          </p>
        </div>

        <Tabs defaultValue="interface" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="interface" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Mortgage Interface
            </TabsTrigger>
            <TabsTrigger value="deployment" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Deploy Contract
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="interface" className="space-y-6">
            <SimpleAvaxMortgageInterface />
          </TabsContent>
          
          <TabsContent value="deployment" className="space-y-6">
            <SimpleAvaxMortgageDeployment />
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>⚡ AVAX Native Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span>No ERC20 token approvals needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span>No faucet required - use testnet AVAX</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span>Simple payable functions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span>Instant transfers with msg.value</span>
                </div>
                <div className="text-muted-foreground mt-3">
                  <strong>Note:</strong> SimpleAvaxMortgage contract needs to be deployed to test this version.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
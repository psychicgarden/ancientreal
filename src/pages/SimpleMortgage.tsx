import React from 'react';
import { SimpleMortgageInterface } from '@/components/SimpleMortgageInterface';
import { SimpleMortgageDeployment } from '@/components/SimpleMortgageDeployment';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Wrench } from 'lucide-react';

export default function SimpleMortgage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Simple Mortgage System
          </h1>
          <p className="text-lg text-muted-foreground">
            Clean, focused mortgage payments on blockchain
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
            <SimpleMortgageInterface />
          </TabsContent>
          
          <TabsContent value="deployment" className="space-y-6">
            <SimpleMortgageDeployment />
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>📋 Current Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <strong>Test USDT:</strong> 0x43eCed1b7C1BDc6522Db5a2F39905Cc0E3CE7F28 ✅
                </div>
                <div>
                  <strong>SimpleMortgage:</strong> Not deployed (use deployment tab)
                </div>
                <div className="text-muted-foreground">
                  Deploy the SimpleMortgage contract first, then use the interface tab.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
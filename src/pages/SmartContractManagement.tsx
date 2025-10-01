// Smart Contract Management Page
// Central hub for deploying and managing enhanced smart contracts

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedContractDeployment } from '@/components/EnhancedContractDeployment';
import { EnhancedPropertyInterface } from '@/components/EnhancedPropertyInterface';
import { SmartContractPropertyPurchase } from '@/components/SmartContractPropertyPurchase';
import { SimpleMortgageDashboard } from '@/components/SimpleMortgageDashboard';
import { 
  Rocket, 
  Database, 
  Home, 
  Settings, 
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';

const SmartContractManagement = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="w-px h-6 bg-border" />
              <Badge variant="outline" className="text-xs">
                Admin Tools
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Smart Contract Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Deploy and manage enhanced smart contracts with property storage and NFT support
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => window.open('https://testnet.snowtrace.io', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Explorer
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Contract</p>
                  <p className="text-lg font-bold">SimpleAvaxMortgage</p>
                  <p className="text-xs text-muted-foreground">Missing property storage</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Enhanced Contract</p>
                  <p className="text-lg font-bold">Ready to Deploy</p>
                  <p className="text-xs text-muted-foreground">With NFT & storage</p>
                </div>
                <Rocket className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Database Sync</p>
                  <p className="text-lg font-bold">Configured</p>
                  <p className="text-xs text-muted-foreground">Auto-sync enabled</p>
                </div>
                <Database className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="purchase" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="purchase" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Purchase Property
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Mortgage Dashboard
            </TabsTrigger>
            <TabsTrigger value="deploy" className="flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              Deploy Contract
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Manage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="purchase" className="space-y-6">
            <SmartContractPropertyPurchase />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mortgage Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleMortgageDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deploy" className="space-y-6">
            <EnhancedContractDeployment />
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Contract Registry
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">SIMPLE_MORTGAGE</div>
                        <div className="text-xs text-muted-foreground">0x8A79...C318</div>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">ENHANCED_MORTGAGE</div>
                        <div className="text-xs text-muted-foreground">Not deployed</div>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">USDT</div>
                        <div className="text-xs text-muted-foreground">0xc298...d36</div>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Enhancement Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Property metadata storage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">NFT ownership certificates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Real property values (not $0)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Database synchronization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Multi-property support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Event listener integration</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Deployment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  No enhanced contracts deployed yet. Use the Deploy tab to deploy the enhanced mortgage contract.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SmartContractManagement;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Database, Shield } from 'lucide-react';
import { BlockchainReconciliation } from '@/components/admin/BlockchainReconciliation';
import { AncientSCContractsList } from '@/components/admin/AncientSCContractsList';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Platform administration, blockchain tools, and system monitoring
        </p>
      </div>

      <Tabs defaultValue="blockchain" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="blockchain" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Blockchain
          </TabsTrigger>
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Smart Contracts
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blockchain" className="space-y-6">
          <BlockchainReconciliation />
          
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Sync Status</CardTitle>
              <CardDescription>
                Monitor blockchain event synchronization and database consistency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-semibold">Last Sync</p>
                    <p className="text-sm text-muted-foreground">Never</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Total Payments Synced</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>💡 <strong>Tip:</strong> Run reconciliation after making on-chain payments to ensure database consistency.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          <AncientSCContractsList />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>
                Configure platform-wide settings and feature flags
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Advanced settings coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

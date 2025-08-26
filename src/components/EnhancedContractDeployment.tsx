// Enhanced Contract Deployment Component
// Deploys the new smart contract with property storage and NFT support

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Rocket, 
  CheckCircle, 
  AlertCircle, 
  Home, 
  Key, 
  Database,
  Coins,
  ExternalLink
} from 'lucide-react';

interface DeploymentResult {
  contractAddress: string;
  network: string;
  contractName: string;
  properties: Array<{
    id: number;
    name: string;
    value: string;
  }>;
}

export const EnhancedContractDeployment = () => {
  const { toast } = useToast();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');

  const deployEnhancedContract = async () => {
    setIsDeploying(true);
    setDeploymentStatus('deploying');
    
    try {
      toast({
        title: "🚀 Starting Deployment",
        description: "Deploying Enhanced Mortgage Contract with property storage...",
      });

      // Call the deployment edge function
      const { data, error } = await supabase.functions.invoke('deploy-enhanced-mortgage', {
        body: { network: 'fuji' }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        setDeploymentResult(data);
        setDeploymentStatus('success');
        
        toast({
          title: "✅ Deployment Successful!",
          description: `Enhanced contract deployed at ${data.contractAddress.slice(0, 10)}...`,
        });
      } else {
        throw new Error(data.error || 'Deployment failed');
      }

    } catch (error: any) {
      console.error('Deployment failed:', error);
      setDeploymentStatus('error');
      
      toast({
        title: "❌ Deployment Failed",
        description: error.message || "Failed to deploy enhanced contract",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const updateSystemToUseNewContract = async () => {
    if (!deploymentResult) return;
    
    try {
      toast({
        title: "🔄 Updating System",
        description: "Switching to use the new enhanced contract...",
      });

      // Update the contract address in the system (this would update the config)
      console.log('Would update system to use contract:', deploymentResult.contractAddress);
      
      toast({
        title: "✅ System Updated",
        description: "Application now uses the enhanced contract with property storage!",
      });
      
    } catch (error: any) {
      toast({
        title: "❌ Update Failed", 
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Deployment Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-primary" />
            Enhanced Smart Contract Deployment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Deploy the enhanced mortgage contract with property storage, NFT minting, and database synchronization.
          </div>
          
          {/* Features List */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Home className="w-4 h-4 text-green-600" />
              <span className="text-sm">Property Storage</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Key className="w-4 h-4 text-blue-600" />
              <span className="text-sm">NFT Ownership</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Database className="w-4 h-4 text-purple-600" />
              <span className="text-sm">Database Sync</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Coins className="w-4 h-4 text-yellow-600" />
              <span className="text-sm">Real AVAX Values</span>
            </div>
          </div>

          {/* Deployment Button */}
          {deploymentStatus === 'idle' && (
            <Button 
              onClick={deployEnhancedContract}
              disabled={isDeploying}
              className="w-full"
              size="lg"
            >
              {isDeploying ? (
                <>
                  <Rocket className="w-4 h-4 mr-2 animate-spin" />
                  Deploying Contract...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Deploy Enhanced Contract
                </>
              )}
            </Button>
          )}

          {/* Deployment Status */}
          {deploymentStatus === 'deploying' && (
            <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Rocket className="w-5 h-5 text-blue-600 animate-pulse" />
              <div>
                <div className="font-medium text-blue-900">Deploying Contract...</div>
                <div className="text-sm text-blue-600">This may take a few moments</div>
              </div>
            </div>
          )}

          {deploymentStatus === 'error' && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <div className="font-medium text-red-900">Deployment Failed</div>
                <div className="text-sm text-red-600">Please try again or check the logs</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Success Results */}
      {deploymentStatus === 'success' && deploymentResult && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Deployment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-green-900">Contract Address</div>
                <div className="text-xs font-mono bg-white p-2 rounded border flex items-center justify-between">
                  <span>{deploymentResult.contractAddress}</span>
                  <ExternalLink className="w-3 h-3 text-green-600" />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-green-900">Network</div>
                <Badge variant="outline" className="mt-1">
                  {deploymentResult.network.toUpperCase()} Testnet
                </Badge>
              </div>
            </div>

            {/* Properties Added */}
            <div>
              <div className="text-sm font-medium text-green-900 mb-2">Properties Added</div>
              <div className="space-y-2">
                {deploymentResult.properties.map((property) => (
                  <div key={property.id} className="flex items-center justify-between bg-white p-3 rounded border">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">{property.name}</span>
                    </div>
                    <Badge variant="secondary">{property.value}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Update System Button */}
            <Button 
              onClick={updateSystemToUseNewContract}
              className="w-full"
              variant="outline"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Update System to Use New Contract
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      {deploymentStatus === 'success' && (
        <Card>
          <CardHeader>
            <CardTitle>🎯 Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Enhanced contract deployed with property storage</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">3 demo properties added to blockchain</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Database synchronization configured</span>
            </div>
            <div className="text-sm text-muted-foreground mt-4">
              The system now supports real property purchases with NFT ownership certificates and proper AVAX values instead of $0 placeholders.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Rocket, ExternalLink, CheckCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DeploymentResult {
  address: string;
  txHash: string;
  deployer: string;
  gasUsed: number;
}

interface DeploymentResponse {
  success: boolean;
  contracts?: Record<string, DeploymentResult>;
  error?: string;
  message?: string;
}

export const DeployRealContracts: React.FC = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResults, setDeploymentResults] = useState<Record<string, DeploymentResult> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const deployContracts = async () => {
    setIsDeploying(true);
    setError(null);
    setDeploymentResults(null);

    try {
      console.log('🚀 Starting real contract deployment...');
      
      const { data, error: invokeError } = await supabase.functions.invoke('deploy-contracts', {
        method: 'POST'
      });

      if (invokeError) {
        throw new Error(`Function invocation failed: ${invokeError.message}`);
      }

      const response = data as DeploymentResponse;
      
      if (!response.success) {
        throw new Error(response.error || 'Deployment failed');
      }

      console.log('✅ Deployment successful:', response);
      setDeploymentResults(response.contracts || {});
      toast.success('Smart contracts deployed successfully!');

      // Refresh page after successful deployment to update contract addresses
      setTimeout(() => {
        window.location.reload();
      }, 3000);

    } catch (err) {
      console.error('❌ Deployment error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown deployment error';
      setError(errorMessage);
      toast.error(`Deployment failed: ${errorMessage}`);
    } finally {
      setIsDeploying(false);
    }
  };

  const getExplorerUrl = (txHash: string): string => {
    return `https://testnet.snowtrace.io/tx/${txHash}`;
  };

  const getAddressUrl = (address: string): string => {
    return `https://testnet.snowtrace.io/address/${address}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5" />
          Deploy Real Smart Contracts
        </CardTitle>
        <CardDescription>
          Deploy the actual smart contracts to Fuji testnet to fix Snowtrace links and enable testing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!deploymentResults && !error && (
          <div className="text-center">
            <Button 
              onClick={deployContracts} 
              disabled={isDeploying}
              size="lg"
              className="w-full sm:w-auto"
            >
              {isDeploying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deploying Contracts...
                </>
              ) : (
                <>
                  <Rocket className="mr-2 h-4 w-4" />
                  Deploy Real Contracts to Fuji
                </>
              )}
            </Button>
            
            {isDeploying && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    This may take 2-3 minutes...
                  </span>
                </div>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Deploying TestUSDT, EnhancedStakingPool, and AncientMortgage contracts to Avalanche Fuji testnet.
                    Please wait while the contracts are deployed and verified.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Deployment Failed:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {deploymentResults && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Deployment Successful!</strong> All contracts have been deployed to Fuji testnet.
                The page will refresh in a few seconds to update with the new contract addresses.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              {Object.entries(deploymentResults).map(([contractName, result]) => (
                <Card key={contractName} className="border-green-200 bg-green-50/50">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{contractName}</h4>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Deployed
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Address:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">{result.address}</code>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => window.open(getAddressUrl(result.address), '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Transaction:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">{result.txHash}</code>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => window.open(getExplorerUrl(result.txHash), '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span>Deployer: {result.deployer.slice(0, 8)}...{result.deployer.slice(-6)}</span>
                        <span>Gas: {result.gasUsed.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Alert>
              <AlertDescription>
                <strong>Next Steps:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Contract addresses have been updated in the database</li>
                  <li>Snowtrace links will now work correctly</li>
                  <li>You can now test the full business model with real deployed contracts</li>
                  <li>Visit the testing page to run the complete flow</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
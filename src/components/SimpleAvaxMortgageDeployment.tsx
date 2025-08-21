import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const SimpleAvaxMortgageDeployment = () => {
  const { toast } = useToast();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<{
    success: boolean;
    contractAddress?: string;
    snowtraceUrl?: string;
    error?: string;
  } | null>(null);

  const deployContract = async () => {
    setIsDeploying(true);
    setDeploymentResult(null);

    try {
      toast({
        title: "🚀 Starting Deployment",
        description: "Deploying SimpleAvaxMortgage contract to Fuji testnet...",
      });

      // Call the Supabase edge function to deploy the contract
      const { data, error } = await supabase.functions.invoke('deploy-simple-avax-mortgage');

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        setDeploymentResult({
          success: true,
          contractAddress: data.contractAddress,
          snowtraceUrl: data.snowtraceUrl
        });

        toast({
          title: "✅ Deployment Successful!",
          description: `SimpleAvaxMortgage deployed to ${data.contractAddress}`,
        });
      } else {
        throw new Error(data.error || 'Deployment failed');
      }

    } catch (error: any) {
      console.error('Deployment failed:', error);
      
      setDeploymentResult({
        success: false,
        error: error.message || 'Unknown deployment error'
      });

      toast({
        title: "❌ Deployment Failed",
        description: error.message || 'Unknown deployment error',
        variant: "destructive"
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-primary" />
            SimpleAvaxMortgage Contract Deployment
          </CardTitle>
          <Badge variant="outline">Fuji Testnet</Badge>
        </div>
        <p className="text-muted-foreground">
          Deploy a native AVAX mortgage contract with direct blockchain execution
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Contract Features */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-3">⚡ Native AVAX Features</h3>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Native AVAX payments (no tokens needed)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Direct property purchases with down payments</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Monthly mortgage payments in AVAX</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Amortization with interest/principal calculation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>ReentrancyGuard and Ownable security</span>
            </div>
          </div>
        </div>

        {/* Deployment Button */}
        <div className="text-center space-y-4">
          <Button
            onClick={deployContract}
            disabled={isDeploying}
            size="lg"
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            {isDeploying ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Deploying Contract...
              </>
            ) : (
              <>
                ⚡ Deploy SimpleAvaxMortgage Contract
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground">
            This will deploy the contract to Fuji testnet and update the database with the real address
          </p>
        </div>

        {/* Deployment Result */}
        {deploymentResult && (
          <div className={`p-4 rounded-lg border ${
            deploymentResult.success 
              ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
              : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
          }`}>
            {deploymentResult.success ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Contract Deployed Successfully!</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Contract Address:</span>
                    <div className="font-mono text-xs bg-white dark:bg-gray-800 p-2 rounded mt-1">
                      {deploymentResult.contractAddress}
                    </div>
                  </div>
                  
                  {deploymentResult.snowtraceUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(deploymentResult.snowtraceUrl, '_blank')}
                      className="w-full"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Snowtrace
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Deployment Failed</span>
                </div>
                <p className="text-sm text-red-600 dark:text-red-400">
                  {deploymentResult.error}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Technical Details */}
        <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
          <div><strong>Network:</strong> Avalanche Fuji Testnet</div>
          <div><strong>Chain ID:</strong> 43113</div>
          <div><strong>Currency:</strong> Native AVAX</div>
          <div><strong>Compiler:</strong> Solidity ^0.8.19</div>
          <div><strong>Features:</strong> OpenZeppelin, ReentrancyGuard, Ownable</div>
        </div>
      </CardContent>
    </Card>
  );
};
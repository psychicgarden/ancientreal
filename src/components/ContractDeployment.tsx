import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export function ContractDeployment() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [deploymentResults, setDeploymentResults] = useState<Record<string, DeploymentResult> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([]);
  const { toast } = useToast();

  const addLog = (message: string) => {
    setDeploymentLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const deployContracts = async () => {
    setIsDeploying(true);
    setError(null);
    setDeploymentResults(null);
    setDeploymentLogs([]);
    setDeploymentProgress(0);

    try {
      addLog('🚀 Starting contract deployment...');
      setDeploymentProgress(10);

      addLog('📋 Calling deployment function...');
      setDeploymentProgress(30);

      const { data, error: functionError } = await supabase.functions.invoke('deploy-contracts', {
        body: { network: 'fuji' }
      });

      if (functionError) {
        throw new Error(`Deployment function error: ${functionError.message}`);
      }

      const result = data as DeploymentResponse;
      
      if (!result.success) {
        throw new Error(result.error || 'Deployment failed');
      }

      addLog('✅ Contracts deployed successfully!');
      setDeploymentProgress(80);

      addLog('💾 Fetching stored contract addresses...');
      const { data: contractAddresses, error: fetchError } = await supabase
        .from('contract_addresses')
        .select('*')
        .eq('network', 'fuji')
        .order('deployed_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching contract addresses:', fetchError);
        addLog('⚠️ Warning: Could not fetch updated contract addresses');
      } else {
        addLog(`📋 Found ${contractAddresses?.length || 0} deployed contracts`);
      }

      setDeploymentResults(result.contracts || {});
      setDeploymentProgress(100);
      addLog('🎉 Deployment completed successfully!');
      
      toast({
        title: "Deployment Successful",
        description: "Smart contracts have been deployed to Avalanche Fuji testnet",
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      addLog(`❌ Deployment failed: ${errorMessage}`);
      toast({
        title: "Deployment Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const getExplorerUrl = (txHash: string) => 
    `https://testnet.snowtrace.io/tx/${txHash}`;

  const getAddressUrl = (address: string) => 
    `https://testnet.snowtrace.io/address/${address}`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Smart Contract Deployment</CardTitle>
          <CardDescription>
            Deploy your smart contracts to the Avalanche Fuji testnet with one click
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isDeploying && !deploymentResults && !error && (
            <Button 
              onClick={deployContracts} 
              size="lg" 
              className="w-full"
            >
              🚀 Deploy Smart Contracts
            </Button>
          )}

          {isDeploying && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deploying contracts...</span>
              </div>
              <Progress value={deploymentProgress} className="w-full" />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {deploymentResults && (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  All contracts deployed successfully! Contract addresses have been automatically updated.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                {Object.entries(deploymentResults).map(([contractName, result]) => (
                  <Card key={contractName}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{contractName}</CardTitle>
                        <Badge variant="outline">Deployed</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Contract Address:</div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-muted p-1 rounded">{result.address}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(getAddressUrl(result.address), '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Transaction Hash:</div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-muted p-1 rounded truncate max-w-xs">{result.txHash}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(getExplorerUrl(result.txHash), '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Gas Used: {result.gasUsed.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {deploymentLogs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Deployment Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-3 rounded-md max-h-60 overflow-y-auto">
                  {deploymentLogs.map((log, index) => (
                    <div key={index} className="text-sm font-mono mb-1">
                      {log}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
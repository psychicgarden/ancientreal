import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const VillageCitizenshipDeployment = () => {
  const { toast } = useToast();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<any>(null);

  const handleDeploy = async () => {
    setIsDeploying(true);
    
    try {
      toast({
        title: "🏛️ Deploying VillageCitizenship Contract",
        description: "This may take a few minutes...",
      });

      const { data, error } = await supabase.functions.invoke('deploy-village-citizenship');
      
      if (error) {
        throw error;
      }

      setDeploymentResult(data);
      
      toast({
        title: "✅ VillageCitizenship Deployed!",
        description: `Contract deployed to: ${data.contractAddress}`,
      });

    } catch (error: any) {
      console.error('Deployment failed:', error);
      toast({
        title: "❌ Deployment Failed",
        description: error.message || "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>🏛️ Village Citizenship Contract</CardTitle>
        <CardDescription>
          Deploy the VillageCitizenship contract to Fuji testnet and update the database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleDeploy} 
          disabled={isDeploying}
          className="w-full"
        >
          {isDeploying ? "⏳ Deploying..." : "🚀 Deploy VillageCitizenship Contract"}
        </Button>
        
        {deploymentResult && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">✅ Deployment Successful!</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Contract Address:</strong> <code className="bg-white px-2 py-1 rounded">{deploymentResult.contractAddress}</code></p>
              <p><strong>Transaction Hash:</strong> <code className="bg-white px-2 py-1 rounded">{deploymentResult.transactionHash}</code></p>
              <a 
                href={deploymentResult.explorerUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-600 hover:text-blue-800 underline"
              >
                🔗 View on Snowtrace
              </a>
            </div>
          </div>
        )}
        
        <div className="text-sm text-gray-600">
          <p><strong>What this does:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Deploys VillageCitizenship.sol to Fuji testnet</li>
            <li>Updates the contract_addresses table with the real address</li>
            <li>Fixes the "Join Village" functionality</li>
            <li>Enables 0.1 AVAX citizenship purchases</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
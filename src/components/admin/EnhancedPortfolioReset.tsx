import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from '@/contexts/WalletContext';
import { resetPortfolio } from '@/lib/admin/resetPortfolio';
import { DEMO_CONFIG } from '@/config/demo';
import { Trash2, AlertTriangle, RefreshCw } from "lucide-react";

export const EnhancedPortfolioReset: React.FC = () => {
  const { toast } = useToast();
  const { account } = useWallet();
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    if (!account) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }

    if (!DEMO_CONFIG.isEnabled) {
      toast({
        title: "Error", 
        description: "Portfolio reset is only available in demo mode",
        variant: "destructive"
      });
      return;
    }

    setResetting(true);
    
    try {
      const result = await resetPortfolio(account);
      
      toast({
        title: "Portfolio Reset Complete",
        description: `Reset completed: ${result.result?.deleted_investments || 0} investments, ${result.result?.deleted_developer_investments || 0} developer investments, ${result.result?.deleted_properties || 0} properties cleared`,
        variant: "default"
      });

      // Refresh the page to show cleared data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('Reset error:', error);
      toast({
        title: "Reset Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setResetting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Enhanced Portfolio Reset
          {DEMO_CONFIG.isEnabled && (
            <Badge variant="secondary" className="bg-accent/20 text-accent">
              Demo Mode
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!DEMO_CONFIG.isEnabled && (
          <div className="bg-muted/50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <p className="text-sm">
                Portfolio reset is only available in demo mode for testing purposes.
              </p>
            </div>
          </div>
        )}

        {DEMO_CONFIG.isEnabled && (
          <>
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Complete Portfolio Reset</h3>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium">This will clear:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• All fractional property investments</li>
                  <li>• All developer project investments</li>
                  <li>• All user property ownership records</li>
                  <li>• All transaction history</li>
                  <li>• Reset all property tokens_sold to 0</li>
                </ul>
              </div>
              
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleReset}
                  disabled={resetting || !account}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {resetting ? 'Resetting Portfolio...' : 'Reset My Portfolio'}
                </Button>
                
                {!account && (
                  <p className="text-sm text-muted-foreground">
                    Connect wallet to reset portfolio
                  </p>
                )}
              </div>

              {account && (
                <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
                  <strong>Connected Wallet:</strong> {account.slice(0, 8)}...{account.slice(-6)}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
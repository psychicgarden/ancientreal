import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function BlockchainReconciliation() {
  const [isReconciling, setIsReconciling] = useState(false);
  const [fromBlock, setFromBlock] = useState('');
  const [result, setResult] = useState<{
    success: boolean;
    payments_synced?: number;
    blocks_scanned?: number;
    error?: string;
  } | null>(null);
  const { toast } = useToast();

  const handleReconcile = async () => {
    setIsReconciling(true);
    setResult(null);

    try {
      // Get user's wallet address
      const walletAddress = localStorage.getItem('wallet_address');
      if (!walletAddress) {
        throw new Error('No wallet connected');
      }

      // Get contract address from database
      const { data: contractData } = await supabase
        .from('contract_addresses')
        .select('address')
        .eq('contract_name', 'AncientMortgage')
        .eq('network', 'fuji')
        .single();

      if (!contractData) {
        throw new Error('Contract address not found');
      }

      // Call reconciliation edge function
      const { data, error } = await supabase.functions.invoke('reconcile-mortgage-payments', {
        body: {
          wallet_address: walletAddress,
          contract_address: contractData.address,
          from_block: fromBlock ? parseInt(fromBlock) : undefined
        }
      });

      if (error) throw error;

      setResult(data);
      
      if (data.success) {
        toast({
          title: "Reconciliation Complete",
          description: `Synced ${data.payments_synced} payment(s) from ${data.blocks_scanned} blocks`,
        });
      }

    } catch (error: any) {
      console.error('Reconciliation error:', error);
      setResult({
        success: false,
        error: error.message
      });
      
      toast({
        title: "Reconciliation Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsReconciling(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Blockchain Payment Reconciliation
        </CardTitle>
        <CardDescription>
          Sync on-chain mortgage payments to database. Run this if payments are missing or after blockchain transactions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fromBlock">From Block (optional)</Label>
          <Input
            id="fromBlock"
            type="number"
            placeholder="Leave empty to scan last 1000 blocks"
            value={fromBlock}
            onChange={(e) => setFromBlock(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Specify a starting block number or leave empty to scan recent blocks
          </p>
        </div>

        <Button
          onClick={handleReconcile}
          disabled={isReconciling}
          className="w-full"
        >
          {isReconciling ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Reconciling...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Start Reconciliation
            </>
          )}
        </Button>

        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {result.success ? (
                <div className="space-y-1">
                  <p className="font-semibold">Reconciliation Successful</p>
                  <p className="text-sm">Payments synced: {result.payments_synced}</p>
                  <p className="text-sm">Blocks scanned: {result.blocks_scanned}</p>
                  <p className="text-sm text-muted-foreground">
                    From block {result.blocks_scanned && (46779208 - result.blocks_scanned)} to latest
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-semibold">Reconciliation Failed</p>
                  <p className="text-sm">{result.error}</p>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold mb-2">How This Works</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Scans Avalanche Fuji blockchain for PaymentMade events</li>
            <li>• Fetches your wallet's payment transactions</li>
            <li>• Syncs payment data to mortgage_payments_ledger table</li>
            <li>• Updates your user_properties with correct balances</li>
            <li>• Prevents duplicate entries via transaction hash tracking</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

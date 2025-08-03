import { useWallet } from '@/contexts/WalletContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Coins, AlertTriangle } from 'lucide-react';

const DemoModeToggle = () => {
  const { isDemoMode, toggleDemoMode, getTestTokens, isGettingTestTokens, usdtBalance } = useWallet();

  return (
    <div className="space-y-4">
      {/* Demo Mode Toggle */}
      <div className="flex items-center space-x-2 p-4 border rounded-lg bg-card">
        <Switch
          id="demo-mode"
          checked={isDemoMode}
          onCheckedChange={toggleDemoMode}
        />
        <Label htmlFor="demo-mode" className="text-sm font-medium">
          {isDemoMode ? 'Demo Mode (Testing)' : 'Live Mode (Real Blockchain)'}
        </Label>
      </div>

      {/* Demo Mode Alert */}
      {isDemoMode && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You're in Demo Mode! Property values are reduced 1000x for testing ($150 instead of $150,000).
            Get free test tokens below to try the complete mortgage flow.
          </AlertDescription>
        </Alert>
      )}

      {/* Test Token Faucet - Only in Demo Mode */}
      {isDemoMode && (
        <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-sm">Test Token Faucet</h3>
              <p className="text-xs text-muted-foreground">
                Current balance: ${usdtBalance} test USDT
              </p>
            </div>
            <Button
              onClick={getTestTokens}
              disabled={isGettingTestTokens}
              size="sm"
              variant="outline"
            >
              <Coins className="h-4 w-4 mr-2" />
              {isGettingTestTokens ? 'Getting...' : 'Get 1,000 Test USDT'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Free test tokens let you purchase demo properties and test payments without real money.
          </p>
        </div>
      )}
    </div>
  );
};

export default DemoModeToggle;
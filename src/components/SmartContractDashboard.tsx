import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSmartContract } from '@/contexts/SmartContractContext';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Shield, 
  Activity,
  RefreshCw,
  Power
} from 'lucide-react';

export function SmartContractDashboard() {
  const {
    flags,
    updateFlag,
    enableEmergencyMode,
    isInitialized,
    isConnected,
    currentNetwork,
    error,
    healthStatus,
    initialize,
    healthCheck,
    emergencyShutdown,
  } = useSmartContract();

  const getStatusIcon = (enabled: boolean) => {
    return enabled ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (enabled: boolean) => {
    return (
      <Badge variant={enabled ? "default" : "secondary"}>
        {enabled ? "Enabled" : "Disabled"}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Smart Contract Control Panel</h1>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
          <Badge variant="outline">{currentNetwork}</Badge>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Emergency Mode Alert */}
      {flags.emergencyMode && (
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            🚨 Emergency Mode Active - All smart contract features are disabled. Platform is using Supabase fallback.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Initialized</span>
              {getStatusIcon(isInitialized)}
            </div>
            <div className="flex items-center justify-between">
              <span>Connected</span>
              {getStatusIcon(isConnected)}
            </div>
            <div className="flex items-center justify-between">
              <span>Network</span>
              <span className="text-sm">{currentNetwork}</span>
            </div>
            {healthStatus && (
              <div className="flex items-center justify-between">
                <span>Block</span>
                <span className="text-sm">#{healthStatus.blockNumber}</span>
              </div>
            )}
            <div className="flex gap-2">
              <Button size="sm" onClick={initialize} disabled={isInitialized}>
                Initialize
              </Button>
              <Button size="sm" variant="outline" onClick={healthCheck}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contract Features */}
        <Card>
          <CardHeader>
            <CardTitle>Contract Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Mortgage Contract</span>
              <div className="flex items-center gap-2">
                {getStatusBadge(flags.mortgageContractEnabled)}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateFlag('mortgageContractEnabled', !flags.mortgageContractEnabled)}
                  disabled={flags.emergencyMode}
                >
                  Toggle
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Developer Escrow</span>
              <div className="flex items-center gap-2">
                {getStatusBadge(flags.developerEscrowEnabled)}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateFlag('developerEscrowEnabled', !flags.developerEscrowEnabled)}
                  disabled={flags.emergencyMode}
                >
                  Toggle
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Staking Pool</span>
              <div className="flex items-center gap-2">
                {getStatusBadge(flags.stakingPoolEnabled)}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateFlag('stakingPoolEnabled', !flags.stakingPoolEnabled)}
                  disabled={flags.emergencyMode}
                >
                  Toggle
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Features */}
        <Card>
          <CardHeader>
            <CardTitle>Function Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Mortgage Purchase</span>
              {getStatusIcon(flags.mortgagePurchaseEnabled && !flags.emergencyMode)}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Mortgage Payments</span>
              {getStatusIcon(flags.mortgagePaymentsEnabled && !flags.emergencyMode)}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Year-10 Appraisal</span>
              {getStatusIcon(flags.year10AppraisalEnabled && !flags.emergencyMode)}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Escrow Investment</span>
              {getStatusIcon(flags.escrowInvestmentEnabled && !flags.emergencyMode)}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Staking Deposits</span>
              {getStatusIcon(flags.stakingDepositsEnabled && !flags.emergencyMode)}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Cross-Contract Yield</span>
              {getStatusIcon(flags.crossContractYieldEnabled && !flags.emergencyMode)}
            </div>
          </CardContent>
        </Card>

        {/* Safety Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Safety Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Emergency Mode</span>
              {getStatusBadge(flags.emergencyMode)}
            </div>
            <div className="flex items-center justify-between">
              <span>Maintenance Mode</span>
              {getStatusBadge(flags.maintenanceMode)}
            </div>
            <div className="flex items-center justify-between">
              <span>Testnet Mode</span>
              {getStatusBadge(flags.testnetMode)}
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={enableEmergencyMode}
                className="w-full"
              >
                <Shield className="h-4 w-4 mr-2" />
                Emergency Mode
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={emergencyShutdown}
                className="w-full"
              >
                <Power className="h-4 w-4 mr-2" />
                Emergency Shutdown
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Health Status */}
        {healthStatus && (
          <Card>
            <CardHeader>
              <CardTitle>Health Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Blockchain Connected</span>
                {getStatusIcon(healthStatus.connected)}
              </div>
              <div className="flex items-center justify-between">
                <span>Network</span>
                <span className="text-sm">{healthStatus.network}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Block Number</span>
                <span className="text-sm">#{healthStatus.blockNumber}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Contracts Initialized:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {healthStatus.contractsInitialized.map((contract) => (
                    <Badge key={contract} variant="outline" className="text-xs">
                      {contract}
                    </Badge>
                  ))}
                </div>
              </div>
              {healthStatus.errors.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-red-500">Errors:</span>
                  <ul className="text-xs text-red-500 mt-1">
                    {healthStatus.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Deployment Info */}
        <Card>
          <CardHeader>
            <CardTitle>Deployment Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Addresses Verified</span>
              {getStatusIcon(flags.contractAddressesVerified)}
            </div>
            <div className="flex items-center justify-between">
              <span>Mode</span>
              <span className="text-sm">
                {flags.testnetMode ? 'Testnet' : 'Production'}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {flags.testnetMode ? (
                <span>⚠️ Running on Avalanche Fuji Testnet</span>
              ) : (
                <span>🔴 Production Mode - Use with caution</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions & Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Safe Deployment Process:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Deploy contracts to Fuji testnet</li>
                <li>Update contract addresses in integration file</li>
                <li>Enable testnet mode and individual features</li>
                <li>Test all functionality thoroughly</li>
                <li>Gradually enable production features</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-2">Emergency Procedures:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Emergency Mode disables all smart contracts</li>
                <li>Platform automatically falls back to Supabase</li>
                <li>Users experience no service interruption</li>
                <li>Re-enable features after fixing issues</li>
              </ul>
            </div>
          </div>
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Always test on Fuji testnet before enabling mainnet features. 
              Emergency mode can be activated at any time to ensure platform safety.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
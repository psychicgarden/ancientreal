import React from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireWallet?: boolean;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, requireWallet = true, fallback }: AuthGuardProps) {
  const { isConnected, connectWallet } = useWallet();

  if (requireWallet && !isConnected) {
    return fallback || (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center space-y-4">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-lg font-medium">Authentication Required</h3>
            <p className="text-sm text-muted-foreground">
              Please connect your wallet to access this feature
            </p>
          </div>
          <Button onClick={connectWallet} variant="default">
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
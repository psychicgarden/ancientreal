import React, { useState } from 'react';
import { useRateLimit } from '@/hooks/useRateLimit';
import { useWallet } from '@/contexts/WalletContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, Clock } from 'lucide-react';

interface SecureFormWrapperProps {
  children: React.ReactNode;
  onSubmit: (data: any) => Promise<void>;
  maxAttempts?: number;
  windowMs?: number;
  requireAuth?: boolean;
}

export function SecureFormWrapper({
  children,
  onSubmit,
  maxAttempts = 5,
  windowMs = 300000, // 5 minutes
  requireAuth = true,
}: SecureFormWrapperProps) {
  const { account, isConnected } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isBlocked, attemptsRemaining, timeUntilReset, executeWithRateLimit } = useRateLimit({
    maxAttempts,
    windowMs,
    blockMs: windowMs,
  });

  const handleSecureSubmit = async (data: any) => {
    if (requireAuth && !isConnected) {
      setError('Please connect your wallet to continue');
      return;
    }

    if (isBlocked) {
      setError(`Too many attempts. Please wait ${Math.ceil(timeUntilReset / 1000)} seconds.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await executeWithRateLimit(async () => {
        // Add wallet address to form data for security validation
        const secureData = {
          ...data,
          user_wallet_address: account?.toLowerCase(),
          timestamp: new Date().toISOString(),
        };

        await onSubmit(secureData);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Security status display
  const SecurityStatus = () => (
    <div className="mb-4 space-y-2">
      {requireAuth && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Wallet: {isConnected ? 'Connected' : 'Not Connected'}</span>
        </div>
      )}
      
      {attemptsRemaining < maxAttempts && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Attempts remaining: {attemptsRemaining}</span>
        </div>
      )}
      
      {isBlocked && (
        <Alert variant="destructive">
          <AlertDescription>
            Rate limit exceeded. Please wait {Math.ceil(timeUntilReset / 1000)} seconds before trying again.
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );

  // Clone children and inject secure submit handler
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === 'form') {
      return React.cloneElement(child as React.ReactElement<any>, {
        onSubmit: (e: React.FormEvent) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const data = Object.fromEntries(formData.entries());
          handleSecureSubmit(data);
        },
      });
    }
    return child;
  });

  return (
    <div className="space-y-4">
      <SecurityStatus />
      <div className={isSubmitting ? 'opacity-60 pointer-events-none' : ''}>
        {childrenWithProps}
      </div>
      
      {isSubmitting && (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            <span>Processing securely...</span>
          </div>
        </div>
      )}
    </div>
  );
}
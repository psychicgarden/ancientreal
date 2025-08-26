import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { NETWORK_CONFIG } from "@/lib/contracts";

const NetworkGuard: React.FC = () => {
  const { isConnected, chainId, networkName, isDemoMode } = useWallet();

  // Skip network validation in demo mode
  if (isDemoMode) return null;
  if (!isConnected) return null;
  if (!chainId || chainId.toLowerCase() === NETWORK_CONFIG.chainId.toLowerCase()) return null;

  return (
    <Alert variant="destructive" className="border-destructive/40">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Wrong network detected</AlertTitle>
      <AlertDescription>
        You are connected to {networkName}. Please switch to {NETWORK_CONFIG.chainName} to transact safely.
      </AlertDescription>
    </Alert>
  );
};

export default NetworkGuard;

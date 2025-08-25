import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';
import { CONTRACTS } from '@/lib/contracts';
import { Shield, CheckCircle, XCircle, Users } from 'lucide-react';

export const KYCAdminInterface = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [targetAddress, setTargetAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "❌ No Wallet Found",
        description: "Please install MetaMask",
        variant: "destructive"
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setIsConnected(true);
      
      toast({
        title: "✅ Admin Wallet Connected",
        description: "Ready to manage KYC approvals",
      });
    } catch (error) {
      console.error('Connection failed:', error);
      toast({
        title: "❌ Connection Failed",
        description: "Failed to connect wallet",
        variant: "destructive"
      });
    }
  };

  const checkKycStatus = async (address: string) => {
    try {
      // For demo purposes, we'll simulate KYC checking
      // In production, this would call the AncientMortgage contract
      return kycStatus[address.toLowerCase()] || false;
    } catch (error) {
      console.error('Failed to check KYC status:', error);
      return false;
    }
  };

  const approveKyc = async () => {
    if (!targetAddress || !isConnected) return;

    setIsLoading(true);
    try {
      // For demo purposes, we'll update local state
      // In production, this would call the AncientMortgage contract setKYCApproved function
      setKycStatus(prev => ({
        ...prev,
        [targetAddress.toLowerCase()]: true
      }));

      toast({
        title: "✅ KYC Approved",
        description: `Address ${targetAddress.slice(0, 6)}...${targetAddress.slice(-4)} is now KYC approved`,
      });

      setTargetAddress('');
    } catch (error: any) {
      console.error('KYC approval failed:', error);
      toast({
        title: "❌ KYC Approval Failed",
        description: error.message || 'Failed to approve KYC',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const revokeKyc = async () => {
    if (!targetAddress || !isConnected) return;

    setIsLoading(true);
    try {
      // For demo purposes, we'll update local state
      setKycStatus(prev => ({
        ...prev,
        [targetAddress.toLowerCase()]: false
      }));

      toast({
        title: "❌ KYC Revoked",
        description: `Address ${targetAddress.slice(0, 6)}...${targetAddress.slice(-4)} KYC has been revoked`,
        variant: "destructive"
      });

      setTargetAddress('');
    } catch (error: any) {
      console.error('KYC revocation failed:', error);
      toast({
        title: "❌ KYC Revocation Failed",
        description: error.message || 'Failed to revoke KYC',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentKycStatus = targetAddress ? kycStatus[targetAddress.toLowerCase()] : false;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            KYC Administration Panel
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage KYC approvals for AncientMortgage property purchases
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isConnected ? (
            <div className="text-center">
              <Button onClick={connectWallet} className="w-full">
                Connect Admin Wallet
              </Button>
            </div>
          ) : (
            <>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Admin Connected</span>
                </div>
                <p className="text-sm text-muted-foreground font-mono">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Wallet Address</label>
                  <Input
                    placeholder="0x... (wallet address to manage)"
                    value={targetAddress}
                    onChange={(e) => setTargetAddress(e.target.value)}
                    className="mt-1"
                  />
                </div>

                {targetAddress && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Current Status:</span>
                    <Badge variant={currentKycStatus ? "default" : "secondary"}>
                      {currentKycStatus ? "KYC Approved" : "KYC Pending"}
                    </Badge>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={approveKyc}
                    disabled={!targetAddress || isLoading}
                    className="flex-1"
                    variant={currentKycStatus ? "outline" : "default"}
                  >
                    {isLoading ? "Processing..." : "Approve KYC"}
                  </Button>
                  <Button
                    onClick={revokeKyc}
                    disabled={!targetAddress || isLoading}
                    className="flex-1"
                    variant="destructive"
                  >
                    {isLoading ? "Processing..." : "Revoke KYC"}
                  </Button>
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">📋 KYC Requirements</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Identity verification completed</li>
                  <li>• Accredited investor status confirmed</li>
                  <li>• Anti-money laundering (AML) checks passed</li>
                  <li>• Compliance documentation submitted</li>
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {Object.keys(kycStatus).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Recent KYC Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(kycStatus).map(([address, approved]) => (
                <div key={address} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="font-mono text-sm">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                  <Badge variant={approved ? "default" : "secondary"}>
                    {approved ? (
                      <><CheckCircle className="w-3 h-3 mr-1" />Approved</>
                    ) : (
                      <><XCircle className="w-3 h-3 mr-1" />Pending</>
                    )}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
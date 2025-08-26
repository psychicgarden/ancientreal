// Enhanced Property Investment Interface with Full Blockchain Integration
// Supports property storage, NFT minting, and database sync

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';
import { CONTRACTS } from '@/lib/contracts';
import { Home, DollarSign, Calendar, MapPin, TrendingUp, Users, Shield, CheckCircle, Key } from 'lucide-react';
import { PROPERTIES_CATALOG } from '@/lib/propertiesCatalog';
import { convertUSDToAVAX, formatAVAXAmount } from '@/lib/constants';
import { blockchainSync } from '@/lib/blockchain-sync';

export const EnhancedPropertyInterface = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string>('');
  const [avaxBalance, setAvaxBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [isKycApproved, setIsKycApproved] = useState(false);
  const [propertyId, setPropertyId] = useState<number | null>(null);
  const [nftTokenId, setNftTokenId] = useState<number | null>(null);

  // Get featured property
  const featuredProperty = PROPERTIES_CATALOG[0]; // Art Deco Loft Mazunte

  // Fixed property values - now in AVAX with proper exchange rate
  const propertyValueUSD = featuredProperty.totalValue; // $129,000
  const downPaymentUSD = Math.round(featuredProperty.totalValue * 0.2); // 20% = $25,800
  const downPaymentAVAX = convertUSDToAVAX(downPaymentUSD); // Using testing rate: 0.000258 AVAX
  const termMonths = 120; // Fixed 10 years
  const FIXED_INTEREST_RATE = 8.0;
  const PLATFORM_FEE_PERCENT = 3.0; // 3% platform fee

  useEffect(() => {
    checkWalletConnection();
    // Start blockchain event listener
    blockchainSync.startEventListener();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setIsConnected(true);
          setUserAddress(accounts[0]);
          await getAvaxBalance(accounts[0]);
          await checkKycStatus();
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnected(true);
        setUserAddress(accounts[0]);
        await getAvaxBalance(accounts[0]);
        await checkKycStatus();
        
        toast({
          title: "✅ Wallet Connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      } catch (error) {
        toast({
          title: "❌ Connection Failed",
          description: "Failed to connect wallet",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "❌ No Wallet Found",
        description: "Please install MetaMask or another Web3 wallet",
        variant: "destructive",
      });
    }
  };

  const getAvaxBalance = async (address: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      setAvaxBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Failed to get AVAX balance:', error);
    }
  };

  const checkKycStatus = async () => {
    try {
      // For demo purposes, we'll assume KYC is approved
      setIsKycApproved(true);
    } catch (error) {
      console.error('Failed to check KYC status:', error);
      setIsKycApproved(true); // Default to approved for demo
    }
  };

  const handlePurchaseProperty = async () => {
    if (!isConnected || !window.ethereum || !isKycApproved) return;

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Use enhanced contract (once deployed)
      const mortgageContract = new ethers.Contract(
        CONTRACTS.SIMPLE_MORTGAGE.address, // Will be updated to enhanced contract
        [
          "function purchaseProperty(uint256 _propertyId, uint256 _termMonths) external payable",
          "function addProperty(string memory _name, string memory _location, string memory _imageUrl, uint256 _totalValue) external returns (uint256)",
          "function getProperty(uint256 _propertyId) external view returns (tuple(uint256 propertyId, string name, string location, string imageUrl, uint256 totalValue, bool isActive))"
        ],
        signer
      );

      const downPaymentAmount = ethers.parseEther(downPaymentAVAX); // AVAX in wei
      
      // For demo, we'll use property ID 1 (should be pre-added by owner)
      const demoPropertyId = 1;

      toast({
        title: "🏠 Processing Purchase",
        description: "Creating your mortgage with property ownership NFT...",
      });

      // Call purchaseProperty with property ID and term
      const tx = await mortgageContract.purchaseProperty(
        demoPropertyId,       // Property ID
        termMonths,           // Term in months (120 = 10 years)
        { 
          value: downPaymentAmount // Down payment in wei
        }
      );

      toast({
        title: "⏳ Transaction Pending",
        description: "Waiting for blockchain confirmation...",
      });

      const receipt = await tx.wait();
      
      // Extract property ID and NFT token ID from events
      const mortgageCreatedEvent = receipt.logs.find((log: any) => {
        try {
          const parsedLog = mortgageContract.interface.parseLog(log);
          return parsedLog?.name === 'MortgageCreated';
        } catch {
          return false;
        }
      });

      if (mortgageCreatedEvent) {
        const decodedEvent = mortgageContract.interface.parseLog(mortgageCreatedEvent);
        setPropertyId(decodedEvent.args[1].toString());
        setNftTokenId(decodedEvent.args[2].toString());
      }

      toast({
        title: "🎉 Property Purchased Successfully!",
        description: `Transaction confirmed! Your property ownership NFT has been minted.`,
      });

      // Refresh balance
      await getAvaxBalance(userAddress);
      
    } catch (error: any) {
      console.error('Purchase failed:', error);
      toast({
        title: "❌ Purchase Failed",
        description: error.message || "Transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const platformFee = Math.round(propertyValueUSD * (PLATFORM_FEE_PERCENT / 100));
  const hasInsufficientBalance = parseFloat(avaxBalance) < parseFloat(downPaymentAVAX);

  return (
    <div className="space-y-6">
      {/* Property Featured Card */}
      <Card className="overflow-hidden">
        <div className="relative">
          <img
            src={featuredProperty.image}
            alt={featuredProperty.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
              Enhanced Property with NFT
            </Badge>
          </div>
          {nftTokenId && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-green-500/90 text-white backdrop-blur-sm flex items-center gap-1">
                <Key className="w-3 h-3" />
                NFT #{nftTokenId}
              </Badge>
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-6 h-6 text-primary" />
            {featuredProperty.name}
          </CardTitle>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{featuredProperty.location}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <DollarSign className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <div className="text-sm text-muted-foreground">Total Value</div>
              <div className="font-semibold">${featuredProperty.totalValue.toLocaleString()}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <div className="text-sm text-muted-foreground">Business Model</div>
              <div className="font-semibold">Full Revenue + NFT</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Calendar className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <div className="text-sm text-muted-foreground">Platform Fee</div>
              <div className="font-semibold">${platformFee.toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Connection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              Wallet Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isConnected ? (
              <Button onClick={connectWallet} className="w-full">
                Connect Wallet
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">AVAX Balance</span>
                  </div>
                  <div className="font-semibold">{formatAVAXAmount(avaxBalance)} AVAX</div>
                  {hasInsufficientBalance && (
                    <div className="text-sm text-red-500 mt-1">
                      Need {formatAVAXAmount(downPaymentAVAX)} AVAX to purchase
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              Purchase Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span>Property Value</span>
              <span className="font-semibold">${propertyValueUSD.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Down Payment</span>
              <span className="font-semibold">
                {formatAVAXAmount(downPaymentAVAX)} AVAX
                <div className="text-xs text-muted-foreground">${downPaymentUSD.toLocaleString()} USD</div>
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
              <span>Platform Fee (3%)</span>
              <span className="font-semibold">${platformFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span>Interest Rate</span>
              <span className="font-semibold">{FIXED_INTEREST_RATE}% → Staking Pool</span>
            </div>
            {propertyId && (
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span>Property ID</span>
                <span className="font-semibold text-green-600">#{propertyId}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Purchase Button */}
      <Card>
        <CardContent className="pt-6">
          <Button 
            onClick={handlePurchaseProperty}
            disabled={isLoading || hasInsufficientBalance || !isKycApproved || !isConnected}
            className="w-full"
            size="lg"
          >
            {isLoading 
              ? "Processing Purchase..." 
              : !isConnected
              ? "Connect Wallet First"
              : !isKycApproved
              ? "KYC Approval Required"
              : hasInsufficientBalance
              ? `Insufficient AVAX Balance (need ${formatAVAXAmount(downPaymentAVAX)})`
              : `Purchase Property with ${formatAVAXAmount(downPaymentAVAX)} AVAX + Get NFT`
            }
          </Button>

          {nftTokenId && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <Key className="w-5 h-5" />
                <span className="font-medium">Property Ownership NFT Minted!</span>
              </div>
              <div className="text-sm text-green-600 mt-1">
                Token ID: #{nftTokenId} | Property ID: #{propertyId}
              </div>
              <div className="text-xs text-green-500 mt-1">
                This NFT represents your ownership stake in the property and mortgage terms.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
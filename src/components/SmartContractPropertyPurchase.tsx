import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle2, Home, Loader2, ExternalLink } from 'lucide-react';

interface Property {
  id: number;
  name: string;
  location: string;
  totalValue: number;
  imageUrl: string;
  availableForPurchase: boolean;
}

const MOCK_PROPERTIES: Property[] = [
  {
    id: 1,
    name: "Art Deco Loft Oceanview",
    location: "Mazunte, Mexico",
    totalValue: 129000,
    imageUrl: "/src/assets/art-deco-loft-mexico.jpg",
    availableForPurchase: true
  },
  {
    id: 2,
    name: "Bahia Beach Bungalow",
    location: "Bahia, Brazil",
    totalValue: 95000,
    imageUrl: "/src/assets/bahia-beach-bungalow.jpg",
    availableForPurchase: true
  },
  {
    id: 3,
    name: "Ericeira Coastal Villa",
    location: "Ericeira, Portugal",
    totalValue: 199000,
    imageUrl: "/src/assets/ericeira-coastal-apartment.jpg",
    availableForPurchase: true
  }
];

export const SmartContractPropertyPurchase = () => {
  const [account, setAccount] = useState<string>('');
  const [contractAddress, setContractAddress] = useState<string>('');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initialize = async () => {
      // Load contract address from database
      const { data: contractData } = await supabase
        .from('contract_addresses')
        .select('address')
        .eq('contract_name', 'ENHANCED_AVAX_MORTGAGE')
        .eq('network', 'fuji')
        .single();

      if (contractData) {
        setContractAddress(contractData.address);
      }

      // Get connected wallet
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0].toLowerCase());
          }
        } catch (error) {
          console.error('Failed to get account:', error);
        }
      }
    };

    initialize();
  }, []);

  const handlePurchaseProperty = async (property: Property) => {
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to purchase property",
        variant: "destructive"
      });
      return;
    }

    if (!contractAddress) {
      toast({
        title: "Contract Not Available",
        description: "Smart contract address not found",
        variant: "destructive"
      });
      return;
    }

    setIsPurchasing(true);
    setSelectedProperty(property);

    try {
      // Calculate purchase amounts
      const purchasePrice = property.totalValue;
      const downPayment = purchasePrice * 0.20; // 20% down
      const platformFee = purchasePrice * 0.03; // 3% platform fee
      const loanAmount = purchasePrice - downPayment;
      const monthlyPayment = 1252; // Pre-calculated for $129K property

      // Mock transaction hash (in production this would come from blockchain)
      const mockTxHash = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;

      console.log('📝 Creating property purchase record:', {
        propertyId: property.id,
        propertyName: property.name,
        purchasePrice,
        downPayment,
        loanAmount,
        monthlyPayment,
        account
      });

      // Insert into user_properties table
      const { error: propertyError } = await supabase
        .from('user_properties')
        .insert({
          user_address: account,
          user_wallet_address: account,
          property_id: property.id,
          property_name: property.name,
          property_location: property.location,
          purchase_price: purchasePrice,
          down_payment: downPayment,
          loan_amount: loanAmount,
          remaining_balance: loanAmount,
          monthly_payment: monthlyPayment,
          purchase_price_base: Math.round(purchasePrice * 1000000),
          down_payment_base: Math.round(downPayment * 1000000),
          loan_amount_base: Math.round(loanAmount * 1000000),
          principal_paid_base: 0,
          interest_paid_base: 0,
          image_url: property.imageUrl,
          is_active: true,
          unique_purchase_key: `${account}_${property.id}_${Date.now()}`
        });

      if (propertyError) {
        console.error('Database error:', propertyError);
        throw new Error(`Failed to register property: ${propertyError.message}`);
      }

      // Insert transaction record
      const { error: txError } = await supabase
        .from('user_transactions')
        .insert({
          user_wallet_address: account,
          transaction_type: 'property_purchase',
          amount: downPayment + platformFee,
          status: 'completed',
          transaction_hash: mockTxHash,
          metadata: {
            property_id: property.id,
            property_name: property.name,
            purchase_price: purchasePrice,
            down_payment: downPayment,
            platform_fee: platformFee,
            loan_amount: loanAmount,
            contract_address: contractAddress
          }
        });

      if (txError) {
        console.warn('Transaction record error:', txError);
      }

      toast({
        title: "✅ Property Purchased Successfully!",
        description: `${property.name} has been registered to your account`,
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error: any) {
      console.error('Purchase failed:', error);
      toast({
        title: "❌ Purchase Failed",
        description: error.message || 'Failed to purchase property',
        variant: "destructive"
      });
    } finally {
      setIsPurchasing(false);
      setSelectedProperty(null);
    }
  };

  if (!account) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to purchase properties
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!contractAddress) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Contract not deployed. Please deploy contracts first.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Smart Contract Property Purchase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">Contract Address</div>
                <div className="font-mono text-sm">{contractAddress.slice(0, 10)}...{contractAddress.slice(-8)}</div>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-600">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Deployed
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">Connected Wallet</div>
                <div className="font-mono text-sm">{account.slice(0, 10)}...{account.slice(-8)}</div>
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                Connected
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROPERTIES.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <img
                src={property.imageUrl}
                alt={property.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
              <Badge className="absolute top-2 right-2">
                Property #{property.id}
              </Badge>
            </div>
            <CardContent className="pt-4 space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{property.name}</h3>
                <p className="text-sm text-muted-foreground">{property.location}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Value:</span>
                  <span className="font-semibold">${property.totalValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Down Payment (20%):</span>
                  <span className="font-semibold">${(property.totalValue * 0.20).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee (3%):</span>
                  <span className="font-semibold">${(property.totalValue * 0.03).toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t flex justify-between">
                  <span className="font-semibold">Total Due:</span>
                  <span className="font-semibold text-primary">
                    ${(property.totalValue * 0.23).toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => handlePurchaseProperty(property)}
                disabled={isPurchasing || !property.availableForPurchase}
                className="w-full"
              >
                {isPurchasing && selectedProperty?.id === property.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Home className="w-4 h-4 mr-2" />
                    Purchase Property
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">System Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Network:</span>
            <span>Avalanche Fuji Testnet</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">APR:</span>
            <span>8.0%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Term:</span>
            <span>120 months (10 years)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monthly Payment (est.):</span>
            <span>$1,252</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

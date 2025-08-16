import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileText, 
  Shield, 
  TrendingUp,
  Download,
  ExternalLink,
  Wallet,
  AlertTriangle
} from "lucide-react";
import { SmartContractViewer } from "./SmartContractViewer";
import { supabase } from "@/integrations/supabase/client";
import NetworkGuard from "@/components/NetworkGuard";

interface PropertyPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}

export const PropertyPurchaseModal = ({ isOpen, onClose, property }: PropertyPurchaseModalProps) => {
  const { isConnected, connectWallet, purchaseProperty, isPurchasingProperty, account } = useWallet();
  const { toast } = useToast();
  const [kycComplete, setKycComplete] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showSmartContract, setShowSmartContract] = useState(false);

  // Use the provided property data directly (from landing page/database)
  const effectiveProperty = {
    id: property?.id || "mazunte-mexico-villa",
    name: property?.name || "Art Deco Loft",
    totalValue: property?.totalValue ?? property?.listPrice ?? 129000,
    downPayment: property?.downPayment ?? Math.round((property?.totalValue ?? property?.listPrice ?? 129000) * 0.2),
    monthlyPayment: property?.monthlyPayment ?? 1456,
    monthlyProfit: property?.monthlyProfit ?? 594,
    location: property?.location || "Mazunte, Mexico",
    image: property?.image || "/src/assets/boho-art-deco-loft-mexico.jpg",
  };

  const fallbackTxHash = () => `pending-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

  const savePurchaseToSupabase = async (opts: {
    status: "completed" | "pending";
    txHash?: string;
    mortgageId?: string;
    platformFeeTxHash?: string;
  }) => {
    if (!account) {
      console.warn("No wallet account available; skipping portfolio insert.");
      return;
    }
    const wallet = account.toLowerCase();

    // Key financials
    const purchasePrice = Number(effectiveProperty.totalValue || 150000);
    const actualDownPayment = purchasePrice * 0.2; // 20% down payment
    const platformFee = purchasePrice * 0.03; // 3% platform fee
    const totalUpfrontCost = actualDownPayment + platformFee;

    // We now write to user_transactions for down payment AND platform fee separately
    const txHashValue = opts.txHash || fallbackTxHash();
    const platformFeeTxHashValue = opts.platformFeeTxHash || `${txHashValue}-platform`;

    // Down payment transaction
    const downPaymentTransaction = {
      user_wallet_address: wallet,
      transaction_type: "purchase",
      transaction_hash: txHashValue,
      amount: actualDownPayment,
      status: opts.status,
      currency: "USDT",
      metadata: {
        property_name: effectiveProperty.name,
        property_location: effectiveProperty.location,
        location: effectiveProperty.location,
        image_url: effectiveProperty.image,
        mortgage_id: opts.mortgageId || null,
        propertyValue: purchasePrice,
        purchase_price: purchasePrice,
        downPayment: actualDownPayment,
        platform_fee_amount: platformFee,
        total_upfront_cost: totalUpfrontCost,
        transaction_category: "down_payment"
      }
    };

    // Platform fee transaction
    const platformFeeTransaction = {
      user_wallet_address: wallet,
      transaction_type: "platform_fee",
      transaction_hash: platformFeeTxHashValue,
      amount: platformFee,
      status: opts.status,
      currency: "USDT",
      metadata: {
        property_name: effectiveProperty.name,
        property_location: effectiveProperty.location,
        propertyValue: purchasePrice,
        fee_percentage: 3.0,
        mortgage_id: opts.mortgageId || null,
        related_transaction_hash: txHashValue,
        transaction_category: "platform_fee"
      }
    };

    try {
      // Insert both transactions
      const { error: downPaymentError } = await supabase
        .from("user_transactions")
        .insert([downPaymentTransaction]);

      if (downPaymentError) {
        console.error("Failed to insert down payment transaction:", downPaymentError);
        throw downPaymentError;
      }

      const { error: platformFeeError } = await supabase
        .from("user_transactions")
        .insert([platformFeeTransaction]);

      if (platformFeeError) {
        console.error("Failed to insert platform fee transaction:", platformFeeError);
        throw platformFeeError;
      }

      // Insert platform fee record for analytics with property identification
      const { error: platformFeeRecordError } = await supabase
        .from("platform_fees")
        .insert([{
          user_wallet_address: wallet,
          fee_amount_usd: platformFee,
          fee_amount_base: Math.round(platformFee * 1e6), // Convert to base units
          property_value_usd: purchasePrice,
          fee_percentage: 3.0,
          payment_status: opts.status,
          transaction_hash: platformFeeTxHashValue,
          property_id: effectiveProperty.id || null
        }]);

      if (platformFeeRecordError) {
        console.error("Failed to insert platform fee record:", platformFeeRecordError);
      }

      console.log("🏠 AUDIT: Successfully inserted all transactions to database:", {
        downPayment: actualDownPayment,
        platformFee,
        totalUpfrontCost,
        propertyName: effectiveProperty.name,
        propertyLocation: effectiveProperty.location,
        mortgageId: opts.mortgageId,
        downPaymentTxHash: txHashValue,
        platformFeeTxHash: platformFeeTxHashValue
      });
    } catch (error) {
      console.error("Failed to save purchase transactions:", error);
      throw error;
    }
  };

  const handlePurchase = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (!kycComplete) {
      toast({
        title: "KYC Required",
        description: "Please complete KYC verification before proceeding with purchase.",
        variant: "destructive",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the investment terms before proceeding.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("🏠 AUDIT: Starting purchase for:", effectiveProperty.name);
      const purchasePrice = Number(effectiveProperty.totalValue || 150000);
      const actualDownPayment = purchasePrice * 0.2;
      const platformFee = purchasePrice * 0.03;
      
      console.log("🏠 AUDIT: Purchase details:", {
        property: effectiveProperty.name,
        purchasePrice,
        actualDownPayment,
        platformFee,
        totalUpfront: actualDownPayment + platformFee
      });
      
      // Execute both down payment and platform fee transactions
      const result = await purchaseProperty(actualDownPayment, platformFee);
      console.log("🏠 AUDIT: Purchase result from wallet:", result);

      // Extract transaction hashes from the result
      const mortgageId = result?.mortgageId;
      const downPaymentTxHash = result?.downPaymentTx?.hash;
      const platformFeeTxHash = result?.platformFeeTx?.hash;

      console.log("🏠 AUDIT: Transaction hashes:", {
        mortgageId,
        downPaymentTxHash,
        platformFeeTxHash
      });

      await savePurchaseToSupabase({
        status: "completed",
        mortgageId,
        txHash: downPaymentTxHash,
        platformFeeTxHash,
      });

      console.log("🏠 AUDIT: Successfully saved to Supabase, redirecting to portfolio");

      toast({
        title: "Purchase Successful!",
        description: `Property purchased! Down payment: $${actualDownPayment.toLocaleString()}, Platform fee: $${platformFee.toLocaleString()}`,
      });
      
      setTimeout(() => {
        window.location.href = '/portfolio';
      }, 1200);
      
      onClose();
    } catch (error) {
      console.error("🏠 AUDIT: Purchase failed, saving pending transaction:", error);
      await savePurchaseToSupabase({
        status: "pending",
      });

      toast({
        title: "Purchase Pending",
        description: "We saved a pending transaction. Once completed, your portfolio will update automatically.",
        variant: "destructive",
      });
    }
  };

  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Building2 className="h-6 w-6" />
            {effectiveProperty.name} - Mortgage Details
          </DialogTitle>
        </DialogHeader>

        <NetworkGuard />

        <div className="space-y-6">
          {/* Property Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Property Overview</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-600">
                  🏠 Mortgage Available
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Calle Rinconcito, Mazunte, Oaxaca, Mexico</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>Legal Owner: Ancient Holdings Ltd (Nevis Corp)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>10-Year Mortgage Term @ 8% APR</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">${property.totalValue?.toLocaleString() || '150,000'}</div>
                    <div className="text-sm text-muted-foreground">Property Value</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Investment Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">
                    ${property.downPayment?.toLocaleString() || '30,000'}
                  </div>
                  <div className="text-sm text-muted-foreground">Down Payment (20%)</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Founding Member Rate
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-xl font-bold text-green-600">
                    ${property.monthlyPayment?.toLocaleString() || '1,456'}
                  </div>
                  <div className="text-sm text-muted-foreground">Monthly Payment</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    10 Years @ 8% APR
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">
                    +${property.monthlyProfit || '594'}
                  </div>
                  <div className="text-sm text-muted-foreground">Monthly Profit</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Rental Income - Mortgage
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appreciation Projections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                10-Year Appreciation Projections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Expected Property Value (Year 10):</span>
                  <span className="font-bold">${property.networkValue?.toLocaleString() || '421,500'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Appreciation:</span>
                  <span className="font-bold text-green-600">
                    ${((property.networkValue || 421500) - 150000).toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="text-sm text-muted-foreground">
                  <strong>Appreciation Split (Full 181% Model):</strong>
                  <ul className="mt-2 space-y-1 list-disc list-inside ml-4">
                    <li>Buyer: 50% of appreciation</li>
                    <li>Ancient Holdings: 40% of appreciation</li>
                    <li>Lenders: 10% of appreciation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Legal Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" size="sm" className="justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Property Deed
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Nevis Corp Registration
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Investment Agreement
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Insurance Policy
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Smart Contract Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Blockchain Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Network:</span>
                <span className="font-medium">Avalanche Fuji Testnet</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Payment Token:</span>
                <span className="font-medium">USDT</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Ownership Token:</span>
                <span className="font-medium">MAZIT (ERC20)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Property Deed:</span>
                <span className="font-medium">NFT (ERC721)</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setShowSmartContract(true)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Smart Contract
              </Button>
            </CardContent>
          </Card>

          {/* KYC & Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Investment Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="kyc"
                  checked={kycComplete}
                  onChange={(e) => setKycComplete(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="kyc" className="text-sm">
                  I confirm I meet the $500 minimum investment requirement and have completed KYC verification
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="terms" className="text-sm">
                  I agree to the investment terms and understand this is a 10-year mortgage commitment
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Actions */}
          <div className="flex flex-col gap-3">
            {!isConnected ? (
              <Button onClick={connectWallet} size="lg" className="w-full">
                <Wallet className="h-5 w-5 mr-2" />
                Connect Wallet to Purchase
              </Button>
            ) : (
              <Button 
                onClick={handlePurchase} 
                size="lg" 
                className="w-full"
                disabled={isPurchasingProperty || !kycComplete || !agreedToTerms}
              >
                {isPurchasingProperty ? (
                  "Processing Transaction..."
                ) : (
                  <>
                    <Shield className="h-5 w-5 mr-2" />
                    Execute Smart Contract Purchase
                  </>
                )}
              </Button>
            )}
            <Button variant="outline" onClick={onClose} size="lg" className="w-full">
              Close
            </Button>
          </div>
        </div>
        
        {/* Smart Contract Viewer Modal */}
        <SmartContractViewer 
          isOpen={showSmartContract}
          onClose={() => setShowSmartContract(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

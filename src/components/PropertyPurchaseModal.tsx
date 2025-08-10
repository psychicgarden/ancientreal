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
import { PROPERTIES_CATALOG } from "@/lib/propertiesCatalog";

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

  // Use the provided property or fall back to the Art Deco Loft catalog entry
  const catalogLoft = PROPERTIES_CATALOG.find(p => p.id === "mazunte-art-deco-loft");
  const effectiveProperty = {
    name: property?.name || "Art Deco Loft",
    totalValue: property?.totalValue ?? 150000,
    downPayment: property?.downPayment ?? Math.round((property?.totalValue ?? 150000) * 0.2),
    monthlyPayment: property?.monthlyPayment ?? 1456,
    monthlyProfit: property?.monthlyProfit ?? 594,
    location: property?.location || catalogLoft?.location || "Mazunte, Mexico",
    image: property?.image || catalogLoft?.image || "/src/assets/villa-tulum.jpg",
  };

  const fallbackTxHash = () => `pending-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

  const savePurchaseToSupabase = async (opts: {
    status: "completed" | "pending";
    txHash?: string;
    mortgageId?: string;
  }) => {
    if (!account) {
      console.warn("No wallet account available; skipping portfolio insert.");
      return;
    }
    const wallet = account.toLowerCase();

    // Check if property already exists for this wallet to avoid duplicates
    const { data: existingProps, error: existingErr } = await supabase
      .from("user_properties")
      .select("id")
      .eq("user_wallet_address", wallet)
      .eq("property_name", effectiveProperty.name)
      .limit(1);

    if (existingErr) {
      console.error("Error checking existing properties:", existingErr);
    }

    const alreadyExists = (existingProps?.length ?? 0) > 0;

    const purchasePrice = Number(effectiveProperty.totalValue || 150000);
    const downPayment = Number(effectiveProperty.downPayment || Math.round(purchasePrice * 0.2));
    const monthlyPayment = Number(effectiveProperty.monthlyPayment || 1456);
    const remainingBalance = Math.max(purchasePrice - downPayment, 0);
    const equityPercentage = Math.round((downPayment / purchasePrice) * 100);

    // Only insert property if not existing
    if (!alreadyExists) {
      const { error: propInsertErr } = await supabase.from("user_properties").insert([
        {
          user_wallet_address: wallet,
          property_name: effectiveProperty.name,
          property_location: effectiveProperty.location,
          image_url: effectiveProperty.image,
          purchase_price: purchasePrice,
          down_payment: downPayment,
          current_value: purchasePrice, // start at purchase price
          monthly_payment: monthlyPayment,
          remaining_balance: remainingBalance,
          equity_percentage: equityPercentage,
          is_active: opts.status === "completed",
          mortgage_id: opts.mortgageId || null,
        },
      ]);

      if (propInsertErr) {
        console.error("Failed to insert user_properties:", propInsertErr);
      } else {
        console.log("Inserted property for wallet:", wallet, effectiveProperty.name);
      }
    } else {
      console.log("Property already exists in portfolio; skipping insert.");
    }

    // Always create a transaction record for traceability
    const txHashValue = opts.txHash || fallbackTxHash();
    const { error: txInsertErr } = await supabase.from("user_transactions").insert([
      {
        user_wallet_address: wallet,
        transaction_type: "purchase",
        transaction_hash: txHashValue,
        amount: downPayment,
        status: opts.status,
        metadata: {
          property_name: effectiveProperty.name,
          location: effectiveProperty.location,
          image_url: effectiveProperty.image,
          mortgage_id: opts.mortgageId || null,
        },
      },
    ]);

    if (txInsertErr) {
      console.error("Failed to insert user_transactions:", txInsertErr);
    } else {
      console.log("Inserted transaction:", txHashValue);
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
      console.log("Starting purchase for:", effectiveProperty.name);
      const result = await purchaseProperty(effectiveProperty.downPayment || 30000);

      // Use only mortgageId from the result; let savePurchaseToSupabase generate a fallback tx hash.
      const mortgageId = result?.mortgageId;

      await savePurchaseToSupabase({
        status: "completed",
        mortgageId,
      });

      toast({
        title: "Purchase Successful!",
        description: "Your property purchase has been completed. Check your portfolio to view your new investment.",
      });
      
      setTimeout(() => {
        window.location.href = '/portfolio';
      }, 1200);
      
      onClose();
    } catch (error) {
      console.error("Purchase failed, saving pending record:", error);
      await savePurchaseToSupabase({
        status: "pending",
      });

      toast({
        title: "Purchase Failed",
        description: "We saved a pending record to your portfolio. You can retry from your portfolio.",
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
            Mazunte Art Deco Loft - Investment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Property Overview</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-600">
                  🔗 Blockchain Secured
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
                  <span className="font-bold">${property.networkValue?.toLocaleString() || '467,000'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Appreciation:</span>
                  <span className="font-bold text-green-600">
                    ${((property.networkValue || 467000) - 150000).toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="text-sm text-muted-foreground">
                  <strong>Appreciation Split (Capped at 110%):</strong>
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

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Home, DollarSign, Zap } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { toBase } from "@/lib/money";
import { PROPERTY_ID_MAP } from "@/lib/constants";
import { isDemoProperty as checkIsDemoProperty } from "@/components/PropertyModeToggle";

interface MortgagePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  property: {
    id: string;
    title: string;
    location: string;
    image: string;
    value: number;
    monthlyPayment: number;
    remainingBalance: number;
    userProperty?: {
      id?: string;
      user_wallet_address?: string;
      principal_paid_base?: number;
      interest_paid_base?: number;
      unique_purchase_key?: string;
      mortgage_id?: string;
    };
  };
}

export const MortgagePaymentModal = ({ isOpen, onClose, property, onSuccess }: MortgagePaymentModalProps) => {
  const [step, setStep] = useState<'review' | 'confirm'>('review');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const { account } = useWallet();
  const { toast } = useToast();
  
  // Determine if this is a demo property payment using the correct detection logic
  // Pass the userProperty object directly to the detection function
  const isDemoProperty = checkIsDemoProperty(property.userProperty || property);
  
  console.log('🔍 MortgagePaymentModal - Full property analysis:', {
    isDemoProperty,
    propertyId: property.id,
    propertyTitle: property.title,
    userPropertyExists: !!property.userProperty,
    uniquePurchaseKey: property.userProperty?.unique_purchase_key,
    mortgageId: property.userProperty?.mortgage_id,
    propertyStructure: {
      hasUserProperty: !!property.userProperty,
      userPropertyKeys: property.userProperty ? Object.keys(property.userProperty) : null,
    }
  });

  // Use real property data for payment details
  const mortgageDetails = {
    monthlyPayment: property.monthlyPayment,
    principalAmount: property.monthlyPayment * 0.65, // Approximate principal portion
    interestAmount: property.monthlyPayment * 0.35, // Approximate interest portion
    remainingBalance: property.remainingBalance,
    nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next month
    loanAmount: property.remainingBalance + 50000, // Approximate original loan
    interestRate: 8.0,
    termRemaining: "9 years, 2 months" // Approximate
  };

  console.log('💰 MortgagePaymentModal - Payment Details:', {
    propertyTitle: property.title,
    monthlyPayment: property.monthlyPayment,
    totalAmount: mortgageDetails.monthlyPayment,
    isDemoProperty
  });

  const transactionFee = 0.0023; // AVAX
  const totalAmount = mortgageDetails.monthlyPayment;

  const handlePayment = async () => {
    if (!hasAcceptedTerms) {
      toast({
        title: "Terms Required",
        description: "Please confirm you understand this is a demo transaction.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Handle demo payment - completely isolated from blockchain
      toast({
        title: "Processing Demo Payment",
        description: "Simulating mortgage payment...",
      });

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update payment history for demo
      const mappedId = PROPERTY_ID_MAP[property.id] ?? 1;
      await supabase
        .from('payment_history')
        .insert({
          user_wallet_address: (account || 'demo-wallet').toLowerCase(),
          property_id: mappedId.toString(),
          payment_amount: property.monthlyPayment,
          remaining_balance_after: Math.max(0, property.remainingBalance - mortgageDetails.principalAmount),
          status: 'completed',
          payment_type: 'demo_payment'
        });

      // Update user property with new balance using the ID from userProperty
      if (property.userProperty?.id) {
        await supabase
          .from('user_properties')
          .update({
            remaining_balance: Math.max(0, property.remainingBalance - mortgageDetails.principalAmount),
            principal_paid_base: (property.userProperty.principal_paid_base || 0) + Number(toBase(mortgageDetails.principalAmount)),
            interest_paid_base: (property.userProperty.interest_paid_base || 0) + Number(toBase(mortgageDetails.interestAmount)),
            updated_at: new Date().toISOString()
          })
          .eq('id', property.userProperty.id);
      }

      toast({
        title: "Demo Payment Successful! 🎉",
        description: "Your demo mortgage payment has been processed! Balance updated.",
      });

      // Close modal and trigger refresh
      resetAndClose();
      onSuccess?.();
      
    } catch (error: any) {
      console.error('❌ Payment failed:', error);
      
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAndClose = () => {
    setStep('review');
    setHasAcceptedTerms(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            Demo Mortgage Payment
            <Badge variant="secondary" className="ml-2">
              Demo
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Home className="h-4 w-4" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-semibold">{property.title}</h4>
                  <p className="text-sm text-muted-foreground">{property.location}</p>
                  <p className="text-sm font-medium">${property.value.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-4 w-4" />
                Payment Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Principal</p>
                  <p className="font-semibold">${mortgageDetails.principalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Interest</p>
                  <p className="font-semibold">${mortgageDetails.interestAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Remaining Balance</p>
                  <p className="font-semibold">${mortgageDetails.remainingBalance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Term Remaining</p>
                  <p className="font-semibold">{mortgageDetails.termRemaining}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Payment</span>
                <span className="text-lg font-bold text-primary">
                  ${totalAmount.toFixed(2)} Demo Tokens
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Information */}
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-orange-800">
                <Zap className="h-4 w-4" />
                Demo Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-mono">
                    Demo Wallet ({account?.slice(0, 6) || 'demo'}...{account?.slice(-4) || 'wallet'})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network:</span>
                  <span>Demo Network</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next Due Date:</span>
                  <span>{new Date(mortgageDetails.nextDueDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="mt-3 p-3 bg-orange-100 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>Demo Mode:</strong> This is a simulated payment for demonstration purposes. 
                  No real cryptocurrency will be transferred.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Confirmation */}
          {step === 'review' && (
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={hasAcceptedTerms}
                  onCheckedChange={(checked) => setHasAcceptedTerms(!!checked)}
                />
                <label htmlFor="terms" className="text-sm leading-5">
                  I understand this is a demo transaction. 
                  I have verified the payment amount and property details above.
                </label>
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={resetAndClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={() => setStep('confirm')} 
                  disabled={!hasAcceptedTerms}
                  className="flex-1"
                >
                  Review Payment
                </Button>
              </div>
            </div>
          )}

          {/* Final Confirmation */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border bg-orange-50 border-orange-200">
                <h4 className="font-semibold mb-2 text-orange-800">Final Confirmation</h4>
                <p className="text-sm">
                  You are about to simulate sending <strong>
                    ${totalAmount.toFixed(2)} Demo Tokens
                  </strong> for your monthly mortgage payment. 
                  This demo transaction will update your portfolio instantly.
                </p>
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep('review')} className="flex-1">
                  Back to Review
                </Button>
                <Button 
                  onClick={handlePayment} 
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? "Processing..." : "Confirm Payment"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Shield, AlertTriangle, CreditCard, Home, Clock, DollarSign } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import NetworkGuard from "@/components/NetworkGuard";
import { toBase, fmtUSD, asUSD, principalBase } from "@/lib/money";
import { PROPERTY_ID_MAP } from "@/lib/constants";

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
  };
}

export const MortgagePaymentModal = ({ isOpen, onClose, property, onSuccess }: MortgagePaymentModalProps) => {
  const [step, setStep] = useState<'review' | 'confirm'>('review');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const { account, makePayment } = useWallet();
  const { toast } = useToast();

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

  const transactionFee = 0.0023; // AVAX
  const totalAmount = mortgageDetails.monthlyPayment;

  const handlePayment = async () => {
    if (!hasAcceptedTerms) {
      toast({
        title: "Terms Required",
        description: "Please confirm you understand this is a blockchain transaction.",
        variant: "destructive"
      });
      return;
    }

    if (!account) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to make a payment.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Use the makePayment from WalletContext
      await makePayment();
      
      const mappedId = PROPERTY_ID_MAP[property.id] ?? 1;

      const principalBase = Number(toBase(Number(mortgageDetails.principalAmount || 0)));
      const interestBase  = Number(toBase(Number(mortgageDetails.interestAmount  || 0)));

      const txHash = (mortgageDetails as any)?.txHash ?? null;

      const { error: rpcErr } = await supabase.rpc('apply_mortgage_payment' as any, {
        p_user_address: account?.toLowerCase(),
        p_property_id: mappedId,
        p_principal_delta_base: principalBase,
        p_interest_delta_base: interestBase,
        p_tx_hash: txHash
      });

      if (rpcErr) {
        console.error('RPC failed', rpcErr);
        toast({
          title: "Payment failed",
          description: "Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // success → refresh UI and close
      // if you use a refetch, call it here; otherwise trigger your local refresh
      // e.g., refetch?.();
      setIsProcessing(false);
      // toast.success('Payment recorded'); // if you use a toaster
      onClose?.();

      // Record payment in payment history using mappedId
      await supabase
        .from('payment_history')
        .insert({
          user_wallet_address: account?.toLowerCase(),
          property_id: mappedId.toString(),
          payment_amount: property.monthlyPayment,
          remaining_balance_after: Math.max(0, property.remainingBalance - property.monthlyPayment),
          status: 'completed'
        });

      toast({
        title: "Payment Successful",
        description: "Your mortgage payment has been processed successfully.",
      });

      // Trigger success callback to refresh portfolio
      onSuccess?.();
      
      onClose();
      setStep('review');
      setHasAcceptedTerms(false);
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Refresh the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
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
            <Shield className="h-5 w-5 text-primary" />
            Mortgage Payment Confirmation
          </DialogTitle>
        </DialogHeader>

        <NetworkGuard />

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
                <span className="text-lg font-bold text-primary">${totalAmount.toFixed(2)} USDT</span>
              </div>
            </CardContent>
          </Card>

          {/* Security Information */}
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-orange-800">
                <AlertTriangle className="h-4 w-4" />
                Transaction Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-mono">Wallet ({account?.slice(0, 6)}...{account?.slice(-4)})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network:</span>
                  <span>Avalanche C-Chain</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Gas Fee:</span>
                  <span>{transactionFee} AVAX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next Due Date:</span>
                  <span>{new Date(mortgageDetails.nextDueDate).toLocaleDateString()}</span>
                </div>
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
                  I understand this is a blockchain transaction that cannot be reversed. 
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
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">Final Confirmation</h4>
                <p className="text-sm">
                  You are about to send <strong>${totalAmount.toFixed(2)} USDT</strong> for your monthly mortgage payment. 
                  This transaction will be processed immediately and cannot be undone.
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
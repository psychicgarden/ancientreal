import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, TrendingDown, AlertTriangle, Repeat } from "lucide-react";

interface CashOutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableBalance: number;
  portfolioValue: number;
}

export const CashOutModal: React.FC<CashOutModalProps> = ({ 
  open, 
  onOpenChange, 
  availableBalance,
  portfolioValue 
}) => {
  const [cashOutAmount, setCashOutAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isConnected, connectWallet } = useWallet();
  const { toast } = useToast();

  // Calculate fees and net amounts
  const platformFee = cashOutAmount * 0.05; // 5% cash-out fee
  const netAmount = cashOutAmount - platformFee;
  const feePercentage = 5;

  // Calculate reinvestment opportunity
  const reinvestmentValue = cashOutAmount; // Full amount stays in platform
  const reinvestmentSavings = platformFee; // Amount saved by not cashing out

  const handleCashOut = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (cashOutAmount <= 0 || cashOutAmount > availableBalance) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid cash-out amount within your available balance.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // TODO: Integrate with smart contracts for actual cash-out
      console.log(`Cashing out $${cashOutAmount} with $${platformFee} fee`);
      
      // Simulate cash-out processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Cash-Out Successful!",
        description: `$${netAmount.toLocaleString()} has been sent to your wallet (${feePercentage}% platform fee deducted)`,
      });
      
      onOpenChange(false);
      setCashOutAmount(0);
    } catch (error) {
      console.error('Cash-out failed:', error);
      toast({
        title: "Cash-Out Failed",
        description: "There was an error processing your cash-out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReinvest = () => {
    toast({
      title: "Smart Choice!",
      description: `Keep your $${cashOutAmount.toLocaleString()} invested and save $${platformFee.toLocaleString()} in fees while continuing to earn returns.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Cash Out Profits
          </DialogTitle>
          <DialogDescription>
            Withdraw your profits or reinvest to avoid platform fees and continue earning
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Available Balance */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="font-medium">Available Balance</div>
              <div className="text-sm text-muted-foreground">Total profits ready for withdrawal</div>
            </div>
            <div className="text-2xl font-bold text-green-600">
              ${availableBalance.toLocaleString()}
            </div>
          </div>

          {/* Cash-Out Amount Input */}
          <div className="space-y-4">
            <Label htmlFor="cashout-amount">Cash-Out Amount</Label>
            <div className="flex gap-2">
              <Input
                id="cashout-amount"
                type="number"
                value={cashOutAmount}
                onChange={(e) => setCashOutAmount(Number(e.target.value))}
                min={0}
                max={availableBalance}
                step={100}
                placeholder="Enter amount to cash out"
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={() => setCashOutAmount(availableBalance)}
              >
                Max
              </Button>
            </div>
          </div>

          {/* Fee Warning */}
          {cashOutAmount > 0 && (
            <Alert className="border-destructive/50 bg-destructive/5">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>
                  <strong>5% Platform Fee:</strong> ${platformFee.toLocaleString()} will be deducted
                </span>
                <Badge variant="destructive">{feePercentage}% Fee</Badge>
              </AlertDescription>
            </Alert>
          )}

          {/* Comparison Cards */}
          {cashOutAmount > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cash-Out Option */}
              <Card className="border-destructive/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="h-4 w-4 text-destructive" />
                    <span className="font-medium text-destructive">Cash Out</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Withdrawal Amount:</span>
                      <span>${cashOutAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-destructive">
                      <span>Platform Fee (5%):</span>
                      <span>-${platformFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>You Receive:</span>
                      <span className="text-destructive">${netAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reinvest Option */}
              <Card className="border-green-500/30 bg-green-50/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Repeat className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-600">Reinvest</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Keep Invested:</span>
                      <span>${reinvestmentValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Fee Savings:</span>
                      <span>+${reinvestmentSavings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Total Value:</span>
                      <span className="text-green-600">${reinvestmentValue.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Reinvestment Benefits */}
          {cashOutAmount > 0 && (
            <div className="bg-green-50/50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-3">💡 Why Reinvesting is Better</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-700">
                <div>✅ No 5% platform fee</div>
                <div>✅ Continue earning compound returns</div>
                <div>✅ Access to new investment opportunities</div>
                <div>✅ Maintain your platform citizenship benefits</div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {cashOutAmount > 0 && (
            <Button 
              variant="secondary"
              onClick={handleReinvest}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Repeat className="h-4 w-4 mr-2" />
              Keep Invested (Save ${platformFee.toLocaleString()})
            </Button>
          )}
          <Button 
            onClick={handleCashOut}
            disabled={isProcessing || cashOutAmount <= 0 || cashOutAmount > availableBalance}
            variant="destructive"
            className="min-w-[140px]"
          >
            {isProcessing ? (
              "Processing..."
            ) : !isConnected ? (
              "Connect Wallet"
            ) : (
              `Cash Out $${netAmount.toLocaleString()}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/contexts/WalletContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  TrendingUp, 
  Calculator, 
  Clock, 
  DollarSign, 
  Users, 
  Shield,
  AlertTriangle 
} from "lucide-react";

interface FractionalProperty {
  id: string;
  name: string;
  location: string;
  originalPrice: number;
  currentSpeculationPrice: number;
  minInvestment: number;
  totalTokensAvailable: number;
  tokensSold: number;
  ownerWalletAddress: string;
  year10TriggerDate: string;
  roi: number;
  imageUrl?: string;
}

interface FractionalInvestmentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  property: FractionalProperty | null;
}

const FractionalInvestmentModal: React.FC<FractionalInvestmentModalProps> = ({
  isOpen,
  onOpenChange,
  property
}) => {
  const [investmentAmount, setInvestmentAmount] = useState<number>(50);
  const [isInvesting, setIsInvesting] = useState(false);
  const { toast } = useToast();
  const { account, isConnected } = useWallet();

  if (!property) return null;

  const ownershipPercentage = (investmentAmount / property.currentSpeculationPrice) * 100;
  const tokenAmount = (investmentAmount / property.currentSpeculationPrice) * property.totalTokensAvailable;
  const projectedYear10Value = property.originalPrice * 2.1; // 110% appreciation cap
  const appreciationBurden = (property.originalPrice * 1.1 - property.originalPrice) * 0.5; // 50% of capped appreciation
  const userAppreciationBurden = appreciationBurden * (ownershipPercentage / 100);
  const projectedAnnualIncome = investmentAmount * (property.roi / 100);

  // Quick investment amounts
  const quickAmounts = [50, 100, 500, 1000, 5000];

  const handleInvestment = async () => {
    if (!isConnected || !account) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to invest",
        variant: "destructive"
      });
      return;
    }

    if (investmentAmount < property.minInvestment) {
      toast({
        title: "Minimum Investment Required",
        description: `Minimum investment is $${property.minInvestment}`,
        variant: "destructive"
      });
      return;
    }

    setIsInvesting(true);

    try {
      // Record fractional investment in database
      const { error } = await supabase
        .from('fractional_investments')
        .insert({
          property_id: property.id,
          investor_wallet_address: account,
          investment_amount: investmentAmount,
          token_amount: tokenAmount,
          ownership_percentage: ownershipPercentage,
          original_property_price: property.originalPrice,
          speculation_price: property.currentSpeculationPrice,
          status: 'active'
        });

      if (error) throw error;

      // Update property fractionalization tokens sold
      const { error: updateError } = await supabase
        .from('property_fractionalization')
        .update({
          tokens_sold: property.tokensSold + tokenAmount
        })
        .eq('id', property.id);

      if (updateError) throw updateError;

      toast({
        title: "Investment Successful! 🎉",
        description: `You've invested $${investmentAmount} and own ${ownershipPercentage.toFixed(4)}% of ${property.name}`,
      });

      onOpenChange(false);
      setInvestmentAmount(50);

    } catch (error) {
      console.error('Investment error:', error);
      toast({
        title: "Investment Failed",
        description: "There was an error processing your investment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsInvesting(false);
    }
  };

  const availablePercentage = ((property.totalTokensAvailable - property.tokensSold) / property.totalTokensAvailable) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Fractional Investment - {property.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Property Details */}
          <div className="space-y-4">
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{property.name}</h3>
                    <p className="text-muted-foreground">{property.location}</p>
                  </div>
                  <Badge variant="secondary">Fractional</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Original Purchase</p>
                    <p className="font-semibold">${property.originalPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Market Speculation</p>
                    <p className="font-semibold text-primary">${property.currentSpeculationPrice.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Available for Investment</span>
                    <span className="text-sm font-medium">{availablePercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={availablePercentage} className="h-2" />
                </div>
              </div>
            </Card>

            {/* Key Investment Details */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Investment Details
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Projected Annual Return:</span>
                  <Badge variant="outline">{property.roi}% APY</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Minimum Investment:</span>
                  <span className="font-medium">${property.minInvestment}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Year 10 Appreciation Event:</span>
                  <span className="text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {new Date(property.year10TriggerDate).getFullYear()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Appreciation Warning */}
            <Card className="p-4 border-orange-200 bg-orange-50 dark:bg-orange-950/10">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200">
                    Year 10 Appreciation Payment
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    At year 10, all fractional owners must pay their share of the appreciation 
                    (50% of capped appreciation). This is calculated from the original purchase 
                    price of ${property.originalPrice.toLocaleString()}, not current speculation prices.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Investment Interface */}
          <div className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Investment Amount
              </h4>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                {quickAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={investmentAmount === amount ? "default" : "outline"}
                    size="sm"
                    onClick={() => setInvestmentAmount(amount)}
                    className="text-xs"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>

              {/* Custom Amount Input */}
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium">Custom Amount</label>
                <Input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  min={property.minInvestment}
                  placeholder="Enter amount"
                />
              </div>

              {/* Investment Slider */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Investment Range: ${property.minInvestment} - $50,000
                </label>
                <Slider
                  value={[investmentAmount]}
                  onValueChange={(value) => setInvestmentAmount(value[0])}
                  min={property.minInvestment}
                  max={50000}
                  step={10}
                  className="w-full"
                />
              </div>
            </Card>

            {/* Investment Summary */}
            <Card className="p-4">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Investment Summary
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Investment Amount:</span>
                  <span className="font-semibold">${investmentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Ownership Percentage:</span>
                  <span className="font-semibold">{ownershipPercentage.toFixed(4)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tokens Received:</span>
                  <span className="font-semibold">{tokenAmount.toFixed(0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm">Projected Annual Income:</span>
                  <span className="font-semibold text-green-600">${projectedAnnualIncome.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Year 10 Appreciation Burden:</span>
                  <span className="font-semibold text-orange-600">${userAppreciationBurden.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Timeline Visualization */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                10-Year Investment Timeline
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="font-medium">Today: Investment & Ownership</p>
                    <p className="text-muted-foreground">Start earning rental income immediately</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-secondary rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="font-medium">Years 1-10: Rental Income</p>
                    <p className="text-muted-foreground">Earn {property.roi}% APY on your investment</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="font-medium">Year 10: Appreciation Event</p>
                    <p className="text-muted-foreground">
                      Pay ${userAppreciationBurden.toFixed(2)} appreciation or choose refinancing
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Investment Button */}
            <Button 
              onClick={handleInvestment}
              disabled={!isConnected || isInvesting || investmentAmount < property.minInvestment}
              className="w-full"
              size="lg"
            >
              {isInvesting ? (
                "Processing Investment..."
              ) : !isConnected ? (
                "Connect Wallet to Invest"
              ) : investmentAmount < property.minInvestment ? (
                `Minimum $${property.minInvestment} Required`
              ) : (
                `Invest $${investmentAmount.toLocaleString()}`
              )}
            </Button>

            {isConnected && (
              <p className="text-xs text-muted-foreground text-center">
                Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FractionalInvestmentModal;
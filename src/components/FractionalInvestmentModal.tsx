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
  AlertTriangle,
  Home,
  Receipt,
  PieChart
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

  const ownershipPercentage = property.currentSpeculationPrice > 0 ? (investmentAmount / property.currentSpeculationPrice) * 100 : 0;
  const tokenAmount = property.currentSpeculationPrice > 0 ? (investmentAmount / property.currentSpeculationPrice) * property.totalTokensAvailable : 0;
  
  // Fixed appreciation calculation using 181% total appreciation with investor 50% share
  const originalPrice = property.originalPrice || 150000;
  const projected181Value = originalPrice * 2.81; // 181% appreciation = 2.81x multiplier
  const totalAppreciation = projected181Value - originalPrice; // $271,500 total appreciation
  const investorAppreciationShare = totalAppreciation * 0.5; // Investors get 50% = $135,750
  const userAppreciationShare = investorAppreciationShare * (ownershipPercentage / 100);
  
  // Real rental income calculation: $2050 base rent - 20% expenses - 8% management fee
  const monthlyBaseRent = 2050;
  const monthlyExpenses = monthlyBaseRent * 0.20; // 20% for maintenance, taxes, insurance
  const managementFee = monthlyBaseRent * 0.08; // 8% management fee
  const netMonthlyRental = monthlyBaseRent - monthlyExpenses - managementFee;
  const userMonthlyRentalIncome = netMonthlyRental * (ownershipPercentage / 100);
  const projectedAnnualIncome = userMonthlyRentalIncome * 12;

  // Investment performance metrics (now includes appreciation gains instead of burden)
  const totalTenYearRental = projectedAnnualIncome * 10;
  const totalTenYearReturn = totalTenYearRental + userAppreciationShare; // Add appreciation gains
  const netTenYearProfit = totalTenYearReturn - investmentAmount; // Subtract initial investment
  const totalReturnPercentage = (totalTenYearReturn / investmentAmount - 1) * 100;
  const annualizedReturn = Math.pow(totalTenYearReturn / investmentAmount, 1/10) - 1;

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

    if (investmentAmount < (property.minInvestment || 50)) {
      toast({
        title: "Minimum Investment Required",
        description: `Minimum investment is $${(property.minInvestment || 50)}`,
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Fractional Real Estate Investment - {property.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    <p className="font-semibold">${originalPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Market Speculation</p>
                    <p className="font-semibold text-primary">${(property.currentSpeculationPrice || 0).toLocaleString()}</p>
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

            {/* Rental Income Details */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Home className="h-4 w-4" />
                Monthly Rental Breakdown
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Base Rent:</span>
                  <span className="font-medium">${monthlyBaseRent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Property Expenses:</span>
                  <span className="font-medium text-red-600">-${monthlyExpenses.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Management Fee:</span>
                  <span className="font-medium text-red-600">-${managementFee.toFixed(0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Net Monthly Rental:</span>
                  <span className="font-medium text-green-600">${netMonthlyRental.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Minimum Investment:</span>
                  <span className="font-medium">${(property.minInvestment || 50)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Year 10 Trigger:</span>
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
                  <h4 className="font-semibold text-green-800 dark:text-green-200">
                    Year 10 Appreciation Gains
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Property is projected to appreciate 181% (${originalPrice.toLocaleString()} → ${projected181Value.toLocaleString()}) 
                    over 10 years. Total appreciation: ${totalAppreciation.toLocaleString()}. 
                    As an investor, you receive 50% of appreciation gains: ${investorAppreciationShare.toLocaleString()} total, 
                    or ${userAppreciationShare.toFixed(2)} for your ownership share.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Middle Column - Investment Interface */}
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
                  min={property.minInvestment || 50}
                  placeholder="Enter amount"
                />
              </div>

              {/* Investment Slider */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Investment Range: ${(property.minInvestment || 50)} - $50,000
                </label>
                <Slider
                  value={[investmentAmount]}
                  onValueChange={(value) => setInvestmentAmount(value[0])}
                  min={property.minInvestment || 50}
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
                  <span className="text-sm">Monthly Rental Income:</span>
                  <span className="font-semibold text-green-600">${userMonthlyRentalIncome.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Annual Rental Income:</span>
                  <span className="font-semibold text-green-600">${projectedAnnualIncome.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Rental Yield (Annual):</span>
                  <span className="font-semibold text-blue-600">{((projectedAnnualIncome / investmentAmount) * 100).toFixed(2)}%</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm">Year 10 Appreciation Share:</span>
                  <span className="font-semibold text-green-600">+${userAppreciationShare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total 10-Year Rental Income:</span>
                  <span className="font-semibold text-green-600">${totalTenYearRental.toFixed(0)}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Performance & Timeline */}
          <div className="space-y-4">
            {/* Performance Metrics */}
            <Card className="p-4">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Investment Performance
              </h4>
              <div className="space-y-4">
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {annualizedReturn > 0 ? '+' : ''}{(annualizedReturn * 100).toFixed(2)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Annualized Return</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Investment:</span>
                    <span className="font-medium">${investmentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Rental (10 years):</span>
                    <span className="font-medium text-green-600">+${totalTenYearRental.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Appreciation Share:</span>
                    <span className="font-medium text-green-600">+${userAppreciationShare.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total 10-Year Value:</span>
                    <span className="font-bold text-green-600">
                      ${totalTenYearReturn.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Net Profit:</span>
                    <span className={`font-bold ${netTenYearProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {netTenYearProfit > 0 ? '+' : ''}${netTenYearProfit.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Return:</span>
                    <span className={`font-bold ${totalReturnPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalReturnPercentage > 0 ? '+' : ''}{totalReturnPercentage.toFixed(1)}%
                    </span>
                  </div>
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
                    <p className="font-medium">Years 1-10: Monthly Rental Income</p>
                    <p className="text-muted-foreground">Earn ${userMonthlyRentalIncome.toFixed(2)}/month (${projectedAnnualIncome.toFixed(0)}/year)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="font-medium">Year 10: Appreciation Event</p>
                     <p className="text-muted-foreground">
                       Receive +${userAppreciationShare.toFixed(2)} appreciation share
                     </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="font-medium">Beyond Year 10: Continued Ownership</p>
                    <p className="text-muted-foreground">
                      Continue earning rental income with full ownership benefits
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Investment Button */}
            <Button 
              onClick={handleInvestment}
              disabled={!isConnected || isInvesting || investmentAmount < (property.minInvestment || 50)}
              className="w-full"
              size="lg"
            >
              {isInvesting ? (
                "Processing Investment..."
              ) : !isConnected ? (
                "Connect Wallet to Invest"
              ) : investmentAmount < (property.minInvestment || 50) ? (
                `Minimum $${(property.minInvestment || 50)} Required`
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
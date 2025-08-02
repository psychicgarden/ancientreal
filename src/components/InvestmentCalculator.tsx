import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, TrendingUp, Home, Users } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";

interface InvestmentCalculatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvestmentCalculator = ({ open, onOpenChange }: InvestmentCalculatorProps) => {
  const [investment, setInvestment] = useState([30000]);
  const { isConnected, purchaseTokens, isPurchasing } = useWallet();

  // Investment calculations
  const investmentAmount = investment[0];
  const propertyValue = 150000;
  const monthlyRent = 2400;
  const monthlyMortgage = 1456;
  const baseMonthlyProfit = monthlyRent - monthlyMortgage; // $943
  
  // Calculate user's share based on investment
  const ownershipPercentage = investmentAmount / propertyValue;
  const monthlyProfit = baseMonthlyProfit * ownershipPercentage;
  const annualProfit = monthlyProfit * 12;
  const annualYield = (annualProfit / investmentAmount) * 100;
  
  // 10-year projections (12% growth)
  const tenYearValue = propertyValue * Math.pow(1.12, 10);
  const tenYearOwnershipValue = tenYearValue * ownershipPercentage;
  const tenYearProfit = tenYearOwnershipValue - investmentAmount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Calculate Your Network Returns
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Investment Amount Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Investment Amount</label>
              <span className="text-xl font-bold">${investmentAmount.toLocaleString()}</span>
            </div>
            <Slider
              value={investment}
              onValueChange={setInvestment}
              max={150000}
              min={30000}
              step={5000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$30K (Founding Member)</span>
              <span>$150K (Full Property)</span>
            </div>
          </div>

          {/* Real-time Calculations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="font-medium">Monthly Cash Flow</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  ${Math.round(monthlyProfit).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {(ownershipPercentage * 100).toFixed(1)}% ownership
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Annual Yield</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {annualYield.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  ${Math.round(annualProfit).toLocaleString()}/year
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 10-Year Projection */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                10-Year Network Projection
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Your Investment</div>
                  <div className="text-lg font-bold">${investmentAmount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Projected Value</div>
                  <div className="text-lg font-bold text-green-600">
                    ${Math.round(tenYearOwnershipValue).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Profit</div>
                  <div className="text-lg font-bold text-primary">
                    ${Math.round(tenYearProfit).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Network Benefits */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-3">🌍 Network Citizenship Benefits</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>✅ Stay in any Ancient property worldwide</div>
              <div>✅ Governance rights in village decisions</div>
              <div>✅ Profit sharing across entire network</div>
              <div>✅ Early access to new village launches</div>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            className="w-full" 
            size="lg"
            onClick={() => {
              purchaseTokens();
              onOpenChange(false);
            }}
            disabled={isPurchasing || !isConnected}
          >
            {isPurchasing 
              ? "Processing..." 
              : !isConnected 
                ? "Connect Wallet to Secure Investment"
                : "Secure This Investment"
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentCalculator;
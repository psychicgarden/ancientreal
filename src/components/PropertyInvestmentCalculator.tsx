import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, TrendingUp, Home, Users } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { calculateInvestmentMetrics, PropertyMortgageData } from "@/lib/finance";

interface PropertyInvestmentCalculatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: {
    name: string;
    location: string;
    totalValue: number;
    downPayment: number;
    monthlyRent: number;
    projected_appreciation_percent?: number;
    networkValue?: number; // Legacy field, kept for backward compatibility
  } | null;
}

const PropertyInvestmentCalculator = ({ open, onOpenChange, property }: PropertyInvestmentCalculatorProps) => {
  const [investment, setInvestment] = useState([30000]); // Default value
  const { isConnected, purchaseTokens, isPurchasing } = useWallet();

  // Set investment to property's down payment when property changes
  useEffect(() => {
    if (property) {
      setInvestment([property.downPayment]);
    }
  }, [property]);

  // Early return AFTER all hooks
  if (!property) return null;

  // Investment calculations using centralized finance service
  const investmentAmount = investment[0];
  
  // Create property data for calculation - use specific data for Art Deco Loft
  const propertyData: PropertyMortgageData = {
    propertyValue: property.totalValue,
    downPayment: property.downPayment,
    aprBps: property.name === "Art Deco Loft" ? 800 : 750, // 8% APR for Art Deco Loft, 7.5% for others
    termMonths: 120, // 10 years
    monthlyRent: property.monthlyRent,
    platformFeePercent: 0.03
  };

  // Platform fee is separate upfront cost (3% of property list price)
  const platformFee = property.totalValue * 0.03;

  // Calculate metrics using centralized service
  const metrics = calculateInvestmentMetrics(investmentAmount, propertyData);

  // Property appreciation calculations - use networkValue for Art Deco Loft or calculate for others
  const tenYearPropertyValue = property.networkValue || 
    (property.totalValue * (1 + ((property.projected_appreciation_percent || 181) / 100)));
  const totalAppreciation = tenYearPropertyValue - property.totalValue;
  const buyerAppreciationShare = totalAppreciation * 0.5; // 50% split

  // Calculate totals for 10-year projection using correct metrics
  const totalCashFlow = metrics.totalCashFlowProfit;
  const actualWealthCreated = metrics.totalProfit; // True profit: cash flow + equity - investment
  const totalInvestment = investmentAmount + platformFee; // Down payment + platform fee
  const total10YearROI = totalInvestment > 0 ? (actualWealthCreated / totalInvestment) * 100 : 0;

  // Interest savings calculation (vs baseline scenario)
  const baselineData: PropertyMortgageData = {
    ...propertyData,
    downPayment: property.downPayment
  };
  const baselineMetrics = calculateInvestmentMetrics(property.downPayment, baselineData);
  const totalInterestSaved = Math.max(0, baselineMetrics.totalInterestCost - metrics.totalInterestCost);

  // Annual calculations
  const annualProfit = metrics.monthlyProfit * 12;
  const trueAnnualROI = totalInvestment > 0 ? (total10YearROI / 10) : 0;


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Calculate Returns - {property.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Investment Amount Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Investment Amount</label>
              <span className="text-xl font-bold">${investmentAmount.toLocaleString()}</span>
            </div>
            
            {/* Platform Fee Notice */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm">
              <div>
                <span className="font-medium">Platform Fee (3%):</span>
                <span className="text-muted-foreground ml-2">Done-for-you legal compliance & deal processing</span>
              </div>
              <span className="font-bold">${platformFee.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg text-sm">
              <span className="font-medium">Your Equity Investment:</span>
              <span className="font-bold">${investmentAmount.toLocaleString()}</span>
            </div>
            <div className="px-3">
              <Slider
                value={investment}
                onValueChange={setInvestment}
                max={property.totalValue || 200000}
                min={property.downPayment || 30000}
                step={5000}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>${(property.downPayment || 30000).toLocaleString()} (Min Down)</span>
              <span>${(property.totalValue || 200000).toLocaleString()} (Full Property)</span>
            </div>
          </div>

          {/* Total 10-Year Profit - Prominent Display */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-sm font-medium text-muted-foreground mb-2">Total 10-Year Profit</div>
                <div className="text-4xl font-bold text-primary mb-2">
                  ${Math.round(actualWealthCreated).toLocaleString()}
                </div>
                <div className="text-lg text-muted-foreground">
                  {((actualWealthCreated / totalInvestment) + 1).toFixed(1)}x total return
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {total10YearROI.toFixed(0)}% total return over 10 years
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Summary */}
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-center">Investment Summary</h3>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">You Invest</div>
                  <div className="text-2xl font-bold text-red-600">
                    ${totalInvestment.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Today</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">You Get Back</div>
                  <div className="text-2xl font-bold text-primary">
                    ${(totalInvestment + actualWealthCreated).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">After 10 years</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Pure Profit</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${Math.round(actualWealthCreated).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Wealth created</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Calculations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="font-medium">Monthly Cash Flow</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  ${Math.round(metrics.monthlyProfit).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  ${Math.round(annualProfit).toLocaleString()}/year
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Cash Flow Yield</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.cashFlowYield.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Annual cash return
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">Mortgage Savings</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  ${Math.max(0, Math.round(totalInterestSaved)).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Interest eliminated
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">Annual ROI</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {trueAnnualROI.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Yearly return rate
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
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Equity Investment</div>
                  <div className="text-lg font-bold">${investmentAmount.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Property equity</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Cash Flow Profit</div>
                  <div className="text-lg font-bold text-green-600">
                    ${Math.round(totalCashFlow).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Interest Saved</div>
                  <div className="text-lg font-bold text-purple-600">
                    ${Math.round(totalInterestSaved).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Final Equity Value</div>
                  <div className="text-lg font-bold text-blue-600">
                    ${Math.round(metrics.totalEquityAtMaturity).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Profit</div>
                  <div className="text-lg font-bold text-primary">
                    ${Math.round(actualWealthCreated).toLocaleString()}
                  </div>
                </div>
              </div>
              
              {/* Property Appreciation Breakdown */}
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium mb-3 text-center">Property Appreciation Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center text-sm">
                  <div>
                    <div className="text-muted-foreground">Starting Value</div>
                    <div className="font-semibold">${property.totalValue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Final Value (Year 10)</div>
                    <div className="font-semibold">${tenYearPropertyValue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Total Appreciation</div>
                    <div className="font-semibold text-blue-600">${totalAppreciation.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Your Share (50%)</div>
                    <div className="font-semibold text-blue-600">${Math.round(buyerAppreciationShare).toLocaleString()}</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t text-center">
                <div className="text-sm text-muted-foreground">Total 10-Year ROI</div>
                <div className="text-2xl font-bold text-primary">
                  {total10YearROI.toFixed(1)}%
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

          {/* Investment Disclaimers */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
            <h4 className="font-semibold text-destructive">⚠️ Important Investment Disclaimers</h4>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>• All investments carry risk of loss and are not guaranteed</li>
              <li>• Projected returns are estimates based on current market conditions</li>
              <li>• Real estate investments subject to market fluctuations and vacancy risk</li>
              <li>• Past performance does not guarantee future results</li>
              <li>• Demo environment - consult professionals before investing</li>
            </ul>
          </div>

          {/* Action Button */}
          <Button 
            className="w-full" 
            size="lg"
            onClick={() => {
              purchaseTokens(investmentAmount);
              onOpenChange(false);
            }}
            disabled={isPurchasing || !isConnected}
          >
            {isPurchasing 
              ? "Processing..." 
              : !isConnected 
                ? "Connect Wallet to Secure Investment"
                : `Secure $${investmentAmount.toLocaleString()} Investment`
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyInvestmentCalculator;
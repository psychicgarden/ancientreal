import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, TrendingUp, Home, Users } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { calculateInvestmentMetrics } from "@/lib/finance";

interface InvestmentCalculatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvestmentCalculator = ({ open, onOpenChange }: InvestmentCalculatorProps) => {
  const [investment, setInvestment] = useState([30000]);
  const { isConnected, purchaseTokens, isPurchasing } = useWallet();

  // Investment calculations using centralized finance service with platform fee
  const investmentAmount = investment[0];
  const platformFee = investmentAmount * 0.03; // 3% platform fee for property purchases
  const totalInvestment = investmentAmount + platformFee; // Total out-of-pocket cost
  const netInvestment = investmentAmount; // Actual amount going to property
  
  // Property data for calculation
  const propertyData = {
    propertyValue: 150000, // Oceanview Loft property value
    downPayment: netInvestment,
    aprBps: 800, // 8% APR
    termMonths: 120, // 10 years
    monthlyRent: 2266, // Correct rent from database
    platformFeePercent: 0.03
  };
  
  // Calculate metrics using centralized service
  const metrics = calculateInvestmentMetrics(investmentAmount, propertyData);
  
  // Calculate baseline scenario (minimum $30K down payment) for interest savings
  const baselineData = {
    ...propertyData,
    downPayment: 30000
  };
  const baselineMetrics = calculateInvestmentMetrics(30000, baselineData);
  const totalInterestSaved = Math.max(0, baselineMetrics.totalInterestCost - metrics.totalInterestCost);
  
  // Annual calculations
  const annualProfit = metrics.monthlyProfit * 12;
  const cashFlowYield = metrics.cashFlowYield;
  
  // Property appreciation calculations - 181% appreciation model
  const appreciationPercent = 181;
  const totalAppreciation = propertyData.propertyValue * (appreciationPercent / 100);
  const tenYearPropertyValue = propertyData.propertyValue + totalAppreciation;
  const buyerAppreciationShare = totalAppreciation * 0.5; // 50% split
  const buyerTotalEquity = propertyData.propertyValue + buyerAppreciationShare;
  const annualAppreciationBenefit = buyerAppreciationShare / 10; // Annualized
  
  // Calculate total annual benefit (cash flow + interest savings + appreciation)
  const annualInterestSavings = totalInterestSaved / 10; // Annual portion of total savings
  const totalAnnualBenefit = annualProfit + annualInterestSavings + annualAppreciationBenefit;
  
  // True ROI: Total annual benefit divided by total investment (including platform fee)
  const trueAnnualROI = (totalAnnualBenefit / totalInvestment) * 100;
  
  // Total wealth actually created using corrected calculation
  const totalCashFlow = metrics.totalCashFlowProfit;
  const actualWealthCreated = metrics.totalProfit; // Already accounts for platform fee in finance.ts
  
  // Calculate total 10-year ROI based on actual profit and total investment
  const total10YearROI = (actualWealthCreated / totalInvestment) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
            
            {/* Platform Fee Notice */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm">
              <div>
                <span className="font-medium">Platform Fee (3%):</span>
                <span className="text-muted-foreground ml-2">Done-for-you legal compliance & deal processing</span>
              </div>
              <span className="font-bold">${platformFee.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg text-sm">
              <span className="font-medium">Net Amount to Property:</span>
              <span className="font-bold">${netInvestment.toLocaleString()}</span>
            </div>
            <div className="px-3">
              <Slider
                value={investment}
                onValueChange={setInvestment}
                max={150000}
                min={30000}
                step={5000}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$30K (Founding Member)</span>
              <span>$150K (Full Property)</span>
            </div>
          </div>

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
                  {cashFlowYield.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Cash-on-cash return
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">Interest Eliminated</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  ${Math.max(0, Math.round(totalInterestSaved)).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {investmentAmount >= 150000 ? "100% Interest-Free" : 
                   totalInterestSaved <= 0 ? "No additional savings" : "vs. baseline scenario"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">True Annual ROI</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {trueAnnualROI.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  {investmentAmount >= 150000 ? "Risk-free returns" : "Total return on investment"}
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
                  <div className="text-sm text-muted-foreground">Total Investment</div>
                  <div className="text-lg font-bold">${totalInvestment.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">(includes 3% fee)</div>
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
                    ${Math.round(buyerTotalEquity).toLocaleString()}
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
                    <div className="font-semibold">${propertyData.propertyValue.toLocaleString()}</div>
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
              purchaseTokens(totalInvestment);
              onOpenChange(false);
            }}
            disabled={isPurchasing || !isConnected}
          >
            {isPurchasing 
              ? "Processing..." 
              : !isConnected 
                ? "Connect Wallet to Secure Investment"
                : `Secure $${totalInvestment.toLocaleString()} Investment`
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentCalculator;
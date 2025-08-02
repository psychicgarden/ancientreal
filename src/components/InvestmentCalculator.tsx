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

  // Investment calculations - Dynamic Mortgage Model
  const investmentAmount = investment[0];
  const propertyValue = 150000;
  const monthlyRent = 2400;
  
  // Calculate mortgage payment based on down payment
  const loanAmount = propertyValue - investmentAmount;
  const annualInterestRate = 0.08; // 8% annual rate
  const monthlyInterestRate = annualInterestRate / 12;
  const loanTermMonths = 10 * 12; // 10 years
  
  // Mortgage payment formula: M = P[r(1+r)^n]/[(1+r)^n-1]
  const monthlyMortgage = loanAmount > 0 
    ? (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) / 
      (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1)
    : 0;
    
  const monthlyProfit = monthlyRent - monthlyMortgage;
  
  // Calculate total interest savings
  const totalPayments = monthlyMortgage * loanTermMonths;
  const totalInterest = totalPayments - loanAmount;
  
  // Calculate baseline scenario (minimum $30K down payment)
  const baselineLoanAmount = propertyValue - 30000;
  const baselineMonthlymortgage = baselineLoanAmount > 0 
    ? (baselineLoanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) / 
      (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1)
    : 0;
  const baselineTotalPayments = baselineMonthlymortgage * loanTermMonths;
  const baselineTotalInterest = baselineTotalPayments - baselineLoanAmount;
  
  const totalInterestSaved = baselineTotalInterest - totalInterest;
  
  // Calculate mortgage financing returns
  const annualProfit = monthlyProfit * 12;
  const cashFlowYield = (annualProfit / investmentAmount) * 100;
  
  // Calculate true annual benefit including interest savings
  const annualInterestSavings = totalInterestSaved / 10; // Annual portion of total savings
  const trueAnnualBenefit = annualProfit + annualInterestSavings;
  const totalROI = (trueAnnualBenefit / investmentAmount) * 100;
  
  // 10-year projections (12% property growth, mortgage balance after 10 years)
  const tenYearPropertyValue = propertyValue * Math.pow(1.12, 10);
  const paymentsIn10Years = 10 * 12;
  const remainingMortgage = loanAmount > 0 
    ? loanAmount * Math.pow(1 + monthlyInterestRate, paymentsIn10Years) - 
      monthlyMortgage * ((Math.pow(1 + monthlyInterestRate, paymentsIn10Years) - 1) / monthlyInterestRate)
    : 0;
  const tenYearEquity = tenYearPropertyValue - Math.max(0, remainingMortgage);
  const tenYearProfit = tenYearEquity - investmentAmount + totalInterestSaved;

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <span className="font-medium">Interest Saved</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  ${Math.round(totalInterestSaved).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  vs. $30K down payment
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
                  {totalROI.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Including interest savings
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
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Investment</div>
                  <div className="text-lg font-bold">${investmentAmount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Cash Flow</div>
                  <div className="text-lg font-bold text-green-600">
                    ${Math.round(annualProfit * 10).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Interest Saved</div>
                  <div className="text-lg font-bold text-purple-600">
                    ${Math.round(totalInterestSaved).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Benefit</div>
                  <div className="text-lg font-bold text-primary">
                    ${Math.round(annualProfit * 10 + totalInterestSaved).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t text-center">
                <div className="text-sm text-muted-foreground">Total Return on Investment</div>
                <div className="text-2xl font-bold text-primary">
                  {(((annualProfit * 10 + totalInterestSaved) / investmentAmount) * 100).toFixed(1)}%
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

export default InvestmentCalculator;
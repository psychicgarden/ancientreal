import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { DollarSign, Shield, Clock, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const SimpleBorrowing = () => {
  const [collateralValue] = useState(50000); // User's total property token value
  const [loanAmount, setLoanAmount] = useState([15000]); // Using array for Slider component
  const [loanTerm, setLoanTerm] = useState(12); // months

  const maxLoanAmount = collateralValue * 0.7; // 70% LTV
  const currentLTV = (loanAmount[0] / collateralValue) * 100;
  const interestRate = 8.5; // Base rate
  const monthlyPayment = (loanAmount[0] * (interestRate / 100 / 12)) / (1 - Math.pow(1 + (interestRate / 100 / 12), -loanTerm));
  const totalRepayment = monthlyPayment * loanTerm;

  const handleBorrow = () => {
    console.log('Borrow clicked', { amount: loanAmount[0], term: loanTerm });
    toast({ title: "Loan approved", description: `$${loanAmount[0].toLocaleString()} will be transferred to your account.` });
  };

  const getLTVColor = () => {
    if (currentLTV <= 50) return "text-green-600";
    if (currentLTV <= 65) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiskLevel = () => {
    if (currentLTV <= 50) return { level: "Low", color: "bg-green-100 text-green-700" };
    if (currentLTV <= 65) return { level: "Medium", color: "bg-yellow-100 text-yellow-700" };
    return { level: "High", color: "bg-red-100 text-red-700" };
  };

  const risk = getRiskLevel();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Borrow Cash Instantly</h2>
        <p className="text-muted-foreground">Use your property tokens as collateral to get instant liquidity</p>
      </div>

      {/* Collateral Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Your Collateral
          </CardTitle>
          <CardDescription>Property tokens available for borrowing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Total Portfolio Value</div>
              <div className="text-2xl font-bold">${collateralValue.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Max Borrowable (70% LTV)</div>
              <div className="text-2xl font-bold text-primary">${maxLoanAmount.toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loan Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Configure Your Loan
          </CardTitle>
          <CardDescription>Adjust loan amount and terms to fit your needs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Loan Amount Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Loan Amount</Label>
              <div className="text-lg font-bold">${loanAmount[0].toLocaleString()}</div>
            </div>
            <Slider
              value={loanAmount}
              onValueChange={setLoanAmount}
              max={maxLoanAmount}
              min={1000}
              step={1000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>$1,000</span>
              <span>${maxLoanAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Loan Term */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="term">Loan Term (months)</Label>
              <Input
                id="term"
                type="number"
                min="1"
                max="36"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Interest Rate</Label>
              <div className="h-10 flex items-center text-lg font-semibold">
                {interestRate}% APR
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium">Loan-to-Value Ratio</span>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${getLTVColor()}`}>
                  {currentLTV.toFixed(1)}%
                </span>
                <Badge className={risk.color}>{risk.level} Risk</Badge>
              </div>
            </div>
            {currentLTV > 65 && (
              <div className="flex items-center gap-2 text-amber-600 text-sm">
                <AlertTriangle className="h-4 w-4" />
                High LTV increases liquidation risk if property values decline
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-primary/5 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                <Clock className="h-3 w-3" />
                Monthly Payment
              </div>
              <div className="text-lg font-bold">
                ${monthlyPayment.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Total Repayment</div>
              <div className="text-lg font-bold">
                ${totalRepayment.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Total Interest</div>
              <div className="text-lg font-bold">
                ${(totalRepayment - loanAmount[0]).toLocaleString()}
              </div>
            </div>
          </div>

          <Button 
            onClick={handleBorrow} 
            className="w-full" 
            size="lg"
            disabled={loanAmount[0] > maxLoanAmount}
          >
            Borrow ${loanAmount[0].toLocaleString()} Now
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Funds will be available in your account within 5 minutes. Your property tokens will be held as collateral.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { DollarSign, Shield, Clock, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

interface CollateralPosition {
  id: string;
  tokenSymbol: string;
  propertyName: string;
  collateralValue: number;
  loanAmount: number;
  interestRate: number;
  ltv: number; // Loan-to-Value ratio
  liquidationThreshold: number;
  daysRemaining: number;
  status: 'healthy' | 'warning' | 'danger';
}

export const CollateralLending = () => {
  const { isConnected, connectWallet } = useWallet();
  const { toast } = useToast();
  const [selectedCollateral, setSelectedCollateral] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanDuration, setLoanDuration] = useState([30]);
  const [isCreatingLoan, setIsCreatingLoan] = useState(false);

  const userTokens = [
    { symbol: 'BAHIA', balance: 2.5, value: 4125, propertyName: 'Bahia Artist Loft' },
    { symbol: 'TULUM', balance: 1.8, value: 3420, propertyName: 'Tulum Beach Penthouse' },
    { symbol: 'SANTORINI', balance: 3.2, value: 5696, propertyName: 'Santorini Caldera View' }
  ];

  const activePositions: CollateralPosition[] = [
    {
      id: 'pos-001',
      tokenSymbol: 'BAHIA',
      propertyName: 'Bahia Artist Loft',
      collateralValue: 8250,
      loanAmount: 5000,
      interestRate: 8.5,
      ltv: 60.6,
      liquidationThreshold: 75,
      daysRemaining: 23,
      status: 'healthy'
    },
    {
      id: 'pos-002',
      tokenSymbol: 'TULUM',
      propertyName: 'Tulum Beach Penthouse',
      collateralValue: 3420,
      loanAmount: 2500,
      interestRate: 9.2,
      ltv: 73.1,
      liquidationThreshold: 75,
      daysRemaining: 8,
      status: 'warning'
    }
  ];

  const maxLoanAmount = selectedCollateral ? 
    userTokens.find(t => t.symbol === selectedCollateral)?.value * 0.7 || 0 : 0;

  const calculateInterestRate = (ltv: number, duration: number) => {
    const baseLtv = ltv / 100;
    const durationMultiplier = duration / 30;
    return 6 + (baseLtv * 8) + (durationMultiplier * 0.5);
  };

  const currentLtv = selectedCollateral && loanAmount ? 
    (parseFloat(loanAmount) / maxLoanAmount) * 70 : 0;

  const interestRate = calculateInterestRate(currentLtv, loanDuration[0]);
  
  const handleCreateLoan = async () => {
    if (!selectedCollateral || !loanAmount || !isConnected) {
      toast({
        title: "Connection Required",
        description: "Please connect wallet and fill all fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreatingLoan(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Loan Created Successfully",
        description: `Borrowed $${parseFloat(loanAmount).toLocaleString()} USDT against ${selectedCollateral} collateral`,
      });
      
      // Store loan in localStorage for portfolio tracking
      const loans = JSON.parse(localStorage.getItem('userLoans') || '[]');
      const newLoan = {
        id: Date.now(),
        collateralToken: selectedCollateral,
        loanAmount: parseFloat(loanAmount),
        interestRate: interestRate,
        duration: loanDuration[0],
        created: new Date().toISOString(),
        status: 'active'
      };
      loans.push(newLoan);
      localStorage.setItem('userLoans', JSON.stringify(loans));
      
      setLoanAmount('');
      setSelectedCollateral('');
    } catch (error) {
      toast({
        title: "Loan Creation Failed",
        description: "Unable to create loan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingLoan(false);
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'danger': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'danger': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Token Collateral Lending</h2>
        <Badge className="bg-blue-100 text-blue-700">Powered by Smart Contracts</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Loan Creation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Create New Loan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Collateral</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={selectedCollateral}
                onChange={(e) => setSelectedCollateral(e.target.value)}
              >
                <option value="">Choose your property tokens</option>
                {userTokens.map(token => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol} - {token.balance} tokens (${token.value.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {selectedCollateral && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">Loan Amount (USDT)</label>
                  <Input 
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="0.00"
                    max={maxLoanAmount}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Max: ${maxLoanAmount.toLocaleString()} (70% LTV)
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Loan Duration: {loanDuration[0]} days
                  </label>
                  <Slider
                    value={loanDuration}
                    onValueChange={setLoanDuration}
                    max={365}
                    min={7}
                    step={7}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>7 days</span>
                    <span>365 days</span>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Collateral Value</span>
                    <span className="font-semibold">
                      ${userTokens.find(t => t.symbol === selectedCollateral)?.value.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Loan-to-Value Ratio</span>
                    <span className="font-semibold">{currentLtv.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Interest Rate</span>
                    <span className="font-semibold text-blue-600">{interestRate.toFixed(2)}% APR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Interest</span>
                    <span className="font-semibold">
                      ${((parseFloat(loanAmount || '0') * interestRate / 100) * (loanDuration[0] / 365)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={handleCreateLoan}
                  disabled={isCreatingLoan || !selectedCollateral || !loanAmount || parseFloat(loanAmount) <= 0 || parseFloat(loanAmount) > maxLoanAmount}
                >
                  {isCreatingLoan ? "Creating Loan..." : "Create Loan"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Loan Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Lending Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-green-600 font-semibold text-sm">Available Credit</div>
                <div className="text-xl font-bold">${(userTokens.reduce((sum, token) => sum + token.value, 0) * 0.7).toLocaleString()}</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-blue-600 font-semibold text-sm">Total Collateral</div>
                <div className="text-xl font-bold">${userTokens.reduce((sum, token) => sum + token.value, 0).toLocaleString()}</div>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Interest Rate Tiers</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>0-50% LTV</span>
                  <span className="text-green-600">6-10% APR</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>50-65% LTV</span>
                  <span className="text-yellow-600">10-12% APR</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>65-70% LTV</span>
                  <span className="text-red-600">12-14% APR</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Safety Features</span>
              </div>
              <div className="text-xs text-blue-700">
                • Automated liquidation at 75% LTV
                • Smart contract escrow
                • Real-time price feeds
                • 24h grace period for top-ups
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Positions */}
      {activePositions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Active Loans ({activePositions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activePositions.map((position) => (
                <div key={position.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {position.tokenSymbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold">{position.propertyName}</div>
                        <div className="text-sm text-muted-foreground">{position.tokenSymbol}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(position.status)}
                      <Badge variant={position.status === 'healthy' ? 'default' : 'destructive'}>
                        {position.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Collateral</div>
                      <div className="font-semibold">${position.collateralValue.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Loan Amount</div>
                      <div className="font-semibold">${position.loanAmount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Interest Rate</div>
                      <div className="font-semibold">{position.interestRate}% APR</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Days Remaining</div>
                      <div className="font-semibold">{position.daysRemaining} days</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>LTV Ratio</span>
                      <span className={getStatusColor(position.status)}>{position.ltv.toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={(position.ltv / position.liquidationThreshold) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Current: {position.ltv.toFixed(1)}%</span>
                      <span>Liquidation: {position.liquidationThreshold}%</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      Add Collateral
                    </Button>
                    <Button variant="outline" size="sm">
                      Repay Loan
                    </Button>
                    <Button variant="outline" size="sm">
                      Extend Duration
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
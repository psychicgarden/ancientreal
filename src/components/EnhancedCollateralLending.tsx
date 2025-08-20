import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Shield, Clock, TrendingUp, AlertCircle, CheckCircle, Zap, Target, Brain, Bot } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";

interface DynamicCollateralPosition {
  id: string;
  tokenSymbol: string;
  propertyName: string;
  collateralValue: number;
  loanAmount: number;
  interestRate: number;
  ltv: number;
  liquidationThreshold: number;
  healthFactor: number;
  riskScore: number;
  autoLiquidationEnabled: boolean;
  flashLoanOptimized: boolean;
  insuranceCovered: boolean;
  daysRemaining: number;
  status: 'healthy' | 'warning' | 'danger' | 'critical';
}

interface RiskAssessment {
  propertyLocation: string;
  occupancyRate: number;
  marketVolatility: number;
  liquidityScore: number;
  creditScore: number;
  overallRisk: 'low' | 'medium' | 'high';
  recommendedLTV: number;
  dynamicRate: number;
}

interface FlashLoanStrategy {
  id: string;
  name: string;
  description: string;
  apy: number;
  riskLevel: 'low' | 'medium' | 'high';
  minimumAmount: number;
  enabled: boolean;
}

interface LiquidationBot {
  id: string;
  strategy: string;
  triggerLTV: number;
  slippageTolerance: number;
  gasLimit: number;
  enabled: boolean;
  lastExecution: string;
}

export const EnhancedCollateralLending = () => {
  const { isConnected, connectWallet } = useWallet();
  const { toast } = useToast();
  
  // State management
  const [selectedCollateral, setSelectedCollateral] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanDuration, setLoanDuration] = useState([30]);
  const [autoOptimization, setAutoOptimization] = useState(false);
  const [flashLoanEnabled, setFlashLoanEnabled] = useState(false);
  const [insuranceEnabled, setInsuranceEnabled] = useState(true);
  const [isCreatingLoan, setIsCreatingLoan] = useState(false);
  const [liquidationBotsState, setLiquidationBotsState] = useState(liquidationBots);

  // Enhanced data structures
  const userTokens = [
    { 
      symbol: 'BAHIA', 
      balance: 2.5, 
      value: 4125, 
      propertyName: 'Bahia Artist Loft',
      location: 'Bahia, Mexico',
      occupancyRate: 95,
      creditScore: 85
    },
    { 
      symbol: 'TULUM', 
      balance: 1.8, 
      value: 3420, 
      propertyName: 'Tulum Beach Penthouse',
      location: 'Tulum, Mexico',
      occupancyRate: 88,
      creditScore: 92
    },
    { 
      symbol: 'SANTORINI', 
      balance: 3.2, 
      value: 5696, 
      propertyName: 'Santorini Caldera View',
      location: 'Santorini, Greece',
      occupancyRate: 92,
      creditScore: 88
    }
  ];

  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([
    {
      propertyLocation: 'Bahia, Mexico',
      occupancyRate: 95,
      marketVolatility: 12.5,
      liquidityScore: 78,
      creditScore: 85,
      overallRisk: 'low',
      recommendedLTV: 75,
      dynamicRate: 7.2
    },
    {
      propertyLocation: 'Tulum, Mexico',
      occupancyRate: 88,
      marketVolatility: 15.8,
      liquidityScore: 82,
      creditScore: 92,
      overallRisk: 'medium',
      recommendedLTV: 70,
      dynamicRate: 8.5
    },
    {
      propertyLocation: 'Santorini, Greece',
      occupancyRate: 92,
      marketVolatility: 18.2,
      liquidityScore: 85,
      creditScore: 88,
      overallRisk: 'medium',
      recommendedLTV: 68,
      dynamicRate: 9.1
    }
  ]);

  const flashLoanStrategies: FlashLoanStrategy[] = [
    {
      id: 'arbitrage-1',
      name: 'Cross-DEX Arbitrage',
      description: 'Profit from price differences across exchanges',
      apy: 15.8,
      riskLevel: 'medium',
      minimumAmount: 10000,
      enabled: true
    },
    {
      id: 'liquidation-2',
      name: 'Liquidation Arbitrage',
      description: 'Profit from liquidating underwater positions',
      apy: 22.3,
      riskLevel: 'high',
      minimumAmount: 25000,
      enabled: false
    },
    {
      id: 'yield-3',
      name: 'Yield Farming Optimization',
      description: 'Automatically compound yields across protocols',
      apy: 12.1,
      riskLevel: 'low',
      minimumAmount: 5000,
      enabled: true
    }
  ];

  const liquidationBots: LiquidationBot[] = [
    {
      id: 'bot-1',
      strategy: 'Conservative Protection',
      triggerLTV: 72,
      slippageTolerance: 2.5,
      gasLimit: 500000,
      enabled: true,
      lastExecution: 'Never'
    },
    {
      id: 'bot-2',
      strategy: 'Aggressive Optimization',
      triggerLTV: 78,
      slippageTolerance: 5.0,
      gasLimit: 800000,
      enabled: true,
      lastExecution: '2 days ago'
    }
  ];

  const activePositions: DynamicCollateralPosition[] = [
    {
      id: 'pos-001',
      tokenSymbol: 'BAHIA',
      propertyName: 'Bahia Artist Loft',
      collateralValue: 8250,
      loanAmount: 5000,
      interestRate: 7.2,
      ltv: 60.6,
      liquidationThreshold: 75,
      healthFactor: 1.35,
      riskScore: 78,
      autoLiquidationEnabled: true,
      flashLoanOptimized: true,
      insuranceCovered: true,
      daysRemaining: 23,
      status: 'healthy'
    },
    {
      id: 'pos-002',
      tokenSymbol: 'TULUM',
      propertyName: 'Tulum Beach Penthouse',
      collateralValue: 3420,
      loanAmount: 2500,
      interestRate: 9.8,
      ltv: 73.1,
      liquidationThreshold: 75,
      healthFactor: 1.02,
      riskScore: 65,
      autoLiquidationEnabled: true,
      flashLoanOptimized: false,
      insuranceCovered: true,
      daysRemaining: 8,
      status: 'warning'
    }
  ];

  // Dynamic risk calculation
  const calculateDynamicRisk = (token: string) => {
    const tokenData = userTokens.find(t => t.symbol === token);
    const riskData = riskAssessments.find(r => r.propertyLocation === tokenData?.location);
    
    if (!tokenData || !riskData) return { ltv: 70, rate: 8.0, score: 50 };

    const occupancyWeight = riskData.occupancyRate * 0.3;
    const volatilityWeight = (100 - riskData.marketVolatility) * 0.25;
    const liquidityWeight = riskData.liquidityScore * 0.25;
    const creditWeight = riskData.creditScore * 0.2;
    
    const overallScore = occupancyWeight + volatilityWeight + liquidityWeight + creditWeight;
    const recommendedLTV = Math.min(80, Math.max(50, overallScore * 0.8));
    const dynamicRate = Math.max(5.0, 15 - (overallScore * 0.1));

    return {
      ltv: recommendedLTV,
      rate: dynamicRate,
      score: overallScore
    };
  };

  const maxLoanAmount = selectedCollateral ? 
    userTokens.find(t => t.symbol === selectedCollateral)?.value * 0.8 || 0 : 0;

  const dynamicRisk = selectedCollateral ? calculateDynamicRisk(selectedCollateral) : { ltv: 70, rate: 8.0, score: 50 };
  
  const currentLtv = selectedCollateral && loanAmount ? 
    (parseFloat(loanAmount) / maxLoanAmount) * 80 : 0;

  const toggleBotStatus = (botId: string) => {
    setLiquidationBotsState(prev => 
      prev.map(bot => 
        bot.id === botId 
          ? { ...bot, enabled: !bot.enabled }
          : bot
      )
    );
    toast({
      title: "Bot Status Updated",
      description: `Liquidation bot ${botId} has been ${liquidationBotsState.find(b => b.id === botId)?.enabled ? 'disabled' : 'enabled'}.`,
    });
  };

  const calculateHealthFactor = (collateralValue: number, loanAmount: number, liquidationThreshold: number) => {
    return (collateralValue * (liquidationThreshold / 100)) / loanAmount;
  };

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
      // Simulate advanced smart contract loan creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newPosition: DynamicCollateralPosition = {
        id: `pos-${Date.now()}`,
        tokenSymbol: selectedCollateral,
        propertyName: userTokens.find(t => t.symbol === selectedCollateral)?.propertyName || '',
        collateralValue: maxLoanAmount,
        loanAmount: parseFloat(loanAmount),
        interestRate: dynamicRisk.rate,
        ltv: currentLtv,
        liquidationThreshold: 75,
        healthFactor: calculateHealthFactor(maxLoanAmount, parseFloat(loanAmount), 75),
        riskScore: dynamicRisk.score,
        autoLiquidationEnabled: true,
        flashLoanOptimized: flashLoanEnabled,
        insuranceCovered: insuranceEnabled,
        daysRemaining: loanDuration[0],
        status: currentLtv < 65 ? 'healthy' : currentLtv < 72 ? 'warning' : 'danger'
      };
      
      toast({
        title: "Advanced Loan Created",
        description: `Borrowed $${parseFloat(loanAmount).toLocaleString()} with dynamic rate ${dynamicRisk.rate.toFixed(2)}%`,
      });
      
      // Store enhanced loan data
      const loans = JSON.parse(localStorage.getItem('enhancedLoans') || '[]');
      loans.push(newPosition);
      localStorage.setItem('enhancedLoans', JSON.stringify(loans));
      
      setLoanAmount('');
      setSelectedCollateral('');
    } catch (error) {
      toast({
        title: "Loan Creation Failed",
        description: "Unable to create advanced loan. Please try again.",
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
      case 'critical': return 'text-red-800';
      default: return 'text-gray-600';
    }
  };

  const getHealthFactorColor = (factor: number) => {
    if (factor > 1.5) return 'text-green-600';
    if (factor > 1.2) return 'text-yellow-600';
    if (factor > 1.0) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Advanced Collateral Lending
        </h2>
        <div className="flex gap-2">
          <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700">
            <Brain className="h-3 w-3 mr-1" />
            AI Risk Assessment
          </Badge>
          <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
            <Bot className="h-3 w-3 mr-1" />
            Auto Liquidation
          </Badge>
          <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700">
            <Zap className="h-3 w-3 mr-1" />
            Flash Loans
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="lending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="lending">Smart Lending</TabsTrigger>
          <TabsTrigger value="risk-analysis">Risk Analysis</TabsTrigger>
          <TabsTrigger value="flash-loans">Flash Loans</TabsTrigger>
          <TabsTrigger value="liquidation-bots">Liquidation Bots</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
        </TabsList>

        <TabsContent value="lending" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enhanced Loan Creation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  AI-Powered Loan Creation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Smart Collateral</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={selectedCollateral}
                    onChange={(e) => setSelectedCollateral(e.target.value)}
                  >
                    <option value="">Choose your property tokens</option>
                    {userTokens.map(token => {
                      const risk = calculateDynamicRisk(token.symbol);
                      return (
                        <option key={token.symbol} value={token.symbol}>
                          {token.symbol} - ${token.value.toLocaleString()} 
                          (Risk Score: {risk.score.toFixed(0)})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {selectedCollateral && (
                  <>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                      <div className="font-medium text-blue-900 mb-2">AI Risk Assessment</div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-blue-700">Risk Score:</span>
                          <span className="font-semibold ml-2">{dynamicRisk.score.toFixed(0)}/100</span>
                        </div>
                        <div>
                          <span className="text-blue-700">Recommended LTV:</span>
                          <span className="font-semibold ml-2">{dynamicRisk.ltv.toFixed(0)}%</span>
                        </div>
                        <div>
                          <span className="text-blue-700">Dynamic Rate:</span>
                          <span className="font-semibold ml-2 text-purple-600">{dynamicRisk.rate.toFixed(2)}%</span>
                        </div>
                        <div>
                          <span className="text-blue-700">Max Loan:</span>
                          <span className="font-semibold ml-2">${maxLoanAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

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
                        Max: ${maxLoanAmount.toLocaleString()} ({dynamicRisk.ltv.toFixed(0)}% LTV)
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
                    </div>

                    {/* Advanced Features */}
                    <div className="space-y-3 border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">Auto-Optimization</span>
                          <div className="text-xs text-muted-foreground">Automatically refinance when better rates available</div>
                        </div>
                        <Switch 
                          checked={autoOptimization}
                          onCheckedChange={setAutoOptimization}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">Flash Loan Integration</span>
                          <div className="text-xs text-muted-foreground">Enable flash loan arbitrage strategies</div>
                        </div>
                        <Switch 
                          checked={flashLoanEnabled}
                          onCheckedChange={setFlashLoanEnabled}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">Insurance Protection</span>
                          <div className="text-xs text-muted-foreground">Protect against liquidation (2% fee)</div>
                        </div>
                        <Switch 
                          checked={insuranceEnabled}
                          onCheckedChange={setInsuranceEnabled}
                        />
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
                        <span className="text-sm">Current LTV Ratio</span>
                        <span className="font-semibold">{currentLtv.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Dynamic Interest Rate</span>
                        <span className="font-semibold text-blue-600">{dynamicRisk.rate.toFixed(2)}% APR</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Health Factor</span>
                        <span className={`font-semibold ${getHealthFactorColor(loanAmount ? calculateHealthFactor(maxLoanAmount, parseFloat(loanAmount), 75) : 1)}`}>
                          {loanAmount ? calculateHealthFactor(maxLoanAmount, parseFloat(loanAmount), 75).toFixed(2) : '∞'}
                        </span>
                      </div>
                      {insuranceEnabled && (
                        <div className="flex justify-between">
                          <span className="text-sm">Insurance Fee</span>
                          <span className="font-semibold">
                            ${((parseFloat(loanAmount || '0')) * 0.02).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button 
                      className="w-full"
                      onClick={handleCreateLoan}
                      disabled={isCreatingLoan || !selectedCollateral || !loanAmount || parseFloat(loanAmount) <= 0 || parseFloat(loanAmount) > maxLoanAmount}
                    >
                      {isCreatingLoan ? "Creating Advanced Loan..." : "Create Smart Loan"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Advanced Lending Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg">
                    <div className="text-green-600 font-semibold text-sm">Total Credit Line</div>
                    <div className="text-xl font-bold">${(userTokens.reduce((sum, token) => sum + token.value, 0) * 0.8).toLocaleString()}</div>
                    <div className="text-xs text-green-600">Dynamic LTV optimization</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg">
                    <div className="text-blue-600 font-semibold text-sm">Portfolio Health</div>
                    <div className="text-xl font-bold">85%</div>
                    <div className="text-xs text-blue-600">AI risk assessment</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-3">Dynamic Interest Rates</div>
                  <div className="space-y-2">
                    {riskAssessments.map((assessment, index) => (
                      <div key={index} className="flex justify-between text-sm p-2 bg-muted/30 rounded">
                        <span>{assessment.propertyLocation}</span>
                        <span className={`font-semibold ${getRiskBadgeColor(assessment.overallRisk).replace('bg-', 'text-').replace('-100', '-600')}`}>
                          {assessment.dynamicRate.toFixed(2)}% APR
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Advanced Protection</span>
                  </div>
                  <div className="text-xs text-purple-700 space-y-1">
                    <div>• AI-powered liquidation protection</div>
                    <div>• Flash loan arbitrage optimization</div>
                    <div>• Cross-chain collateral monitoring</div>
                    <div>• Insurance coverage available</div>
                    <div>• Automated refinancing</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Positions with Enhanced Features */}
          {activePositions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Advanced Loan Positions ({activePositions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activePositions.map((position) => (
                    <div key={position.id} className="border rounded-lg p-4 bg-gradient-to-r from-background to-muted/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {position.tokenSymbol.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-lg">{position.propertyName}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <span>{position.tokenSymbol}</span>
                              <Badge className={getRiskBadgeColor(position.status)}>
                                {position.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Health Factor</div>
                          <div className={`text-xl font-bold ${getHealthFactorColor(position.healthFactor)}`}>
                            {position.healthFactor.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Collateral</div>
                          <div className="font-semibold">${position.collateralValue.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Loan Amount</div>
                          <div className="font-semibold">${position.loanAmount.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Dynamic Rate</div>
                          <div className="font-semibold">{position.interestRate.toFixed(2)}% APR</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Risk Score</div>
                          <div className="font-semibold">{position.riskScore}/100</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Time Remaining</div>
                          <div className="font-semibold">{position.daysRemaining} days</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>LTV Ratio</span>
                            <span className={getStatusColor(position.status)}>{position.ltv.toFixed(1)}%</span>
                          </div>
                          <Progress 
                            value={(position.ltv / position.liquidationThreshold) * 100} 
                            className="h-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Current: {position.ltv.toFixed(1)}%</span>
                            <span>Liquidation: {position.liquidationThreshold}%</span>
                          </div>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          {position.autoLiquidationEnabled && (
                            <Badge className="bg-blue-100 text-blue-700">
                              <Bot className="h-3 w-3 mr-1" />
                              Auto Protection
                            </Badge>
                          )}
                          {position.flashLoanOptimized && (
                            <Badge className="bg-purple-100 text-purple-700">
                              <Zap className="h-3 w-3 mr-1" />
                              Flash Optimized
                            </Badge>
                          )}
                          {position.insuranceCovered && (
                            <Badge className="bg-green-100 text-green-700">
                              <Shield className="h-3 w-3 mr-1" />
                              Insured
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          Add Collateral
                        </Button>
                        <Button variant="outline" size="sm">
                          Optimize Rate
                        </Button>
                        <Button variant="outline" size="sm">
                          Flash Refinance
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
        </TabsContent>

        <TabsContent value="risk-analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {riskAssessments.map((assessment, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{assessment.propertyLocation}</CardTitle>
                  <Badge className={getRiskBadgeColor(assessment.overallRisk)}>
                    {assessment.overallRisk.toUpperCase()} RISK
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Occupancy:</span>
                      <span className="font-semibold ml-2">{assessment.occupancyRate}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Volatility:</span>
                      <span className="font-semibold ml-2">{assessment.marketVolatility}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Liquidity:</span>
                      <span className="font-semibold ml-2">{assessment.liquidityScore}/100</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Credit:</span>
                      <span className="font-semibold ml-2">{assessment.creditScore}/100</span>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-2 rounded text-sm">
                    <div className="flex justify-between">
                      <span>Recommended LTV:</span>
                      <span className="font-semibold">{assessment.recommendedLTV}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dynamic Rate:</span>
                      <span className="font-semibold text-blue-600">{assessment.dynamicRate}% APR</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="flash-loans" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {flashLoanStrategies.map((strategy) => (
              <Card key={strategy.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{strategy.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getRiskBadgeColor(strategy.riskLevel)}>
                      {strategy.riskLevel.toUpperCase()}
                    </Badge>
                    <Badge className={strategy.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {strategy.enabled ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Expected APY:</span>
                      <span className="font-semibold text-green-600">{strategy.apy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Minimum:</span>
                      <span className="font-semibold">${strategy.minimumAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button className="w-full" variant={strategy.enabled ? "outline" : "default"}>
                    {strategy.enabled ? "Configure" : "Enable Strategy"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="liquidation-bots" className="space-y-4">
          {liquidationBotsState.map((bot) => (
            <Card key={bot.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    {bot.strategy}
                  </span>
                  <Badge className={bot.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                    {bot.enabled ? 'ACTIVE' : 'INACTIVE'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Trigger LTV</div>
                    <div className="font-semibold">{bot.triggerLTV}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Slippage</div>
                    <div className="font-semibold">{bot.slippageTolerance}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Gas Limit</div>
                    <div className="font-semibold">{bot.gasLimit.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Last Run</div>
                    <div className="font-semibold">{bot.lastExecution}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Configure</Button>
                  <Button variant="outline" size="sm">Test Run</Button>
                  <Button 
                    variant={bot.enabled ? "destructive" : "default"} 
                    size="sm"
                    onClick={() => toggleBotStatus(bot.id)}
                  >
                    {bot.enabled ? "Disable" : "Enable"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="insurance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Liquidation Insurance Coverage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                <div className="text-green-800 font-semibold mb-2">Premium Protection Available</div>
                <div className="text-sm text-green-700 space-y-1">
                  <div>• Coverage up to $500,000 per position</div>
                  <div>• Protection against oracle manipulation</div>
                  <div>• Gas fee coverage for emergency transactions</div>
                  <div>• 24/7 monitoring and automated protection</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="font-semibold">Basic Coverage</div>
                  <div className="text-2xl font-bold text-blue-600">1.5%</div>
                  <div className="text-sm text-muted-foreground">Annual premium</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="font-semibold">Premium Coverage</div>
                  <div className="text-2xl font-bold text-purple-600">2.5%</div>
                  <div className="text-sm text-muted-foreground">Annual premium</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="font-semibold">Elite Coverage</div>
                  <div className="text-2xl font-bold text-gold-600">3.5%</div>
                  <div className="text-sm text-muted-foreground">Annual premium</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
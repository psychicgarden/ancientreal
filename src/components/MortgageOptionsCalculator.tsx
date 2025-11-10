import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DollarSign, TrendingUp, Home, Percent, Calendar, ChartBar } from 'lucide-react';

interface CalculationResults {
  // Buyer metrics
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  propertyValueAtEnd: number;
  netGain: number;
  buyerROI: number;
  
  // Ancient metrics
  totalRevenue: number;
  interestRevenue: number;
  samRevenue: number;
  platformFee: number;
  ancientROI: number;
}

export const MortgageOptionsCalculator = () => {
  const [propertyPrice, setPropertyPrice] = useState(143000); // Weighted average of dynamic pricing
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [termYears, setTermYears] = useState(15);
  const [appreciationRate, setAppreciationRate] = useState(7);
  const [samPercent, setSamPercent] = useState(30);

  const calculateOption = (
    type: 'CASH' | 'SAM_8' | 'FIXED_11'
  ): CalculationResults => {
    const downPayment = propertyPrice * (downPaymentPercent / 100);
    const loanAmount = propertyPrice - downPayment;
    const termMonths = termYears * 12;
    const platformFee = propertyPrice * 0.035;
    
    // Calculate appreciation
    const propertyValueAtEnd = propertyPrice * Math.pow(1 + appreciationRate / 100, termYears);
    const totalAppreciation = propertyValueAtEnd - propertyPrice;
    
    if (type === 'CASH') {
      // Ancient's revenue: $75k profit + platform fee ($3,500 or 3.5%)
      const buildCost = 75000; // Ancient's investment to build
      const profitFromSale = 75000; // $75k profit on the flip
      const actualPlatformFee = 3500; // Platform fee (user specified)
      const totalRevenue = profitFromSale + actualPlatformFee;
      
      return {
        monthlyPayment: 0,
        totalPayments: downPayment,
        totalInterest: 0,
        propertyValueAtEnd,
        netGain: totalAppreciation,
        buyerROI: (totalAppreciation / propertyPrice) * 100,
        totalRevenue: totalRevenue,
        interestRevenue: 0,
        samRevenue: 0,
        platformFee: actualPlatformFee,
        ancientROI: ((totalRevenue) / buildCost) * 100 // ROI based on $75k build cost
      };
    }
    
    if (type === 'SAM_8') {
      const apr = 0.08;
      const monthlyRate = apr / 12;
      const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
        (Math.pow(1 + monthlyRate, termMonths) - 1);
      const totalPayments = downPayment + (monthlyPayment * termMonths);
      const totalInterest = (monthlyPayment * termMonths) - loanAmount;
      
      // Dynamic SAM to Ancient
      const samShare = totalAppreciation * (samPercent / 100);
      const netGain = totalAppreciation - samShare;
      
      return {
        monthlyPayment,
        totalPayments,
        totalInterest,
        propertyValueAtEnd,
        netGain,
        buyerROI: (netGain / totalPayments) * 100,
        totalRevenue: totalInterest + samShare + platformFee,
        interestRevenue: totalInterest,
        samRevenue: samShare,
        platformFee,
        ancientROI: ((totalInterest + samShare + platformFee) / loanAmount - 1) * 100
      };
    }
    
    // FIXED_11
    const apr = 0.11;
    const monthlyRate = apr / 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
      (Math.pow(1 + monthlyRate, termMonths) - 1);
    const totalPayments = downPayment + (monthlyPayment * termMonths);
    const totalInterest = (monthlyPayment * termMonths) - loanAmount;
    const netGain = totalAppreciation;
    
    // Ancient's return expressed as annualized IRR (effective annual rate)
    const totalRevenue = totalInterest + platformFee;
    const monthlyIRR = monthlyRate; // IRR per month equals the amortization rate
    const annualizedIRR = Math.pow(1 + monthlyIRR, 12) - 1;
    const ancientROI = annualizedIRR * 100;
    
    return {
      monthlyPayment,
      totalPayments,
      totalInterest,
      propertyValueAtEnd,
      netGain,
      buyerROI: (netGain / totalPayments) * 100,
      totalRevenue,
      interestRevenue: totalInterest,
      samRevenue: 0,
      platformFee,
      ancientROI
    };
  };

  const cashResults = calculateOption('CASH');
  const samResults = calculateOption('SAM_8');
  const fixedResults = calculateOption('FIXED_11');

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="w-full space-y-8">
      {/* Input Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartBar className="w-5 h-5" />
            Mortgage Product Comparison Calculator
          </CardTitle>
          <CardDescription>
            Compare Ancient's three purchase options: Cash, 8% + 30% SAM, and 11% Fixed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Property Price
              </Label>
              <Input
                id="price"
                type="number"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                min={100000}
                max={200000}
                step={5000}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="down" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Down Payment: {downPaymentPercent}%
              </Label>
              <Slider
                id="down"
                value={[downPaymentPercent]}
                onValueChange={([value]) => setDownPaymentPercent(value)}
                min={10}
                max={50}
                step={5}
                className="pt-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="term" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Loan Term: {termYears} years
              </Label>
              <Slider
                id="term"
                value={[termYears]}
                onValueChange={([value]) => setTermYears(value)}
                min={10}
                max={30}
                step={5}
                className="pt-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appreciation" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Annual Appreciation: {appreciationRate}%
              </Label>
              <Slider
                id="appreciation"
                value={[appreciationRate]}
                onValueChange={([value]) => setAppreciationRate(value)}
                min={3}
                max={12}
                step={1}
                className="pt-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sam" className="flex items-center gap-2">
                <Percent className="w-4 h-4" />
                SAM Share (Ancient): {samPercent}%
              </Label>
              <Slider
                id="sam"
                value={[samPercent]}
                onValueChange={([value]) => setSamPercent(value)}
                min={0}
                max={65}
                step={5}
                className="pt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cash Purchase */}
        <Card className="border-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Cash Purchase</CardTitle>
              <Badge variant="secondary">Immediate</Badge>
            </div>
            <CardDescription>Full payment upfront</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Purchase Price</span>
                <span className="font-semibold">{formatCurrency(propertyPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Payment</span>
                <span className="font-semibold">$0</span>
              </div>
              <Separator />
              <div className="pt-2 space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase">Buyer Metrics</div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Property Value (Y{termYears})</span>
                  <span className="font-semibold text-primary">{formatCurrency(cashResults.propertyValueAtEnd)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Net Gain</span>
                  <span className="font-semibold text-primary">{formatCurrency(cashResults.netGain)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ROI</span>
                  <span className="font-semibold text-primary">{formatPercent(cashResults.buyerROI)}</span>
                </div>
              </div>
              <Separator />
              <div className="pt-2 space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase">Ancient Revenue</div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Revenue</span>
                  <span className="font-semibold">{formatCurrency(cashResults.totalRevenue)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Platform Fee</span>
                  <span>{formatCurrency(cashResults.platformFee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ancient ROI</span>
                  <span className="font-semibold">{formatPercent(cashResults.ancientROI)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 8% + Dynamic SAM */}
        <Card className="border-2 border-primary shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">8% + {samPercent}% SAM</CardTitle>
              <Badge>Recommended</Badge>
            </div>
            <CardDescription>Low payment, shared growth</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Down Payment ({downPaymentPercent}%)</span>
                <span className="font-semibold">{formatCurrency(propertyPrice * downPaymentPercent / 100)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Payment</span>
                <span className="font-semibold text-primary">{formatCurrency(samResults.monthlyPayment)}</span>
              </div>
              <Separator />
              <div className="pt-2 space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase">Buyer Metrics</div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Paid</span>
                  <span className="font-semibold">{formatCurrency(samResults.totalPayments)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Property Value (Y{termYears})</span>
                  <span className="font-semibold text-primary">{formatCurrency(samResults.propertyValueAtEnd)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Net Gain ({100 - samPercent}% SAM)</span>
                  <span className="font-semibold text-primary">{formatCurrency(samResults.netGain)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ROI</span>
                  <span className="font-semibold text-primary">{formatPercent(samResults.buyerROI)}</span>
                </div>
              </div>
              <Separator />
              <div className="pt-2 space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase">Ancient Revenue</div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Revenue</span>
                  <span className="font-semibold text-primary">{formatCurrency(samResults.totalRevenue)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Interest</span>
                  <span>{formatCurrency(samResults.interestRevenue)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{samPercent}% SAM Share</span>
                  <span>{formatCurrency(samResults.samRevenue)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Platform Fee</span>
                  <span>{formatCurrency(samResults.platformFee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ancient ROI</span>
                  <span className="font-semibold text-primary">{formatPercent(samResults.ancientROI)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 11% Fixed */}
        <Card className="border-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">11% Fixed</CardTitle>
              <Badge variant="outline">Traditional</Badge>
            </div>
            <CardDescription>Fixed rate, keep all growth</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Down Payment ({downPaymentPercent}%)</span>
                <span className="font-semibold">{formatCurrency(propertyPrice * downPaymentPercent / 100)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Payment</span>
                <span className="font-semibold">{formatCurrency(fixedResults.monthlyPayment)}</span>
              </div>
              <Separator />
              <div className="pt-2 space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase">Buyer Metrics</div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Paid</span>
                  <span className="font-semibold">{formatCurrency(fixedResults.totalPayments)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Property Value (Y{termYears})</span>
                  <span className="font-semibold text-primary">{formatCurrency(fixedResults.propertyValueAtEnd)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Net Gain (100%)</span>
                  <span className="font-semibold text-primary">{formatCurrency(fixedResults.netGain)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ROI</span>
                  <span className="font-semibold text-primary">{formatPercent(fixedResults.buyerROI)}</span>
                </div>
              </div>
              <Separator />
              <div className="pt-2 space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase">Ancient Revenue</div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Revenue</span>
                  <span className="font-semibold">{formatCurrency(fixedResults.totalRevenue)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Interest</span>
                  <span>{formatCurrency(fixedResults.interestRevenue)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Platform Fee</span>
                  <span>{formatCurrency(fixedResults.platformFee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ancient ROI</span>
                  <span className="font-semibold">{formatPercent(fixedResults.ancientROI)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>Which option wins for each stakeholder?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* SAM Sensitivity Analysis */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-semibold mb-3">SAM Sensitivity Analysis (7% Appreciation)</h4>
              <div className="space-y-2 text-sm">
                {[20, 30, 40, 50, 65].map(sam => {
                  const testResults = calculateOption('SAM_8');
                  const testSamShare = (testResults.propertyValueAtEnd - propertyPrice) * (sam / 100);
                  const testRevenue = testResults.interestRevenue + testSamShare + testResults.platformFee;
                  return (
                    <div key={sam} className="flex justify-between items-center">
                      <span className={sam === samPercent ? 'font-bold text-primary' : 'text-muted-foreground'}>
                        {sam}% SAM
                      </span>
                      <span className={sam === samPercent ? 'font-bold text-primary' : ''}>
                        {formatCurrency(testRevenue)} Ancient Revenue
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Best Option Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
              <div className="text-sm font-semibold">Best for Buyer (Monthly Payment)</div>
              <div className="flex items-center gap-2">
                <Badge variant="default">8% + 30% SAM</Badge>
                <span className="text-sm">{formatCurrency(samResults.monthlyPayment)}/mo</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatCurrency(fixedResults.monthlyPayment - samResults.monthlyPayment)} less than 11% Fixed
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-semibold">Best for Ancient (Total Revenue)</div>
              <div className="flex items-center gap-2">
                <Badge variant="default">8% + 30% SAM</Badge>
                <span className="text-sm">{formatCurrency(samResults.totalRevenue)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatCurrency(samResults.totalRevenue - fixedResults.totalRevenue)} more than 11% Fixed
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-semibold">Best Buyer ROI (Net Gain)</div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">11% Fixed</Badge>
                <span className="text-sm">{formatCurrency(fixedResults.netGain)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Buyer keeps 100% of appreciation
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-semibold">Best for Liquidity (Ancient)</div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Cash</Badge>
                <span className="text-sm">{formatCurrency(cashResults.totalRevenue)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Immediate capital for next flip
              </div>
            </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Home, TrendingUp, Star, DollarSign } from "lucide-react";

export default function EngineBCalculator() {
  const [propertyValue, setPropertyValue] = useState(150000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(15);
  const [monthlyRent, setMonthlyRent] = useState(1000);
  
  const downPayment = propertyValue * (downPaymentPercent / 100);
  const loanAmount = propertyValue - downPayment;
  const interestRate = 0.10; // 10% fixed
  const termMonths = 180; // 15 years
  
  // Monthly mortgage payment calculation
  const monthlyRate = interestRate / 12;
  const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
  
  // Net cash flow
  const netMonthlyCashFlow = monthlyRent - monthlyPayment;
  
  // Total paid over term
  const totalPaid = monthlyPayment * termMonths;
  const totalInterest = totalPaid - loanAmount;
  
  // Appreciation (4% annual)
  const appreciationRate = 0.04;
  const valueIn15Years = propertyValue * Math.pow(1 + appreciationRate, 15);
  const appreciationGain = valueIn15Years - propertyValue;
  
  // Rental income growth (4% annual)
  const rentalGrowth = 0.04;
  const rentIn15Years = monthlyRent * Math.pow(1 + rentalGrowth, 15);
  const totalRentalIncome = Array.from({ length: 15 }, (_, i) => 
    monthlyRent * Math.pow(1 + rentalGrowth, i) * 12
  ).reduce((a, b) => a + b, 0);
  
  // Total return
  const totalReturn = appreciationGain + totalRentalIncome - totalInterest;
  const equityMultiple = (downPayment + totalReturn) / downPayment;

  // OCCR Score progression
  const occrScores = [
    { month: 0, score: 0, tier: "No History" },
    { month: 12, score: 450, tier: "Bronze" },
    { month: 36, score: 620, tier: "Silver" },
    { month: 60, score: 720, tier: "Gold" },
    { month: 120, score: 800, tier: "Platinum" },
  ];

  return (
    <Card className="bg-card/50 backdrop-blur border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-500" />
          Engine B: Credit Home Calculator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          10-20% down → 10% fixed mortgage → Build OCCR credit score
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Value Slider */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Property Value</span>
            <span className="font-bold text-primary">${propertyValue.toLocaleString()}</span>
          </div>
          <Slider
            value={[propertyValue]}
            onValueChange={(v) => setPropertyValue(v[0])}
            min={75000}
            max={300000}
            step={5000}
            className="w-full"
          />
        </div>

        {/* Down Payment Slider */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Down Payment</span>
            <span className="font-bold">{downPaymentPercent}% (${downPayment.toLocaleString()})</span>
          </div>
          <Slider
            value={[downPaymentPercent]}
            onValueChange={(v) => setDownPaymentPercent(v[0])}
            min={10}
            max={30}
            step={1}
            className="w-full"
          />
        </div>

        {/* Monthly Rent Slider */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Monthly Rental Income</span>
            <span className="font-bold text-green-500">${monthlyRent.toLocaleString()}</span>
          </div>
          <Slider
            value={[monthlyRent]}
            onValueChange={(v) => setMonthlyRent(v[0])}
            min={500}
            max={2500}
            step={100}
            className="w-full"
          />
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="bg-background/50 rounded-lg p-4 text-center">
            <DollarSign className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">${monthlyPayment.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground">Monthly Payment</div>
          </div>
          
          <div className={`rounded-lg p-4 text-center ${netMonthlyCashFlow >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
            <TrendingUp className="h-6 w-6 mx-auto mb-2" />
            <div className={`text-2xl font-bold ${netMonthlyCashFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${netMonthlyCashFlow.toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground">Net Monthly Cash Flow</div>
          </div>
          
          <div className="bg-background/50 rounded-lg p-4 text-center">
            <Home className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold text-blue-500">${valueIn15Years.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Value in 15 Years</div>
          </div>
          
          <div className="bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-lg p-4 text-center">
            <Star className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">{equityMultiple.toFixed(1)}×</div>
            <div className="text-xs text-muted-foreground">Equity Multiple</div>
          </div>
        </div>

        {/* OCCR Score Timeline */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4">
          <div className="text-sm font-medium mb-3">OCCR Credit Score Progression</div>
          <div className="flex justify-between items-end">
            {occrScores.map((item, i) => (
              <div key={i} className="text-center flex-1">
                <div 
                  className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t mx-auto mb-1"
                  style={{ 
                    height: `${(item.score / 800) * 60}px`, 
                    width: '24px',
                    opacity: 0.3 + (item.score / 800) * 0.7
                  }}
                />
                <div className="text-xs font-bold">{item.score || '—'}</div>
                <div className="text-[10px] text-muted-foreground">{item.tier}</div>
                <div className="text-[10px] text-muted-foreground">Mo {item.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-primary/5 rounded p-2">
            <div className="font-bold text-primary">10%</div>
            <div className="text-muted-foreground">Fixed Rate</div>
          </div>
          <div className="bg-primary/5 rounded p-2">
            <div className="font-bold text-primary">15yr</div>
            <div className="text-muted-foreground">Term</div>
          </div>
          <div className="bg-primary/5 rounded p-2">
            <div className="font-bold text-green-500">${totalRentalIncome.toLocaleString()}</div>
            <div className="text-muted-foreground">Total Rent (15yr)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

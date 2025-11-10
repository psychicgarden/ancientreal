import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, DollarSign } from "lucide-react";

interface InvestorTimelineProps {
  investorPaybackMonths?: number;
  developmentPhaseCash?: number;
}

export default function InvestorTimeline({ 
  investorPaybackMonths = 18, 
  developmentPhaseCash = 5.2 
}: InvestorTimelineProps) {
  const paybackYears = Math.floor(investorPaybackMonths / 12);
  const paybackMonthsRemainder = investorPaybackMonths % 12;
  const paybackDisplay = paybackYears > 0 
    ? `${paybackYears}y ${paybackMonthsRemainder}m` 
    : `${paybackMonthsRemainder}m`;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Investment Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timeline visualization */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
          
          {/* Phase 1: Development */}
          <div className="relative pl-16 pb-8">
            <div className="absolute left-6 top-2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
            <Badge className="mb-2 bg-primary/10 text-primary border-primary/20">
              Phase 1: Years 0-5
            </Badge>
            <h4 className="font-semibold text-foreground mb-1">Construction & Sales</h4>
            <p className="text-sm text-muted-foreground mb-2">
              6 flips completed over 5 years
            </p>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="font-medium text-foreground">
                ${developmentPhaseCash.toFixed(1)}M immediate cash
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-1">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">
                Investor payback in <span className="font-semibold text-foreground">{paybackDisplay}</span>
              </span>
            </div>
          </div>
          
          {/* Phase 2: Mortgage Income */}
          <div className="relative pl-16 pb-8">
            <div className="absolute left-6 top-2 w-4 h-4 rounded-full bg-blue-500 border-4 border-background" />
            <Badge className="mb-2 bg-blue-500/10 text-blue-600 border-blue-500/20">
              Phase 2: Years 1-15
            </Badge>
            <h4 className="font-semibold text-foreground mb-1">Passive Mortgage Income</h4>
            <p className="text-sm text-muted-foreground">
              Recurring monthly payments from financed units
            </p>
          </div>
          
          {/* Phase 3: SAM Exit */}
          <div className="relative pl-16">
            <div className="absolute left-6 top-2 w-4 h-4 rounded-full bg-purple-500 border-4 border-background" />
            <Badge className="mb-2 bg-purple-500/10 text-purple-600 border-purple-500/20">
              Phase 3: Year 15
            </Badge>
            <h4 className="font-semibold text-foreground mb-1">SAM Appreciation Exit</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Collect 20% of appreciation on SAM units
            </p>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-muted-foreground">
                Bonus upside from property growth
              </span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Key Insight:</span> Investors recover 
            capital from cash sales in Years 0-5, then earn passive income for 15 years.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, Home, Calendar, DollarSign } from "lucide-react";
import { InvestorTierStatus } from "./InvestorTierStatus";
import { useFractionalInvestments } from "@/hooks/useFractionalInvestments";
import { Skeleton } from "@/components/ui/skeleton";

export const UserFractionalPortfolio = () => {
  const { investments, loading, totalInvestment, totalValue, monthlyIncome } = useFractionalInvestments();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const totalGain = totalValue - totalInvestment;
  const totalROI = totalInvestment > 0 ? (totalGain / totalInvestment) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Investor Tier Status */}
      <InvestorTierStatus totalInvestmentAmount={totalInvestment} />
      
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Investment</span>
            </div>
            <div className="text-2xl font-bold">${totalInvestment.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Initial capital</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Current Value</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              ${totalValue.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              {totalGain >= 0 ? '+' : ''}${totalGain.toLocaleString()} ({totalROI.toFixed(1)}%)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Home className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Properties</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {investments.length}
            </div>
            <div className="text-sm text-muted-foreground">Fractional holdings</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Monthly Income</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              ${monthlyIncome.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              ${(monthlyIncome * 12).toLocaleString()}/year
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property Holdings */}
      {investments.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Your Property Holdings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {investments.map((investment) => (
              <Card key={investment.id} className="bg-gradient-card border-accent/20">
                <CardContent className="p-0">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={investment.property_image_url}
                      alt={investment.property_name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="default" className="bg-primary text-primary-foreground">
                        {investment.ownership_percentage.toFixed(2)}% Owned
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold mb-2">{investment.property_name}</h4>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{investment.property_location}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Investment:</span>
                        <span className="font-semibold">${investment.investment_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Tokens:</span>
                        <span className="font-semibold">{investment.token_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Monthly Income:</span>
                        <span className="font-semibold text-green-600">
                          ${((investment.monthly_base_rent * investment.ownership_percentage) / 100).toFixed(0)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Book Stay
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Sell Shares
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="text-center p-8">
          <CardContent>
            <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start building your fractional property portfolio today
            </p>
            <Button>Browse Properties</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
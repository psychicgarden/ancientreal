import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Calculator, TrendingUp } from "lucide-react";
import { useState } from "react";
import { MortgagePaymentModal } from "@/components/MortgagePaymentModal";
import { PropertyAnalyticsModal } from "@/components/PropertyAnalyticsModal";
import { MortgagePropertyData } from "@/hooks/useMortgageProperties";

interface MortgagePropertyCardProps {
  property: MortgagePropertyData;
  onInvest?: () => void;
  onCalculate?: () => void;
}

export const MortgagePropertyCard = ({
  property,
  onInvest,
  onCalculate,
}: MortgagePropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);

  // Calculate financial metrics
  const monthlyProfit = Math.round(property.monthlyRent - property.monthlyPayment);
  
  // Calculate platform fee (3% of property value) and total investment
  const platformFee = property.totalValue * 0.03;
  const totalInvestment = property.downPayment + platformFee;
  
  // Calculate 10-year ROI: (Total Cash Flow + Final Equity - Total Investment) / Total Investment
  const totalCashFlow = monthlyProfit * 120;
  const finalEquity = property.networkValue;
  const totalReturn = (totalCashFlow + finalEquity - totalInvestment) / totalInvestment;
  const totalReturn10Year = Math.round(totalReturn * 100) / 100;
  
  // Calculate return range
  const returnLow = Math.floor(property.expectedReturn - 1.5);
  const returnHigh = Math.ceil(property.expectedReturn + 1.5);

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-card/40 backdrop-blur-sm border border-border/30">
      <CardContent className="p-0">
        {/* Image Header */}
        <div className="aspect-[4/3] relative overflow-hidden">
          <img
            src={property.image}
            alt={property.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-green-600/95 text-white font-semibold border border-green-400/50 shadow-lg backdrop-blur-sm px-3 py-1">
              Available
            </Badge>
          </div>
          
          {/* Heart Icon */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
          >
            <Heart
              className={`h-4 w-4 ${
                isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
              }`}
            />
          </button>
        </div>

        <div className="p-6">
          {/* Property Title & Location */}
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-2 leading-tight">{property.name}</h3>
            <p className="text-muted-foreground flex items-center gap-2 font-light">
              <MapPin className="w-4 h-4" />
              {property.location}
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {/* Network Investment Section */}
            <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl p-5 border border-border/20">
              <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase mb-4">
                Network Investment
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">List Price:</span>
                  <span className="text-lg font-semibold">${property.totalValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {property.id === "art-deco-loft-mexico" ? "Citizenship Cost:" : "Down Payment:"}
                  </span>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">${property.downPayment.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {property.id === "art-deco-loft-mexico" ? "(founding member rate)" : "(20% down payment)"}
                    </div>
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-border/50 to-transparent my-3" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Monthly Network Yield:</span>
                  <span className="text-lg font-bold text-green-600">
                    ${monthlyProfit > 0 ? '+' : ''}${monthlyProfit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {property.id === "art-deco-loft-mexico" ? "10-Year Village Value:" : "10-Year Property Value:"}
                  </span>
                  <span className="text-lg font-bold">${property.networkValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total 10-Year Return:</span>
                  <span className="text-lg font-bold text-primary">{totalReturn10Year}x</span>
                </div>
                <div className="flex justify-between items-start pt-2">
                  <span className="text-sm text-muted-foreground">Annual Return Range:</span>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{returnLow}-{returnHigh}%</div>
                    <div className="text-xs text-muted-foreground">conservative estimate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Immediate Cash Flow Section */}
            <div className="bg-gradient-to-br from-muted/20 to-muted/5 rounded-xl p-5 border border-border/20">
              <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase mb-4">
                Immediate Cash Flow
              </h4>
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 text-center min-w-0">
                  <div className="text-xl font-bold text-green-600 mb-1 whitespace-nowrap">
                    ${property.monthlyRent.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide leading-tight">
                    Monthly<br />Rent
                  </div>
                </div>
                
                <div className="flex items-center justify-center px-2">
                  <div className="text-lg text-muted-foreground font-semibold">−</div>
                </div>
                
                <div className="flex-1 text-center min-w-0">
                  <div className="text-xl font-bold text-red-500 mb-1 whitespace-nowrap">
                    ${property.monthlyPayment.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide leading-tight">
                    Mortgage<br />Payment
                  </div>
                </div>
                
                <div className="flex items-center justify-center px-2">
                  <div className="text-lg text-muted-foreground font-semibold">=</div>
                </div>
                
                <div className="flex-1 text-center min-w-0">
                  <div className="text-xl font-bold text-primary mb-1 whitespace-nowrap">
                    ${monthlyProfit > 0 ? '+' : ''}${monthlyProfit.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide leading-tight">
                    Profit<br />Per Month
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full h-12 text-base font-medium hover:scale-[1.02] transition-transform" 
              size="lg" 
              onClick={onInvest}
            >
              {property.id === "art-deco-loft-mexico" ? "Purchase with 20% Down" : "Purchase with 20% Down"}
            </Button>
            <Button 
              className="w-full h-11 font-medium" 
              variant="outline" 
              onClick={onCalculate}
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Returns
            </Button>
          </div>

          {/* Risk Disclaimer */}
          <div className="mt-4 p-3 bg-muted/10 rounded-lg border border-border/10">
            <p className="text-xs text-muted-foreground">
              * Returns include 10% reserve for vacancy/maintenance. Property appreciation estimates are conservative. 
              Past performance doesn't guarantee future results.
            </p>
          </div>
        </div>
      </CardContent>

      <MortgagePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        property={{
          id: property.id,
          title: property.name,
          location: property.location,
          image: property.image,
          value: property.totalValue,
          monthlyPayment: property.monthlyPayment,
          remainingBalance: property.totalValue - property.downPayment
        }}
      />

      <PropertyAnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        property={{
          id: property.id,
          title: property.name,
          location: property.location,
          value: property.totalValue,
          equity: property.downPayment,
          monthlyIncome: monthlyProfit,
          occupancyRate: 90
        }}
      />
    </Card>
  );
};
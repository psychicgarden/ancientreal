import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, TrendingUp, DollarSign, Home, Sparkles } from "lucide-react";

interface ProductComparisonProps {
  basePrice?: number;
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({ 
  basePrice = 143000 
}) => {
  const cashPrice = basePrice;
  const financedPrice = basePrice + 10000;
  const samPrice = basePrice;

  // Calculate monthly payments
  const calculateMonthlyPayment = (principal: number, apr: number, years: number) => {
    const monthlyRate = apr / 100 / 12;
    const numPayments = years * 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  const cashDownPayment = cashPrice * 0.20;
  const financedDownPayment = financedPrice * 0.20;
  const samDownPayment = samPrice * 0.20;

  const financedLoan = financedPrice * 0.80;
  const samLoan = samPrice * 0.80;

  const financedMonthly = calculateMonthlyPayment(financedLoan, 10.5, 15);
  const samMonthly = calculateMonthlyPayment(samLoan, 8.0, 15);

  const financedTotalPaid = financedMonthly * 180;
  const samTotalPaid = samMonthly * 180;

  const products = [
    {
      title: "Full Cash Sale",
      subtitle: "Velocity Build",
      icon: <DollarSign className="w-6 h-6" />,
      badge: "Fastest IRR: 45-55%",
      badgeVariant: "default" as const,
      price: cashPrice,
      downPayment: 0,
      monthly: 0,
      totalCost: cashPrice,
      ownership: "100%",
      features: [
        "Lowest total cost",
        "Instant equity",
        "Use HELOC @ 8-9%",
        "Perfect for families with home equity",
        "No credit check required",
      ],
      bestFor: "Families with existing home equity or liquid capital",
      helocExample: {
        rate: 8.5,
        monthly: Math.round((cashPrice * 0.085) / 12),
      },
    },
    {
      title: "Ancient Mortgage",
      subtitle: "Pathway to Ownership",
      icon: <Home className="w-6 h-6" />,
      badge: "Core Revenue: 20-22% IRR",
      badgeVariant: "secondary" as const,
      price: financedPrice,
      downPayment: financedDownPayment,
      monthly: financedMonthly,
      totalCost: financedDownPayment + financedTotalPaid,
      ownership: "100%",
      features: [
        "Only 20% down required",
        "10.5% APR fixed rate",
        "15-year term",
        "Build equity over time",
        "100% ownership at maturity",
      ],
      bestFor: "Independent buyers without family capital",
    },
    {
      title: "SAM - Shared Appreciation",
      subtitle: "Grow Together",
      icon: <Sparkles className="w-6 h-6" />,
      badge: "Aligned Upside: ~20% IRR",
      badgeVariant: "outline" as const,
      price: samPrice,
      downPayment: samDownPayment,
      monthly: samMonthly,
      totalCost: samDownPayment + samTotalPaid,
      ownership: "80%",
      features: [
        "Lowest monthly payment",
        "8% APR (vs 10.5%)",
        "Share 20% appreciation with Ancient",
        "Aligned incentives",
        "Budget-friendly path",
      ],
      bestFor: "Buyers prioritizing low monthly costs",
      appreciationNote: "Ancient shares in property growth, not just debt collection",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="outline" className="mb-4">
          Three Paths to Global Property
        </Badge>
        <h2 className="text-4xl font-bold mb-4">
          Choose Your Investment Strategy
        </h2>
        <p className="text-lg text-muted-foreground">
          40% Cash • 50% Mortgage • 10% SAM = 26-29% Blended IRR
        </p>
      </div>

      {/* Product Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {products.map((product, idx) => {
          const isRecommended = idx === 1; // Mortgage is the core product
          
          return (
            <Card 
              key={product.title}
              className={`relative ${
                isRecommended 
                  ? 'border-primary shadow-lg scale-105' 
                  : 'border-border'
              }`}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {product.icon}
                  </div>
                  <Badge variant={product.badgeVariant}>
                    {product.badge}
                  </Badge>
                </div>
                
                <CardTitle className="text-2xl">{product.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{product.subtitle}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Pricing */}
                <div>
                  <div className="text-3xl font-bold text-primary">
                    ${product.price.toLocaleString()}
                  </div>
                  {product.downPayment > 0 && (
                    <div className="text-sm text-muted-foreground mt-1">
                      ${Math.round(product.downPayment).toLocaleString()} down
                    </div>
                  )}
                </div>

                {/* Monthly Payment */}
                {product.monthly > 0 ? (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      Monthly Payment
                    </div>
                    <div className="text-2xl font-bold">
                      ${Math.round(product.monthly).toLocaleString()}/mo
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Total: ${Math.round(product.totalCost).toLocaleString()}
                    </div>
                  </div>
                ) : product.helocExample ? (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      HELOC Example @ {product.helocExample.rate}%
                    </div>
                    <div className="text-2xl font-bold">
                      ~${product.helocExample.monthly.toLocaleString()}/mo
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Use home equity for instant ownership
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      Payment Method
                    </div>
                    <div className="text-2xl font-bold">
                      Full Cash
                    </div>
                  </div>
                )}

                {/* Ownership */}
                <div className="flex items-center justify-between py-3 border-y border-border">
                  <span className="text-sm text-muted-foreground">Final Ownership</span>
                  <span className="font-bold text-lg">{product.ownership}</span>
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Appreciation Note for SAM */}
                {product.appreciationNote && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        {product.appreciationNote}
                      </p>
                    </div>
                  </div>
                )}

                {/* Best For */}
                <div className="pt-4">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">
                    BEST FOR:
                  </div>
                  <p className="text-sm">{product.bestFor}</p>
                </div>

                {/* CTA */}
                <Button 
                  className="w-full" 
                  variant={isRecommended ? "default" : "outline"}
                >
                  {idx === 0 ? "Pay Cash" : idx === 1 ? "Get Pre-Approved" : "Apply for SAM"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Portfolio Mix Summary */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Tiered Portfolio Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">40%</div>
              <div className="font-semibold mb-1">Cash Sales</div>
              <div className="text-sm text-muted-foreground">
                Fast capital recycling • 45-55% IRR
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50%</div>
              <div className="font-semibold mb-1">Ancient Mortgage</div>
              <div className="text-sm text-muted-foreground">
                Core revenue engine • 20-22% IRR
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10%</div>
              <div className="font-semibold mb-1">SAM Model</div>
              <div className="text-sm text-muted-foreground">
                Brand differentiation • ~20% IRR
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <div className="text-2xl font-bold mb-2">
              Blended Portfolio IRR: 26-29%
            </div>
            <p className="text-muted-foreground">
              Diversified revenue streams across three distinct buyer segments
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

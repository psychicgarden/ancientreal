import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calculator, MapPin } from "lucide-react";
import { useMortgageProperties } from "@/hooks/useMortgageProperties";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyInvestmentCalculator from "@/components/PropertyInvestmentCalculator";
import { PropertyPurchaseModal } from "@/components/PropertyPurchaseModal";
import { Link } from "react-router-dom";
import SectionHeader from "@/components/SectionHeader";

const FeaturedProperties = () => {
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  
  const { properties, loading: propertiesLoading } = useMortgageProperties();

  return (
    <>
      <section id="properties" className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <SectionHeader
            title="Featured Investment Opportunities"
            subtitle="Discover hand-selected premium properties with 20% down financing. Each property offers immediate cash flow and long-term appreciation potential."
          />

          {propertiesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-card/40 backdrop-blur-sm border border-border/30">
                  <CardContent className="p-0">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <div className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-6" />
                      <Skeleton className="h-2 w-full mb-6" />
                      <div className="space-y-6 mb-8">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-24 w-full" />
                      </div>
                      <div className="space-y-3">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-11 w-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {properties.map((property) => {
                const monthlyProfit = Math.round(property.monthlyRent - property.monthlyPayment);
                
                return (
                  <Card key={property.id} className="bg-card/40 backdrop-blur-sm border border-border/30 hover:border-border/60 transition-all duration-500 hover:shadow-2xl group overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img src={property.image} alt={property.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        
                        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
                          <div className="text-xs font-medium text-muted-foreground mb-1">Status</div>
                          <div className="text-sm font-semibold">Available</div>
                        </div>
                        
                        <Badge className="absolute top-4 right-4 bg-green-500/90 text-white backdrop-blur-sm">
                          Mortgage Ready
                        </Badge>
                      </div>

                      <div className="p-6">
                        <div className="mb-6">
                          <h3 className="text-2xl font-semibold mb-2 leading-tight">{property.name}</h3>
                          <p className="text-muted-foreground flex items-center gap-2 font-light">
                            <MapPin className="w-4 h-4" />
                            {property.location}
                          </p>
                        </div>

                        <div className="mb-6">
                          <Progress value={75} className="h-1.5" />
                        </div>

                        <div className="space-y-6 mb-8">
                          <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl p-5 border border-border/20">
                            <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase mb-4">Mortgage Details</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Property Value:</span>
                                <span className="text-lg font-semibold">${property.totalValue.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Down Payment:</span>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-primary">${property.downPayment.toLocaleString()}</div>
                                  <div className="text-xs text-muted-foreground">(20% down)</div>
                                </div>
                              </div>
                              <div className="h-px bg-gradient-to-r from-border/50 to-transparent my-3" />
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Expected Return:</span>
                                <span className="text-lg font-bold text-green-600">{property.expectedReturn.toFixed(1)}%</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-muted/20 to-muted/5 rounded-xl p-5 border border-border/20">
                            <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase mb-4">Monthly Cash Flow</h4>
                            <div className="flex justify-between items-center text-center">
                              <div className="flex-1">
                                <div className="text-2xl font-bold text-green-600 mb-1">${Math.round(property.monthlyRent)}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wide leading-tight">Monthly<br />Rent</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-2xl font-bold text-red-500 mb-1">-${Math.round(property.monthlyPayment)}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wide leading-tight">Mortgage<br />Payment</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-2xl font-bold text-primary mb-1">+${monthlyProfit}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wide leading-tight">Profit<br />Per Month</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Button 
                            className="w-full h-12 text-base font-medium hover:scale-[1.02] transition-transform" 
                            size="lg"
                            onClick={() => {
                              setSelectedProperty(property);
                              setPurchaseModalOpen(true);
                            }}
                          >
                            Get Mortgage
                          </Button>
                          <Button 
                            className="w-full h-11 font-medium" 
                            variant="outline"
                            onClick={() => {
                              setSelectedProperty(property);
                              setCalculatorOpen(true);
                            }}
                          >
                            <Calculator className="w-4 h-4 mr-2" />
                            Calculate Returns
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="text-center">
            <Button variant="outline" size="lg" className="px-12" asChild>
              <Link to="/investor">
                View All Properties
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <PropertyInvestmentCalculator 
        open={calculatorOpen} 
        onOpenChange={setCalculatorOpen}
        property={selectedProperty}
      />

      <PropertyPurchaseModal 
        isOpen={purchaseModalOpen}
        onClose={() => setPurchaseModalOpen(false)}
        property={selectedProperty}
      />
    </>
  );
};

export default FeaturedProperties;
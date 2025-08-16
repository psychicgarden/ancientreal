import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, PieChart, DollarSign, BarChart3, Calculator, Zap, MapPin, Building, Users } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import PropertyInvestmentCalculator from "@/components/PropertyInvestmentCalculator";
import { PropertyPurchaseModal } from "@/components/PropertyPurchaseModal";
import { LiquidityTradingHub } from "@/components/LiquidityTradingHub";
import { PropertyFractionalizationInterface } from "@/components/PropertyFractionalizationInterface";
import { OwnedListingsOverview } from "@/components/OwnedListingsOverview";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useMortgageProperties } from "@/hooks/useMortgageProperties";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";


const InvestorPortal = () => {
  const { isConnected, isPurchasing } = useWallet();
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Use mortgage properties
  const { properties, loading: propertiesLoading } = useMortgageProperties();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-32 pb-8 px-6">
        <div className="container mx-auto">
          <Tabs defaultValue="properties" className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Investor Portal
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                Get a mortgage with just 20% down and start building equity in premium real estate properties.
              </p>

<TabsList className="grid grid-cols-4 w-fit mx-auto">
  <TabsTrigger value="properties" className="flex items-center gap-2">
    <DollarSign className="h-4 w-4" />
    Buy Properties
  </TabsTrigger>
  <TabsTrigger value="list-property" className="flex items-center gap-2">
    <Building className="h-4 w-4" />
    List My Property
  </TabsTrigger>
  <TabsTrigger value="my-listings" className="flex items-center gap-2">
    <Users className="h-4 w-4" />
    My Listings
  </TabsTrigger>
  <TabsTrigger value="defi" className="flex items-center gap-2">
    <Zap className="h-4 w-4" />
    DeFi Trading Hub
  </TabsTrigger>
</TabsList>
            </div>

            <TabsContent value="properties" className="space-y-16">
              {/* Investment Features */}
              <section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-card border-accent/20">
                    <CardHeader>
                      <PieChart className="w-8 h-8 text-gold mb-2" />
                      <CardTitle>20% Down Payment</CardTitle>
                      <CardDescription>
                        Get a mortgage with just 20% down on premium properties
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="bg-gradient-card border-accent/20">
                    <CardHeader>
                      <BarChart3 className="w-8 h-8 text-gold mb-2" />
                      <CardTitle>Positive Cash Flow</CardTitle>
                      <CardDescription>
                        Rental income exceeds mortgage payments for immediate profits
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="bg-gradient-card border-accent/20">
                    <CardHeader>
                      <DollarSign className="w-8 h-8 text-gold mb-2" />
                      <CardTitle>Blockchain Security</CardTitle>
                      <CardDescription>
                        All mortgages secured by smart contracts and NFT property deeds
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="bg-gradient-card border-accent/20">
                    <CardHeader>
                      <TrendingUp className="w-8 h-8 text-gold mb-2" />
                      <CardTitle>Property Appreciation</CardTitle>
                      <CardDescription>
                        Benefit from property value increases over 10 years
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </section>

              {/* Available Properties */}
              <section>
                <h2 className="text-3xl font-bold text-center mb-12">Available Mortgage Properties</h2>
                {propertiesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="bg-gradient-card border-accent/20">
                        <CardContent className="p-6">
                          <Skeleton className="aspect-video rounded-lg mb-4" />
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2 mb-2" />
                          <Skeleton className="h-4 w-full mb-4" />
                          <div className="space-y-3 mb-6">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-12 w-full" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <Card key={property.id} className="bg-gradient-card border-accent/20 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                        <CardContent className="p-0">
                          <div className="relative aspect-video overflow-hidden">
                            <img
                              src={property.image}
                              alt={property.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-3 left-3 flex gap-2">
                              <Badge variant="default" className="bg-primary text-primary-foreground">
                                Mortgage Available
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="p-6">
                            <div className="mb-4">
                              <h3 className="text-xl font-semibold mb-2">{property.name}</h3>
                              <div className="flex items-center text-muted-foreground mb-3">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className="text-sm">{property.location}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-3 mb-6">
                              <div className="bg-card/50 p-4 rounded-lg border">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Property Value:</span>
                                  <span className="text-lg font-semibold">${property.totalValue.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-sm text-muted-foreground">Down Payment:</span>
                                  <span className="text-xl font-bold text-gold">${property.downPayment.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-sm text-muted-foreground">Monthly Payment:</span>
                                  <span className="text-lg font-semibold text-green-500">${Math.round(property.monthlyPayment)}</span>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-sm text-muted-foreground">Monthly Rent:</span>
                                  <span className="text-lg font-semibold text-blue-500">${Math.round(property.monthlyRent)}</span>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                <span className="text-sm text-muted-foreground">Expected Return</span>
                                <span className="font-semibold text-primary">{property.expectedReturn.toFixed(1)}% annually</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Button 
                                className="w-full" 
                                size="lg"
                                onClick={() => {
                                  console.log('Get Mortgage clicked', { property: property.name });
                                  setSelectedProperty(property);
                                  setPurchaseModalOpen(true);
                                }}
                                disabled={isPurchasing || !isConnected}
                              >
                                {isPurchasing 
                                  ? "Processing..." 
                                  : !isConnected 
                                    ? "Connect Wallet to Purchase"
                                    : "Get Mortgage"
                                }
                              </Button>
                              <Button 
                                className="w-full" 
                                variant="outline"
                                onClick={() => {
                                  console.log('Calculate Returns clicked', { property: property.name });
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
                    ))}
                  </div>
                )}
              </section>
</TabsContent>


            <TabsContent value="list-property">
              <ErrorBoundary>
                <PropertyFractionalizationInterface />
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="my-listings">
              <ErrorBoundary>
                <OwnedListingsOverview />
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="defi">
              <ErrorBoundary>
                <LiquidityTradingHub />
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Property Investment Calculator Modal */}
      <PropertyInvestmentCalculator 
        open={calculatorOpen} 
        onOpenChange={setCalculatorOpen}
        property={selectedProperty}
      />

      {/* Property Purchase Modal */}
      <PropertyPurchaseModal 
        isOpen={purchaseModalOpen}
        onClose={() => setPurchaseModalOpen(false)}
        property={selectedProperty}
      />
    </div>
  );
};

export default InvestorPortal;
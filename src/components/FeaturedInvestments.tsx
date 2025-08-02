import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Calculator, MapPin, RefreshCw, AlertCircle } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { useProperties } from "@/hooks/useProperties";
import PropertyInvestmentCalculator from "@/components/PropertyInvestmentCalculator";
import villaTulum from "@/assets/villa-tulum.jpg";
import beachChalet from "@/assets/beach-chalet.jpg";
import villaCorfu from "@/assets/villa-corfu-greece.jpg";

const FeaturedInvestments = () => {
  const { isConnected, purchaseTokens, isPurchasing } = useWallet();
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  
  const { data: dbProperties, isLoading, error, refetch } = useProperties();

  // Transform database properties to match UI format
  const transformProperty = (dbProp: any, index: number) => {
    const basePrice = dbProp.price;
    const downPayment = Math.round(basePrice * 0.2); // 20% down
    const monthlyPayment = Math.round((basePrice - downPayment) / 120); // 10 years
    const monthlyRent = Math.round(basePrice * 0.015); // 1.5% of value per month
    const monthlyProfit = Math.round(monthlyRent - monthlyPayment);
    
    // Default property images cycle
    const images = [villaTulum, beachChalet, villaCorfu];
    const image = images[index % images.length];
    
    return {
      id: dbProp.id,
      type: "🏡 Real Estate",
      name: dbProp.name,
      location: dbProp.address,
      totalValue: basePrice,
      listPrice: basePrice,
      downPayment,
      monthlyPayment,
      monthlyRent,
      monthlyProfit,
      networkValue: Math.round(basePrice * 2.4), // 10-year projection
      propertiesSold: Math.floor(Math.random() * 8) + 3, // Random for demo
      totalProperties: 15,
      mortgageTerm: "10 years",
      expectedReturn: Math.round((monthlyProfit * 12 / downPayment) * 100 * 10) / 10,
      image,
      isBlockchain: index === 0, // First property is blockchain-enabled
      isVillage: true,
      dbProperty: dbProp
    };
  };

  const properties = dbProperties?.map(transformProperty) || [];

  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            Sustainable Living
            <br />
            <span className="text-muted-foreground font-light">20% Down Financing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Thoughtfully curated eco-luxury residences. 
            Modern financing for conscious living.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-gradient-card border-accent/20">
                <CardContent className="p-6">
                  <Skeleton className="aspect-video rounded-lg mb-4" />
                  <Skeleton className="h-4 mb-2" />
                  <Skeleton className="h-8 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                  </div>
                  <Skeleton className="h-10 mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Unable to load properties</h3>
            <p className="text-muted-foreground mb-4">Please check your connection and try again</p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        )}

        {/* Properties Grid */}
        {!isLoading && !error && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {properties.map((property, index) => (
            <Card key={property.id} className="bg-gradient-card border-accent/20">
              <CardContent className="p-6">
                <div className="aspect-video bg-muted rounded-lg mb-4 relative overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
                    {property.type}
                  </Badge>
                  {property.isBlockchain && isConnected && (
                    <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                      🔗 LIVE BLOCKCHAIN
                    </Badge>
                  )}
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Availability</span>
                    <span className="text-sm font-semibold">{property.propertiesSold}/{property.totalProperties} sold</span>
                  </div>
                  <Progress value={(property.propertiesSold / property.totalProperties) * 100} className="h-2" />
                </div>

                <h3 className="text-xl font-semibold mb-1">{property.name}</h3>
                <p className="text-muted-foreground mb-4 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {property.location}
                </p>

                {property.isVillage ? (
                  <div className="space-y-4 mb-6">
                    {/* Network Investment */}
                    <div className="bg-card/50 p-4 rounded-lg border">
                       <h4 className="font-semibold mb-3">NETWORK INVESTMENT</h4>
                       <div className="space-y-2 text-sm">
                         <div className="flex justify-between">
                           <span>List Price:</span>
                           <span className="font-semibold">${property.listPrice.toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between">
                           <span>Citizenship Cost:</span>
                           <span className="font-semibold">${property.downPayment.toLocaleString()} (founding member rate)</span>
                         </div>
                        <div className="flex justify-between">
                          <span>Monthly Network Yield:</span>
                          <span className="font-semibold text-green-600">${property.monthlyProfit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>10-Year Village Value:</span>
                          <span className="font-semibold">${property.networkValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Access:</span>
                          <span className="font-semibold">Entire Ancient archipelago</span>
                        </div>
                      </div>
                    </div>

                    {/* Immediate Cash Flow */}
                    <div className="bg-card/50 p-4 rounded-lg border">
                      <h4 className="font-semibold mb-3">IMMEDIATE CASH FLOW</h4>
                      <div className="flex justify-between items-center text-lg">
                        <div className="text-center">
                          <div className="text-green-600 font-bold">${property.monthlyRent}</div>
                          <div className="text-xs text-muted-foreground">Monthly Rent</div>
                        </div>
                        <div className="text-center">
                          <div className="text-red-600 font-bold">-${property.monthlyPayment}</div>
                          <div className="text-xs text-muted-foreground">Mortgage</div>
                        </div>
                        <div className="text-center">
                          <div className="text-primary font-bold">= +${property.monthlyProfit}</div>
                          <div className="text-xs text-muted-foreground">PROFIT/Month</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 mb-6">
                    <div className="bg-card/50 p-4 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Value</span>
                        <span className="text-lg font-semibold">${property.totalValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-muted-foreground">Down Payment</span>
                        <span className="text-xl font-bold">${property.downPayment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-muted-foreground">Monthly ({property.mortgageTerm})</span>
                        <span className="text-lg font-semibold">${property.monthlyPayment.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Expected Return</span>
                      <span className="font-semibold text-primary">{property.expectedReturn}% annually</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {property.isVillage ? (
                    <>
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => purchaseTokens(property.downPayment)}
                        disabled={isPurchasing || !isConnected}
                      >
                        {isPurchasing 
                          ? "Processing..." 
                          : !isConnected 
                            ? "Connect Wallet First"
                            : "Become a Founding Citizen"
                        }
                      </Button>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => {
                          setSelectedProperty(property);
                          setCalculatorOpen(true);
                        }}
                      >
                        <Calculator className="w-4 h-4 mr-2" />
                        Calculate Network Returns
                      </Button>
                    </>
                  ) : property.isBlockchain ? (
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => purchaseTokens()}
                      disabled={isPurchasing || !isConnected}
                    >
                      {isPurchasing 
                        ? "Processing..." 
                        : !isConnected 
                          ? "Connect Wallet to Purchase"
                          : "Purchase Mortgage Tokens"
                      }
                    </Button>
                  ) : (
                    <Button className="w-full" size="lg" disabled>
                      Coming Soon - Tokenization
                    </Button>
                  )}
                  {!property.isVillage && (
                    <Button className="w-full" variant="outline">
                      Schedule Viewing
                    </Button>
                  )}
                </div>
               </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && properties.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground">Properties will appear here once they're added to the database</p>
          </div>
        )}

        <div className="text-center">
          <Button variant="outline" size="lg">
            View All Properties
          </Button>
        </div>
      </div>

      {/* Property Investment Calculator Modal */}
      <PropertyInvestmentCalculator 
        open={calculatorOpen} 
        onOpenChange={setCalculatorOpen}
        property={selectedProperty}
      />
    </section>
  );
};

export default FeaturedInvestments;
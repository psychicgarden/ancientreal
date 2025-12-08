import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calculator, MapPin } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { MAZUNTE_PROPERTY } from "@/lib/contracts";
import PropertyInvestmentCalculator from "@/components/PropertyInvestmentCalculator";
import { PropertyPurchaseModal } from "@/components/PropertyPurchaseModal";
import { Link } from "react-router-dom";
import SectionHeader from "@/components/SectionHeader";
import { useFractionalProperties } from "@/hooks/useFractionalProperties";
import { Skeleton } from "@/components/ui/skeleton";
import { calculatePropertyAppreciation, calculateInvestmentMetrics, PropertyMortgageData } from '@/lib/finance';
const FeaturedInvestments = () => {
  const {
    isConnected,
    purchaseTokens,
    isPurchasing,
    purchaseProperty,
    isPurchasingProperty,
    getMazuntePropertyStatus
  } = useWallet();
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  
  // Use real fractional properties from Supabase
  const { properties, loading: propertiesLoading } = useFractionalProperties();

  // Transform properties for Village display with correct financial calculations
  const transformedProperties = properties.map(property => {
    // Use the same calculation logic as PropertyInvestmentCalculator and MortgagePropertyCard
    const propertyData: PropertyMortgageData = {
      propertyValue: property.totalValue,
      downPayment: property.downPayment,
      aprBps: property.location.includes('Mexico') ? 800 : 750, // 8% for Mexico, 7.5% for others
      termMonths: 120, // 10 years
      monthlyRent: property.monthlyRent,
      platformFeePercent: 0.03
    };

    // Calculate using the centralized finance function
    const metrics = calculateInvestmentMetrics(property.downPayment, propertyData);
    
    // Extract calculated values
    const platformFee = property.totalValue * 0.03;
    const totalInvestment = property.downPayment + platformFee;
    const monthlyProfit = Math.round(metrics.monthlyProfit);
    
    // Calculate network value using 181% appreciation and buyer's total equity
    const appreciation = calculatePropertyAppreciation(property.totalValue, property.projected_appreciation_percent || 181, 0.5);
    const networkValue = Math.round(appreciation.buyerTotalEquity);
    
    // Calculate 10-year return: (totalProfit / totalInvestment) + 1 (same as other components)
    const totalReturnMultiple = Math.round(((metrics.totalProfit / totalInvestment) + 1) * 10) / 10; // Round to 1 decimal
    
    return {
      type: property.location.includes('Mexico') ? "🏝️ Join the Mazunte Village" : "Villa",
      name: property.name,
      location: property.location,
      totalValue: property.totalValue,
      listPrice: property.totalValue,
      downPayment: property.downPayment,
      monthlyPayment: Math.round(metrics.monthlyPayment),
      monthlyRent: property.monthlyRent, // Use real database value
      monthlyProfit, // Calculated from real values
      networkValue, // Proper appreciation model
      totalReturnMultiple, // 10-year total return multiple
      propertiesSold: property.wholePropertiesSold,
      totalProperties: 15,
      mortgageTerm: "10 years",
      expectedReturn: property.expectedReturn,
      image: property.image,
      isBlockchain: property.isBlockchain,
      isVillage: true // Make all properties use the NETWORK INVESTMENT layout
    };
  });
  return <section className="px-6 bg-gradient-to-br from-background via-background to-muted/5 py-[20px]">
      <div className="container mx-auto">
        <SectionHeader
          eyebrow="Featured"
          title="The Ancient Collective"
          subtitle={
            <>
              Private residences in the world's most soulful places. Start with 20% down. Modern financing for conscious living.
              <br />
              Own your place in the story.
              <br />
            </>
          }
        />

        {propertiesLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {transformedProperties.map((property, index) => <Card key={index} className="bg-card/40 backdrop-blur-sm border border-border/30 hover:border-border/60 transition-all duration-500 hover:shadow-2xl group overflow-hidden">
              <CardContent className="p-0">
                
                {/* Image Header */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  
                  {/* Availability Badge */}
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
                    <div className="text-xs font-medium text-muted-foreground mb-1">Availability</div>
                    <div className="text-sm font-semibold">{property.propertiesSold}/{property.totalProperties} sold</div>
                  </div>
                  
                  {property.isBlockchain && isConnected && <Badge className="absolute top-4 right-4 bg-green-500/90 text-white backdrop-blur-sm">
                      🔗 LIVE
                    </Badge>}
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

                  {/* Availability Progress */}
                  <div className="mb-6">
                    <Progress value={property.propertiesSold / property.totalProperties * 100} className="h-1.5" />
                  </div>

                  {property.isVillage ? <div className="space-y-6 mb-8">
                      
                      {/* Network Investment Section */}
                      <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl p-5 border border-border/20">
                        <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase mb-4">Network Investment</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">List Price:</span>
                            <span className="text-lg font-semibold">${property.listPrice.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Citizenship Cost:</span>
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary">${property.downPayment.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground">(founding member rate)</div>
                            </div>
                          </div>
                          <div className="h-px bg-gradient-to-r from-border/50 to-transparent my-3" />
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Monthly Network Yield:</span>
                            <span className="text-lg font-bold text-green-600">${property.monthlyProfit}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">10-Year Village Value:</span>
                            <span className="text-lg font-bold">${property.networkValue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Total 10-Year Return:</span>
                            <span className="text-lg font-bold text-primary">{property.totalReturnMultiple}x</span>
                          </div>
                          <div className="flex justify-between items-start pt-2">
                            <span className="text-sm text-muted-foreground">Access:</span>
                            <div className="text-right">
                              <div className="text-sm font-semibold">Entire Ancient</div>
                              <div className="text-xs text-muted-foreground">archipelago</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Immediate Cash Flow Section */}
                      <div className="bg-gradient-to-br from-muted/20 to-muted/5 rounded-xl p-5 border border-border/20">
                        <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase mb-4">Immediate Cash Flow</h4>
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
                              ${property.monthlyProfit.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wide leading-tight">
                              Profit<br />Per Month
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> : <div className="space-y-4 mb-8">
                      <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl p-5 border border-border/20">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Total Value</span>
                            <span className="text-xl font-semibold">${property.totalValue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Down Payment</span>
                            <span className="text-2xl font-bold text-primary">${property.downPayment.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Monthly ({property.mortgageTerm})</span>
                            <span className="text-lg font-semibold">${property.monthlyPayment.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-muted/20 rounded-lg border border-border/20">
                        <span className="text-sm text-muted-foreground">Expected Return</span>
                        <span className="text-lg font-bold text-primary">{property.expectedReturn}% annually</span>
                      </div>
                    </div>}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {property.isVillage ? <>
                        <Button className="w-full h-12 text-base font-medium hover:scale-[1.02] transition-transform" size="lg" onClick={() => {
                    setSelectedProperty(property);
                    setPurchaseModalOpen(true);
                  }} disabled={isPurchasing}>
                          {isPurchasing ? "Processing..." : "Become a Founding Citizen"}
                        </Button>
                        <Button className="w-full h-11 font-medium" variant="outline" onClick={() => {
                    setSelectedProperty(property);
                    setCalculatorOpen(true);
                  }}>
                          <Calculator className="w-4 h-4 mr-2" />
                          Calculate Network Returns
                        </Button>
                      </> : property.isBlockchain ? <Button className="w-full h-12 text-base font-medium hover:scale-[1.02] transition-transform" size="lg" onClick={() => purchaseTokens()} disabled={isPurchasing || !isConnected}>
                        {isPurchasing ? "Processing..." : !isConnected ? "Connect Wallet to Purchase" : "Purchase Mortgage Tokens"}
                      </Button> : <Button className="w-full h-12 text-base font-medium" size="lg" disabled>
                        Coming Soon - Tokenization
                      </Button>}
                    {!property.isVillage && <Button className="w-full h-11 font-medium" variant="outline">
                        Schedule Viewing
                      </Button>}
                  </div>
                </div>
              </CardContent>
            </Card>)}
          </div>
        )}

        <div className="text-center">
          <Button variant="outline" size="lg" className="px-8 py-3 text-base font-medium hover:scale-105 transition-transform" asChild>
            <Link to="/investor">View All Properties</Link>
          </Button>
        </div>
      </div>

      {/* Property Investment Calculator Modal */}
      <PropertyInvestmentCalculator open={calculatorOpen} onOpenChange={setCalculatorOpen} property={selectedProperty} />

      {/* Property Purchase Modal */}
      <PropertyPurchaseModal isOpen={purchaseModalOpen} onClose={() => setPurchaseModalOpen(false)} property={selectedProperty} />
    </section>;
};
export default FeaturedInvestments;
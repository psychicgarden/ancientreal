import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, PieChart, DollarSign, BarChart3, Calculator, Zap } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import PropertyInvestmentCalculator from "@/components/PropertyInvestmentCalculator";
import { PropertyPurchaseModal } from "@/components/PropertyPurchaseModal";
import { LiquidityTradingHub } from "@/components/LiquidityTradingHub";
import ErrorBoundary from "@/components/ErrorBoundary";
import villaBahia from "@/assets/loft-bahia.jpg";
import villaMexico from "@/assets/penthouse-mexico.jpg";
import villaGreece from "@/assets/apartment-greece.jpg";


const InvestorPortal = () => {
  const { isConnected, isPurchasing } = useWallet();
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Property data structure matching the landing page format
  const properties = [
    {
      type: "Artist Loft",
      name: "Artist Loft Bahia", 
      location: "Salvador, Bahia, Brazil",
      description: "Industrial-chic loft with ocean views in historic Pelourinho",
      totalValue: 165000,
      listPrice: 165000,
      downPayment: 33000,
      monthlyPayment: 1268,
      monthlyRent: 1800,
      monthlyProfit: 532,
      networkValue: 515000,
      propertiesSold: 3,
      totalProperties: 8,
      mortgageTerm: "10 years",
      expectedReturn: 15.8,
      image: villaBahia,
      isBlockchain: true,
      isVillage: false
    },
    {
      type: "Beach Penthouse",
      name: "Beach Penthouse Tulum",
      location: "Tulum, Quintana Roo, Mexico", 
      description: "Rooftop penthouse with private terrace near cenotes",
      totalValue: 190000,
      listPrice: 190000,
      downPayment: 38000,
      monthlyPayment: 1464,
      monthlyRent: 2100,
      monthlyProfit: 636,
      networkValue: 593000,
      propertiesSold: 2,
      totalProperties: 6,
      mortgageTerm: "10 years", 
      expectedReturn: 16.2,
      image: villaMexico,
      isBlockchain: true,
      isVillage: false
    },
    {
      type: "Caldera Apartment",
      name: "Caldera Apartment",
      location: "Oia, Santorini, Greece",
      description: "Minimalist apartment overlooking the caldera",
      totalValue: 178000,
      listPrice: 178000,
      downPayment: 36000,
      monthlyPayment: 1372,
      monthlyRent: 1950,
      monthlyProfit: 578,
      networkValue: 556000,
      propertiesSold: 1,
      totalProperties: 4,
      mortgageTerm: "10 years",
      expectedReturn: 15.9,
      image: villaGreece,
      isBlockchain: true,
      isVillage: false
    }
  ];
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
                Smart contract mortgages, DeFi trading, and yield farming for global nomads.
              </p>

<TabsList className="grid grid-cols-2 w-fit mx-auto">
  <TabsTrigger value="properties" className="flex items-center gap-2">
    <DollarSign className="h-4 w-4" />
    Property Investment
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
                      <CardTitle>20% Down Mortgages</CardTitle>
                      <CardDescription>
                        Smart contract mortgages with crypto payments
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="bg-gradient-card border-accent/20">
                    <CardHeader>
                      <BarChart3 className="w-8 h-8 text-gold mb-2" />
                      <CardTitle>10-Year Terms</CardTitle>
                      <CardDescription>
                        Build equity fast with accelerated payment schedules
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="bg-gradient-card border-accent/20">
                    <CardHeader>
                      <DollarSign className="w-8 h-8 text-gold mb-2" />
                      <CardTitle>Instant Ownership</CardTitle>
                      <CardDescription>
                        Get property deed on blockchain after down payment
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="bg-gradient-card border-accent/20">
                    <CardHeader>
                      <TrendingUp className="w-8 h-8 text-gold mb-2" />
                      <CardTitle>181% ROI Potential</CardTitle>
                      <CardDescription>
                        Equity building + appreciation over 10 years
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </section>

              {/* Available Properties */}
              <section>
                <h2 className="text-3xl font-bold text-center mb-12">Available Properties</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property, index) => (
                    <Card key={index} className="bg-gradient-card border-accent/20">
                      <CardContent className="p-6">
                        <div className="aspect-video bg-cover bg-center rounded-lg mb-4" 
                             style={{ backgroundImage: `url(${property.image})` }}></div>
                        <h3 className="text-xl font-semibold mb-2">{property.name}</h3>
                        <p className="text-muted-foreground mb-2">{property.location}</p>
                        <p className="text-sm text-muted-foreground mb-4">{property.description}</p>
                        
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
                              <span className="text-sm text-muted-foreground">Monthly ({property.mortgageTerm}):</span>
                              <span className="text-lg font-semibold text-green-500">${property.monthlyPayment.toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                            <span className="text-sm text-muted-foreground">Expected Return</span>
                            <span className="font-semibold text-primary">{property.expectedReturn}% annually</span>
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
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
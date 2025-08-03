import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, PieChart, DollarSign, BarChart3, Calculator } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import PropertyInvestmentCalculator from "@/components/PropertyInvestmentCalculator";
import { PropertyPurchaseModal } from "@/components/PropertyPurchaseModal";
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
      
      {/* Hero Section */}
      <section className="pt-32 pb-8 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Investor Portal
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Smart contract mortgages for global nomads. Own property worldwide with 20% down and build equity instead of burning cash on rent.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              variant="default" 
              size="lg"
              onClick={() => {
                const propertiesSection = document.querySelector('h2');
                if (propertiesSection) {
                  propertiesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Browse Properties
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/portfolio">View Portfolio</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Investment Features */}
      <section className="pb-16 px-6">
        <div className="container mx-auto">
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
        </div>
      </section>

      {/* Active Properties */}
      <section className="pb-16 px-6">
        <div className="container mx-auto">
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
        </div>
      </section>

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
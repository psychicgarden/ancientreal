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
import villaTulum from "@/assets/villa-tulum.jpg";
import beachChalet from "@/assets/beach-chalet.jpg";
import villaCorfu from "@/assets/villa-corfu-greece.jpg";

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

  // Hardcoded blockchain data for Mazunte property
  const mazunteData = {
    totalValue: 150000,
    downPayment: 30000,
    monthlyPayment: 1456,
    projectedValue: 421500,
    location: "Calle Rinconcito, Mazunte, Oaxaca, Mexico",
    legalOwner: "Ancient Holdings Ltd (Nevis Corporation)"
  };
  const properties = [
    {
      type: "🏝️ Join the Mazunte Village",
      name: "Art Deco Loft",
      location: "Mazunte, Mexico",
      totalValue: isConnected ? mazunteData.totalValue : 150000,
      listPrice: 150000,
      downPayment: isConnected ? mazunteData.downPayment : 30000,
      monthlyPayment: isConnected ? mazunteData.monthlyPayment : 1456,
      monthlyRent: 2050,
      monthlyProfit: 594,
      networkValue: 467000, // Updated with 4% annual rent growth
      propertiesSold: 11,
      totalProperties: 15,
      mortgageTerm: "10 years",
      expectedReturn: isConnected ? 181 : 16.8,
      image: villaTulum,
      isBlockchain: true,
      isVillage: true
    },
    {
      type: "Villa", 
      name: "Ocean Villa Retreat",
      location: "Bahia, Brazil", 
      totalValue: 130000,
      listPrice: 130000,
      downPayment: 26000,
      monthlyPayment: 1264,
      monthlyRent: 1800,
      monthlyProfit: 536,
      networkValue: 405600, // 130k * 1.12^10
      propertiesSold: 8,
      totalProperties: 12,
      mortgageTerm: "10 years",
      expectedReturn: 15.2,
      image: beachChalet,
      isBlockchain: false,
      isVillage: true
    },
    {
      type: "Villa",
      name: "Mediterranean Villa",
      location: "Corfu, Greece",
      totalValue: 280000,
      listPrice: 280000,
      downPayment: 56000, 
      monthlyPayment: 2717,
      monthlyRent: 2950,
      monthlyProfit: 233,
      networkValue: 663000, // 280k * 2.37 (10-year appreciation with 4% rent growth)
      propertiesSold: 5,
      totalProperties: 10,
      mortgageTerm: "10 years",
      expectedReturn: 17.8,
      image: villaCorfu,
      isBlockchain: false,
      isVillage: true
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {properties.map((property, index) => (
            <Card key={index} className="bg-gradient-card border-accent/20">
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
                        onClick={() => {
                          setSelectedProperty(property);
                          setPurchaseModalOpen(true);
                        }}
                        disabled={isPurchasing}
                      >
                        {isPurchasing 
                          ? "Processing..." 
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

      {/* Property Purchase Modal */}
      <PropertyPurchaseModal 
        isOpen={purchaseModalOpen}
        onClose={() => setPurchaseModalOpen(false)}
        property={selectedProperty}
      />
    </section>
  );
};

export default FeaturedInvestments;
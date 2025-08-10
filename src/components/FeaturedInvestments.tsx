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
  const properties = [{
    type: "🏝️ Join the Mazunte Village",
    name: "Art Deco Loft",
    location: "Mazunte, Mexico",
    totalValue: isConnected ? mazunteData.totalValue : 150000,
    listPrice: 150000,
    downPayment: isConnected ? mazunteData.downPayment : 30000,
    monthlyPayment: isConnected ? mazunteData.monthlyPayment : 1456,
    monthlyRent: 2050,
    monthlyProfit: 594,
    networkValue: 467000,
    // Updated with 4% annual rent growth
    propertiesSold: 11,
    totalProperties: 15,
    mortgageTerm: "10 years",
    expectedReturn: isConnected ? 181 : 16.8,
    image: villaTulum,
    isBlockchain: true,
    isVillage: true
  }, {
    type: "Villa",
    name: "Ocean Villa Retreat",
    location: "Bahia, Brazil",
    totalValue: 130000,
    listPrice: 130000,
    downPayment: 26000,
    monthlyPayment: 1264,
    monthlyRent: 1800,
    monthlyProfit: 536,
    networkValue: 405600,
    // 130k * 1.12^10
    propertiesSold: 8,
    totalProperties: 12,
    mortgageTerm: "10 years",
    expectedReturn: 15.2,
    image: beachChalet,
    isBlockchain: false,
    isVillage: true
  }, {
    type: "Villa",
    name: "Mediterranean Villa",
    location: "Corfu, Greece",
    totalValue: 280000,
    listPrice: 280000,
    downPayment: 56000,
    monthlyPayment: 2717,
    monthlyRent: 2950,
    monthlyProfit: 233,
    networkValue: 663000,
    // 280k * 2.37 (10-year appreciation with 4% rent growth)
    propertiesSold: 5,
    totalProperties: 10,
    mortgageTerm: "10 years",
    expectedReturn: 17.8,
    image: villaCorfu,
    isBlockchain: false,
    isVillage: true
  }];
  return <section className="px-6 bg-gradient-to-br from-background via-background to-muted/5 py-[20px]">
      <div className="container mx-auto">
        <SectionHeader
          eyebrow="Featured"
          title="Sustainable Living"
          subtitle="20% Down Financing — Thoughtfully curated eco‑luxury residences. Modern financing for conscious living."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {properties.map((property, index) => <Card key={index} className="bg-card/40 backdrop-blur-sm border border-border/30 hover:border-border/60 transition-all duration-500 hover:shadow-2xl group overflow-hidden">
              <CardContent className="p-0">
                
                {/* Image Header */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img src={property.image} alt={property.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
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
                      <div className="rounded-2xl border border-border/30 bg-gradient-card p-6 shadow-card">
                        <h4 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase mb-3">Immediate Cash Flow</h4>
                        {/* Elegant equation row */}
                        <div className="flex items-baseline justify-center gap-3 md:gap-4 mb-2">
                          <span className="text-2xl md:text-3xl font-semibold text-accent">{`$${property.monthlyRent.toLocaleString()}`}</span>
                          <span className="text-2xl md:text-3xl font-semibold text-destructive">{`- $${property.monthlyPayment.toLocaleString()}`}</span>
                          <span className="text-2xl md:text-3xl font-semibold text-primary">{`+ $${property.monthlyProfit.toLocaleString()}`}</span>
                        </div>
                        <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent my-3" />
                        {/* Sub labels */}
                        <div className="grid grid-cols-3 gap-2 text-center text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">
                          <div>Monthly Rent</div>
                          <div>Mortgage Payment</div>
                          <div>Profit Per Month</div>
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
                        <Button
                          className="w-full h-12 text-base font-medium hover:scale-[1.02] transition-transform"
                          size="lg"
                          variant="gold"
                          onClick={() => {
                            setSelectedProperty(property);
                            setPurchaseModalOpen(true);
                          }}
                          disabled={isPurchasing}
                        >
                          {isPurchasing ? "Processing..." : "Become a Founding Citizen"}
                        </Button>
                        <Button
                          className="w-full h-11 font-medium"
                          variant="pill"
                          onClick={() => {
                            setSelectedProperty(property);
                            setCalculatorOpen(true);
                          }}
                        >
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
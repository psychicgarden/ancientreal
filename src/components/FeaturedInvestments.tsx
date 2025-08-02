import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import villaTulum from "@/assets/villa-tulum.jpg";
import beachChalet from "@/assets/beach-chalet.jpg";
import coworkingParis from "@/assets/coworking-paris.jpg";

const FeaturedInvestments = () => {
  const { isConnected, purchaseTokens, isPurchasing } = useWallet();

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
      type: "🔥 12% Annual Growth Market",
      name: "Mazunte Beachfront Mortgage",
      location: isConnected ? mazunteData.location : "Mexico • High-Growth Coastal Market",
      totalValue: isConnected ? mazunteData.totalValue : 150000,
      downPayment: isConnected ? mazunteData.downPayment : 30000,
      monthlyPayment: isConnected ? mazunteData.monthlyPayment : 1456,
      propertiesSold: 11,
      totalProperties: 15,
      mortgageTerm: "10 years",
      expectedReturn: isConnected ? 181 : 12, // Market growth rate
      image: villaTulum,
      isBlockchain: true
    },
    {
      type: "Coming Soon", 
      name: "Maldives Growth Market",
      location: "Maldives • 8% Growth Market", 
      totalValue: 280000,
      downPayment: 56000,
      monthlyPayment: 2712,
      propertiesSold: 8,
      totalProperties: 12,
      mortgageTerm: "10 years",
      expectedReturn: 8,
      image: beachChalet,
      isBlockchain: false
    },
    {
      type: "Coming Soon",
      name: "Paris Urban Mortgage",
      location: "Paris, France • 6% Growth Market",
      totalValue: 450000,
      downPayment: 90000, 
      monthlyPayment: 4370,
      propertiesSold: 3,
      totalProperties: 8,
      mortgageTerm: "10 years",
      expectedReturn: 6,
      image: coworkingParis,
      isBlockchain: false
    }
  ];

  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            High-Growth Global Markets
            <br />
            <span className="text-muted-foreground font-light">Same Process, Better Returns</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Access mortgages in the world's fastest-growing real estate markets. 
            Why settle for 4% when you can get 12%?
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
                <p className="text-muted-foreground mb-4">{property.location}</p>

                <div className="space-y-3 mb-6">
                  {property.isBlockchain ? (
                    <div className="bg-card/50 p-4 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Market Growth</span>
                        <span className="text-lg font-semibold text-green-500">{property.expectedReturn}% annually</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">(vs 4% in NYC)</div>
                      
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm text-muted-foreground">Entry Point</span>
                        <span className="text-xl font-bold">${property.downPayment.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">(vs $160K in NYC)</div>
                      
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm text-muted-foreground">Property Value</span>
                        <span className="text-lg font-semibold">${property.totalValue.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">(vs $800K in NYC)</div>
                      
                      <div className="mt-4 pt-3 border-t border-border/50">
                        <div className="text-sm font-semibold text-primary mb-1">5-Year Projection:</div>
                        <div className="text-sm text-muted-foreground">
                          ${property.totalValue.toLocaleString()} → ${Math.round(property.totalValue * Math.pow(1.12, 5)).toLocaleString()} 
                          <span className="text-green-500 font-semibold"> (+${Math.round(property.totalValue * (Math.pow(1.12, 5) - 1)).toLocaleString()} profit)</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Plus: ${property.monthlyPayment.toLocaleString()}/month mortgage income
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-card/50 p-4 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Market Growth</span>
                        <span className="text-lg font-semibold">{property.expectedReturn}% annually</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-muted-foreground">Entry Point</span>
                        <span className="text-xl font-bold">${property.downPayment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-muted-foreground">Property Value</span>
                        <span className="text-lg font-semibold">${property.totalValue.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {property.isBlockchain ? (
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={purchaseTokens}
                      disabled={isPurchasing || !isConnected}
                    >
                      {isPurchasing 
                        ? "Processing..." 
                        : !isConnected 
                          ? "Connect Wallet to Purchase"
                          : "Apply for This Mortgage"
                      }
                    </Button>
                  ) : (
                    <Button className="w-full" size="lg" disabled>
                      Coming Soon - Tokenization
                    </Button>
                  )}
                  <Button className="w-full" variant="outline">
                    {property.isBlockchain ? "Download Market Report" : "Get Notified When Available"}
                  </Button>
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
    </section>
  );
};

export default FeaturedInvestments;
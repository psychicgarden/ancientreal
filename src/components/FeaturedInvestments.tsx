import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import villaTulum from "@/assets/villa-tulum.jpg";
import beachChalet from "@/assets/beach-chalet.jpg";
import coworkingParis from "@/assets/coworking-paris.jpg";

const FeaturedInvestments = () => {
  const properties = [
    {
      type: "Loft",
      name: "Art Deco Loft",
      location: "Bahia, Brazil",
      totalValue: 150000,
      pricePerShare: 150,
      sharesLeft: 234,
      fundingProgress: 77,
      expectedReturn: 14.2,
      image: villaTulum
    },
    {
      type: "Atelier", 
      name: "Coastal Atelier",
      location: "Mazunte, Mexico", 
      totalValue: 150000,
      downPayment: 30000,
      monthlyPayment: 950,
      occupancyRate: 92,
      expectedReturn: 16.8,
      image: beachChalet
    },
    {
      type: "Coliving",
      name: "BOHO Creative Coliving Centre",
      location: "Paris, France",
      totalValue: 2200000,
      pricePerShare: 2200, 
      sharesLeft: 250,
      fundingProgress: 75,
      expectedReturn: 18.2,
      image: coworkingParis
    }
  ];

  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            🏡 Dream Homes Available
            <br />
            <span className="text-foreground">With Just 20% Down</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            <strong className="text-primary">Don't wait for "someday"</strong> - Your perfect home is here, waiting for you. 
            These aren't just properties, they're <em>lifestyle investments</em> in your future happiness. 
            <span className="text-accent font-semibold">Starting from just $30K down.</span>
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
                </div>
                
                {property.downPayment ? (
                  // Mortgage format for Coastal Atelier
                  <>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">🔥 High Demand</span>
                        <span className="text-sm font-semibold text-orange-500">{property.occupancyRate}% Booked</span>
                      </div>
                      <Progress value={property.occupancyRate} className="h-2" />
                    </div>

                    <h3 className="text-xl font-semibold mb-1">{property.name}</h3>
                    <p className="text-muted-foreground mb-4">📍 {property.location}</p>

                    <div className="space-y-3 mb-6">
                      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border-l-4 border-accent">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-primary">Total Price:</span>
                          <span className="text-2xl font-bold">${property.totalValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-muted-foreground">You only need:</span>
                          <span className="text-xl font-bold text-accent">${property.downPayment.toLocaleString()} down</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-muted-foreground">Monthly payment:</span>
                          <span className="text-lg font-semibold">${property.monthlyPayment}/mo</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <span className="text-sm font-medium">💰 ROI Potential:</span>
                        <span className="font-bold text-green-600 dark:text-green-400">{property.expectedReturn}% annually</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold py-3 shadow-lg transform hover:scale-105 transition-all duration-200" size="lg">
                        🚀 Secure This Dream Home NOW
                      </Button>
                      <Button className="w-full" variant="outline" size="lg">
                        💳 Apply for Mortgage
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        ⏰ <strong>Limited time:</strong> Lock in today's rates before they rise
                      </p>
                    </div>
                  </>
                ) : (
                  // Investment format for other properties
                  <>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Funding Progress</span>
                        <span className="text-sm font-semibold">{property.fundingProgress}% Sold</span>
                      </div>
                      <Progress value={property.fundingProgress} className="h-2" />
                    </div>

                    <h3 className="text-xl font-semibold mb-1">{property.name}</h3>
                    <p className="text-muted-foreground mb-4">{property.location}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Value:</span>
                        <span className="font-semibold">${property.totalValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Per Share:</span>
                        <span className="font-semibold">${property.pricePerShare}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Shares Left:</span>
                        <span className="font-semibold">{property.sharesLeft} shares left</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Expected Return:</span>
                        <span className="font-semibold text-green-500">{property.expectedReturn}% expected return</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full" variant="default">
                        Invest Now
                      </Button>
                      <Button className="w-full" variant="outline">
                        20% Down Purchase
                      </Button>
                    </div>
                  </>
                )}
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
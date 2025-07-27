import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

const FeaturedInvestments = () => {
  const properties = [
    {
      type: "Villa",
      name: "Boho Luxury Villa",
      location: "Tulum, Mexico",
      totalValue: 150000,
      pricePerShare: 150,
      sharesLeft: 234,
      fundingProgress: 77,
      expectedReturn: 14.2,
      image: "/placeholder.svg"
    },
    {
      type: "House", 
      name: "Modern Desert Oasis",
      location: "Bahia, Brazil", 
      totalValue: 140000,
      pricePerShare: 140,
      sharesLeft: 456,
      fundingProgress: 54,
      expectedReturn: 11.8,
      image: "/placeholder.svg"
    },
    {
      type: "Commercial",
      name: "Creative Coworking Space",
      location: "Mallorca, Spain",
      totalValue: 160000,
      pricePerShare: 160, 
      sharesLeft: 123,
      fundingProgress: 88,
      expectedReturn: 16.5,
      image: "/placeholder.svg"
    }
  ];

  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Featured Investment
            <br />
            Opportunities
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover hand-selected premium properties that blend luxury living with smart investment returns. Each property is carefully vetted for quality, location, and growth potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {properties.map((property, index) => (
            <Card key={index} className="bg-gradient-card border-accent/20">
              <CardContent className="p-6">
                <div className="aspect-video bg-muted rounded-lg mb-4 relative">
                  <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
                    {property.type}
                  </Badge>
                </div>
                
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
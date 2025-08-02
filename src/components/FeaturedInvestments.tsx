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
      type: "Atelier",
      name: "Coastal Atelier",
      location: "Mazunte, Mexico",
      totalValue: 150000,
      downPayment: 30000,
      monthlyPayment: 1456,
      propertiesSold: 11,
      totalProperties: 15,
      mortgageTerm: "10 years",
      expectedReturn: 16.8,
      image: villaTulum
    },
    {
      type: "Villa", 
      name: "Ocean Villa Retreat",
      location: "Maldives", 
      totalValue: 280000,
      downPayment: 56000,
      monthlyPayment: 2712,
      propertiesSold: 8,
      totalProperties: 12,
      mortgageTerm: "10 years",
      expectedReturn: 15.2,
      image: beachChalet
    },
    {
      type: "Residence",
      name: "Urban Creative Residence",
      location: "Paris, France",
      totalValue: 450000,
      downPayment: 90000, 
      monthlyPayment: 4370,
      propertiesSold: 3,
      totalProperties: 8,
      mortgageTerm: "10 years",
      expectedReturn: 18.2,
      image: coworkingParis
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

                <div className="space-y-2">
                  <Button className="w-full" size="lg">
                    Apply for Financing
                  </Button>
                  <Button className="w-full" variant="outline">
                    Schedule Viewing
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
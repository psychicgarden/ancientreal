import PropertyCard from "./PropertyCard";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import { Button } from "@/components/ui/button";

const properties = [
  {
    id: "1",
    image: property1,
    title: "Boho Luxury Villa",
    location: "Tulum, Mexico",
    price: 150000,
    sharePrice: 150,
    totalShares: 1000,
    availableShares: 234,
    expectedReturn: 14.2,
    type: "Villa",
  },
  {
    id: "2", 
    image: property2,
    title: "Modern Desert Oasis",
    location: "Bahia, Brazil",
    price: 140000,
    sharePrice: 140,
    totalShares: 1000,
    availableShares: 456,
    expectedReturn: 11.8,
    type: "House",
  },
  {
    id: "3",
    image: property3,
    title: "Creative Coworking Space",
    location: "Mallorca, Spain",
    price: 160000,
    sharePrice: 160,
    totalShares: 1000,
    availableShares: 123,
    expectedReturn: 16.5,
    type: "Commercial",
  },
];

const FeaturedProperties = () => {
  return (
    <section id="properties" className="py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="mb-6">
            Featured Investment
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Opportunities
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover hand-selected premium properties that blend luxury living with smart investment returns. 
            Each property is carefully vetted for quality, location, and growth potential.
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="px-12">
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
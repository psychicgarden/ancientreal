import OriginalPropertyCard from "./OriginalPropertyCard";
import { useMortgageProperties } from "@/hooks/useMortgageProperties";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedProperties = () => {
  const { properties: mortgageProperties, loading } = useMortgageProperties();

  // Transform mortgage properties to match OriginalPropertyCard props
  const properties = mortgageProperties.map((property) => ({
    id: property.id,
    image: property.image,
    title: property.name,
    location: property.location,
    price: property.totalValue,
    sharePrice: Math.round(property.totalValue / 1000), // $129K -> $129 per share
    totalShares: 1000,
    availableShares: 1000, // All shares available for new properties
    expectedReturn: property.expectedReturn,
    type: "Villa",
  }));

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
          {loading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : (
            properties.map((property) => (
              <OriginalPropertyCard key={property.id} {...property} />
            ))
          )}
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
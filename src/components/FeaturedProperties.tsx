import OriginalPropertyCard from "./OriginalPropertyCard";
import { PROPERTIES_CATALOG } from "@/lib/propertiesCatalog";
import { Button } from "@/components/ui/button";

// Only show original properties that haven't been purchased and fractionalized
const properties = PROPERTIES_CATALOG.slice(0, 3).map((p) => ({
  id: p.id,
  image: p.image,
  title: p.name,
  location: p.location,
  price: p.totalValue,
  sharePrice: p.sharePrice ?? Math.round(p.totalValue / 1000),
  totalShares: p.totalShares ?? 1000,
  availableShares: p.availableShares ?? 1000, // All shares available for new properties
  expectedReturn: p.expectedReturn ?? 15,
  type: "Villa",
}));

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
            <OriginalPropertyCard key={property.id} {...property} />
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
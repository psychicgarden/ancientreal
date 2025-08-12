import VillagePropertyCard from "./VillagePropertyCard";
import { VILLAGE_PROPERTIES_CATALOG } from "@/lib/villagePropertiesCatalog";
import { Button } from "@/components/ui/button";

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
          {VILLAGE_PROPERTIES_CATALOG.map((property) => (
            <VillagePropertyCard key={property.id} {...property} />
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
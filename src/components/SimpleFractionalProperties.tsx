import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, Users } from "lucide-react";
import FractionalInvestmentModal from "./FractionalInvestmentModal";
import { useFractionalProperties } from "@/hooks/useFractionalProperties";
import { Skeleton } from "@/components/ui/skeleton";

export const SimpleFractionalProperties = () => {
  const { properties, loading } = useFractionalProperties();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [investmentModalOpen, setInvestmentModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-gradient-card border-accent/20">
            <CardContent className="p-0">
              <Skeleton className="aspect-video rounded-t-lg" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => {
          const availabilityPercent = (property.availableShares / property.totalShares) * 100;
          
          return (
            <Card 
              key={property.id} 
              className="bg-gradient-card border-accent/20 overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              <CardContent className="p-0">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="default" className="bg-primary text-primary-foreground">
                      Fractional Ownership
                    </Badge>
                    {availabilityPercent < 20 && (
                      <Badge variant="destructive">
                        Low Availability
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">{property.name}</h3>
                    <div className="flex items-center text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Property Value:</span>
                      <span className="text-lg font-semibold">${property.totalValue.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Share Price:</span>
                      <span className="text-xl font-bold text-primary">${property.sharePrice.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Available Shares:</span>
                      <span className="text-lg font-semibold text-green-500">
                        {property.availableShares.toLocaleString()} / {property.totalShares.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Expected Return:</span>
                      <span className="text-lg font-semibold text-blue-500 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {property.expectedReturn.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="bg-card/50 p-3 rounded-lg border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Investors
                        </span>
                        <span className="font-medium">
                          {Math.round((property.totalShares - property.availableShares) / 100)} people
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${100 - availabilityPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => {
                      // Transform property to match FractionalInvestmentModal interface
                      const transformedProperty = {
                        id: property.id,
                        name: property.name,
                        location: property.location,
                        originalPrice: property.totalValue,
                        currentSpeculationPrice: property.totalValue,
                        minInvestment: 50,
                        totalTokensAvailable: property.totalShares,
                        tokensSold: property.totalShares - property.availableShares,
                        ownerWalletAddress: '0x1234567890123456789012345678901234567890', // Mock owner
                        year10TriggerDate: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString(),
                        roi: property.expectedReturn,
                        imageUrl: property.image
                      };
                      setSelectedProperty(transformedProperty);
                      setInvestmentModalOpen(true);
                    }}
                    disabled={property.availableShares === 0}
                  >
                    {property.availableShares === 0 ? "Fully Funded" : "Buy Shares"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <FractionalInvestmentModal
        isOpen={investmentModalOpen}
        onOpenChange={setInvestmentModalOpen}
        property={selectedProperty}
      />
    </>
  );
};
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, TrendingUp, MapPin, DollarSign, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PropertyToken {
  id: string;
  propertyName: string;
  location: string;
  imageUrl: string;
  tokenPrice: number;
  totalTokens: number;
  tokensAvailable: number;
  expectedYield: number;
  propertyValue: number;
  monthlyRent: number;
  tokensSold: number;
}

export const PropertyTokenPurchase = () => {
  const [selectedProperty, setSelectedProperty] = useState<PropertyToken | null>(null);
  const [tokenAmount, setTokenAmount] = useState(100);
  const [propertyTokens, setPropertyTokens] = useState<PropertyToken[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPropertyTokens();
  }, []);

  const fetchPropertyTokens = async () => {
    try {
      const { data: fractionalProperties, error } = await supabase
        .from('property_fractionalization')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      // Mock property data since we don't have full property details in the database yet
      const mockProperties: PropertyToken[] = [
        {
          id: "1",
          propertyName: "Luxury Beach Villa - Tulum",
          location: "Tulum, Mexico",
          imageUrl: "/src/assets/villa-tulum.jpg",
          tokenPrice: 50,
          totalTokens: 1000000,
          tokensAvailable: 750000,
          expectedYield: 12,
          propertyValue: 2500000,
          monthlyRent: 8500,
          tokensSold: 250000,
        },
        {
          id: "2", 
          propertyName: "Modern Penthouse - Mexico City",
          location: "Roma Norte, Mexico City",
          imageUrl: "/src/assets/penthouse-mexico.jpg",
          tokenPrice: 75,
          totalTokens: 800000,
          tokensAvailable: 600000,
          expectedYield: 10,
          propertyValue: 3200000,
          monthlyRent: 12000,
          tokensSold: 200000,
        },
        {
          id: "3",
          propertyName: "Eco Jungle Lodge - Costa Rica", 
          location: "Manuel Antonio, Costa Rica",
          imageUrl: "/src/assets/jungle-lodge-costarica.jpg",
          tokenPrice: 25,
          totalTokens: 1200000,
          tokensAvailable: 900000,
          expectedYield: 15,
          propertyValue: 1800000,
          monthlyRent: 6200,
          tokensSold: 300000,
        }
      ];

      setPropertyTokens(mockProperties);
      setSelectedProperty(mockProperties[0]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching property tokens:', error);
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedProperty) return;

    const totalCost = tokenAmount * selectedProperty.tokenPrice;
    
    try {
      // Here would be the Web3 integration with SecondaryMarketplace contract
      console.log('Purchasing tokens:', {
        property: selectedProperty.propertyName,
        tokens: tokenAmount,
        cost: totalCost
      });

      toast({
        title: "Purchase Successful!",
        description: `You now own ${tokenAmount.toLocaleString()} tokens of ${selectedProperty.propertyName}`,
      });
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    }
  };

  const getTokensSoldPercentage = (property: PropertyToken) => {
    return (property.tokensSold / property.totalTokens) * 100;
  };

  const calculateOwnershipPercentage = (tokens: number, totalTokens: number) => {
    return ((tokens / totalTokens) * 100).toFixed(4);
  };

  const calculateMonthlyIncome = (tokens: number, property: PropertyToken) => {
    const ownershipPercentage = tokens / property.totalTokens;
    return (property.monthlyRent * ownershipPercentage).toFixed(2);
  };

  if (loading) {
    return <div className="text-center">Loading available properties...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Buy Property Tokens</h2>
        <p className="text-muted-foreground">Own fractions of premium real estate and earn rental income</p>
      </div>

      {/* Property Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {propertyTokens.map((property) => (
          <Card 
            key={property.id}
            className={`cursor-pointer transition-all ${
              selectedProperty?.id === property.id 
                ? 'ring-2 ring-primary border-primary' 
                : 'hover:shadow-md'
            }`}
            onClick={() => {
              setSelectedProperty(property);
              setTokenAmount(Math.max(100, Math.ceil(1000 / property.tokenPrice)));
            }}
          >
            <CardHeader className="pb-3">
              <div className="aspect-video rounded-lg overflow-hidden mb-3">
                <img 
                  src={property.imageUrl} 
                  alt={property.propertyName}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardTitle className="text-lg">{property.propertyName}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {property.location}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">${property.tokenPrice}</span>
                <Badge variant="secondary">{property.expectedYield}% Yield</Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tokens Sold</span>
                  <span>{Math.round(getTokensSoldPercentage(property))}%</span>
                </div>
                <Progress value={getTokensSoldPercentage(property)} className="h-2" />
              </div>

              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Property Value:</span>
                  <span className="font-medium">${property.propertyValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Rent:</span>
                  <span className="font-medium">${property.monthlyRent.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Purchase Interface */}
      {selectedProperty && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Purchase {selectedProperty.propertyName} Tokens
            </CardTitle>
            <CardDescription>
              Each token costs ${selectedProperty.tokenPrice} and represents fractional ownership
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Number of Tokens</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={1}
                  max={selectedProperty.tokensAvailable}
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border rounded-md text-lg"
                  placeholder="Enter token amount"
                />
                <Button 
                  variant="outline" 
                  onClick={() => setTokenAmount(Math.ceil(1000 / selectedProperty.tokenPrice))}
                >
                  $1K
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setTokenAmount(Math.ceil(5000 / selectedProperty.tokenPrice))}
                >
                  $5K
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                  <DollarSign className="h-3 w-3" />
                  Total Cost
                </div>
                <div className="text-lg font-bold">
                  ${(tokenAmount * selectedProperty.tokenPrice).toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                  <Users className="h-3 w-3" />
                  Ownership
                </div>
                <div className="text-lg font-bold">
                  {calculateOwnershipPercentage(tokenAmount, selectedProperty.totalTokens)}%
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                  <TrendingUp className="h-3 w-3" />
                  Monthly Income
                </div>
                <div className="text-lg font-bold text-green-600">
                  ${calculateMonthlyIncome(tokenAmount, selectedProperty)}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                  <Building2 className="h-3 w-3" />
                  Expected Yield
                </div>
                <div className="text-lg font-bold text-green-600">
                  {selectedProperty.expectedYield}%
                </div>
              </div>
            </div>

            <Button 
              onClick={handlePurchase} 
              className="w-full" 
              size="lg"
              disabled={tokenAmount > selectedProperty.tokensAvailable || tokenAmount < 1}
            >
              Buy {tokenAmount.toLocaleString()} Tokens for ${(tokenAmount * selectedProperty.tokenPrice).toLocaleString()}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Property tokens represent fractional ownership and generate rental income. Returns are subject to market conditions.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
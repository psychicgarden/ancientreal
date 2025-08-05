import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, TrendingUp, MapPin } from "lucide-react";
import { toast } from "sonner";

const featuredProperties = [
  {
    id: 1,
    name: "Beachfront Villa",
    location: "Tulum, Mexico",
    pricePerToken: 1000,
    expectedReturn: "12%",
    image: "/src/assets/villa-tulum.jpg",
    totalTokens: 100,
    soldTokens: 67
  },
  {
    id: 2,
    name: "Jungle Resort",
    location: "Bali, Indonesia",
    pricePerToken: 750,
    expectedReturn: "10%",
    image: "/src/assets/bali-jungle-resort.jpg",
    totalTokens: 150,
    soldTokens: 89
  },
  {
    id: 3,
    name: "Desert Oasis",
    location: "Morocco",
    pricePerToken: 500,
    expectedReturn: "8%",
    image: "/src/assets/desert-oasis-morocco.jpg",
    totalTokens: 200,
    soldTokens: 134
  }
];

export const SimpleTokenPurchase = () => {
  const [selectedProperty, setSelectedProperty] = useState(featuredProperties[0]);
  const [tokenAmount, setTokenAmount] = useState(1);

  const handlePurchase = () => {
    const totalCost = selectedProperty.pricePerToken * tokenAmount;
    toast.success(`Successfully purchased ${tokenAmount} tokens of ${selectedProperty.name} for $${totalCost.toLocaleString()}`);
  };

  const totalCost = selectedProperty.pricePerToken * tokenAmount;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Buy Property Tokens</h2>
        <p className="text-muted-foreground">Own a piece of premium real estate worldwide</p>
      </div>

      {/* Property Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featuredProperties.map((property) => (
          <Card 
            key={property.id} 
            className={`cursor-pointer transition-all ${
              selectedProperty.id === property.id 
                ? 'ring-2 ring-primary border-primary' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedProperty(property)}
          >
            <div className="aspect-video relative">
              <img 
                src={property.image} 
                alt={property.name}
                className="w-full h-full object-cover rounded-t-lg"
              />
              <Badge className="absolute top-2 right-2 bg-green-500">
                {property.expectedReturn} APY
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold">{property.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <MapPin className="h-3 w-3" />
                {property.location}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">${property.pricePerToken}</span>
                <span className="text-sm text-muted-foreground">
                  {property.soldTokens}/{property.totalTokens} sold
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Purchase Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Purchase {selectedProperty.name} Tokens
          </CardTitle>
          <CardDescription>
            Each token represents fractional ownership in this property
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tokens">Number of Tokens</Label>
              <Input
                id="tokens"
                type="number"
                min="1"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(Number(e.target.value))}
                className="text-lg"
              />
            </div>
            <div>
              <Label>Price per Token</Label>
              <div className="h-10 flex items-center text-lg font-semibold">
                ${selectedProperty.pricePerToken}
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-muted/50">
            <div className="flex justify-between items-center mb-2">
              <span>Total Cost:</span>
              <span className="text-2xl font-bold">${totalCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Expected Annual Return:</span>
              <span className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-3 w-3" />
                ${(totalCost * (parseFloat(selectedProperty.expectedReturn) / 100)).toLocaleString()}/year
              </span>
            </div>
          </div>

          <Button 
            onClick={handlePurchase} 
            className="w-full" 
            size="lg"
          >
            Buy {tokenAmount} Token{tokenAmount !== 1 ? 's' : ''} for ${totalCost.toLocaleString()}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, TrendingUp, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@/contexts/WalletContext";
import { supabase } from "@/integrations/supabase/client";
import NetworkGuard from "@/components/NetworkGuard";

import { PROPERTY_IMAGES } from "@/lib/assets";

// Use centralized image management
const images = PROPERTY_IMAGES;

type UIMarketProperty = {
  id: string;
  name: string;
  location: string;
  pricePerToken: number;
  expectedReturn: string;
  image: string;
  totalTokens: number;
  soldTokens: number;
  minInvestment: number;
  originalPrice: number;
};

export const SimpleTokenPurchase = () => {
  const { isConnected, account, connectWallet } = useWallet();
  const [properties, setProperties] = useState<UIMarketProperty[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<UIMarketProperty | null>(null);
  const [tokenAmount, setTokenAmount] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('property_fractionalization')
          .select('*')
          .eq('is_active', true);
        if (error) throw error;
        const mapped: UIMarketProperty[] = (data || []).map((p: any, idx: number) => {
          const price = Number(p.current_speculation_price) || Number(p.min_investment) || 100;
          const total = Number(p.total_tokens_available) || 1000;
          const sold = Number(p.tokens_sold) || 0;
          const expected = p.roi ? `${Number(p.roi)}%` : "10%";
          return {
            id: p.id,
            name: p.property_name || `Property ${idx + 1}`,
            location: p.property_location || "—",
            pricePerToken: price,
            expectedReturn: expected,
            image: images[idx % images.length],
            totalTokens: total,
            soldTokens: sold,
            minInvestment: Number(p.min_investment) || 50,
            originalPrice: Number(p.original_purchase_price) || price
          };
        });
        setProperties(mapped);
        if (mapped.length) setSelectedProperty(mapped[0]);
      } catch (err) {
        console.error('Failed to load properties', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'property_fractionalization' },
        (payload: any) => {
          const updated = payload.new;
          setProperties((prev) => prev.map((p) => p.id === updated.id ? {
            ...p,
            soldTokens: Number(updated.tokens_sold ?? p.soldTokens),
            pricePerToken: Number(updated.current_speculation_price ?? p.pricePerToken),
            totalTokens: Number(updated.total_tokens_available ?? p.totalTokens),
          } : p));
          setSelectedProperty((prev) => prev && prev.id === updated.id ? {
            ...prev,
            soldTokens: Number(updated.tokens_sold ?? prev.soldTokens),
            pricePerToken: Number(updated.current_speculation_price ?? prev.pricePerToken),
            totalTokens: Number(updated.total_tokens_available ?? prev.totalTokens),
          } : prev);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handlePurchase = async () => {
    if (!selectedProperty) return;
    if (!isConnected || !account) {
      toast({ title: 'Connect Wallet', description: 'Please connect your wallet to purchase tokens.' });
      await connectWallet();
      return;
    }

    const totalCost = selectedProperty.pricePerToken * tokenAmount;
    const remaining = selectedProperty.totalTokens - selectedProperty.soldTokens;

    if (tokenAmount < 1) {
      toast({ title: 'Invalid amount', description: 'Enter at least 1 token.', variant: 'destructive' });
      return;
    }

    if (tokenAmount > remaining) {
      toast({ title: 'Not enough availability', description: `Only ${remaining} tokens left.`, variant: 'destructive' });
      return;
    }

    if (totalCost < selectedProperty.minInvestment) {
      toast({ title: 'Below minimum investment', description: `Minimum investment is $${selectedProperty.minInvestment.toLocaleString()}.`, variant: 'destructive' });
      return;
    }
    console.log('Purchase clicked', { property: selectedProperty.name, tokens: tokenAmount, totalCost });

    try {
      const ownership = (tokenAmount / selectedProperty.totalTokens) * 100;
      const { error } = await supabase
        .from('fractional_investments')
        .insert({
          property_id: selectedProperty.id,
          investor_wallet_address: account.toLowerCase(),
          investment_amount: totalCost,
          token_amount: tokenAmount,
          ownership_percentage: ownership,
          original_property_price: selectedProperty.originalPrice,
          speculation_price: selectedProperty.pricePerToken,
          status: 'active'
        });

      if (error) throw error;

      try {
        await supabase
          .from('property_fractionalization')
          .update({
            tokens_sold: selectedProperty.soldTokens + tokenAmount
          })
          .eq('id', selectedProperty.id);
      } catch (e) {
        console.warn('Tokens sold update may be restricted by RLS policies:', e);
      }

      const updated = { ...selectedProperty, soldTokens: selectedProperty.soldTokens + tokenAmount };
      setSelectedProperty(updated);
      setProperties((prev) => prev.map(p => p.id === updated.id ? updated : p));

      toast({ title: 'Purchase successful', description: `Purchased ${tokenAmount} tokens of ${selectedProperty.name} for $${totalCost.toLocaleString()}` });
    } catch (e: any) {
      console.error('Purchase failed', e);
      toast({ title: 'Purchase failed', description: e.message || 'Please try again.', variant: 'destructive' });
    }
  };
  const totalCost = selectedProperty ? selectedProperty.pricePerToken * tokenAmount : 0;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Primary Market: Buy Property Tokens</h2>
        <p className="text-muted-foreground">Buy newly issued fractional tokens directly from the property issuer. This is the primary sale (not peer-to-peer resales).</p>
      </div>
      <NetworkGuard />
      {/* Property Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center text-muted-foreground py-6">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="col-span-3 text-center text-muted-foreground py-6">No properties available right now.</div>
        ) : (
          properties.map((property) => (
            <Card 
              key={property.id} 
              className={`cursor-pointer transition-all ${
                selectedProperty?.id === property.id 
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
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
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
          ))
        )}
      </div>

      {/* Purchase Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Purchase {selectedProperty?.name || 'Property'} Tokens
          </CardTitle>
          <CardDescription>
            Primary sale: each token represents newly issued fractional ownership, priced by the issuer.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tokens">Number of Tokens</Label>
              <Input
                id="tokens"
                type="number"
                min={1}
                value={tokenAmount}
                onChange={(e) => setTokenAmount(Math.floor(Math.max(0, Number(e.target.value))))}
                className="text-lg"
              />
              {selectedProperty && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Min investment: ${selectedProperty.minInvestment.toLocaleString()} • Available: {selectedProperty.totalTokens - selectedProperty.soldTokens} tokens
                </p>
              )}
            </div>
            <div>
              <Label>Price per Token</Label>
              <div className="h-10 flex items-center text-lg font-semibold">
                ${selectedProperty?.pricePerToken ?? 0}
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
                ${ (totalCost * ((parseFloat(selectedProperty?.expectedReturn || '0')) / 100)).toLocaleString() }/year
              </span>
            </div>
          </div>

          <Button 
            onClick={handlePurchase} 
            className="w-full" 
            size="lg"
            disabled={
              loading ||
              !selectedProperty ||
              tokenAmount < 1 ||
              (selectedProperty && (
                tokenAmount > (selectedProperty.totalTokens - selectedProperty.soldTokens) ||
                (selectedProperty.pricePerToken * tokenAmount) < selectedProperty.minInvestment
              ))
            }
          >
            {selectedProperty
              ? `Buy ${tokenAmount} Token${tokenAmount !== 1 ? 's' : ''} for $${totalCost.toLocaleString()}`
              : 'Select a property to buy tokens'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
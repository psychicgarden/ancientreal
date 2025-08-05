import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, MapPin, Calendar, DollarSign, Target, Clock } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PropertyAppreciation {
  id: string;
  property_id: string;
  original_purchase_price: number;
  current_speculation_price: number;
  year_10_trigger_date: string;
  tokens_available: number;
  tokens_sold: number;
  min_investment: number;
  property_name: string;
  property_location: string;
  image_url?: string;
  owner_wallet_address: string;
}

interface AppreciationInvestment {
  property_id: string;
  property_name: string;
  investment_amount: number;
  appreciation_tokens: number;
  potential_upside: number;
  upside_percentage: number;
}

export const PropertyAppreciationMarketplace = () => {
  const { isConnected, connectWallet, account } = useWallet();
  const { toast } = useToast();
  const [properties, setProperties] = useState<PropertyAppreciation[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyAppreciation | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [isInvesting, setIsInvesting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppreciationProperties();
  }, []);

  const fetchAppreciationProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('property_fractionalization')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching properties:', error);
        return;
      }

      // Transform data to match our interface
      const transformedProperties: PropertyAppreciation[] = data?.map(property => ({
        id: property.id,
        property_id: property.property_id,
        original_purchase_price: property.original_purchase_price,
        current_speculation_price: property.current_speculation_price,
        year_10_trigger_date: property.year_10_trigger_date,
        tokens_available: property.total_tokens_available - property.tokens_sold,
        tokens_sold: property.tokens_sold,
        min_investment: property.min_investment,
        property_name: `Investment Property ${property.property_id.slice(0, 8)}`,
        property_location: "Mexico",
        owner_wallet_address: property.owner_wallet_address
      })) || [];

      setProperties(transformedProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAppreciationMetrics = (property: PropertyAppreciation) => {
    const totalAppreciation = property.current_speculation_price - property.original_purchase_price;
    const appreciationPercentage = ((totalAppreciation / property.original_purchase_price) * 100);
    const yearsToTrigger = Math.floor((new Date(property.year_10_trigger_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 365));
    const annualizedReturn = appreciationPercentage / (10 - yearsToTrigger);
    
    return {
      totalAppreciation,
      appreciationPercentage: Math.max(0, appreciationPercentage),
      yearsToTrigger: Math.max(0, yearsToTrigger),
      annualizedReturn: Math.max(0, annualizedReturn)
    };
  };

  const handleInvestment = async () => {
    if (!selectedProperty || !investmentAmount || !isConnected || !account) {
      toast({
        title: "Connection Required",
        description: "Please connect your wallet to invest",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(investmentAmount);
    if (amount < selectedProperty.min_investment) {
      toast({
        title: "Minimum Investment Required",
        description: `Minimum investment is $${selectedProperty.min_investment}`,
        variant: "destructive"
      });
      return;
    }

    setIsInvesting(true);

    try {
      // Calculate appreciation tokens based on investment amount
      const appreciationTokens = (amount / selectedProperty.current_speculation_price) * 1000000;
      const ownershipPercentage = (appreciationTokens / 1000000) * 100;
      const metrics = calculateAppreciationMetrics(selectedProperty);
      const potentialGain = (amount * metrics.appreciationPercentage) / 100;

      // Store investment in database
      const { error } = await supabase
        .from('fractional_investments')
        .insert({
          property_id: selectedProperty.property_id,
          investor_wallet_address: account,
          investment_amount: amount,
          token_amount: appreciationTokens,
          ownership_percentage: ownershipPercentage,
          original_property_price: selectedProperty.original_purchase_price,
          speculation_price: selectedProperty.current_speculation_price,
          status: 'active'
        });

      if (error) {
        throw error;
      }

      // Update property fractionalization
      const { error: updateError } = await supabase
        .from('property_fractionalization')
        .update({
          tokens_sold: selectedProperty.tokens_sold + appreciationTokens
        })
        .eq('id', selectedProperty.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Investment Successful",
        description: `Invested $${amount} in ${selectedProperty.property_name} appreciation. Potential gain: $${potentialGain.toFixed(2)}`,
      });

      setInvestmentAmount('');
      setSelectedProperty(null);
      fetchAppreciationProperties(); // Refresh data
    } catch (error) {
      console.error('Investment error:', error);
      toast({
        title: "Investment Failed",
        description: "Unable to process investment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsInvesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading appreciation opportunities...</div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Appreciation Opportunities Available</h3>
          <p className="text-muted-foreground">
            Check back later for new property appreciation investment opportunities.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Property Appreciation Marketplace</h2>
          <p className="text-muted-foreground">
            Invest in the appreciation potential of specific properties
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700">
          {properties.length} Properties Available
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property List */}
        <div className="space-y-4">
          {properties.map((property) => {
            const metrics = calculateAppreciationMetrics(property);
            const availabilityPercentage = ((property.tokens_available / 1000000) * 100);
            
            return (
              <Card 
                key={property.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedProperty?.id === property.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedProperty(property)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{property.property_name}</h3>
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {property.property_location}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        Appreciation-only investment • No rental income
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      {metrics.annualizedReturn.toFixed(1)}% APY
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Original Price</div>
                      <div className="font-semibold">${property.original_purchase_price.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Current Value</div>
                      <div className="font-semibold">${property.current_speculation_price.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Appreciation</div>
                      <div className="font-semibold text-green-600">
                        {metrics.appreciationPercentage.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Years to Trigger</div>
                      <div className="font-semibold flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {metrics.yearsToTrigger}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Availability</span>
                      <span>{availabilityPercentage.toFixed(1)}% remaining</span>
                    </div>
                    <Progress value={100 - availabilityPercentage} className="h-2" />
                  </div>

                  <div className="mt-4 pt-3 border-t">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Min Investment: </span>
                      <span className="font-semibold">${property.min_investment}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Investment Interface */}
        {selectedProperty ? (
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Invest in {selectedProperty.property_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {(() => {
                const metrics = calculateAppreciationMetrics(selectedProperty);
                const investAmount = parseFloat(investmentAmount) || 0;
                const potentialGain = (investAmount * metrics.appreciationPercentage) / 100;
                
                return (
                  <>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Appreciation Potential</span>
                        <span className="font-semibold text-green-600">
                          {metrics.appreciationPercentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Annualized Return</span>
                        <span className="font-semibold">{metrics.annualizedReturn.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Time to Trigger</span>
                        <span className="font-semibold">{metrics.yearsToTrigger} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Min Investment</span>
                        <span className="font-semibold">${selectedProperty.min_investment}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Investment Amount</label>
                      <Input 
                        type="number"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                        placeholder={`Min $${selectedProperty.min_investment}`}
                        min={selectedProperty.min_investment}
                      />
                    </div>

                    {investAmount > 0 && (
                      <div className="bg-green-50 p-4 rounded-lg space-y-2">
                        <div className="text-sm font-medium text-green-800">Investment Preview</div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Investment Amount:</span>
                            <span className="font-semibold">${investAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Potential Gain:</span>
                            <span className="font-semibold text-green-600">
                              ${potentialGain.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Return:</span>
                            <span className="font-semibold">
                              ${(investAmount + potentialGain).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <Button 
                        className="w-full"
                        onClick={isConnected ? handleInvestment : connectWallet}
                        disabled={isInvesting || (isConnected && (!investmentAmount || parseFloat(investmentAmount) < selectedProperty.min_investment))}
                      >
                        {isInvesting 
                          ? "Processing Investment..." 
                          : !isConnected 
                            ? "Connect Wallet to Invest"
                            : `Invest in Appreciation`
                        }
                      </Button>

                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>• Gains distributed when property triggers 10-year appreciation event</p>
                        <p>• Appreciation shares can be traded on secondary market</p>
                        <p>• No rental income - appreciation only investment</p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        ) : (
          <Card className="h-fit">
            <CardContent className="p-8 text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Select a Property</h3>
              <p className="text-muted-foreground">
                Choose a property from the list to view investment details and potential returns.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
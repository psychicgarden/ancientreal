import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TrendingUp, MapPin, Users, DollarSign, Calculator, Crown, Award, Calendar, Star, Plane, Vote } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { useFractionalProperties } from "@/hooks/useFractionalProperties";
import { OwnerApprovalExplanation } from "@/components/OwnerApprovalExplanation";
import { InvestorTierStatus } from "@/components/InvestorTierStatus";
import { calculateTotalUserInvestments } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const PropertySharesInterface = () => {
  const { isConnected, connectWallet, account } = useWallet();
  const { toast } = useToast();
  const { properties, loading } = useFractionalProperties();
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [totalInvestment, setTotalInvestment] = useState(0);

  React.useEffect(() => {
    const fetchTotalInvestment = async () => {
      if (account) {
        try {
          const total = await calculateTotalUserInvestments(account, supabase);
          setTotalInvestment(total);
        } catch (error) {
          console.error('Error fetching total investment:', error);
        }
      }
    };
    
    fetchTotalInvestment();
  }, [account]);

  const calculateShares = (amount: number, sharePrice: number) => {
    return Math.floor(amount / sharePrice);
  };

  const calculateMonthlyIncome = (shares: number, monthlyRent: number, totalShares: number) => {
    return (shares / totalShares) * monthlyRent;
  };

  const handleInvestment = async () => {
    if (!selectedProperty || !investmentAmount || !account) {
      toast({
        title: "Missing Information",
        description: "Please select a property and enter an investment amount",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(investmentAmount);
    const shares = calculateShares(amount, selectedProperty.sharePrice);
    
    if (shares === 0) {
      toast({
        title: "Investment Too Small",
        description: `Minimum investment: $${selectedProperty.sharePrice.toFixed(2)}`,
        variant: "destructive"
      });
      return;
    }

    // Here you would implement the actual investment logic
    toast({
      title: "Investment Successful!",
      description: `Purchased ${shares} shares of ${selectedProperty.name}`,
    });
    
    setInvestmentAmount('');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-48 bg-muted rounded-lg"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Buy Property Shares</h3>
        <p className="text-muted-foreground">
          Purchase individual shares of rental properties. Start earning passive income immediately.
        </p>
      </div>

      {/* Ancient Investor Tier System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            Ancient Investor Tier System
          </CardTitle>
          <p className="text-muted-foreground">
            Unlock exclusive travel benefits and perks as you grow your investment portfolio
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bronze Nomad */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-600" />
                  <h3 className="font-semibold">Bronze Nomad</h3>
                </div>
                <Badge variant="outline" className="text-amber-600 border-amber-600">$500+</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>50% off 1 week stay per year</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span>Early access to new properties</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Annual Value: $500
                </div>
              </div>
            </div>

            {/* Silver Voyager */}
            <div className="border rounded-lg p-4 space-y-3 border-blue-200 bg-blue-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Silver Voyager</h3>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-600">$5,000+</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-muted-foreground" />
                  <span>1 free week per year</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>10% discount on all stays</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span>Priority booking access</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Annual Value: $2,500
                </div>
              </div>
            </div>

            {/* Gold Wayfarer */}
            <div className="border rounded-lg p-4 space-y-3 border-yellow-200 bg-yellow-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-semibold">Gold Wayfarer</h3>
                </div>
                <Badge variant="outline" className="text-yellow-600 border-yellow-600">$10,000+</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-muted-foreground" />
                  <span>2 free weeks per year</span>
                </div>
                <div className="flex items-center gap-2">
                  <Vote className="h-4 w-4 text-muted-foreground" />
                  <span>DAO voting rights</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Private investor events</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Annual Value: $5,000
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {account && selectedProperty && (
        <InvestorTierStatus 
          totalInvestmentAmount={Number(investmentAmount) || 0}
          propertyName={selectedProperty.property_name}
        />
      )}

      <OwnerApprovalExplanation />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property List */}
        <div className="lg:col-span-2 space-y-4">
          {properties.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No properties available for fractional investment</p>
              </CardContent>
            </Card>
          ) : (
            properties.map((property) => (
              <Card 
                key={property.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedProperty?.id === property.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedProperty(property)}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img 
                      src={property.image} 
                      alt={property.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">{property.name}</h4>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {property.location}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">
                            {property.expectedReturn.toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Annual Return</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Share Price</div>
                          <div className="font-semibold">${property.sharePrice.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Monthly Rent</div>
                          <div className="font-semibold">${property.monthlyRent.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Available</div>
                          <div className="font-semibold">{property.availableShares.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          <Users className="h-3 w-3 mr-1" />
                          {property.wholePropertiesSold} investors
                        </Badge>
                        <Badge className="bg-green-100 text-green-700">
                          Owner Listed
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Investment Panel */}
        <div className="space-y-4">
          {selectedProperty ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Investment Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Investment Amount</label>
                  <Input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder="Enter amount in USD"
                    className="mt-1"
                  />
                </div>

                {investmentAmount && parseFloat(investmentAmount) > 0 && (
                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium">Your Investment Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Shares Purchased:</span>
                        <span className="font-semibold">
                          {calculateShares(parseFloat(investmentAmount), selectedProperty.sharePrice)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Income:</span>
                        <span className="font-semibold text-green-600">
                          ${calculateMonthlyIncome(
                            calculateShares(parseFloat(investmentAmount), selectedProperty.sharePrice),
                            selectedProperty.monthlyRent,
                            selectedProperty.totalShares
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Annual ROI:</span>
                        <span className="font-semibold text-green-600">
                          {selectedProperty.expectedReturn.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {isConnected ? (
                  <Button 
                    onClick={handleInvestment}
                    className="w-full"
                    disabled={!investmentAmount || parseFloat(investmentAmount) <= 0}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Buy Shares
                  </Button>
                ) : (
                  <Button onClick={connectWallet} className="w-full">
                    Connect Wallet to Invest
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Select a property to see investment details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
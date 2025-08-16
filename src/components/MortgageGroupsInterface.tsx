import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Home, 
  Users, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Calculator,
  HandHeart,
  Clock,
  Target
} from "lucide-react";
import { useWallet } from '@/contexts/WalletContext';
import { toast } from 'sonner';
import { useMortgageProperties } from '@/hooks/useMortgageProperties';

interface MortgageGroupProperty {
  id: string;
  property_name: string;
  property_location: string;
  property_image_url: string;
  current_speculation_price: number;
  monthly_base_rent: number;
  group_size_limit: number;
  down_payment_per_person: number;
  mortgage_down_payment_total: number;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  property_description?: string;
  tokens_sold: number;
  total_tokens_available: number;
}

interface GroupMember {
  investor_wallet_address: string;
  investment_amount: number;
  ownership_percentage: number;
  investment_date: string;
}

export const MortgageGroupsInterface = () => {
  const { isConnected, account } = useWallet();
  const { properties: mortgageProps, loading } = useMortgageProperties();
  const [properties, setProperties] = useState<MortgageGroupProperty[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<MortgageGroupProperty | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [purchasing, setPurchasing] = useState(false);

  // Transform mortgage properties to match component interface
  useEffect(() => {
    if (mortgageProps.length > 0) {
      const transformedProperties: MortgageGroupProperty[] = mortgageProps.map(prop => ({
        id: prop.id,
        property_name: prop.name,
        property_location: prop.location,
        property_image_url: prop.image,
        current_speculation_price: prop.totalValue,
        monthly_base_rent: prop.monthlyRent,
        group_size_limit: 6, // Fixed group size for all properties
        down_payment_per_person: prop.downPayment / 6, // Divide 20% down payment by 6 people
        mortgage_down_payment_total: prop.downPayment,
        bedrooms: 3, // Default values for display
        bathrooms: 2,
        square_feet: 1200,
        property_description: `Beautiful ${prop.name} available for shared ownership`,
        tokens_sold: 0, // Start fresh
        total_tokens_available: 1000000 // Standard token amount
      }));
      
      setProperties(transformedProperties);
      if (transformedProperties.length > 0) {
        setSelectedProperty(transformedProperties[0]);
      }
    }
  }, [mortgageProps]);

  // Mock group members for demo (no database interaction)
  useEffect(() => {
    if (selectedProperty) {
      // Start with empty group members for demo
      setGroupMembers([]);
    }
  }, [selectedProperty]);

  const handleJoinGroup = async () => {
    if (!selectedProperty || !isConnected || !account) {
      toast.error('Please connect your wallet first');
      return;
    }

    const amount = parseFloat(investmentAmount);
    if (!amount || amount < selectedProperty.down_payment_per_person) {
      toast.error(`Minimum investment is $${selectedProperty.down_payment_per_person.toLocaleString()}`);
      return;
    }

    if (groupMembers.length >= selectedProperty.group_size_limit) {
      toast.error('This mortgage group is already full');
      return;
    }

    try {
      setPurchasing(true);

      // Calculate ownership percentage
      const ownershipPercentage = (amount / selectedProperty.mortgage_down_payment_total) * 100;

      // Simulate successful investment (demo mode - no database)
      setTimeout(() => {
        toast.success(`Successfully joined mortgage group! You now own ${ownershipPercentage.toFixed(1)}% of the property.`);
        setInvestmentAmount('');
        
        // Add member to local state for demo
        const newMember: GroupMember = {
          investor_wallet_address: account.toLowerCase(),
          investment_amount: amount,
          ownership_percentage: ownershipPercentage,
          investment_date: new Date().toISOString()
        };
        setGroupMembers([...groupMembers, newMember]);
        setPurchasing(false);
      }, 1500);

    } catch (error) {
      console.error('Error joining mortgage group:', error);
      toast.error('Failed to join mortgage group. Please try again.');
      setPurchasing(false);
    }
  };

  const calculateMonthlyIncome = (amount: number) => {
    if (!selectedProperty) return 0;
    const ownershipPercentage = (amount / selectedProperty.mortgage_down_payment_total) * 100;
    return (selectedProperty.monthly_base_rent * ownershipPercentage) / 100;
  };

  const getCurrentProgress = () => {
    if (!selectedProperty) return 0;
    const totalInvested = groupMembers.reduce((sum, member) => sum + member.investment_amount, 0);
    return (totalInvested / selectedProperty.mortgage_down_payment_total) * 100;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Shared Mortgage Opportunities</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join a small group of investors to collectively own rental properties. Share the down payment, own the property, earn rental income.
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge className="bg-green-100 text-green-700">Real Estate Ownership</Badge>
          <Badge className="bg-blue-100 text-blue-700">Shared Mortgages</Badge>
          <Badge className="bg-purple-100 text-purple-700">Monthly Rental Income</Badge>
        </div>
      </div>

      {/* Property Selection */}
      <div className="grid md:grid-cols-3 gap-4">
        {properties.map((property) => (
          <Card 
            key={property.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedProperty?.id === property.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedProperty(property)}
          >
            <CardContent className="p-4">
              <img 
                src={property.property_image_url} 
                alt={property.property_name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h3 className="font-semibold text-lg">{property.property_name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {property.property_location}
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Group Size:</span>
                  <span className="font-medium">{groupMembers.filter(m => properties.find(p => p.id === property.id)).length || 0}/{property.group_size_limit} people</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Your Share:</span>
                  <span className="font-medium">${property.down_payment_per_person.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedProperty && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <img 
                src={selectedProperty.property_image_url} 
                alt={selectedProperty.property_name}
                className="w-full h-64 object-cover rounded-lg"
              />
              
              <div>
                <h3 className="text-xl font-bold">{selectedProperty.property_name}</h3>
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {selectedProperty.property_location}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Property Value</Label>
                  <p className="font-semibold">${selectedProperty.current_speculation_price.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Monthly Rent</Label>
                  <p className="font-semibold">${selectedProperty.monthly_base_rent.toLocaleString()}</p>
                </div>
                {selectedProperty.bedrooms && (
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Bedrooms</Label>
                    <p className="font-semibold">{selectedProperty.bedrooms}</p>
                  </div>
                )}
                {selectedProperty.bathrooms && (
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Bathrooms</Label>
                    <p className="font-semibold">{selectedProperty.bathrooms}</p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Mortgage Group Details
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Total Down Payment</Label>
                    <p className="font-semibold">${selectedProperty.mortgage_down_payment_total.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Per Person</Label>
                    <p className="font-semibold">${selectedProperty.down_payment_per_person.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Group Progress</span>
                    <span>{groupMembers.length}/{selectedProperty.group_size_limit} members</span>
                  </div>
                  <Progress value={getCurrentProgress()} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    ${groupMembers.reduce((sum, member) => sum + member.investment_amount, 0).toLocaleString()} of ${selectedProperty.mortgage_down_payment_total.toLocaleString()} raised
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HandHeart className="h-5 w-5" />
                Join Mortgage Group
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Investment Calculator */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="investment-amount">Investment Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="investment-amount"
                      type="number"
                      placeholder={selectedProperty.down_payment_per_person.toString()}
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      className="pl-10"
                      min={selectedProperty.down_payment_per_person}
                      step="1000"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Minimum: ${selectedProperty.down_payment_per_person.toLocaleString()}
                  </p>
                </div>

                {investmentAmount && parseFloat(investmentAmount) > 0 && (
                  <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Your Investment Summary
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Ownership Share</Label>
                        <p className="font-semibold">
                          {((parseFloat(investmentAmount) / selectedProperty.mortgage_down_payment_total) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Monthly Income</Label>
                        <p className="font-semibold text-green-600">
                          ${calculateMonthlyIncome(parseFloat(investmentAmount)).toFixed(0)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Annual Income</Label>
                        <p className="font-semibold">
                          ${(calculateMonthlyIncome(parseFloat(investmentAmount)) * 12).toFixed(0)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Estimated ROI</Label>
                        <p className="font-semibold text-green-600">
                          {((calculateMonthlyIncome(parseFloat(investmentAmount)) * 12) / parseFloat(investmentAmount) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button 
                onClick={handleJoinGroup}
                disabled={!isConnected || purchasing || groupMembers.length >= selectedProperty.group_size_limit || !investmentAmount || parseFloat(investmentAmount) < selectedProperty.down_payment_per_person}
                className="w-full"
                size="lg"
              >
                {!isConnected ? 'Connect Wallet' : 
                 purchasing ? 'Processing...' :
                 groupMembers.length >= selectedProperty.group_size_limit ? 'Group Full' :
                 'Join Mortgage Group'}
              </Button>

              {/* Current Group Members */}
              {groupMembers.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Current Group Members ({groupMembers.length})
                  </h4>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {groupMembers.map((member, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted/30 rounded text-sm">
                        <span className="font-mono">
                          {member.investor_wallet_address.slice(0, 6)}...{member.investor_wallet_address.slice(-4)}
                        </span>
                        <div className="text-right">
                          <div className="font-semibold">{member.ownership_percentage.toFixed(1)}%</div>
                          <div className="text-muted-foreground">${member.investment_amount.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
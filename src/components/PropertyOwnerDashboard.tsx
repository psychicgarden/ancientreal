import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Building, DollarSign, MapPin, Eye, Settings, CheckCircle, Clock } from "lucide-react";

interface UserProperty {
  id: string;
  property_name: string;
  property_location: string;
  property_id?: number;
  purchase_price: number;
  image_url?: string;
  current_value: number;
  monthly_payment: number;
  remaining_balance: number;
  equity_percentage: number;
  is_active: boolean;
}

interface FractionalListing {
  id: string;
  property_name: string;
  property_location: string;
  current_speculation_price: number;
  monthly_base_rent: number;
  owner_approved_listing: boolean;
  owner_listing_date?: string;
  owner_set_valuation: boolean;
  tokens_sold: number;
  total_tokens_available: number;
}

export const PropertyOwnerDashboard = () => {
  const [userProperties, setUserProperties] = useState<UserProperty[]>([]);
  const [fractionalListings, setFractionalListings] = useState<FractionalListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<UserProperty | null>(null);
  const [listingForm, setListingForm] = useState({
    valuation: '',
    monthlyRent: '',
    description: '',
    enableListing: false
  });
  const { toast } = useToast();

  // Mock wallet address for demo
  const mockWalletAddress = "0xabcdef1234567890abcdef1234567890abcdef12";

  useEffect(() => {
    fetchUserProperties();
    fetchFractionalListings();
  }, []);

  const fetchUserProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('user_properties')
        .select('*')
        .eq('user_wallet_address', mockWalletAddress)
        .eq('is_active', true);

      if (error) throw error;
      setUserProperties(data || []);
    } catch (error) {
      console.error('Error fetching user properties:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your properties",
        variant: "destructive"
      });
    }
  };

  const fetchFractionalListings = async () => {
    try {
      const { data, error } = await supabase
        .from('property_fractionalization')
        .select('*')
        .eq('owner_wallet_address', mockWalletAddress);

      if (error) throw error;
      setFractionalListings(data || []);
    } catch (error) {
      console.error('Error fetching fractional listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async (property: UserProperty) => {
    setSelectedProperty(property);
    setListingForm({
      valuation: property.current_value.toString(),
      monthlyRent: (property.current_value * 0.015).toString(), // 1.5% monthly estimate
      description: `Beautiful ${property.property_name} located in ${property.property_location}`,
      enableListing: false
    });
  };

  const handleSubmitListing = async () => {
    if (!selectedProperty) return;

    try {
      const valuation = parseFloat(listingForm.valuation);
      const monthlyRent = parseFloat(listingForm.monthlyRent);

      // Check if listing already exists
      const existingListing = fractionalListings.find(
        listing => listing.property_name === selectedProperty.property_name &&
                  listing.property_location === selectedProperty.property_location
      );

      if (existingListing) {
        // Update existing listing
        const { error } = await supabase
          .from('property_fractionalization')
          .update({
            current_speculation_price: valuation,
            monthly_base_rent: monthlyRent,
            property_description: listingForm.description,
            owner_approved_listing: listingForm.enableListing,
            owner_listing_date: listingForm.enableListing ? new Date().toISOString() : null,
            owner_set_valuation: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingListing.id);

        if (error) throw error;
      } else {
        // Create new listing
        const { error } = await supabase
          .from('property_fractionalization')
          .insert({
            property_id: crypto.randomUUID(), // Generate UUID for property_id
            property_name: selectedProperty.property_name,
            property_location: selectedProperty.property_location,
            property_description: listingForm.description,
            owner_wallet_address: mockWalletAddress,
            current_speculation_price: valuation,
            original_purchase_price: selectedProperty.purchase_price,
            monthly_base_rent: monthlyRent,
            total_tokens_available: 1000000, // 1M tokens standard
            tokens_sold: 0,
            min_investment: 50,
            owner_approved_listing: listingForm.enableListing,
            owner_listing_date: listingForm.enableListing ? new Date().toISOString() : null,
            owner_set_valuation: true,
            year_10_trigger_date: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString(),
            property_image_url: selectedProperty.image_url || '/placeholder.svg'
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: listingForm.enableListing 
          ? "Property listed for fractional investment!" 
          : "Listing saved as draft",
      });

      setSelectedProperty(null);
      fetchFractionalListings();
    } catch (error) {
      console.error('Error creating/updating listing:', error);
      toast({
        title: "Error",
        description: "Failed to save listing",
        variant: "destructive"
      });
    }
  };

  const getListingStatus = (property: UserProperty) => {
    const listing = fractionalListings.find(
      l => l.property_name === property.property_name && 
           l.property_location === property.property_location
    );

    if (!listing) return { status: 'not_listed', badge: null };
    
    if (listing.owner_approved_listing) {
      return { 
        status: 'approved', 
        badge: <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Live</Badge> 
      };
    } else {
      return { 
        status: 'draft', 
        badge: <Badge className="bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3 mr-1" />Draft</Badge> 
      };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Property Owner Dashboard</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Manage your property portfolio and control which properties are available for fractional investment.
        </p>
      </div>

      {userProperties.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No Properties Found</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any properties in your portfolio yet.
            </p>
            <Button>Purchase Your First Property</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {userProperties.map((property) => {
            const listingStatus = getListingStatus(property);
            const listing = fractionalListings.find(
              l => l.property_name === property.property_name && 
                   l.property_location === property.property_location
            );

            return (
              <Card key={property.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {property.property_name}
                        {listingStatus.badge}
                      </CardTitle>
                      <div className="flex items-center text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.property_location}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCreateListing(property)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {listingStatus.status === 'not_listed' ? 'Create Listing' : 'Edit Listing'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Property Value</div>
                      <div className="font-semibold">${property.current_value.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Your Equity</div>
                      <div className="font-semibold text-green-600">{property.equity_percentage}%</div>
                    </div>
                    {listing && (
                      <div>
                        <div className="text-sm text-muted-foreground">Tokens Sold</div>
                        <div className="font-semibold">
                          {listing.tokens_sold.toLocaleString()} / {listing.total_tokens_available.toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Listing Form Modal */}
      {selectedProperty && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Configure Fractional Listing</CardTitle>
            <p className="text-muted-foreground">
              Set your property valuation and rental income for {selectedProperty.property_name}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valuation">Property Valuation</Label>
                <Input
                  id="valuation"
                  type="number"
                  value={listingForm.valuation}
                  onChange={(e) => setListingForm(prev => ({ ...prev, valuation: e.target.value }))}
                  placeholder="Enter property value"
                />
              </div>
              <div>
                <Label htmlFor="monthlyRent">Monthly Rental Income</Label>
                <Input
                  id="monthlyRent"
                  type="number"
                  value={listingForm.monthlyRent}
                  onChange={(e) => setListingForm(prev => ({ ...prev, monthlyRent: e.target.value }))}
                  placeholder="Enter monthly rent"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Property Description</Label>
              <Textarea
                id="description"
                value={listingForm.description}
                onChange={(e) => setListingForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your property for potential investors"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enableListing"
                checked={listingForm.enableListing}
                onCheckedChange={(checked) => setListingForm(prev => ({ ...prev, enableListing: checked }))}
              />
              <Label htmlFor="enableListing">
                Make this property available for fractional investment
              </Label>
            </div>

            {listingForm.enableListing && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Preview: Investor View</h4>
                <div className="text-sm text-blue-700">
                  <p>• Investment opportunity: ${listingForm.valuation}</p>
                  <p>• Expected monthly income: ${listingForm.monthlyRent}</p>
                  <p>• Estimated annual return: {listingForm.valuation && listingForm.monthlyRent ? 
                    ((parseFloat(listingForm.monthlyRent) * 12 / parseFloat(listingForm.valuation)) * 100).toFixed(1) : 0}%</p>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSubmitListing} className="flex-1">
                {listingForm.enableListing ? 'Publish Listing' : 'Save as Draft'}
              </Button>
              <Button variant="outline" onClick={() => setSelectedProperty(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
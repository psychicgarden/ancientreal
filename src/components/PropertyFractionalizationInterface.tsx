import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useSafeBorrowing } from '@/hooks/useSafeBorrowing';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { fromBase, toBase } from '@/lib/money';
import { Building, DollarSign, Percent, Users, MapPin, AlertTriangle } from 'lucide-react';

interface FractionalizationFormData {
  valuationUSD: number;
  equityPercentage: number;
  minInvestment: number;
  expectedMonthlyRent: number;
  description: string;
}

export const PropertyFractionalizationInterface = () => {
  const { properties, loading } = useSafeBorrowing();
  const { account, isConnected } = useWallet();
  const { toast } = useToast();
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [formData, setFormData] = useState<FractionalizationFormData>({
    valuationUSD: 0,
    equityPercentage: 50,
    minInvestment: 100,
    expectedMonthlyRent: 0,
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePropertySelect = (property: any) => {
    setSelectedProperty(property);
    const propertyValueUSD = fromBase(property.property.purchase_price_base);
    const estimatedRent = Math.round(propertyValueUSD * 0.008); // 0.8% monthly yield estimate
    
    setFormData({
      valuationUSD: propertyValueUSD,
      equityPercentage: 50,
      minInvestment: 100,
      expectedMonthlyRent: estimatedRent,
      description: `Premium ${property.property.property_name} available for fractional investment. Located in ${property.property.property_location}.`
    });
    setDialogOpen(true);
  };

  const handleSubmitFractionalization = async () => {
    if (!selectedProperty || !account) return;

    try {
      setIsSubmitting(true);

      const totalTokens = 1000000;
      const tokensForSale = Math.floor(totalTokens * (formData.equityPercentage / 100));
      
      const { error } = await supabase
        .from('property_fractionalization')
        .insert({
          owner_wallet_address: account.toLowerCase(),
          property_name: selectedProperty.property.property_name,
          property_location: selectedProperty.property.property_location,
          property_description: formData.description,
          property_image_url: selectedProperty.property.image_url,
          current_speculation_price: formData.valuationUSD,
          original_purchase_price: fromBase(selectedProperty.property.purchase_price_base),
          original_property_value: fromBase(selectedProperty.property.purchase_price_base),
          monthly_base_rent: formData.expectedMonthlyRent,
          min_investment: formData.minInvestment,
          total_tokens_available: tokensForSale,
          tokens_sold: 0,
          is_listed_fractionally: true,
          source_property_id: selectedProperty.property.id,
          investment_type: 'fractional_ownership',
          property_type: 'residential',
          property_id: crypto.randomUUID(),
          year_10_trigger_date: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString()
        });

      if (error) throw error;

      toast({
        title: "Property Listed Successfully!",
        description: `${formData.equityPercentage}% of your property is now available for fractional investment.`,
      });

      setDialogOpen(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error('Error listing property:', error);
      toast({
        title: "Error",
        description: "Failed to list property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please connect your wallet to view and list your properties for fractional investment.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="bg-gradient-card border-accent/20">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-48 bg-muted rounded-lg mb-4" />
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                <div className="h-10 bg-muted rounded w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <Alert>
        <Building className="h-4 w-4" />
        <AlertDescription>
          You don't own any properties yet. Purchase a property with a mortgage first to list it for fractional investment.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">List My Properties</h2>
        <p className="text-muted-foreground">
          Fractionally list your owned properties and earn from rental income and appreciation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map((borrowableProperty) => {
          const property = borrowableProperty.property;
          const equityUSD = fromBase(borrowableProperty.paidEquityBase);
          const propertyValueUSD = fromBase(property.purchase_price_base);
          const equityPercentage = (equityUSD / propertyValueUSD) * 100;

          return (
            <Card key={property.id} className="bg-gradient-card border-accent/20 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={property.image_url}
                  alt={property.property_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-background/80 text-foreground">
                    Your Property
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {property.property_name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {property.property_location}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Property Value:</span>
                    <div className="font-semibold">${propertyValueUSD.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Your Equity:</span>
                    <div className="font-semibold text-primary">${equityUSD.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Equity %:</span>
                    <div className="font-semibold">{equityPercentage.toFixed(1)}%</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Est. Monthly Rent:</span>
                    <div className="font-semibold text-green-600">${Math.round(propertyValueUSD * 0.008)}</div>
                  </div>
                </div>

                <Separator />

                <Dialog open={dialogOpen && selectedProperty?.property.id === property.id} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full" 
                      onClick={() => handlePropertySelect(borrowableProperty)}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      List for Fractional Investment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>List Property for Fractional Investment</DialogTitle>
                      <DialogDescription>
                        Set up your property for fractional ownership and start earning from multiple investors.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Property Overview */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">{selectedProperty?.property.property_name}</CardTitle>
                          <CardDescription>{selectedProperty?.property.property_location}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Current Value:</span>
                              <div className="font-semibold">${fromBase(selectedProperty?.property.purchase_price_base || 0).toLocaleString()}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Your Equity:</span>
                              <div className="font-semibold">${fromBase(selectedProperty?.paidEquityBase || 0).toLocaleString()}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Fractionalization Form */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="valuation">Property Valuation (USD)</Label>
                          <Input
                            id="valuation"
                            type="number"
                            value={formData.valuationUSD}
                            onChange={(e) => setFormData(prev => ({ ...prev, valuationUSD: Number(e.target.value) }))}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Set your property's current market value
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="equity">Equity Percentage to Sell (%)</Label>
                          <Input
                            id="equity"
                            type="number"
                            min="10"
                            max="80"
                            value={formData.equityPercentage}
                            onChange={(e) => setFormData(prev => ({ ...prev, equityPercentage: Number(e.target.value) }))}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            You'll retain {100 - formData.equityPercentage}% ownership
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="minInvestment">Minimum Investment (USD)</Label>
                          <Input
                            id="minInvestment"
                            type="number"
                            min="50"
                            value={formData.minInvestment}
                            onChange={(e) => setFormData(prev => ({ ...prev, minInvestment: Number(e.target.value) }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="rent">Expected Monthly Rent (USD)</Label>
                          <Input
                            id="rent"
                            type="number"
                            value={formData.expectedMonthlyRent}
                            onChange={(e) => setFormData(prev => ({ ...prev, expectedMonthlyRent: Number(e.target.value) }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="description">Property Description</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                          />
                        </div>
                      </div>

                      {/* Investment Summary */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Investment Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span>Property Valuation:</span>
                            <span className="font-semibold">${formData.valuationUSD.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Equity for Sale ({formData.equityPercentage}%):</span>
                            <span className="font-semibold text-primary">${((formData.valuationUSD * formData.equityPercentage) / 100).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>You Retain ({100 - formData.equityPercentage}%):</span>
                            <span className="font-semibold">${((formData.valuationUSD * (100 - formData.equityPercentage)) / 100).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Monthly Rental Income:</span>
                            <span className="font-semibold text-green-600">${formData.expectedMonthlyRent}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Your Monthly Share ({100 - formData.equityPercentage}%):</span>
                            <span className="font-semibold text-green-600">${Math.round((formData.expectedMonthlyRent * (100 - formData.equityPercentage)) / 100)}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSubmitFractionalization} 
                          disabled={isSubmitting}
                          className="flex-1"
                        >
                          {isSubmitting ? "Listing..." : "List Property"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
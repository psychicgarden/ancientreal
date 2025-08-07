import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/contexts/WalletContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Home, 
  Receipt,
  Clock,
  Coins,
  AlertCircle
} from "lucide-react";

interface RentalClaim {
  id: string;
  distribution_id: string;
  property_fractionalization_id: string;
  ownership_percentage: number;
  claimable_amount: number;
  claimed_amount: number;
  claimed_at: string | null;
  created_at: string;
  distribution: {
    distribution_date: string;
    total_rental_income: number;
    property_expenses: number;
    distributable_amount: number;
    expense_breakdown: any;
  };
}

interface PropertyRentalSummary {
  property_id: string;
  property_name: string;
  monthly_base_rent: number;
  total_claimable: number;
  total_claimed: number;
  unclaimed_distributions: number;
  last_distribution_date: string | null;
}

const RentalIncomeTracker: React.FC = () => {
  const { account, isConnected } = useWallet();
  const { toast } = useToast();
  const [rentalClaims, setRentalClaims] = useState<RentalClaim[]>([]);
  const [propertySummary, setPropertySummary] = useState<PropertyRentalSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && account) {
      fetchRentalData();
    }
  }, [isConnected, account]);

  const fetchRentalData = async () => {
    if (!account) return;
    
    try {
      // Fetch rental claims for this investor
      const { data: claims, error: claimsError } = await supabase
        .from('investor_rental_claims')
        .select(`
          *,
          distribution:rental_income_distributions!inner(
            distribution_date,
            total_rental_income,
            property_expenses,
            distributable_amount,
            expense_breakdown
          )
        `)
        .eq('investor_wallet_address', account.toLowerCase())
        .order('created_at', { ascending: false });

      if (claimsError) throw claimsError;
      setRentalClaims((claims as any) || []);

      // Aggregate property summary
      const summaryMap = new Map<string, PropertyRentalSummary>();
      
      (claims || []).forEach((claim: any) => {
        const propId = claim.property_fractionalization_id;
        if (!summaryMap.has(propId)) {
          summaryMap.set(propId, {
            property_id: propId,
            property_name: `Property ${propId.slice(0, 8)}`,
            monthly_base_rent: claim.distribution?.total_rental_income || 2050,
            total_claimable: 0,
            total_claimed: 0,
            unclaimed_distributions: 0,
            last_distribution_date: null
          });
        }
        
        const summary = summaryMap.get(propId)!;
        summary.total_claimable += claim.claimable_amount;
        summary.total_claimed += claim.claimed_amount;
        if (!claim.claimed_at) {
          summary.unclaimed_distributions += 1;
        }
        
        if (!summary.last_distribution_date || claim.distribution?.distribution_date > summary.last_distribution_date) {
          summary.last_distribution_date = claim.distribution?.distribution_date;
        }
      });
      
      setPropertySummary(Array.from(summaryMap.values()));
      
    } catch (error) {
      console.error('Error fetching rental data:', error);
      toast({
        title: "Error Loading Rental Data",
        description: "Failed to load your rental income information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRental = async (claimId: string, amount: number) => {
    if (!account || claiming) return;
    
    setClaiming(claimId);
    
    try {
      const { error } = await supabase
        .from('investor_rental_claims')
        .update({
          claimed_amount: amount,
          claimed_at: new Date().toISOString()
        })
        .eq('id', claimId);

      if (error) throw error;

      toast({
        title: "Rental Income Claimed! 🎉",
        description: `Successfully claimed $${amount.toFixed(2)} in rental income`,
      });

      // Refresh data
      await fetchRentalData();
      
    } catch (error) {
      console.error('Error claiming rental:', error);
      toast({
        title: "Claim Failed",
        description: "Failed to claim rental income. Please try again.",
        variant: "destructive"
      });
    } finally {
      setClaiming(null);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Coins className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Connect your wallet to view rental income</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading rental income data...</p>
        </CardContent>
      </Card>
    );
  }

  const totalUnclaimedAmount = rentalClaims
    .filter(claim => !claim.claimed_at)
    .reduce((sum, claim) => sum + claim.claimable_amount, 0);

  const totalClaimedAmount = rentalClaims
    .reduce((sum, claim) => sum + claim.claimed_amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unclaimed Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalUnclaimedAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Available to claim
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claimed</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalClaimedAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {propertySummary.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Generating income
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Property Summaries */}
      {propertySummary.map((property) => (
        <Card key={property.property_id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{property.property_name}</span>
              <Badge variant="secondary">
                ${property.monthly_base_rent}/month
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Claimable</p>
                <p className="font-semibold">${property.total_claimable.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Claimed</p>
                <p className="font-semibold">${property.total_claimed.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unclaimed</p>
                <p className="font-semibold text-orange-600">
                  {property.unclaimed_distributions} distributions
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Distribution</p>
                <p className="font-semibold">
                  {property.last_distribution_date 
                    ? new Date(property.last_distribution_date).toLocaleDateString()
                    : 'None'
                  }
                </p>
              </div>
            </div>
            
            <Progress 
              value={(property.total_claimed / property.total_claimable) * 100} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {((property.total_claimed / property.total_claimable) * 100).toFixed(1)}% claimed
            </p>
          </CardContent>
        </Card>
      ))}

      {/* Individual Claims */}
      <Card>
        <CardHeader>
          <CardTitle>Rental Income Claims</CardTitle>
        </CardHeader>
        <CardContent>
          {rentalClaims.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No rental income distributions yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Rental income is distributed monthly for properties you own
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {rentalClaims.map((claim) => (
                <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {new Date(claim.distribution.distribution_date).toLocaleDateString('en-US', { 
                            month: 'long', 
                            year: 'numeric' 
                          })} Distribution
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {claim.ownership_percentage.toFixed(4)}% ownership • 
                          Property {claim.property_fractionalization_id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right mr-4">
                    <p className="font-semibold">${claim.claimable_amount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      From ${claim.distribution.total_rental_income} total rent
                    </p>
                  </div>

                  {claim.claimed_at ? (
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      Claimed
                    </Badge>
                  ) : (
                    <Button
                      onClick={() => handleClaimRental(claim.id, claim.claimable_amount)}
                      disabled={claiming === claim.id}
                      size="sm"
                    >
                      {claiming === claim.id ? "Claiming..." : "Claim"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RentalIncomeTracker;
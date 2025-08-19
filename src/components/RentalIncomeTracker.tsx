import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/contexts/WalletContext";
import { supabase } from "@/integrations/supabase/client";
import { PROPERTIES_CATALOG } from "@/lib/propertiesCatalog";
import { 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Home, 
  Receipt,
  Clock,
  Coins,
  AlertCircle,
  Star,
  Users,
  Wifi,
  CalendarDays,
  BarChart3,
  MapPin,
  CheckCircle2,
  Zap,
  Camera,
  Heart
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
    income_source_breakdown?: any;
    airbnb_metrics?: any;
    booking_details?: any;
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

// Sample data for beautiful demo
const SAMPLE_RENTAL_DATA = {
  properties: [
    {
      id: "mazunte-mexico-villa",
      name: "Mallorca Beach Villa",
      location: "Mallorca, Spain",
      image: PROPERTIES_CATALOG[0].image,
      monthlyRent: 2850,
      occupancyRate: 92,
      avgNightlyRate: 180,
      rating: 4.9,
      totalBookings: 28,
      nightsBooked: 27,
      nextBooking: "Dec 15-22, 2024",
      unclaimedIncome: 478.50,
      totalClaimed: 2156.30,
      ownershipPercentage: 15.2
    },
    {
      id: "bahia-brazil-villa", 
      name: "Koh Phangan Ocean Villa",
      location: "Koh Phangan, Thailand",
      image: PROPERTIES_CATALOG[1].image,
      monthlyRent: 2650,
      occupancyRate: 88,
      avgNightlyRate: 165,
      rating: 4.8,
      totalBookings: 24,
      nightsBooked: 25,
      nextBooking: "Dec 28 - Jan 5",
      unclaimedIncome: 392.75,
      totalClaimed: 1873.20,
      ownershipPercentage: 12.8
    },
    {
      id: "ericeira-portugal-villa",
      name: "Corfu Coastal Villa", 
      location: "Corfu, Greece",
      image: PROPERTIES_CATALOG[2].image,
      monthlyRent: 3200,
      occupancyRate: 95,
      avgNightlyRate: 210,
      rating: 4.95,
      totalBookings: 31,
      nightsBooked: 29,
      nextBooking: "Jan 10-17, 2025",
      unclaimedIncome: 624.80,
      totalClaimed: 2987.40,
      ownershipPercentage: 18.6
    }
  ],
  recentClaims: [
    {
      id: "claim-1",
      propertyId: "ericeira-portugal-villa",
      month: "November 2024",
      amount: 624.80,
      totalIncome: 3200,
      status: "available",
      airbnbBookings: 2890,
      traditionalRent: 310,
      bookingCount: 31,
      occupancy: 95
    },
    {
      id: "claim-2", 
      propertyId: "mazunte-mexico-villa",
      month: "November 2024",
      amount: 478.50,
      totalIncome: 2850,
      status: "available",
      airbnbBookings: 2540,
      traditionalRent: 310,
      bookingCount: 28,
      occupancy: 92
    },
    {
      id: "claim-3",
      propertyId: "bahia-brazil-villa",
      month: "November 2024", 
      amount: 392.75,
      totalIncome: 2650,
      status: "available",
      airbnbBookings: 2340,
      traditionalRent: 310,
      bookingCount: 24,
      occupancy: 88
    }
  ]
};

const RentalIncomeTracker: React.FC = () => {
  const { account, isConnected } = useWallet();
  const { toast } = useToast();
  const [claiming, setClaiming] = useState<string | null>(null);

  // For demo purposes, we'll use sample data
  useEffect(() => {
    // Simulate loading delay for demo
    setTimeout(() => {
      // Data is already loaded via SAMPLE_RENTAL_DATA
    }, 1000);
  }, [isConnected, account]);

  const handleClaimRental = async (claimId: string, amount: number) => {
    if (claiming) return;
    
    setClaiming(claimId);
    
    // Simulate claiming process for demo
    setTimeout(() => {
      toast({
        title: "Rental Income Claimed! 🎉",
        description: `Successfully claimed $${amount.toFixed(2)} in rental income`,
      });
      setClaiming(null);
    }, 1500);
  };

  // Calculate totals from sample data
  const totalUnclaimedAmount = SAMPLE_RENTAL_DATA.properties.reduce((sum, property) => sum + property.unclaimedIncome, 0);
  const totalClaimedAmount = SAMPLE_RENTAL_DATA.properties.reduce((sum, property) => sum + property.totalClaimed, 0);
  const totalProperties = SAMPLE_RENTAL_DATA.properties.length;

  return (
    <div className="space-y-6">
      {/* Airbnb Integration Header */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 rounded-xl p-6 border border-red-100 dark:border-red-800/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Airbnb Integration</h2>
              <p className="text-sm text-muted-foreground">Real-time rental income from your property investments</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Synced
            </Badge>
            <Badge variant="outline" className="text-xs">DEMO</Badge>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-200 dark:border-emerald-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Available to Claim</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              ${totalUnclaimedAmount.toFixed(2)}
            </div>
            <p className="text-xs text-emerald-600/70">
              This month's earnings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Earned</CardTitle>
            <Receipt className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              ${totalClaimedAmount.toFixed(2)}
            </div>
            <p className="text-xs text-blue-600/70">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border-purple-200 dark:border-purple-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Properties</CardTitle>
            <Home className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {totalProperties}
            </div>
            <p className="text-xs text-purple-600/70">
              Active listings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
              4.9
            </div>
            <p className="text-xs text-amber-600/70">
              Guest satisfaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Beautiful Property Performance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {SAMPLE_RENTAL_DATA.properties.map((property) => (
          <Card key={property.id} className="overflow-hidden bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-950/50 shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Property Image Header */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={property.image} 
                alt={property.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-bold text-white mb-1">{property.name}</h3>
                <p className="text-sm text-white/90 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {property.location}
                </p>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge className="bg-red-500 hover:bg-red-600 text-white border-0">
                  <Wifi className="h-3 w-3 mr-1" />
                  Airbnb
                </Badge>
                <Badge variant="secondary" className="bg-white/90 text-gray-900">
                  {property.ownershipPercentage}%
                </Badge>
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                  <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                    ${property.unclaimedIncome.toFixed(0)}
                  </div>
                  <div className="text-xs text-emerald-600/70">Available</div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                    ${property.totalClaimed.toFixed(0)}
                  </div>
                  <div className="text-xs text-blue-600/70">Earned YTD</div>
                </div>
              </div>

              {/* Airbnb Performance */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Occupancy Rate</span>
                  <span className="text-sm font-bold">{property.occupancyRate}%</span>
                </div>
                <Progress value={property.occupancyRate} className="h-2" />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Avg Rate</span>
                    <span className="font-semibold">${property.avgNightlyRate}/night</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-semibold flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {property.rating}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Bookings</span>
                    <span className="font-semibold">{property.totalBookings} this month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Nights</span>
                    <span className="font-semibold">{property.nightsBooked} booked</span>
                  </div>
                </div>
              </div>

              {/* Next Booking */}
              <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-100 dark:border-purple-800/30">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Next Booking</span>
                </div>
                <p className="text-sm text-purple-600/80">{property.nextBooking}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Claimable Income Section */}
      <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border-emerald-200 dark:border-emerald-800/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <DollarSign className="h-5 w-5" />
              November 2024 Income Available
            </CardTitle>
            <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Ready to Claim
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {SAMPLE_RENTAL_DATA.recentClaims.map((claim) => {
              const property = SAMPLE_RENTAL_DATA.properties.find(p => p.id === claim.propertyId);
              if (!property) return null;
              
              return (
                <div key={claim.id} className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-emerald-100 dark:border-emerald-800/30 space-y-4">
                  {/* Property Header with Image */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <img 
                        src={property.image} 
                        alt={property.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">{property.name}</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {property.location} • {property.ownershipPercentage}% ownership
                          </p>
                        </div>
                        <Button
                          onClick={() => handleClaimRental(claim.id, claim.amount)}
                          disabled={claiming === claim.id}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          {claiming === claim.id ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                              Claiming...
                            </div>
                          ) : (
                            <>
                              <Zap className="h-4 w-4 mr-2" />
                              Claim ${claim.amount.toFixed(2)}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Income Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
                          <Home className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium">Airbnb Revenue</span>
                      </div>
                      <p className="text-xl font-bold text-blue-700 dark:text-blue-300">${claim.airbnbBookings}</p>
                      <p className="text-xs text-blue-600/70">{claim.bookingCount} bookings • {claim.occupancy}% occupancy</p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-green-500 flex items-center justify-center">
                          <Receipt className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium">Base Rent</span>
                      </div>
                      <p className="text-xl font-bold text-green-700 dark:text-green-300">${claim.traditionalRent}</p>
                      <p className="text-xs text-green-600/70">Monthly guaranteed</p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-purple-500 flex items-center justify-center">
                          <DollarSign className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium">Your Share</span>
                      </div>
                      <p className="text-xl font-bold text-purple-700 dark:text-purple-300">${claim.amount.toFixed(2)}</p>
                      <p className="text-xs text-purple-600/70">From ${claim.totalIncome} total</p>
                    </div>
                  </div>

                  {/* Airbnb Performance Metrics */}
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 rounded-lg p-4 border border-red-100 dark:border-red-800/30">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-6 w-6 rounded bg-red-500 flex items-center justify-center">
                        <Home className="h-3 w-3 text-white" />
                      </div>
                      <span className="font-medium text-red-700 dark:text-red-300">Airbnb Performance</span>
                      <Badge variant="outline" className="text-xs border-red-200 text-red-600">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        {property.rating}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-red-600/70">Avg Nightly Rate</p>
                        <p className="font-semibold text-red-700 dark:text-red-300">${property.avgNightlyRate}</p>
                      </div>
                      <div>
                        <p className="text-red-600/70">Nights Booked</p>
                        <p className="font-semibold text-red-700 dark:text-red-300">{property.nightsBooked}</p>
                      </div>
                      <div>
                        <p className="text-red-600/70">Guest Reviews</p>
                        <p className="font-semibold text-red-700 dark:text-red-300 flex items-center gap-1">
                          <Heart className="h-3 w-3 fill-current" />
                          {property.totalBookings} reviews
                        </p>
                      </div>
                      <div>
                        <p className="text-red-600/70">Next Booking</p>
                        <p className="font-semibold text-red-700 dark:text-red-300">Dec 15</p>
                      </div>
                    </div>
                  </div>

                  {/* Integration Status */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600">Airbnb API Connected</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Last synced: 2 hours ago
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RentalIncomeTracker;
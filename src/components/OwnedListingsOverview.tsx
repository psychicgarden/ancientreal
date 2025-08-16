import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useOwnedFractionalListings } from '@/hooks/useOwnedFractionalListings';
import { useWallet } from '@/contexts/WalletContext';
import { Building, DollarSign, Users, TrendingUp, MapPin, AlertTriangle } from 'lucide-react';

export const OwnedListingsOverview = () => {
  const { isConnected } = useWallet();
  const { listings, loading, error } = useOwnedFractionalListings();

  if (!isConnected) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please connect your wallet to view your fractional property listings.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">My Fractional Listings</h2>
          <p className="text-muted-foreground">Track your property listings and investor activity.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="bg-gradient-card border-accent/20">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-32 bg-muted rounded-lg mb-4" />
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Error loading your listings: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (listings.length === 0) {
    return (
      <Alert>
        <Building className="h-4 w-4" />
        <AlertDescription>
          You haven't listed any properties for fractional investment yet. Go to the "List My Property" section to get started.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">My Fractional Listings</h2>
        <p className="text-muted-foreground">
          Track your property listings and investor activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listings.map((listing) => {
          const soldPercentage = (listing.tokens_sold / listing.total_tokens_available) * 100;
          const remainingTokens = listing.total_tokens_available - listing.tokens_sold;
          const totalRaised = (listing.tokens_sold / listing.total_tokens_available) * listing.current_speculation_price;
          const ownerRentalShare = 100 - ((listing.tokens_sold / listing.total_tokens_available) * 100);
          const ownerMonthlyIncome = (listing.monthly_base_rent * ownerRentalShare) / 100;

          return (
            <Card key={listing.id} className="bg-gradient-card border-accent/20 overflow-hidden">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={listing.property_image_url}
                  alt={listing.property_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="default" className="bg-primary text-primary-foreground">
                    Listed
                  </Badge>
                  {soldPercentage === 100 && (
                    <Badge variant="secondary" className="bg-green-600 text-white">
                      Fully Funded
                    </Badge>
                  )}
                </div>
              </div>

              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {listing.property_name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {listing.property_location}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Investment Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Investment Progress</span>
                    <span className="text-sm font-medium">{soldPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={soldPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>${totalRaised.toLocaleString()} raised</span>
                    <span>${listing.current_speculation_price.toLocaleString()} goal</span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Property Value:
                    </span>
                    <div className="font-semibold">${listing.current_speculation_price.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Tokens Sold:
                    </span>
                    <div className="font-semibold">{listing.tokens_sold.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Monthly Rent:
                    </span>
                    <div className="font-semibold text-green-600">${listing.monthly_base_rent}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Your Monthly Share:</span>
                    <div className="font-semibold text-primary">${Math.round(ownerMonthlyIncome)}</div>
                  </div>
                </div>

                {/* Owner Retention Info */}
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Your Ownership:</span>
                    <span className="font-semibold">{ownerRentalShare.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-muted-foreground">Tokens Remaining:</span>
                    <span className="font-semibold">{remainingTokens.toLocaleString()}</span>
                  </div>
                </div>

                {/* Listing Date */}
                <div className="text-xs text-muted-foreground">
                  Listed on {new Date(listing.listing_date).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
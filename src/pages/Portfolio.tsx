import { useState, useEffect, useMemo, useRef } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link, useSearchParams } from "react-router-dom";
import { Wallet, Home, TrendingUp, Users, Calendar, DollarSign, Building, FileText, BarChart3, ChevronRight, Loader2 } from "lucide-react";
import { MultiPropertyMortgageDashboard } from "@/components/MultiPropertyMortgageDashboard";
import { PortfolioSummary } from "@/components/PortfolioSummary";
import { PropertyCard } from "@/components/PropertyCard";
import { EnhancedPortfolioAnalytics } from "@/components/EnhancedPortfolioAnalytics";
import { DeveloperInvestmentsAnalytics } from "@/components/DeveloperInvestmentsAnalytics";
import { TrustSignals } from "@/components/TrustSignals";
import { CompetitorComparison } from "@/components/CompetitorComparison";
// Removed PropertyModeToggle - keeping demo-only experience

import OneTimeReset from "@/components/admin/OneTimeReset";
import RentalIncomeTracker from "@/components/RentalIncomeTracker";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { shouldAllowPortfolioReset } from "@/config/demo";
import { getPropertyImage } from "@/lib/propertyImageMapping";

const Portfolio = () => {
  const { isConnected, account, connectWallet } = useWallet();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "properties");
  const [userProperties, setUserProperties] = useState<any[]>([]);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);
  const [developerInvestments, setDeveloperInvestments] = useState<any[]>([]);
  // Removed fractional investments - focusing on mortgage-only functionality
  const [loading, setLoading] = useState(true);
  const [showAllProperties, setShowAllProperties] = useState(false);
  // Removed propertyMode - keeping demo-only experience

  // Debug logging for state changes
  useEffect(() => {
    console.log('🔍 Portfolio state changed:', {
      userProperties: userProperties.length,
      userTransactions: userTransactions.length,
      developerInvestments: developerInvestments.length,
      loading,
      account,
      isConnected
    });
  }, [userProperties, userTransactions, developerInvestments, loading, account, isConnected]);

  const propertiesSectionRef = useRef<HTMLDivElement | null>(null);
  const handleNavigateToProperties = (args?: { propertyId?: string; name?: string; location?: string }) => {
    setActiveTab('properties');
    setTimeout(() => {
      propertiesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Fetch user's properties and transactions from database
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isConnected || !account) {
        console.log('🚫 Not fetching data - isConnected:', isConnected, 'account:', account);
        setLoading(false);
        return;
      }

      console.log('🚀 Starting data fetch for account:', account);
      setLoading(true);
      try {
        // Fetch whole property mortgages from user_properties (using user_wallet_address)
        const { data: wholeProperties, error: propertiesError } = await supabase
          .from('user_properties')
          .select('*')
          .eq('user_wallet_address', account.toLowerCase())
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (propertiesError) {
          console.error('Error fetching user properties:', propertiesError);
          setUserProperties([]);
        } else {
          console.log('Whole property mortgages:', wholeProperties);
          setUserProperties(wholeProperties || []);
        }

        // Fetch user transactions
        const { data: transactions, error: txError } = await supabase
          .from('user_transactions')
          .select('*')
          .eq('user_wallet_address', account?.toLowerCase() ?? '')
          .order('created_at', { ascending: false });

        if (txError) {
          console.error('Error fetching transactions:', txError);
        } else {
          setUserTransactions(transactions || []);
        }

        // Fetch developer investments
        const { data: investments, error: investmentsError } = await supabase
          .from('developer_investments')
          .select(`
            *,
            developer_projects (
              title,
              description,
              creator_name,
              target_funding,
              current_funding,
              project_status,
              timeline,
              category,
              image_url
            )
          `)
          .eq('user_wallet_address', account?.toLowerCase() ?? '')
          .order('created_at', { ascending: false });

        if (investmentsError) {
          console.error('Error fetching developer investments:', investmentsError);
        } else {
          setDeveloperInvestments(investments || []);
        }

        // Removed fractional investments fetching - focusing on mortgage-only functionality
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({ title: 'Failed to load portfolio data', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Set up realtime subscription only if account exists
    if (account) {
      const channel = supabase
        .channel('portfolio-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_properties',
            filter: `user_wallet_address=eq.${account.toLowerCase()}`
          },
          (payload) => {
            console.log('📡 Real-time update received for user_properties:', payload);
            // Only refetch if not currently loading to prevent loops
            if (!loading) {
              setTimeout(() => fetchUserData(), 100); // Debounce refetch
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_transactions',
            filter: `user_wallet_address=eq.${account.toLowerCase()}`
          },
          () => {
            if (!loading) {
              setTimeout(() => fetchUserData(), 100);
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'developer_investments',
            filter: `user_wallet_address=eq.${account.toLowerCase()}`
          },
          () => {
            if (!loading) {
              setTimeout(() => fetchUserData(), 100);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isConnected, account]);

  // Deduplicate properties and normalize to latest row per unique purchase
  const uniqueUserProperties = useMemo(() => {
    const map = new Map<string, any>();
    for (const p of userProperties) {
      const key = p.unique_purchase_key || `${p.property_name}|${p.property_location}`;
      const existing = map.get(key);
      if (!existing) {
        map.set(key, p);
      } else {
        const a = new Date(existing.updated_at || existing.created_at || 0).getTime();
        const b = new Date(p.updated_at || p.created_at || 0).getTime();
        if (b >= a) map.set(key, p);
      }
    }
    return Array.from(map.values());
  }, [userProperties]);

  // Use all properties - demo-only experience
  const filteredUniqueProperties = uniqueUserProperties;

  // Convert database properties to display format with proper status logic  
  const displayProperties = filteredUniqueProperties.length > 0 ? filteredUniqueProperties.map(prop => {
    console.log('Processing property:', prop.property_name, 'is_active:', prop.is_active);
    const status: "mortgaged" | "pending" | "success" = prop.is_active ? "mortgaged" : "pending";
    return {
      id: prop.id,
      image: getPropertyImage(prop),
      title: prop.property_name,
      location: prop.property_location,
      status,
      value: prop.current_value,
      equity: (prop.current_value * prop.equity_percentage) / 100,
      monthlyIncome: prop.monthly_payment * 0.7,
      occupancyRate: 85,
      downPayment: prop.down_payment,
      mortgageId: prop.mortgage_id,
      uniquePurchaseKey: prop.unique_purchase_key,
      remainingBalance: prop.remaining_balance,
      isPending: status === "pending",
      failureReason: status === "pending" ? "Smart contract deployment required" : null
    };
  }) : [];

  // Removed property counts - demo-only experience

  const visibleProperties = displayProperties.slice(0, showAllProperties ? displayProperties.length : 7);
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Connect Your Wallet</h1>
            <p className="text-muted-foreground">
              Connect your wallet to view your property portfolio and investment details.
            </p>
          </div>
          <Button onClick={connectWallet} className="w-full" size="lg">
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Loading Portfolio</h1>
            <p className="text-muted-foreground">
              Fetching your properties and transactions from the blockchain...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate mortgage property values only
  const totalValue = displayProperties.reduce((sum, prop) => sum + prop.value, 0);
  const totalEquity = displayProperties.reduce((sum, prop) => sum + prop.equity, 0);
  const totalMonthlyIncome = displayProperties.reduce((sum, prop) => sum + prop.monthlyIncome, 0);
  const avgOccupancy = displayProperties.length > 0 ? displayProperties.reduce((sum, prop) => sum + prop.occupancyRate, 0) / displayProperties.length : 0;

  // Portfolio data for enhanced analytics (mortgage properties only)
  const totalInvestment = userProperties.reduce((sum, prop) => sum + prop.down_payment, 0) || 0;
  const portfolioData = {
    totalInvestment,
    currentValue: totalValue,
    availableProfits: Math.max(0, totalValue - totalInvestment),
    activeProperties: displayProperties.length,
    monthlyIncome: totalMonthlyIncome
  };

  const handlePropertyAction = (action: string, propertyId: string) => {
    toast({ title: action, description: `Action for property ${propertyId}` });
  };

  // New: Handlers for fractional actions
  const handleSellTokens = (investment: any) => {
    console.log('Sell Tokens clicked for investment:', investment?.id, investment);
    toast({
      title: 'Secondary Market',
      description: 'Token selling will open in the Secondary Marketplace soon.',
    });
  };

  const handleClaimIncome = async (investment: any) => {
    if (!account) return;
    console.log('Claim Income clicked for investment:', investment?.id, investment);
    // Attempt to check claimable rental income for this property
    const { data, error } = await supabase
      .from('investor_rental_claims')
      .select('claimable_amount, claimed_amount, distribution_id, created_at')
      .eq('investor_wallet_address', account)
      .eq('property_fractionalization_id', investment.property_id);

    if (error) {
      console.error('Error fetching rental claims:', error);
      toast({ title: 'Could not fetch claimable income', variant: 'destructive' });
      return;
    }

    const outstanding = (data || []).reduce((sum, row) => {
      const claimable = Number(row.claimable_amount || 0);
      const claimed = Number(row.claimed_amount || 0);
      return sum + Math.max(0, claimable - claimed);
    }, 0);

    if (outstanding > 0) {
      toast({
        title: 'Claim Ready',
        description: `You have $${outstanding.toFixed(2)} available to claim.`,
      });
    } else {
      toast({
        title: 'No Claimable Income Yet',
        description: 'We will notify you when a rental distribution is available.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Portfolio Reset Component - Only in Demo Mode */}
      {account && shouldAllowPortfolioReset() && <OneTimeReset wallet={account} />}
      
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <Link 
              to="/" 
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Portfolio</span>
          </nav>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Property Portfolio</h1>
              <p className="text-muted-foreground mt-1">
                Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total Portfolio Value</div>
                <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              </div>
              <Badge variant="secondary" className="text-green-600 bg-green-500/10">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% YTD
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-fit">
            <TabsTrigger value="properties" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              My Properties
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="developer-investments" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Developer Investments
            </TabsTrigger>
            <TabsTrigger value="mortgage" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Mortgage & Financing
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Bookings & Revenue
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Comparison
            </TabsTrigger>
          </TabsList>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            {/* Enhanced Portfolio Summary with Tier Status */}
            <PortfolioSummary portfolioData={portfolioData} />
            
            {/* Portfolio Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Real Estate Properties</p>
                      <p className="text-xl font-bold">{displayProperties.length}</p>
                    </div>
                    <Home className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                     <div>
                       <p className="text-sm text-muted-foreground">Total Equity</p>
                       <p className="text-xl font-bold">${totalEquity.toLocaleString()}</p>
                     </div>
                     <TrendingUp className="h-8 w-8 text-green-500" />
                   </div>
                 </CardContent>
               </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Income</p>
                      <p className="text-xl font-bold">${totalMonthlyIncome.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Properties</p>
                      <p className="text-xl font-bold">{displayProperties.length}</p>
                    </div>
                    <Home className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Occupancy</p>
                      <p className="text-xl font-bold">{avgOccupancy.toFixed(0)}%</p>
                    </div>
                    <Calendar className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Whole Properties Section */}
            <div ref={propertiesSectionRef}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Whole Properties</h2>
                <div className="flex gap-2">
                  {displayProperties.length > 7 && (
                    <Button variant="outline" onClick={() => setShowAllProperties(v => !v)}>
                      {showAllProperties ? 'Show less' : 'Show all'}
                    </Button>
                  )}
                  <Button>Add Property</Button>
                </div>
              </div>
              {filteredUniqueProperties.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="space-y-4">
                    <Home className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold">
                        No Properties Yet
                      </h3>
                      <p className="text-muted-foreground">
                        Visit Investment Access to purchase your first property
                      </p>
                    </div>
                    <Link to="/investor">
                      <Button>Browse Properties</Button>
                    </Link>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      {...property}
                      uniquePurchaseKey={property.uniquePurchaseKey}
                      mortgageId={property.mortgageId}
                      onManage={() => handlePropertyAction("Manage", property.id)}
                      onListForTravel={() => handlePropertyAction("List for Travel", property.id)}
                      onMakePayment={() => handlePropertyAction("Make Payment", property.id)}
                      onViewAnalytics={() => handlePropertyAction("View Analytics", property.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Removed fractional investments section - focusing on mortgage-only functionality */}
          </TabsContent>

          {/* Advanced Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Advanced Portfolio Analytics</h3>
              <Badge>Premium Analytics</Badge>
            </div>
            
            <EnhancedPortfolioAnalytics />
            
            <TrustSignals />
          </TabsContent>

          {/* Developer Investments Tab */}
          <TabsContent value="developer-investments" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Developer Investments</h3>
              <Badge variant="secondary">Active Tracking</Badge>
            </div>
            <DeveloperInvestmentsAnalytics />
          </TabsContent>

          {/* Mortgage & Financing Tab */}
          <TabsContent value="mortgage" className="space-y-6">
            <MultiPropertyMortgageDashboard 
              onNavigateToProperties={handleNavigateToProperties}
            />
          </TabsContent>

          {/* Bookings & Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <RentalIncomeTracker />
          </TabsContent>


          {/* Platform Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Why Boho Shares Leads the Market</h3>
              <Badge className="bg-primary/10 text-primary">Technical Leadership</Badge>
            </div>
            
            <CompetitorComparison />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Portfolio;

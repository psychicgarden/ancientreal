
import { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link, useSearchParams } from "react-router-dom";
import { Wallet, Home, TrendingUp, Users, Calendar, DollarSign, Building, FileText, BarChart3, ChevronRight, Loader2 } from "lucide-react";
import { InvestorMortgageDashboard } from "@/components/InvestorMortgageDashboard";
import { PortfolioSummary } from "@/components/PortfolioSummary";
import { PropertyCard } from "@/components/PropertyCard";
import { EnhancedPortfolioAnalytics } from "@/components/EnhancedPortfolioAnalytics";
import { DeveloperInvestmentsAnalytics } from "@/components/DeveloperInvestmentsAnalytics";
import { TrustSignals } from "@/components/TrustSignals";
import { CompetitorComparison } from "@/components/CompetitorComparison";
import { PlatformAnalytics } from "@/components/PlatformAnalytics";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";



const Portfolio = () => {
  const { isConnected, account, connectWallet } = useWallet();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "properties");
  const [userProperties, setUserProperties] = useState<any[]>([]);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);
  const [developerInvestments, setDeveloperInvestments] = useState<any[]>([]);
  const [fractionalInvestments, setFractionalInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's properties and transactions from database
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isConnected || !account) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch user properties (including failed purchases for transparency)
        const { data: properties, error: propError } = await supabase
          .from('user_properties')
          .select('*')
          .eq('user_wallet_address', account.toLowerCase())
          .order('created_at', { ascending: false });

        if (propError) {
          console.error('Error fetching properties:', propError);
        } else {
          setUserProperties(properties || []);
        }

        // Fetch user transactions
        const { data: transactions, error: txError } = await supabase
          .from('user_transactions')
          .select('*')
          .eq('user_wallet_address', account.toLowerCase())
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
          .eq('user_wallet_address', account.toLowerCase())
          .order('created_at', { ascending: false });

        if (investmentsError) {
          console.error('Error fetching developer investments:', investmentsError);
        } else {
          setDeveloperInvestments(investments || []);
        }

        // Fetch fractional investments via secure RPC to bypass RLS read issues
        const { data: fractionalData, error: fractionalError } = await supabase
          .rpc('get_user_fractional_investments', { wallet_address: account });

        if (fractionalError) {
          console.error('Error fetching fractional investments (RPC):', fractionalError);
        } else {
          const mapped = (fractionalData || []).map((row: any) => ({
            id: row.id,
            property_id: row.property_id,
            investor_wallet_address: row.investor_wallet_address,
            investment_amount: row.investment_amount,
            token_amount: row.token_amount,
            ownership_percentage: row.ownership_percentage,
            investment_date: row.investment_date,
            status: row.status,
            created_at: row.created_at,
            updated_at: row.updated_at,
            property_fractionalization: {
              property_name: row.property_name,
              property_location: row.property_location,
              property_image_url: row.property_image_url,
              current_speculation_price: row.current_speculation_price,
              monthly_base_rent: row.monthly_base_rent,
              total_tokens_available: row.total_tokens_available,
            },
          }));
          console.log('Fractional investments (RPC) mapped:', mapped);
          setFractionalInvestments(mapped);
        }
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
          () => {
            fetchUserData(); // Refetch data when changes occur
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
            fetchUserData(); // Refetch data when changes occur
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
            fetchUserData(); // Refetch data when changes occur
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'fractional_investments',
            filter: `investor_wallet_address=eq.${account}`
          },
          () => {
            fetchUserData(); // Refetch data when changes occur
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isConnected, account]);

  // Convert database properties to display format with proper status logic
  const displayProperties = userProperties.length > 0 ? userProperties.map(prop => {
    console.log('Processing property:', prop.property_name, 'is_active:', prop.is_active);
    
    // Now that the Art Deco Loft is reactivated, all active properties are "mortgaged"
    const status: "mortgaged" | "pending" | "success" = prop.is_active ? "mortgaged" : "pending";
    
    // Check if this property also has fractional investments to show additional ownership
    const hasAdditionalFractionalOwnership = fractionalInvestments.some(fi => 
      fi.property_fractionalization?.property_name === prop.property_name
    );
    
    // Calculate additional ownership from fractional investments
    const additionalOwnership = fractionalInvestments
      .filter(fi => fi.property_fractionalization?.property_name === prop.property_name)
      .reduce((sum, fi) => sum + (fi.ownership_percentage || 0), 0);
    
    return {
      id: prop.id,
      image: prop.image_url || "/src/assets/villa-bali.jpg",
      title: prop.property_name,
      location: prop.property_location,
      status,
      value: prop.current_value,
      equity: (prop.current_value * prop.equity_percentage) / 100,
      monthlyIncome: prop.monthly_payment * 0.7,
      occupancyRate: 85,
      downPayment: prop.down_payment,
      mortgageId: prop.mortgage_id,
      remainingBalance: prop.remaining_balance,
      isPending: status === "pending",
      failureReason: status === "pending" ? "Smart contract deployment required" : null,
      hasAdditionalFractionalOwnership,
      additionalOwnership: additionalOwnership
    };
  }) : [];

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

  // Calculate fractional investment values
  const fractionalValue = fractionalInvestments.reduce((sum, investment) => {
    const propertyValue = investment.property_fractionalization?.current_speculation_price || 0;
    const ownershipPercentage = investment.ownership_percentage || 0;
    return sum + (propertyValue * ownershipPercentage / 100);
  }, 0);

  const fractionalMonthlyIncome = fractionalInvestments.reduce((sum, investment) => {
    const monthlyRent = investment.property_fractionalization?.monthly_base_rent || 0;
    const ownershipPercentage = investment.ownership_percentage || 0;
    // Updated: assume 92% net of gross rent is distributable (aligned with backend)
    return sum + (monthlyRent * ownershipPercentage / 100 * 0.92);
  }, 0);

  const totalValue = displayProperties.reduce((sum, prop) => sum + prop.value, 0) + fractionalValue;
  const totalEquity = displayProperties.reduce((sum, prop) => sum + prop.equity, 0) + fractionalValue;
  const totalMonthlyIncome = displayProperties.reduce((sum, prop) => sum + prop.monthlyIncome, 0) + fractionalMonthlyIncome;
  const avgOccupancy = displayProperties.length > 0 ? displayProperties.reduce((sum, prop) => sum + prop.occupancyRate, 0) / displayProperties.length : 0;

  // Portfolio data for enhanced analytics
  const totalInvestment = (userProperties.reduce((sum, prop) => sum + prop.down_payment, 0) || 0) + 
    fractionalInvestments.reduce((sum, investment) => sum + investment.investment_amount, 0);
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
          <TabsList className="grid w-full grid-cols-7 lg:w-fit">
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
            <TabsTrigger value="platform" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Platform Analytics
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
                       <p className="text-sm text-muted-foreground">Fractional Investments</p>
                       <p className="text-xl font-bold">{fractionalInvestments.length}</p>
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
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Whole Properties</h2>
                <Button>Add Property</Button>
              </div>
              {userProperties.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="space-y-4">
                    <Home className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold">No Whole Properties Yet</h3>
                      <p className="text-muted-foreground">
                        Visit the Investor Portal to purchase your first property
                      </p>
                    </div>
                    <Link to="/investor">
                      <Button>Browse Properties</Button>
                    </Link>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      {...property}
                      onManage={() => handlePropertyAction("Manage", property.id)}
                      onListForTravel={() => handlePropertyAction("List for Travel", property.id)}
                      onMakePayment={() => handlePropertyAction("Make Payment", property.id)}
                      onViewAnalytics={() => handlePropertyAction("View Analytics", property.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Fractional Investments Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Fractional Investments ({fractionalInvestments.length})</h2>
                <Link to="/investor">
                  <Button variant="outline">Browse More</Button>
                </Link>
              </div>
              {fractionalInvestments.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="space-y-4">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold">No Fractional Investments Yet</h3>
                      <p className="text-muted-foreground">
                        Start with fractional real estate investments for as little as $50
                      </p>
                    </div>
                    <Link to="/investor">
                      <Button>Start Investing</Button>
                    </Link>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fractionalInvestments.map((investment) => (
                    <Card key={investment.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img 
                          src={investment.property_fractionalization?.property_image_url || "/src/assets/property-1.jpg"} 
                          alt={investment.property_fractionalization?.property_name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-2 right-2" variant="secondary">
                          {investment.ownership_percentage.toFixed(2)}% Owned
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">
                          {investment.property_fractionalization?.property_name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {investment.property_fractionalization?.property_location}
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Investment Amount:</span>
                            <span className="font-medium">${investment.investment_amount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Current Value:</span>
                            <span className="font-medium">
                              ${((investment.property_fractionalization?.current_speculation_price || 0) * investment.ownership_percentage / 100).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Monthly Income (est):</span>
                            <span className="font-medium text-green-600">
                              ${(((investment.property_fractionalization?.monthly_base_rent || 0) * investment.ownership_percentage / 100 * 0.92)).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tokens Owned:</span>
                            <span className="font-medium">{investment.token_amount.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => handleSellTokens(investment)}>
                            Sell Tokens
                          </Button>
                          <Button size="sm" className="flex-1" onClick={() => handleClaimIncome(investment)}>
                            Claim Income
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Advanced Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Advanced Portfolio Analytics</h3>
              <Badge>Premium Analytics</Badge>
            </div>
            
            <EnhancedPortfolioAnalytics 
              portfolioData={portfolioData} 
              userProperties={displayProperties.map(p => ({
                id: p.id,
                property_name: p.title,
                ownership_percentage: 100,
                current_value: p.value,
                investment_amount: p.downPayment
              }))}
              fractionalInvestments={fractionalInvestments.map(f => ({
                id: f.id,
                property_name: f.property_fractionalization?.property_name || 'Unknown Property',
                ownership_percentage: f.ownership_percentage,
                current_value: f.property_fractionalization?.current_speculation_price || 0,
                investment_amount: f.investment_amount
              }))}
            />
            
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
            <InvestorMortgageDashboard />
          </TabsContent>

          {/* Bookings & Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Revenue Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">This Month</p>
                      <p className="text-2xl font-bold text-green-600">$8,000</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">YTD Revenue</p>
                      <p className="text-2xl font-bold">$89,600</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Average Daily Rate</span>
                      <span className="font-semibold">$267</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Booking Conversion</span>
                      <span className="font-semibold">18.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Villa Tulum</p>
                        <p className="text-sm text-muted-foreground">Dec 15-22, 2024</p>
                      </div>
                      <Badge variant="secondary">$2,240</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Mykonos Beach House</p>
                        <p className="text-sm text-muted-foreground">Dec 28 - Jan 5</p>
                      </div>
                      <Badge variant="secondary">$4,200</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Platform Analytics Tab */}
          <TabsContent value="platform" className="space-y-6">
            <PlatformAnalytics />
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

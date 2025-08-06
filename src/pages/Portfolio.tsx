import { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Wallet, Home, TrendingUp, Users, Calendar, DollarSign, Building, FileText, BarChart3, ChevronRight, Loader2 } from "lucide-react";
import { InvestorMortgageDashboard } from "@/components/InvestorMortgageDashboard";
import { PortfolioSummary } from "@/components/PortfolioSummary";
import { PropertyCard } from "@/components/PropertyCard";
import { EnhancedPortfolioAnalytics } from "@/components/EnhancedPortfolioAnalytics";
import { DeveloperInvestmentsAnalytics } from "@/components/DeveloperInvestmentsAnalytics";
import { TrustSignals } from "@/components/TrustSignals";
import { CompetitorComparison } from "@/components/CompetitorComparison";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Sample property data - in real app this would come from API
const sampleProperties = [
  {
    id: "1",
    image: "/src/assets/villa-tulum.jpg",
    title: "Luxury Villa Tulum",
    location: "Tulum, Mexico",
    status: "mortgaged" as const,
    value: 450000,
    equity: 90000,
    monthlyIncome: 3200,
    occupancyRate: 85,
  },
  {
    id: "2", 
    image: "/src/assets/beach-house-mykonos.jpg",
    title: "Mykonos Beach House",
    location: "Mykonos, Greece",
    status: "hosted" as const,
    value: 680000,
    equity: 680000,
    monthlyIncome: 4800,
    occupancyRate: 78,
  },
  {
    id: "3",
    image: "/src/assets/apartment-nyc.jpg", 
    title: "Manhattan Penthouse",
    location: "New York, USA",
    status: "owned" as const,
    value: 1200000,
    equity: 1200000,
    monthlyIncome: 0,
    occupancyRate: 0,
  },
];

const Portfolio = () => {
  const { isConnected, account, connectWallet } = useWallet();
  const [activeTab, setActiveTab] = useState("properties");
  const [userProperties, setUserProperties] = useState<any[]>([]);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);
  const [developerInvestments, setDeveloperInvestments] = useState<any[]>([]);
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
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isConnected, account]);

  // Convert database properties to display format
  const displayProperties = userProperties.length > 0 ? userProperties.map(prop => ({
    id: prop.id,
    image: prop.image_url || "/src/assets/villa-bali.jpg", // Use database image_url or fallback
    title: prop.property_name,
    location: prop.property_location,
    status: prop.is_active ? "mortgaged" as const : "pending" as const,
    value: prop.current_value,
    equity: (prop.current_value * prop.equity_percentage) / 100,
    monthlyIncome: prop.monthly_payment * 0.7, // Estimate rental income
    occupancyRate: 85, // Default occupancy rate
    downPayment: prop.down_payment,
    mortgageId: prop.mortgage_id,
    remainingBalance: prop.remaining_balance,
    isPending: !prop.is_active, // Show if purchase failed/pending
    failureReason: prop.is_active ? null : "Smart contract deployment required"
  })) : sampleProperties; // Fallback to sample data if no real properties

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

  const totalValue = displayProperties.reduce((sum, prop) => sum + prop.value, 0);
  const totalEquity = displayProperties.reduce((sum, prop) => sum + prop.equity, 0);
  const totalMonthlyIncome = displayProperties.reduce((sum, prop) => sum + prop.monthlyIncome, 0);
  const avgOccupancy = displayProperties.length > 0 ? displayProperties.reduce((sum, prop) => sum + prop.occupancyRate, 0) / displayProperties.length : 0;

  // Portfolio data for enhanced analytics
  const totalInvestment = userProperties.reduce((sum, prop) => sum + prop.down_payment, 0) || 1500000;
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
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Legal & Documents
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Comparison
            </TabsTrigger>
          </TabsList>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
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
                      <p className="text-sm text-muted-foreground">Developer Investments</p>
                      <p className="text-xl font-bold">{developerInvestments.length}</p>
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

            {/* Property Cards Grid */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Properties</h2>
                <Button>Add Property</Button>
              </div>
              {userProperties.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="space-y-4">
                    <Home className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold">No Properties Yet</h3>
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
          </TabsContent>

          {/* Advanced Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Advanced Portfolio Analytics</h3>
              <Badge>Premium Analytics</Badge>
            </div>
            
            <EnhancedPortfolioAnalytics portfolioData={portfolioData} />
            
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

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Legal & Investment Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <FileText className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">Investment Agreement</div>
                      <div className="text-sm text-muted-foreground">Legal contract details</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <FileText className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">Property Deeds</div>
                      <div className="text-sm text-muted-foreground">Ownership documentation</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <FileText className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">Insurance Policies</div>
                      <div className="text-sm text-muted-foreground">Coverage details</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <FileText className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">Tax Documents</div>
                      <div className="text-sm text-muted-foreground">Annual statements</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
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
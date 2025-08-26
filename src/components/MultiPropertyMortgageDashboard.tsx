import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MortgagePaymentModal } from "@/components/MortgagePaymentModal";
import { fmtUSD, fromBase } from "@/lib/money";
import { PROPERTIES_CATALOG } from "@/lib/propertiesCatalog";
import { calculateMortgageMetrics, calculatePortfolioMetrics, MortgageData } from "@/lib/mortgageCalculations";
import { PropertyModeToggle, usePropertyMode, filterPropertiesByMode, getPropertyCounts } from "@/components/PropertyModeToggle";
import { 
  Building2, 
  DollarSign, 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  Home,
  CreditCard,
  CheckCircle2,
  Star,
  MapPin,
  PiggyBank,
  Clock,
  ChevronDown,
  ChevronUp,
  Filter,
  Eye,
  Target,
  BarChart3,
  LineChart
} from "lucide-react";

interface PropertyGroup {
  location: string;
  properties: PropertyMortgageData[];
  totalValue: number;
  totalDownPayment: number;
  totalMonthlyPayment: number;
  totalEquity: number;
  totalOutstanding: number;
}

interface PropertyMortgageData {
  id: string;
  name: string;
  location: string;
  image: string;
  purchasePrice: number;
  downPayment: number;
  remainingBalance: number;
  monthlyPayment: number;
  nextPaymentDue: Date;
  equity: number;
  isOverdue: boolean;
  daysPastDue: number;
  mortgageProgress: number;
  purchaseDate: Date;
  userProperty: any;
  metrics: {
    ownershipPercentage: number;
    timeToPayoff: string;
    loanToValueRatio: number;
    equityBuilt: number;
    remainingMonths: number;
    monthsElapsed: number;
  };
}

export const MultiPropertyMortgageDashboard = ({ 
  onNavigateToProperties
}: { 
  onNavigateToProperties?: () => void;
}) => {
  const { isConnected, account } = useWallet();
  const { toast } = useToast();
  
  const [properties, setProperties] = useState<PropertyMortgageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyMortgageData | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("overview");
  const [propertyMode, setPropertyMode] = usePropertyMode();

  useEffect(() => {
    const fetchMortgageData = async () => {
      if (!isConnected || !account) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const { data: userProperties, error } = await supabase
          .from('user_properties')
          .select('*')
          .eq('user_wallet_address', account.toLowerCase())
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        console.log('🔍 MultiPropertyMortgageDashboard - Database query result:', {
          account: account.toLowerCase(),
          userProperties,
          error,
          propertiesCount: userProperties?.length || 0
        });

        if (error) throw error;

        if (userProperties && userProperties.length > 0) {
          console.log('🎯 Found properties in database:', userProperties.map(p => ({
            name: p.property_name,
            uniquePurchaseKey: p.unique_purchase_key,
            mortgageId: p.mortgage_id,
            isDemo: p.unique_purchase_key?.startsWith('demo_') || p.mortgage_id?.startsWith('demo_')
          })));

          const transformedProperties: PropertyMortgageData[] = userProperties.map((property) => {
            const purchasePrice = (property as any).purchase_price_base ? 
              fromBase((property as any).purchase_price_base) : 
              Number(property.purchase_price || 0);
            
            // Get expected loan amount (80% of purchase price for most demos)
            const expectedLoanAmount = purchasePrice * 0.8;
            const actualLoanAmountBase = BigInt((property as any).loan_amount_base || Math.floor(expectedLoanAmount * 1000000));
            const actualLoanAmount = fromBase(actualLoanAmountBase);
            
            // Create mortgage data object for calculations
            const mortgageData: MortgageData = {
              loanAmountBase: actualLoanAmountBase,
              principalPaidBase: BigInt((property as any).principal_paid_base || 0),
              interestPaidBase: BigInt((property as any).interest_paid_base || 0),
              aprBps: Number((property as any).apr_bps || 800), // 8% APR
              termMonths: Number((property as any).term_months || 120), // 10 years
              purchaseDate: property.purchase_date
            };

            // Calculate accurate mortgage metrics
            const metrics = calculateMortgageMetrics(mortgageData, purchasePrice);
            
            console.log('🧮 DETAILED Mortgage calculation for', property.property_name, ':', {
              // Input data
              purchasePrice,
              purchasePriceBase: (property as any).purchase_price_base,
              loanAmountBase: actualLoanAmountBase.toString(),
              actualLoanAmount,
              expectedLoanAmount,
              aprBps: mortgageData.aprBps,
              termMonths: mortgageData.termMonths,
              
              // Calculated outputs
              calculatedMonthlyPayment: metrics.monthlyPayment,
              remainingBalance: metrics.remainingBalance,
              equityBuilt: metrics.equityBuilt,
              ownershipPercentage: metrics.ownershipPercentage,
              
              // Stored values (for comparison)
              storedMonthlyPayment: property.monthly_payment,
              storedRemainingBalance: property.remaining_balance,
              
              // Demo detection fields
              uniquePurchaseKey: property.unique_purchase_key,
              mortgageId: property.mortgage_id
            });
            
            // Get property details from catalog
            const catalogProperty = PROPERTIES_CATALOG.find(p => 
              p.name.toLowerCase().includes(property.property_name.toLowerCase().split(' ')[0]) ||
              property.property_name.toLowerCase().includes(p.name.toLowerCase().split(' ')[0])
            );

            return {
              id: property.id,
              name: property.property_name,
              location: property.property_location,
              image: catalogProperty?.image || '/placeholder.svg',
              purchasePrice,
              downPayment: purchasePrice - actualLoanAmount,
              remainingBalance: metrics.remainingBalance,
              monthlyPayment: metrics.monthlyPayment, // Use calculated value from proper amortization
              nextPaymentDue: metrics.nextPaymentDue,
              equity: metrics.equityBuilt,
              isOverdue: false, // TODO: Calculate based on payment history
              daysPastDue: 0,
              mortgageProgress: metrics.ownershipPercentage,
              purchaseDate: new Date(property.purchase_date),
              userProperty: {
                ...property, // Include ALL original property fields for demo detection
                id: property.id,
                user_wallet_address: property.user_wallet_address,
                unique_purchase_key: property.unique_purchase_key,
                mortgage_id: property.mortgage_id,
                principal_paid_base: property.principal_paid_base,
                interest_paid_base: property.interest_paid_base,
                property_name: property.property_name,
                property_location: property.property_location
              },
              metrics: {
                ownershipPercentage: metrics.ownershipPercentage,
                timeToPayoff: metrics.timeToPayoff,
                loanToValueRatio: metrics.loanToValueRatio,
                equityBuilt: metrics.equityBuilt,
                remainingMonths: metrics.remainingMonths,
                monthsElapsed: metrics.monthsElapsed
              }
            };
          });

          setProperties(transformedProperties);
        }
      } catch (error) {
        console.error('Error fetching mortgage data:', error);
        toast({
          title: "Data Loading Error",
          description: "Failed to load mortgage data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMortgageData();

    // Set up real-time subscription for mortgage payment updates
    const channel = supabase
      .channel('user_properties_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_properties',
          filter: `user_wallet_address=eq.${account?.toLowerCase()}`
        },
        () => {
          // Refetch data when properties are updated (e.g., after payments)
          fetchMortgageData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isConnected, account, toast]); // Removed refreshTrigger

  // Filter properties based on selected mode
  const filteredProperties = filterPropertiesByMode(properties, propertyMode);
  
  // Get property counts for the toggle
  const { onChainCount, demoCount } = getPropertyCounts(properties);

  // Group filtered properties by location
  const propertyGroups: PropertyGroup[] = filteredProperties.reduce((groups, property) => {
    const existingGroup = groups.find(g => g.location === property.location);
    
    if (existingGroup) {
      existingGroup.properties.push(property);
      existingGroup.totalValue += property.purchasePrice;
      existingGroup.totalDownPayment += property.downPayment;
      existingGroup.totalMonthlyPayment += property.monthlyPayment;
      existingGroup.totalEquity += property.equity;
      existingGroup.totalOutstanding += property.remainingBalance;
    } else {
      groups.push({
        location: property.location,
        properties: [property],
        totalValue: property.purchasePrice,
        totalDownPayment: property.downPayment,
        totalMonthlyPayment: property.monthlyPayment,
        totalEquity: property.equity,
        totalOutstanding: property.remainingBalance
      });
    }
    
    return groups;
  }, [] as PropertyGroup[]);

  // Calculate professional portfolio metrics
  const mortgageData = filteredProperties.map(p => ({
    loanAmountBase: BigInt((p.userProperty as any).loan_amount_base || 0),
    principalPaidBase: BigInt((p.userProperty as any).principal_paid_base || 0),
    interestPaidBase: BigInt((p.userProperty as any).interest_paid_base || 0),
    aprBps: Number((p.userProperty as any).apr_bps || 800),
    termMonths: Number((p.userProperty as any).term_months || 120),
    purchaseDate: p.userProperty.purchase_date,
    propertyValue: p.purchasePrice
  }));

  const portfolioMetrics = calculatePortfolioMetrics(mortgageData);
  
  // Portfolio totals (for backward compatibility)
  const portfolioTotals = {
    totalValue: portfolioMetrics.totalValue,
    totalDownPayment: portfolioMetrics.totalValue - portfolioMetrics.totalDebt - portfolioMetrics.totalPrincipalPaid,
    totalMonthlyPayment: portfolioMetrics.totalMonthlyPayment,
    totalEquity: portfolioMetrics.totalEquity,
    totalOutstanding: portfolioMetrics.totalDebt,
    averageProgress: portfolioMetrics.portfolioOwnership
  };

  const toggleGroupExpansion = (location: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(location)) {
      newExpanded.delete(location);
    } else {
      newExpanded.add(location);
    }
    setExpandedGroups(newExpanded);
  };

  const handleMakePayment = (property: PropertyMortgageData) => {
    // Ensure userProperty data is properly passed for demo detection
    const propertyWithUserData = {
      id: property.id,
      title: property.name,
      location: property.location,
      image: property.image,
      value: property.purchasePrice,
      monthlyPayment: property.monthlyPayment,
      remainingBalance: property.remainingBalance,
      userProperty: property.userProperty // This contains the database fields needed for demo detection
    };
    
    console.log('🔧 handleMakePayment - Passing property with userProperty:', {
      propertyId: property.id,
      propertyName: property.name,
      userProperty: property.userProperty,
      uniquePurchaseKey: property.userProperty?.unique_purchase_key,
      mortgageId: property.userProperty?.mortgage_id
    });
    
    setSelectedProperty(propertyWithUserData as any);
    setPaymentModalOpen(true);
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
          <CardDescription>Connect your wallet to view your mortgage portfolio</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Portfolio...</CardTitle>
          <CardDescription>Fetching your property mortgages</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (filteredProperties.length === 0 && !loading) {
    return (
      <div className="space-y-6">
        {/* Property Mode Toggle */}
        <PropertyModeToggle
          mode={propertyMode}
          onModeChange={setPropertyMode}
          onChainCount={onChainCount}
          demoCount={demoCount}
        />
        
        <Card>
          <CardHeader>
            <CardTitle>No {propertyMode === "onchain" ? "On-Chain" : "Demo"} Mortgages</CardTitle>
            <CardDescription>
              You don't have any {propertyMode === "onchain" ? "on-chain" : "demo"} mortgages. 
              {propertyMode === "onchain" ? " Consider purchasing a property!" : " Demo mortgages will appear here for testing."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Property Mode Toggle */}
      <PropertyModeToggle
        mode={propertyMode}
        onModeChange={setPropertyMode}
        onChainCount={onChainCount}
        demoCount={demoCount}
      />
      
      {/* Portfolio Summary Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-background via-muted/30 to-primary/5 border">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Mortgage Portfolio
              </h1>
              <p className="text-muted-foreground mb-6">
                Managing {filteredProperties.length} {propertyMode === "onchain" ? "on-chain" : "demo"} properties across {propertyGroups.length} locations
              </p>
              
              {/* Professional Portfolio Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-background/60 border">
                  <div className="text-2xl font-bold text-primary">
                    ${Math.round(portfolioMetrics.totalEquity).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Equity Built</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {portfolioMetrics.portfolioOwnership.toFixed(1)}% ownership
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-background/60 border">
                  <div className="text-2xl font-bold text-destructive">
                    ${Math.round(portfolioMetrics.totalDebt).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Remaining Balance</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {portfolioMetrics.portfolioLTV.toFixed(1)}% LTV
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-background/60 border">
                  <div className="text-2xl font-bold text-blue-600">
                    ${Math.round(portfolioMetrics.totalMonthlyPayment).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Monthly Payments</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    10-year mortgages
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-background/60 border">
                  <div className="text-2xl font-bold text-green-600">
                    {portfolioMetrics.averageTimeToPayoff}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Time to Payoff</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {portfolioMetrics.numberOfProperties} properties
                  </div>
                </div>
              </div>
            </div>
            
            {/* Professional Progress Circle */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-8 border-muted relative">
                <div 
                  className="absolute inset-0 rounded-full border-8 border-transparent border-t-primary"
                  style={{ 
                    transform: `rotate(${(portfolioMetrics.portfolioOwnership / 100) * 360}deg)`,
                    transition: 'transform 1s ease-in-out'
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {portfolioMetrics.portfolioOwnership.toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Ownership</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
          <TabsTrigger value="by-location">By Location</TabsTrigger>
          <TabsTrigger value="individual">Individual Properties</TabsTrigger>
        </TabsList>

        {/* Professional Analytics Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Properties Owned</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredProperties.length}</div>
                <p className="text-xs text-muted-foreground">
                  {propertyGroups.length} locations • 10-year mortgages
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolio LTV</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{portfolioMetrics.portfolioLTV.toFixed(1)}%</div>
                <Progress value={portfolioMetrics.portfolioLTV} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Loan-to-value ratio
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Principal Paid</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${Math.round(portfolioMetrics.totalPrincipalPaid).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  ${Math.round(portfolioMetrics.totalInterestPaid).toLocaleString()} interest paid
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time to Payoff</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{portfolioMetrics.averageTimeToPayoff}</div>
                <p className="text-xs text-muted-foreground">
                  Average across all properties
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Mortgage Progress by Property
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredProperties.map((property) => (
                  <div key={property.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{property.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {property.metrics.ownershipPercentage.toFixed(1)}% owned • {property.metrics.timeToPayoff} remaining
                        </div>
                      </div>
                      <Badge variant="outline">
                        {property.metrics.loanToValueRatio.toFixed(0)}% LTV
                      </Badge>
                    </div>
                    <Progress value={property.metrics.ownershipPercentage} className="h-3" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payment Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Monthly Payment</span>
                    <span className="font-semibold">${Math.round(portfolioMetrics.totalMonthlyPayment).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Principal Portion (~70%)</span>
                    <span className="font-semibold">${Math.round(portfolioMetrics.totalMonthlyPayment * 0.7).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Interest Portion (~30%)</span>
                    <span className="font-semibold">${Math.round(portfolioMetrics.totalMonthlyPayment * 0.3).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Interest to Date</span>
                      <span className="font-semibold">${Math.round(portfolioMetrics.totalInterestPaid).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* By Location Tab */}
        <TabsContent value="by-location" className="space-y-4">
          {propertyGroups.map((group) => (
            <Card key={group.location} className="overflow-hidden">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleGroupExpansion(group.location)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{group.location}</CardTitle>
                      <CardDescription>
                        {group.properties.length} properties • ${group.totalValue.toLocaleString()} total value
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">${group.totalMonthlyPayment.toLocaleString()}/mo</div>
                      <div className="text-xs text-muted-foreground">
                        ${group.totalOutstanding.toLocaleString()} outstanding
                      </div>
                    </div>
                    {expandedGroups.has(group.location) ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </div>
                </div>
              </CardHeader>
              
              {expandedGroups.has(group.location) && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-lg font-bold text-primary">
                        ${group.totalDownPayment.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Down Payments</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-lg font-bold text-green-600">
                        ${group.totalEquity.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Equity</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-lg font-bold">
                        {((group.totalEquity / group.totalValue) * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Equity Ratio</div>
                    </div>
                  </div>
                  
                    <div className="space-y-3">
                      {group.properties.map((property, index) => (
                        <div key={property.id} className="flex items-center justify-between p-4 rounded-lg border bg-background/60">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden">
                              <img 
                                src={property.image} 
                                alt={property.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {property.name} #{index + 1}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                ${Math.round(property.monthlyPayment).toLocaleString()}/mo • {property.metrics.ownershipPercentage.toFixed(1)}% owned
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {property.metrics.timeToPayoff} remaining • {property.metrics.loanToValueRatio.toFixed(0)}% LTV
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                ${Math.round(property.remainingBalance).toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">remaining</div>
                            </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleMakePayment(property)}
                          >
                            Pay
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </TabsContent>

        {/* Individual Properties Tab */}
        <TabsContent value="individual" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProperties.map((property, index) => (
              <Card key={property.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <img 
                        src={property.image} 
                        alt={property.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{property.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {property.location}
                      </CardDescription>
                      <Badge variant="secondary" className="mt-1">
                        Property #{index + 1}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Purchase Price:</span>
                      <p className="font-medium">${property.purchasePrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Down Payment:</span>
                      <p className="font-medium">${property.downPayment.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Monthly Payment:</span>
                      <p className="font-medium">${Math.round(property.monthlyPayment).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Remaining Balance:</span>
                      <p className="font-medium text-destructive">${Math.round(property.remainingBalance).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Mortgage Progress</span>
                      <span className="font-medium">{property.metrics.ownershipPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={property.metrics.ownershipPercentage} />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => handleMakePayment(property)}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Make Payment
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Payment Modal */}
      {paymentModalOpen && selectedProperty && (
        <MortgagePaymentModal
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedProperty(null);
          }}
          property={{
            id: selectedProperty.id,
            title: selectedProperty.name,
            location: selectedProperty.location,
            image: selectedProperty.image,
            value: selectedProperty.purchasePrice,
            monthlyPayment: selectedProperty.monthlyPayment,
            remainingBalance: selectedProperty.remainingBalance,
            userProperty: selectedProperty.userProperty
          }}
          onSuccess={() => {
            // Success handled by modal's internal refresh via real-time subscription
          }}
        />
      )}
    </div>
  );
};
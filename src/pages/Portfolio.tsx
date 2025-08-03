import { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Wallet, Home, TrendingUp, Users, Calendar, DollarSign, Building, FileText, BarChart3, ChevronRight } from "lucide-react";
import { InvestorMortgageDashboard } from "@/components/InvestorMortgageDashboard";
import { PortfolioSummary } from "@/components/PortfolioSummary";
import { PropertyCard } from "@/components/PropertyCard";
import { toast } from "sonner";

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

  const totalValue = sampleProperties.reduce((sum, prop) => sum + prop.value, 0);
  const totalEquity = sampleProperties.reduce((sum, prop) => sum + prop.equity, 0);
  const totalMonthlyIncome = sampleProperties.reduce((sum, prop) => sum + prop.monthlyIncome, 0);
  const avgOccupancy = sampleProperties.reduce((sum, prop) => sum + prop.occupancyRate, 0) / sampleProperties.length;

  const handlePropertyAction = (action: string, propertyId: string) => {
    toast.success(`${action} action for property ${propertyId}`);
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
          <TabsList className="grid w-full grid-cols-4 lg:w-fit">
            <TabsTrigger value="properties" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              My Properties
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
          </TabsList>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            {/* Portfolio Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      <p className="text-xl font-bold">{sampleProperties.length}</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleProperties.map((property) => (
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
            </div>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Portfolio;
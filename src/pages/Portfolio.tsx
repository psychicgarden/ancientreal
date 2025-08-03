import { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MAZUNTE_PROPERTY, CONTRACTS } from "@/lib/contracts";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Coins, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Shield, 
  ExternalLink,
  Wallet,
  FileText,
  BarChart3
} from "lucide-react";

const Portfolio = () => {
  const { 
    isConnected, 
    account, 
    connectWallet, 
    getMazunteInvestorDetails, 
    getMazuntePropertyStatus,
    claimRentalIncome,
    isInvestingInMazunte
  } = useWallet();
  
  const { toast } = useToast();
  const [investorData, setInvestorData] = useState<any>(null);
  const [propertyData, setPropertyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!isConnected) {
        setLoading(false);
        return;
      }

      try {
        const [investor, property] = await Promise.all([
          getMazunteInvestorDetails(),
          getMazuntePropertyStatus()
        ]);
        
        setInvestorData(investor);
        setPropertyData(property);
      } catch (error) {
        console.error('Failed to fetch portfolio data:', error);
        toast({
          title: "Data Loading Error",
          description: "Failed to load portfolio data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [isConnected, getMazunteInvestorDetails, getMazuntePropertyStatus, toast]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to view your Ancient investment portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={connectWallet} className="w-full">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  const ownershipPercentage = investorData ? (investorData.ownershipPercentage / 100) : 0;
  const monthlyRentalIncome = investorData ? Math.round((MAZUNTE_PROPERTY.MONTHLY_RENT * ownershipPercentage) / 100) : 0;
  const annualYield = investorData ? ((monthlyRentalIncome * 12 / investorData.investmentAmount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      {/* Header */}
      <div className="bg-card/50 border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Investment Portfolio</h1>
              <p className="text-muted-foreground mt-1">
                Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
              </p>
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
              <Shield className="h-3 w-3 mr-1" />
              Blockchain Secured
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contract">Smart Contract</TabsTrigger>
            <TabsTrigger value="income">Rental Income</TabsTrigger>
            <TabsTrigger value="legal">Legal Documents</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Investment Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${investorData?.investmentAmount.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {ownershipPercentage.toFixed(2)}% ownership
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    ${monthlyRentalIncome.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {annualYield.toFixed(1)}% annual yield
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Claimable Income</CardTitle>
                  <Coins className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    ${investorData?.claimableRental || '0'}
                  </div>
                  <Button 
                    size="sm" 
                    className="mt-2 w-full" 
                    onClick={claimRentalIncome}
                    disabled={!investorData?.claimableRental}
                  >
                    Claim Income
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Mazunte Beachfront Property
                </CardTitle>
                <CardDescription>
                  Luxury beachfront villa in Mazunte, Oaxaca, Mexico
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Mazunte, Oaxaca, Mexico</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Property Value</span>
                        <span className="font-medium">${MAZUNTE_PROPERTY.VALUE.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Monthly Rent</span>
                        <span className="font-medium">${MAZUNTE_PROPERTY.MONTHLY_RENT.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Management Fee</span>
                        <span className="font-medium">{MAZUNTE_PROPERTY.MANAGEMENT_FEE}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Funding Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {propertyData ? Math.round((propertyData.invested / propertyData.totalValue) * 100) : 0}%
                        </span>
                      </div>
                      <Progress 
                        value={propertyData ? (propertyData.invested / propertyData.totalValue) * 100 : 0} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        ${propertyData?.invested.toLocaleString() || '0'} of ${MAZUNTE_PROPERTY.VALUE.toLocaleString()} raised
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Smart Contract Tab */}
          <TabsContent value="contract" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Smart Contract Details
                </CardTitle>
                <CardDescription>
                  Your investment is secured by blockchain smart contracts on Avalanche
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Contract Addresses</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mazunte Mortgage:</span>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          {CONTRACTS.MAZUNTE_MORTGAGE.address.slice(0, 10)}...
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Village Citizenship:</span>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          {CONTRACTS.VILLAGE_CITIZENSHIP.address.slice(0, 10)}...
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rental Distribution:</span>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          {CONTRACTS.RENTAL_DISTRIBUTION.address.slice(0, 10)}...
                        </code>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Token Holdings</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">MAZIT Tokens:</span>
                        <span className="font-medium">{investorData?.tokenBalance.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ownership %:</span>
                        <span className="font-medium">{ownershipPercentage.toFixed(3)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Token Standard:</span>
                        <span className="font-medium">ERC-20</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Loan Terms</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground block">Interest Rate</span>
                      <span className="font-medium">{MAZUNTE_PROPERTY.MORTGAGE_RATE}% APR</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Term</span>
                      <span className="font-medium">{MAZUNTE_PROPERTY.MORTGAGE_TERM_YEARS} years</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Monthly Payment</span>
                      <span className="font-medium">$1,467</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Legal Entity</span>
                      <span className="font-medium">Ancient Holdings Ltd</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Avalanche Explorer
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rental Income Tab */}
          <TabsContent value="income" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Rental Income Tracking
                </CardTitle>
                <CardDescription>
                  Monthly rental income distribution and history
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                    <div className="text-sm text-green-600 dark:text-green-400">This Month</div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                      ${monthlyRentalIncome}
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 dark:text-blue-400">YTD Total</div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      ${(monthlyRentalIncome * 8).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
                    <div className="text-sm text-purple-600 dark:text-purple-400">Annual Projection</div>
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      ${(monthlyRentalIncome * 12).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Recent Distributions</h4>
                  {[...Array(6)].map((_, i) => {
                    const date = new Date();
                    date.setMonth(date.getMonth() - i);
                    return (
                      <div key={i} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <span className="font-medium">
                            {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </span>
                          <span className="text-sm text-muted-foreground block">
                            Rental distribution from Mazunte property
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-medium text-green-600">
                            +${monthlyRentalIncome}
                          </span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            Claimed
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Legal Documents Tab */}
          <TabsContent value="legal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Legal Documentation
                </CardTitle>
                <CardDescription>
                  Property deeds, contracts, and legal compliance documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { name: "Property Deed (Mexico)", status: "Verified", type: "Legal" },
                    { name: "Smart Contract ABI", status: "Active", type: "Technical" },
                    { name: "Nevis Corp Registration", status: "Valid", type: "Corporate" },
                    { name: "Investment Agreement", status: "Signed", type: "Contract" },
                    { name: "Rental Management Contract", status: "Active", type: "Management" },
                    { name: "Insurance Policy", status: "Current", type: "Insurance" }
                  ].map((doc, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{doc.name}</span>
                        <div className="text-sm text-muted-foreground">{doc.type}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          {doc.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Legal Structure</h4>
                  <p className="text-sm text-muted-foreground">
                    This property is owned by Ancient Holdings Ltd, a Nevis Corporation, and managed 
                    under Mexican real estate law. Your investment is secured by blockchain smart 
                    contracts on the Avalanche network, providing transparency and automated income distribution.
                  </p>
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
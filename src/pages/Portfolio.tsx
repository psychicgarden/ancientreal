import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/contexts/WalletContext";
import { InvestorMortgageDashboard } from "@/components/InvestorMortgageDashboard";
import Header from "@/components/Header";
import { 
  Wallet, 
  Building2, 
  TrendingUp, 
  FileText, 
  Shield,
  BarChart3,
  DollarSign
} from "lucide-react";

const Portfolio = () => {
  const { 
    isConnected, 
    account, 
    connectWallet,
    getMortgageDetails,
    getMazuntePropertyStatus
  } = useWallet();

  const [investorData, setInvestorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestorData = async () => {
      if (!isConnected) {
        setLoading(false);
        return;
      }

      try {
        const [mortgage, property] = await Promise.all([
          getMortgageDetails(),
          getMazuntePropertyStatus()
        ]);
        
        setInvestorData({ mortgage, property });
      } catch (error) {
        console.error('Failed to fetch investor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestorData();
  }, [isConnected, getMortgageDetails, getMazuntePropertyStatus]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
        <Header />
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <Wallet className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle>Connect Your Wallet</CardTitle>
                <CardDescription>
                  Connect your wallet to view your Ancient investment portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={connectWallet} className="w-full" size="lg">
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Header />
      
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
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Portfolio Value</div>
                <div className="text-2xl font-bold">
                  {investorData?.mortgage?.downPayment ? 
                    `$${investorData.mortgage.downPayment.toLocaleString()}` : 
                    '$0'
                  }
                </div>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="mortgage" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="mortgage">Mortgage</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Mortgage Tab */}
          <TabsContent value="mortgage">
            <InvestorMortgageDashboard />
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Property Portfolio
                </CardTitle>
                <CardDescription>
                  Your real estate investments and ownership stakes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Mazunte Art Deco Loft</h3>
                  <p className="text-muted-foreground mb-4">
                    Your first property investment in the Ancient network
                  </p>
                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                    <div className="text-center">
                      <div className="text-2xl font-bold">20%</div>
                      <div className="text-sm text-muted-foreground">Down Payment</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">10</div>
                      <div className="text-sm text-muted-foreground">Year Term</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">8%</div>
                      <div className="text-sm text-muted-foreground">Interest Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Legal Documents
                </CardTitle>
                <CardDescription>
                  Important legal and investment documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-semibold">Property Deed</div>
                      <div className="text-sm text-muted-foreground">Legal ownership documentation</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-semibold">Mortgage Agreement</div>
                      <div className="text-sm text-muted-foreground">Smart contract terms</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-semibold">Insurance Policy</div>
                      <div className="text-sm text-muted-foreground">Property protection coverage</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-semibold">Nevis Corp Registration</div>
                      <div className="text-sm text-muted-foreground">Legal entity documentation</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Investment Analytics
                </CardTitle>
                <CardDescription>
                  Performance metrics and projections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold text-green-600">$594</div>
                    <div className="text-sm text-muted-foreground">Monthly Cash Flow</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-600">181%</div>
                    <div className="text-sm text-muted-foreground">10-Year ROI</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <Building2 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold text-purple-600">$467k</div>
                    <div className="text-sm text-muted-foreground">Projected Value</div>
                  </div>
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
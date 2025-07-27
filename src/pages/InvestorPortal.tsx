import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, PieChart, DollarSign, BarChart3 } from "lucide-react";
import villaBahia from "@/assets/villa-bahia.jpg";
import villaMexico from "@/assets/villa-mexico.jpg";
import villaGreece from "@/assets/villa-greece.jpg";

const InvestorPortal = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Investor Portal
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Fractional property ownership through blockchain tokens. Invest in global real estate with AI-driven analytics and instant liquidity.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="default" size="lg">
              Browse Properties
            </Button>
            <Button variant="outline" size="lg">
              View Portfolio
            </Button>
          </div>
        </div>
      </section>

      {/* Investment Features */}
      <section className="pb-16 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-card border-accent/20">
              <CardHeader>
                <PieChart className="w-8 h-8 text-gold mb-2" />
                <CardTitle>Fractional Ownership</CardTitle>
                <CardDescription>
                  Own portions of premium properties worldwide
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-card border-accent/20">
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-gold mb-2" />
                <CardTitle>AI Analytics</CardTitle>
                <CardDescription>
                  Predictive yield forecasts and portfolio optimization
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-card border-accent/20">
              <CardHeader>
                <DollarSign className="w-8 h-8 text-gold mb-2" />
                <CardTitle>Instant Liquidity</CardTitle>
                <CardDescription>
                  Sell property tokens on secondary markets in minutes
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-card border-accent/20">
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-gold mb-2" />
                <CardTitle>Average 12.5% Returns</CardTitle>
                <CardDescription>
                  Consistent returns from rental income and appreciation
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Active Campaigns Placeholder */}
      <section className="pb-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Active Property Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-card border-accent/20">
              <CardContent className="p-6">
                <div className="aspect-video bg-cover bg-center rounded-lg mb-4" 
                     style={{ backgroundImage: `url(${villaBahia})` }}></div>
                <h3 className="text-xl font-semibold mb-2">Oceanfront Villa Bahia</h3>
                <p className="text-muted-foreground mb-2">Salvador, Bahia, Brazil</p>
                <p className="text-sm text-muted-foreground mb-4">Luxury beachfront property with infinity pool and private beach access</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Funded: 78%</span>
                  <span className="text-sm font-semibold">$3.2M Target</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Min. Investment:</span>
                  <span className="text-sm font-semibold text-gold">$1,000</span>
                </div>
                <Button className="w-full" variant="default">
                  Invest Now
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-accent/20">
              <CardContent className="p-6">
                <div className="aspect-video bg-cover bg-center rounded-lg mb-4" 
                     style={{ backgroundImage: `url(${villaMexico})` }}></div>
                <h3 className="text-xl font-semibold mb-2">Colonial Villa Tulum</h3>
                <p className="text-muted-foreground mb-2">Tulum, Quintana Roo, Mexico</p>
                <p className="text-sm text-muted-foreground mb-4">Traditional Mexican architecture with modern amenities in eco-paradise</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Funded: 65%</span>
                  <span className="text-sm font-semibold">$2.8M Target</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Min. Investment:</span>
                  <span className="text-sm font-semibold text-gold">$750</span>
                </div>
                <Button className="w-full" variant="default">
                  Invest Now
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-accent/20">
              <CardContent className="p-6">
                <div className="aspect-video bg-cover bg-center rounded-lg mb-4" 
                     style={{ backgroundImage: `url(${villaGreece})` }}></div>
                <h3 className="text-xl font-semibold mb-2">Cliffside Villa Santorini</h3>
                <p className="text-muted-foreground mb-2">Oia, Santorini, Greece</p>
                <p className="text-sm text-muted-foreground mb-4">Iconic white and blue villa with panoramic Aegean Sea views</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Funded: 92%</span>
                  <span className="text-sm font-semibold">$4.5M Target</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Min. Investment:</span>
                  <span className="text-sm font-semibold text-gold">$1,500</span>
                </div>
                <Button className="w-full" variant="default">
                  Invest Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InvestorPortal;
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, PieChart, DollarSign, BarChart3 } from "lucide-react";
import villaBahia from "@/assets/loft-bahia.jpg";
import villaMexico from "@/assets/penthouse-mexico.jpg";
import villaGreece from "@/assets/apartment-greece.jpg";

const InvestorPortal = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-8 px-6">
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
                <h3 className="text-xl font-semibold mb-2">Artist Loft Bahia</h3>
                <p className="text-muted-foreground mb-2">Salvador, Bahia, Brazil</p>
                <p className="text-sm text-muted-foreground mb-4">Industrial-chic loft with ocean views in the historic Pelourinho district</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Funded: 82%</span>
                  <span className="text-sm font-semibold">$165K Target</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Min. Investment:</span>
                  <span className="text-sm font-semibold text-gold">$250</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Est. Annual Yield:</span>
                  <span className="text-sm font-semibold text-green-500">11.2%</span>
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
                <h3 className="text-xl font-semibold mb-2">Beach Penthouse Tulum</h3>
                <p className="text-muted-foreground mb-2">Tulum, Quintana Roo, Mexico</p>
                <p className="text-sm text-muted-foreground mb-4">Rooftop penthouse with private terrace and jacuzzi near cenotes</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Funded: 75%</span>
                  <span className="text-sm font-semibold">$152K Target</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Min. Investment:</span>
                  <span className="text-sm font-semibold text-gold">$200</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Est. Annual Yield:</span>
                  <span className="text-sm font-semibold text-green-500">13.8%</span>
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
                <h3 className="text-xl font-semibold mb-2">Modern Caldera Apartment</h3>
                <p className="text-muted-foreground mb-2">Oia, Santorini, Greece</p>
                <p className="text-sm text-muted-foreground mb-4">Minimalist apartment with private balcony overlooking the caldera</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Funded: 91%</span>
                  <span className="text-sm font-semibold">$178K Target</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Min. Investment:</span>
                  <span className="text-sm font-semibold text-gold">$300</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Est. Annual Yield:</span>
                  <span className="text-sm font-semibold text-green-500">10.5%</span>
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
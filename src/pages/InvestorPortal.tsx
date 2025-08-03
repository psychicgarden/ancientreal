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
              Smart contract mortgages for global nomads. Own property worldwide with 20% down and build equity instead of burning cash on rent.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="default" size="lg">
              Browse Properties
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/portfolio">View Portfolio</a>
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
                <CardTitle>20% Down Mortgages</CardTitle>
                <CardDescription>
                  Smart contract mortgages with crypto payments
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-card border-accent/20">
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-gold mb-2" />
                <CardTitle>10-Year Terms</CardTitle>
                <CardDescription>
                  Build equity fast with accelerated payment schedules
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-card border-accent/20">
              <CardHeader>
                <DollarSign className="w-8 h-8 text-gold mb-2" />
                <CardTitle>Instant Ownership</CardTitle>
                <CardDescription>
                  Get property deed on blockchain after down payment
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-card border-accent/20">
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-gold mb-2" />
                <CardTitle>181% ROI Potential</CardTitle>
                <CardDescription>
                  Equity building + appreciation over 10 years
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Active Properties */}
      <section className="pb-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Available Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-card border-accent/20">
              <CardContent className="p-6">
                <div className="aspect-video bg-cover bg-center rounded-lg mb-4" 
                     style={{ backgroundImage: `url(${villaBahia})` }}></div>
                <h3 className="text-xl font-semibold mb-2">Artist Loft Bahia</h3>
                <p className="text-muted-foreground mb-2">Salvador, Bahia, Brazil</p>
                <p className="text-sm text-muted-foreground mb-4">Industrial-chic loft with ocean views in historic Pelourinho</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Property Value:</span>
                  <span className="text-sm font-semibold">$165K</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Down Payment:</span>
                  <span className="text-sm font-semibold text-gold">$33K (20%)</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Monthly Payment:</span>
                  <span className="text-sm font-semibold text-green-500">$1,268</span>
                </div>
                <Button className="w-full" variant="default">
                  Get Mortgage
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-accent/20">
              <CardContent className="p-6">
                <div className="aspect-video bg-cover bg-center rounded-lg mb-4" 
                     style={{ backgroundImage: `url(${villaMexico})` }}></div>
                <h3 className="text-xl font-semibold mb-2">Beach Penthouse Tulum</h3>
                <p className="text-muted-foreground mb-2">Tulum, Quintana Roo, Mexico</p>
                <p className="text-sm text-muted-foreground mb-4">Rooftop penthouse with private terrace near cenotes</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Property Value:</span>
                  <span className="text-sm font-semibold">$190K</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Down Payment:</span>
                  <span className="text-sm font-semibold text-gold">$38K (20%)</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Monthly Payment:</span>
                  <span className="text-sm font-semibold text-green-500">$1,464</span>
                </div>
                <Button className="w-full" variant="default">
                  Get Mortgage
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-accent/20">
              <CardContent className="p-6">
                <div className="aspect-video bg-cover bg-center rounded-lg mb-4" 
                     style={{ backgroundImage: `url(${villaGreece})` }}></div>
                <h3 className="text-xl font-semibold mb-2">Caldera Apartment</h3>
                <p className="text-muted-foreground mb-2">Oia, Santorini, Greece</p>
                <p className="text-sm text-muted-foreground mb-4">Minimalist apartment overlooking the caldera</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Property Value:</span>
                  <span className="text-sm font-semibold">$178K</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Down Payment:</span>
                  <span className="text-sm font-semibold text-gold">$36K (20%)</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Monthly Payment:</span>
                  <span className="text-sm font-semibold text-green-500">$1,372</span>
                </div>
                <Button className="w-full" variant="default">
                  Get Mortgage
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
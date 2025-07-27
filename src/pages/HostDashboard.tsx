import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, DollarSign, Calendar, Settings, Plus, TrendingUp } from "lucide-react";
import villaBali from "@/assets/villa-bali.jpg";
import apartmentNYC from "@/assets/apartment-nyc.jpg";
import beachHouseMaldives from "@/assets/beach-house-maldives.jpg";

const HostDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Host Dashboard
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Manage your property NFTs, automate income distribution, and access a global pool of travelers and investors.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="default" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
            <Button variant="outline" size="lg">
              View Analytics
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="pb-16 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gradient-card border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                <div className="text-2xl font-bold">$24,580</div>
                <p className="text-xs text-green-500">+12% from last month</p>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-card border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Listings</CardTitle>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-blue-500">All properties live</p>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-card border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Occupancy Rate</CardTitle>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-green-500">+5% from last month</p>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-card border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Rating</CardTitle>
                <div className="text-2xl font-bold">4.9</div>
                <p className="text-xs text-muted-foreground">From 127 reviews</p>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Property Management */}
      <section className="pb-16 px-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Your Properties</h2>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Manage All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[
              { name: "Luxury Villa Bali", status: "Active", bookings: 12, revenue: "$8,420", image: villaBali },
              { name: "Modern Apartment NYC", status: "Active", bookings: 8, revenue: "$12,150", image: apartmentNYC },
              { name: "Beach House Maldives", status: "Maintenance", bookings: 0, revenue: "$4,010", image: beachHouseMaldives }
            ].map((property, i) => (
              <Card key={i} className="bg-gradient-card border-accent/20">
                <CardContent className="p-6">
                  <div className="aspect-video bg-cover bg-center rounded-lg mb-4" 
                       style={{ backgroundImage: `url(${property.image})` }}></div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{property.name}</h3>
                    <Badge variant={property.status === "Active" ? "default" : "secondary"}>
                      {property.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">This month:</span>
                      <span className="font-semibold">{property.bookings} bookings</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-semibold text-green-500">{property.revenue}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      Calendar
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Host Features */}
      <section className="pb-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Host Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-card border-accent/20">
              <CardHeader>
                <Home className="w-8 h-8 text-gold mb-2" />
                <CardTitle>NFT Property Listings</CardTitle>
                <CardDescription>
                  Properties represented as NFTs with smart contract management
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-card border-accent/20">
              <CardHeader>
                <DollarSign className="w-8 h-8 text-gold mb-2" />
                <CardTitle>Automated Payouts</CardTitle>
                <CardDescription>
                  Smart contracts handle rental income distribution automatically
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-card border-accent/20">
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-gold mb-2" />
                <CardTitle>Global Exposure</CardTitle>
                <CardDescription>
                  Access worldwide travelers and investors for maximum returns
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HostDashboard;
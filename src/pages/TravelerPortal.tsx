import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users, Wallet, Gift } from "lucide-react";

const TravelerPortal = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Travel Portal
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Book luxury accommodations with crypto payments. Convert your investment rewards into travel credits.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gradient-card border-accent/20 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-10" placeholder="Where to?" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Check-in</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-10" placeholder="Add dates" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Guests</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-10" placeholder="Add guests" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium opacity-0">Search</label>
                <Button className="w-full" size="lg">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="pb-16 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-card border-accent/20">
              <CardHeader>
                <Wallet className="w-8 h-8 text-gold mb-2" />
                <CardTitle>Crypto Payments</CardTitle>
                <CardDescription>
                  Pay with stablecoins, DPN tokens, or convert fiat seamlessly
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-card border-accent/20">
              <CardHeader>
                <Gift className="w-8 h-8 text-gold mb-2" />
                <CardTitle>Investment Rewards</CardTitle>
                <CardDescription>
                  Convert staking rewards into travel credits and discounts
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-card border-accent/20">
              <CardHeader>
                <MapPin className="w-8 h-8 text-gold mb-2" />
                <CardTitle>Global Properties</CardTitle>
                <CardDescription>
                  Access premium accommodations worldwide through our network
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Property Listings Placeholder */}
      <section className="pb-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Stays</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-gradient-card border-accent/20 overflow-hidden">
                <div className="aspect-square bg-muted"></div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">Luxury Villa #{i}</h3>
                  <p className="text-sm text-muted-foreground mb-2">Tropical Paradise • 4.9★</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">$200/night</span>
                    <span className="text-xs text-gold">Crypto accepted</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TravelerPortal;
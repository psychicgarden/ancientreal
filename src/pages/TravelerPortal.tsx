import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users, Wallet, Gift } from "lucide-react";
import villaBahia from "@/assets/loft-bahia.jpg";
import villaMexico from "@/assets/penthouse-mexico.jpg";
import villaGreece from "@/assets/apartment-greece.jpg";
import beachHouseMykonos from "@/assets/beach-house-mykonos.jpg";
import jungleLodge from "@/assets/jungle-lodge-costarica.jpg";
import desertOasis from "@/assets/desert-oasis-morocco.jpg";

const TravelerPortal = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-8 px-6">
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
            <Card className="bg-gradient-card border-accent/20 overflow-hidden">
              <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${villaBahia})` }}></div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">Artist Loft Bahia</h3>
                <p className="text-sm text-muted-foreground mb-2">Salvador, Brazil • 4.8★ (34 reviews)</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">$85/night</span>
                  <span className="text-xs text-gold">Crypto accepted</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-accent/20 overflow-hidden">
              <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${villaMexico})` }}></div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">Beach Penthouse Tulum</h3>
                <p className="text-sm text-muted-foreground mb-2">Tulum, Mexico • 4.9★ (28 reviews)</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">$95/night</span>
                  <span className="text-xs text-gold">DPN tokens 15% off</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-accent/20 overflow-hidden">
              <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${villaGreece})` }}></div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">Modern Caldera Apartment</h3>
                <p className="text-sm text-muted-foreground mb-2">Oia, Greece • 4.9★ (52 reviews)</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">$120/night</span>
                  <span className="text-xs text-gold">Investment credits</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-accent/20 overflow-hidden">
              <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${beachHouseMykonos})` }}></div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">Beach House Mykonos</h3>
                <p className="text-sm text-muted-foreground mb-2">Mykonos, Greece • 4.7★ (23 reviews)</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">$110/night</span>
                  <span className="text-xs text-gold">Crypto accepted</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-accent/20 overflow-hidden">
              <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${jungleLodge})` }}></div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">Jungle Lodge Costa Rica</h3>
                <p className="text-sm text-muted-foreground mb-2">Manuel Antonio, CR • 4.9★ (61 reviews)</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">$75/night</span>
                  <span className="text-xs text-gold">Stablecoin discount</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-accent/20 overflow-hidden">
              <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${desertOasis})` }}></div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">Desert Oasis Morocco</h3>
                <p className="text-sm text-muted-foreground mb-2">Marrakech, Morocco • 4.8★ (38 reviews)</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">$65/night</span>
                  <span className="text-xs text-gold">Travel credits</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TravelerPortal;
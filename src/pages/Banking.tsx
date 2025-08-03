import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Wallet, 
  TrendingUp, 
  Home, 
  Shield, 
  Clock, 
  Users,
  ArrowRight,
  Zap,
  Lock,
  Unlock
} from "lucide-react";

const Banking = () => {
  const { isConnected, connectWallet } = useWallet();
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  const handleTierSelect = (tier: number) => {
    if (!isConnected) {
      connectWallet();
      return;
    }
    setSelectedTier(tier);
    toast({
      title: `Selected Tier ${tier}`,
      description: "Investment strategy selected successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 px-4 py-2">
            Three-Tier Banking Strategy
          </Badge>
          <h1 className="text-6xl md:text-7xl font-light mb-8 tracking-tight">
            Your Money,
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Working Smarter
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Choose your liquidity strategy. From ultra-liquid savings to property ownership.
            Each tier designed for different risk tolerances and time horizons.
          </p>
        </div>
      </section>

      {/* Three Tiers Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Tier 1: Ancient Savings */}
            <Card className={`relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${selectedTier === 1 ? 'border-primary' : 'border-border'}`}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Ancient Savings</CardTitle>
                <CardDescription>Ultra-liquid, risk-free yield</CardDescription>
                <div className="text-3xl font-bold text-green-600 mt-2">7.5% - 8.5%</div>
                <Badge variant="secondary" className="w-fit mx-auto mt-2">
                  <Unlock className="w-3 h-3 mr-1" />
                  Ultra Liquid
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Zap className="w-4 h-4 mr-2 text-primary" />
                    Instant withdrawals, no penalties
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="w-4 h-4 mr-2 text-primary" />
                    Backed by first-lien mortgages
                  </div>
                  <div className="flex items-center text-sm">
                    <Home className="w-4 h-4 mr-2 text-primary" />
                    One-click home purchase transfers
                  </div>
                  <div className="flex items-center text-sm">
                    <Lock className="w-4 h-4 mr-2 text-primary" />
                    Insurance fund protection
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2">Current Pool Status</div>
                  <Progress value={75} className="mb-2" />
                  <div className="text-xs text-muted-foreground">$2.4M available for mortgages</div>
                </div>

                <Button 
                  onClick={() => handleTierSelect(1)}
                  className="w-full mt-6"
                  variant={selectedTier === 1 ? "default" : "outline"}
                >
                  Start Earning <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Tier 2: Property Development */}
            <Card className={`relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${selectedTier === 2 ? 'border-primary' : 'border-border'}`}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Property Development</CardTitle>
                <CardDescription>Active investment opportunities</CardDescription>
                <div className="text-3xl font-bold text-blue-600 mt-2">12% - 15%</div>
                <Badge variant="secondary" className="w-fit mx-auto mt-2">
                  <Clock className="w-3 h-3 mr-1" />
                  6-18 Months
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                    Higher projected returns
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2 text-primary" />
                    Fractional project investment
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    Project-based lock-ups
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="w-4 h-4 mr-2 text-primary" />
                    Due diligence required
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2">Active Projects</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Mazunte Villa Complex</span>
                      <span className="text-green-600">87% funded</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Tulum Eco Resort</span>
                      <span className="text-blue-600">43% funded</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => handleTierSelect(2)}
                  className="w-full mt-6"
                  variant={selectedTier === 2 ? "default" : "outline"}
                >
                  Browse Projects <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Tier 3: Village Citizenship */}
            <Card className={`relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${selectedTier === 3 ? 'border-primary' : 'border-border'}`}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Village Citizenship</CardTitle>
                <CardDescription>Property ownership + community</CardDescription>
                <div className="text-3xl font-bold text-purple-600 mt-2">Own + Earn</div>
                <Badge variant="secondary" className="w-fit mx-auto mt-2">
                  <Lock className="w-3 h-3 mr-1" />
                  Long-term
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Home className="w-4 h-4 mr-2 text-primary" />
                    Actual property ownership
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                    Property appreciation
                  </div>
                  <div className="flex items-center text-sm">
                    <Wallet className="w-4 h-4 mr-2 text-primary" />
                    Rental income distribution
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2 text-primary" />
                    Exclusive community access
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2">Available Properties</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Beachfront Villas</span>
                      <span className="text-primary">From $180K</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Jungle Lofts</span>
                      <span className="text-primary">From $95K</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => handleTierSelect(3)}
                  className="w-full mt-6"
                  variant={selectedTier === 3 ? "default" : "outline"}
                >
                  Explore Properties <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why This Works Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-8">Why This Strategy Works</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Risk Layering</h3>
              <p className="text-muted-foreground">
                Each tier serves different risk tolerances while maintaining ecosystem liquidity.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Instant Utility</h3>
              <p className="text-muted-foreground">
                Move between tiers seamlessly. Your savings work for home purchases instantly.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Network Effects</h3>
              <p className="text-muted-foreground">
                Higher participation improves rates and opportunities for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Banking;
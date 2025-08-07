import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
  Home, 
  TrendingUp, 
  Shield, 
  Globe, 
  Heart, 
  Users, 
  Music, 
  Flower,
  Calendar,
  MapPin,
  Star,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowRight,
  Zap,
  Play,
  PiggyBank,
  Building,
  TreePine,
  Waves,
  Sun,
  Moon,
  Wallet,
  Lock,
  Unlock
} from "lucide-react";
import { useState } from "react";
import liveMusicImage from "@/assets/woman-guitar-stage.jpg";
import ecstaticDanceImage from "@/assets/three-women-drums.jpg";
import sacredCeremoniesImage from "@/assets/incense-brown-vases.jpg";

const Community = () => {
  const [propertyValue, setPropertyValue] = useState([150000]);
  const [downPayment, setDownPayment] = useState([30000]);
  const [selectedLocation, setSelectedLocation] = useState("bali");
  
  // Location-based property data with realistic rental yields
  const locationData = {
    bahia: {
      name: "Bahia, Brazil", 
      avgPrice: 120000,
      monthlyRent: 1400,
      context: "Growing surf tourism, lower property costs",
      yield: 14.0
    },
    mykonos: {
      name: "Mykonos, Greece",
      avgPrice: 280000,
      monthlyRent: 2200,
      context: "Premium Mediterranean location, seasonal peaks",
      yield: 9.4
    },
    mallorca: {
      name: "Mallorca, Spain",
      avgPrice: 190000,
      monthlyRent: 1600,
      context: "Digital nomad hub, year-round demand",
      yield: 10.1
    },
    bali: {
      name: "Bali, Indonesia",
      avgPrice: 135000,
      monthlyRent: 1400,
      context: "Lowest entry cost, strong rental demand",
      yield: 12.4
    }
  };
  
  const currentLocation = locationData[selectedLocation];
  
  // Calculate ROI metrics based on selected location
  const monthlyPayment = ((propertyValue[0] - downPayment[0]) * 0.08) / 12;
  const monthlyRentalIncome = currentLocation.monthlyRent;
  const monthlyProfit = monthlyRentalIncome - monthlyPayment;
  const yearlyROI = ((monthlyProfit * 12) / downPayment[0]) * 100;

  // Property comparison data
  const rentingVsOwning = [
    {
      category: "Monthly Payment",
      renting: "Pay rent forever",
      ancient: "Build equity with each payment",
      rentingIcon: "💸",
      ancientIcon: "🏡"
    },
    {
      category: "Financial Future", 
      renting: "Zero ownership, zero returns",
      ancient: "Earn rental income + appreciation",
      rentingIcon: "📉",
      ancientIcon: "📈"
    },
    {
      category: "Legal Complexity",
      renting: "Lease restrictions & rent hikes", 
      ancient: "We handle everything legally",
      rentingIcon: "📋",
      ancientIcon: "✨"
    },
    {
      category: "Investment Control",
      renting: "Subject to landlord decisions",
      ancient: "You own, you decide",
      rentingIcon: "🚫", 
      ancientIcon: "👑"
    }
  ];

  // Journey steps
  const ownershipJourney = [
    {
      step: 1,
      title: "Discover Your Sacred Space",
      description: "Browse curated properties in conscious communities worldwide",
      icon: Globe,
      action: "Explore vetted homes in Tulum, Bali, Portugal & beyond",
      color: "from-blue-500 to-purple-600"
    },
    {
      step: 2, 
      title: "One-Click Ownership",
      description: "Pay 20% down with USDT - no banks, no paperwork nightmares",
      icon: Zap,
      action: "Smart contract handles everything instantly",
      color: "from-purple-500 to-pink-600"
    },
    {
      step: 3,
      title: "We Handle Everything", 
      description: "Legal, taxes, maintenance, tenants - completely hands-off",
      icon: Shield,
      action: "Relax while we manage your investment",
      color: "from-pink-500 to-orange-600"
    },
    {
      step: 4,
      title: "Earn & Build Wealth",
      description: "Receive rental yields, track appreciation, exit with profit",
      icon: TrendingUp, 
      action: "Watch your wealth grow passively",
      color: "from-orange-500 to-green-600"
    }
  ];

  // Community features
  const communityFeatures = [
    {
      title: "Ecstatic Dance Sessions",
      description: "Weekly movement medicine gatherings that connect body, spirit, and community",
      icon: Music,
      frequency: "Every Friday",
      vibe: "🌊 Flow State",
      image: ecstaticDanceImage
    },
    {
      title: "Wellness Workshops", 
      description: "Breathwork, meditation, sound healing, and transformative practices",
      icon: Flower,
      frequency: "3x per week",
      vibe: "🧘‍♀️ Inner Peace",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop"
    },
    {
      title: "Nomad Coworking Hubs",
      description: "Collaborative spaces with starlink internet and inspiring views", 
      icon: Users,
      frequency: "Daily",
      vibe: "💻 Flow Productivity",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=200&fit=crop"
    },
    {
      title: "Investment Mastery",
      description: "Learn advanced DeFi, real estate, and wealth-building strategies",
      icon: TrendingUp,
      frequency: "Monthly",
      vibe: "📈 Abundance Mindset",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&h=200&fit=crop"
    },
    {
      title: "Live Music & Arts",
      description: "Local musicians, artists, and creative expression in paradise",
      icon: Music,
      frequency: "Weekends",
      vibe: "🎵 Creative Flow",
      image: liveMusicImage
    },
    {
      title: "Sacred Ceremonies",
      description: "New moon circles, cacao ceremonies, and consciousness expansion",
      icon: Moon,
      frequency: "Monthly",
      vibe: "🌙 Mystical",
      image: sacredCeremoniesImage
    }
  ];

  // Investor testimonials
  const investorStories = [
    {
      name: "Luna Martinez",
      location: "Traveling between properties",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b9412b03?w=150&h=150&fit=crop&crop=face",
      story: "Ancient isn't just an investment - it's a lifestyle. I own three homes in sacred communities and my life has never been more abundant.",
      roi: "147%",
      timeframe: "18 months",
      community: "Tulum Village",
      monthlyEarnings: "$4,200"
    },
    {
      name: "River Thompson",
      location: "Bali, Indonesia", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      story: "The magic happens in the intersection of conscious living and smart investing. Ancient made both possible.",
      roi: "189%",
      timeframe: "24 months", 
      community: "Bali Collective",
      monthlyEarnings: "$3,800"
    },
    {
      name: "Sage Williams",
      location: "Costa Rica",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      story: "From broke digital nomad to owning jungle retreats. Ancient transformed my relationship with money and home.",
      roi: "156%", 
      timeframe: "20 months",
      community: "Jungle Lodge Collective",
      monthlyEarnings: "$2,900"
    }
  ];

  const vibeReasons = [
    {
      title: "Consciousness First",
      description: "We're not just building wealth - we're cultivating conscious communities that elevate human potential",
      icon: Heart,
      gradient: "from-pink-400 to-rose-600"
    },
    {
      title: "Global Sacred Spaces",
      description: "Each property is chosen for its energy, beauty, and connection to local wisdom traditions",
      icon: TreePine,
      gradient: "from-green-400 to-emerald-600"
    },
    {
      title: "No Traditional Bullshit",
      description: "Skip banks, brokers, and bureaucracy. Pure blockchain magic meets ancient wisdom",
      icon: Zap,
      gradient: "from-yellow-400 to-orange-600"
    },
    {
      title: "Community Over Competition",
      description: "We're building a tribe of conscious investors who lift each other up",
      icon: Users,
      gradient: "from-blue-400 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Video Background Feel */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10" />
        
        <div className="relative container mx-auto px-4 text-center">
          <Badge className="mb-6 text-sm px-4 py-2 bg-white/10 text-white border-white/20">
            ✨ Conscious Ownership Revolution
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            A New Era of Ownership.
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Click. Own. Earn.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed">
            No banks. No borders. No bullshit.<br />
            Curated sanctuaries where creatives renegades build wealth and community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="group px-8 py-4 text-lg" asChild>
              <a href="/community">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Become a Founding Citizen
              </a>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg bg-white/10 border-white/20 text-primary hover:bg-white/20" asChild>
              <a href="/investor">
                Explore Spaces
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Your Journey to Ownership */}
      <section className="py-12 bg-gradient-to-br from-muted/20 to-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Your Journey to Ownership
            </h2>
            <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground/90">
              Four Steps to Global Homeownership
            </h3>
            <p className="text-xl text-muted-foreground">
              From discovery to passive income - your journey to conscious homeownership starts here.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Discover Your Perfect Space",
                description: "Browse curated properties worldwide"
              },
              {
                step: 2,
                title: "One-Click Ownership", 
                description: "Pay 20% down with USDT - no banks, no paperwork nightmares"
              },
              {
                step: 3,
                title: "We Handle Everything",
                description: "Legal, taxes, maintenance, tenants - completely hands-off"
              },
              {
                step: 4,
                title: "Earn & Build Wealth",
                description: "Receive rental yields, track appreciation, exit with profit"
              }
            ].map((step, index) => (
              <div key={index} className="group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {step.step}
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-purple-300 to-orange-300/30 transform translate-x-8"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

        {/* The Mathematics of Modern Nomadism */}
        <section className="py-20 bg-gradient-to-br from-muted/20 to-muted/40">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                The Mathematics of Modern Nomadism
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto">
                Every decade the average digital nomad burns 216K on dead rent.<br />
                We transform that into $467,000 in real estate equity.
              </p>
            </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl p-6">
              <h4 className="text-xl font-bold mb-4 text-red-400">Traditional Path</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Monthly Rent</span>
                  <span className="text-lg font-semibold">$1,800</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Decade Total</span>
                  <span className="text-lg font-semibold">$216,000</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Equity Built</span>
                  <span className="text-lg font-semibold text-red-400">$0</span>
                </div>
              </div>
            </div>

            <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl p-6">
              <h4 className="text-xl font-bold mb-4 text-green-400">Ancient Path</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Monthly Payment</span>
                  <span className="text-lg font-semibold">$1,456</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Decade Total</span>
                  <span className="text-lg font-semibold">$204,720</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Property Value</span>
                  <span className="text-lg font-semibold text-green-400">$467,000</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-8 rounded-lg mb-8">
              <h3 className="text-2xl font-bold mb-4">The Difference</h3>
              <p className="text-xl mb-6">Identical monthly commitment. Generational wealth outcome.</p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm opacity-90 uppercase tracking-wide">Down Payment</div>
                  <div className="text-3xl font-bold">$30K</div>
                </div>
                <div>
                  <div className="text-sm opacity-90 uppercase tracking-wide">Final Equity</div>
                  <div className="text-3xl font-bold">$467K</div>
                </div>
                <div>
                  <div className="text-sm opacity-90 uppercase tracking-wide">Total Return</div>
                  <div className="text-3xl font-bold">181%</div>
                </div>
              </div>
            </div>
            
            <Button size="lg" className="px-8 py-4 text-lg">
              Calculate Returns
            </Button>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4">Interactive Calculator</Badge>
              <h2 className="text-4xl font-bold mb-6">Your Path to Financial Freedom</h2>
              <p className="text-xl text-muted-foreground">
                See how your investment grows with our transparent ownership model.
              </p>
            </div>

            <Card className="p-8">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium mb-4">Choose Location</label>
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(locationData).map(([key, location]) => (
                        <button
                          key={key}
                          onClick={() => {
                            setSelectedLocation(key);
                            setPropertyValue([location.avgPrice]);
                          }}
                          className={`p-4 rounded-lg border text-left transition-all ${
                            selectedLocation === key 
                              ? 'border-primary bg-primary/5 shadow-md' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{location.name}</h3>
                            <Badge variant={selectedLocation === key ? "default" : "secondary"} className="text-xs">
                              {location.yield}% yield
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{location.context}</p>
                          <div className="flex justify-between text-sm">
                            <span>Avg Price: ${location.avgPrice.toLocaleString()}</span>
                            <span className="text-green-600 font-medium">${location.monthlyRent}/mo rent</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>


                  <div>
                    <label className="block text-sm font-medium mb-4">Down Payment (20%)</label>
                    <div className="text-3xl font-bold text-primary mb-2">
                      ${(propertyValue[0] * 0.2).toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Secure ownership with just 20% down via USDT payment
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Annual ROI</span>
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      {yearlyROI.toFixed(1)}%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Monthly Payment</div>
                      <div className="text-xl font-bold">${monthlyPayment.toFixed(0)}</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Monthly Profit</div>
                      <div className="text-xl font-bold text-green-600">+${monthlyProfit.toFixed(0)}</div>
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    Start Building Wealth
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Life & Events */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Living the Vision</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              More Than Real Estate - <span className="text-primary">It's a Lifestyle</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ecstatic dance, workshops, live music, yoga, ceremonies - experience what happens when conscious entrepreneurs gather in paradise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {communityFeatures.map((feature, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{feature.frequency}</Badge>
                    <span className="text-sm">{feature.vibe}</span>
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    <feature.icon className="h-5 w-5 text-primary" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vibe Check - Why Ancient */}
      <section className="py-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">✨ Vibe Check</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why <span className="text-primary">Ancient</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              This isn't real estate. It's access. Access to places that mean something. Spaces designed for those who don't just want to own — they want to belong.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {vibeReasons.map((reason, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full bg-gradient-to-br ${reason.gradient} flex-shrink-0`}>
                    <reason.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{reason.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{reason.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <p className="text-2xl font-medium text-primary mb-6">
              "You're not just buying into an investment.<br />You're joining a movement."
            </p>
            <Button size="lg" className="px-8 py-4">
              Join the Revolution
            </Button>
          </div>
        </div>
      </section>


      {/* Success Stories */}
      <section className="py-20 bg-gradient-to-br from-muted/20 to-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Success Stories</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              From Renters to <span className="text-primary">Global Homeowners</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real people, real properties, real transformation. Their stories could be yours.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {investorStories.map((story, index) => (
              <Card key={index} className="h-full hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={story.avatar} />
                      <AvatarFallback>{story.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg">{story.name}</h3>
                      <p className="text-sm text-muted-foreground">{story.location}</p>
                      <Badge variant="secondary" className="text-xs">{story.community}</Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <blockquote className="text-muted-foreground mb-6 italic leading-relaxed">
                    "{story.story}"
                  </blockquote>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{story.roi}</div>
                      <div className="text-xs text-green-600 font-medium">Total ROI</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{story.monthlyEarnings}</div>
                      <div className="text-xs text-blue-600 font-medium">Monthly Income</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <span className="text-sm text-muted-foreground">{story.timeframe} of ownership</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Own Your Future Home Today
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">
            Join hundreds of conscious investors building wealth in sacred communities worldwide. 
            Your journey to financial freedom and spiritual alignment starts with a single click.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
              <Zap className="mr-2 h-5 w-5" />
              Start with $30,000
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white/20 text-white hover:bg-white/10">
              Schedule Sacred Property Tour
            </Button>
          </div>
          
          <div className="text-sm opacity-75">
            ✨ No banks • No brokers • No bullshit • Just pure ownership magic ✨
          </div>
        </div>
      </section>
    </div>
  );
};

export default Community;
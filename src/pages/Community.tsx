import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MapPin, 
  Shield, 
  Clock, 
  Star, 
  MessageCircle, 
  Camera,
  DollarSign,
  Home,
  Heart,
  Globe,
  CheckCircle,
  Calendar
} from "lucide-react";

const Community = () => {
  const managementTiers = [
    {
      name: "Essential",
      price: "5%",
      description: "Basic oversight and maintenance",
      features: [
        "Monthly property inspections",
        "Basic maintenance coordination",
        "Rental income collection",
        "Monthly photo reports"
      ],
      icon: <Home className="h-6 w-6" />
    },
    {
      name: "Premium",
      price: "8%",
      description: "Full-service property management",
      features: [
        "Weekly property checks",
        "Guest experience management",
        "24/7 emergency response",
        "Professional cleaning service",
        "Marketing optimization"
      ],
      icon: <Star className="h-6 w-6" />,
      popular: true
    },
    {
      name: "Concierge",
      price: "12%",
      description: "White-glove investment experience",
      features: [
        "Daily property monitoring",
        "Personal concierge service",
        "Interior design updates",
        "Investment optimization",
        "Tax documentation support"
      ],
      icon: <Shield className="h-6 w-6" />
    }
  ];

  const investorStories = [
    {
      name: "Sarah Chen",
      location: "NYC → Oaxaca",
      avatar: "/placeholder.svg",
      story: "Living in Manhattan, I never thought I could own a vacation rental in Mexico. Ancient's community made it seamless.",
      return: "18% ROI",
      timeframe: "6 months"
    },
    {
      name: "Marcus Thompson",
      location: "London → Tulum",
      avatar: "/placeholder.svg", 
      story: "The property management team treats my villa like their own. I get weekly updates and beautiful photos.",
      return: "22% ROI",
      timeframe: "1 year"
    },
    {
      name: "Elena Rodriguez",
      location: "Toronto → Bahía",
      avatar: "/placeholder.svg",
      story: "I was nervous about remote ownership, but the local partners became like family. Best investment decision ever.",
      return: "25% ROI",
      timeframe: "8 months"
    }
  ];

  const localPartners = [
    {
      name: "Oaxaca Property Solutions",
      location: "Oaxaca, Mexico",
      speciality: "Beachfront Villas",
      rating: 4.9,
      properties: 24,
      services: ["24/7 Support", "Emergency Response", "Guest Services"]
    },
    {
      name: "Tulum Estate Management",
      location: "Tulum, Mexico", 
      speciality: "Jungle Retreats",
      rating: 4.8,
      properties: 18,
      services: ["Eco-Tourism", "Cultural Experiences", "Maintenance"]
    },
    {
      name: "Bahía Property Care",
      location: "Bahía, Brazil",
      speciality: "Luxury Rentals",
      rating: 4.9,
      properties: 31,
      services: ["Concierge", "Cleaning", "Marketing"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 text-sm">Community-Powered Investment</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Invest Globally, 
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Manage Locally</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join a community of global investors who own premium vacation rentals managed by trusted local partners. 
              From NYC to Oaxaca, from London to Tulum - distance is no barrier to smart real estate investment.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>500+ Global Investors</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>12 Exotic Locations</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>100% Managed Properties</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Management Tiers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Management Level</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From basic oversight to white-glove service, we have the perfect management solution for your investment style and peace of mind.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {managementTiers.map((tier, index) => (
              <Card key={index} className={`relative ${tier.popular ? 'ring-2 ring-primary shadow-lg scale-105' : ''}`}>
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    {tier.icon}
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{tier.price}</div>
                  <CardDescription className="text-base">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant={tier.popular ? "default" : "outline"}>
                    Select {tier.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investor Stories */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Global Investors, Local Success</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from investors who've built successful vacation rental portfolios across continents with Ancient's community support.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {investorStories.map((story, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={story.avatar} />
                      <AvatarFallback>{story.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{story.name}</h3>
                      <p className="text-sm text-muted-foreground">{story.location}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 italic">"{story.story}"</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">{story.return}</Badge>
                    <span className="text-sm text-muted-foreground">{story.timeframe}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Local Partners */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted Local Partners</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our carefully vetted property management partners provide on-ground expertise and 24/7 support for your investments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {localPartners.map((partner, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{partner.name}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {partner.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{partner.rating}</span>
                    </div>
                  </div>
                  <Badge variant="outline">{partner.speciality}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      {partner.properties} Properties
                    </div>
                  </div>
                  <div className="space-y-2">
                    {partner.services.map((service, idx) => (
                      <Badge key={idx} variant="secondary" className="mr-2 mb-1">
                        {service}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Partner Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Features */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Community Benefits</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Being part of Ancient means joining a community of like-minded investors with shared resources and support.
            </p>
          </div>

          <Tabs defaultValue="forum" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="forum">Investor Forum</TabsTrigger>
              <TabsTrigger value="events">Local Events</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="updates">Live Updates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="forum" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Community Discussions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-medium">Best practices for Oaxaca season planning?</h4>
                    <p className="text-sm text-muted-foreground">Marcus Thompson • 2 hours ago • 12 replies</p>
                  </div>
                  <div className="border-l-4 border-muted pl-4">
                    <h4 className="font-medium">Insurance tips for international properties</h4>
                    <p className="text-sm text-muted-foreground">Sarah Chen • 5 hours ago • 8 replies</p>
                  </div>
                  <div className="border-l-4 border-muted pl-4">
                    <h4 className="font-medium">Tax optimization strategies for 2024</h4>
                    <p className="text-sm text-muted-foreground">Elena Rodriguez • 1 day ago • 24 replies</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Oaxaca Property Tour</h4>
                      <p className="text-sm text-muted-foreground">March 15-17, 2024</p>
                    </div>
                    <Badge>Virtual + In-Person</Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Investor Meetup NYC</h4>
                      <p className="text-sm text-muted-foreground">March 22, 2024</p>
                    </div>
                    <Badge variant="secondary">In-Person</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Resource Library</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">International Property Guide</h4>
                      <p className="text-sm text-muted-foreground">Complete guide to remote property ownership</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Tax Optimization Handbook</h4>
                      <p className="text-sm text-muted-foreground">Maximize returns across jurisdictions</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Market Analysis Reports</h4>
                      <p className="text-sm text-muted-foreground">Quarterly insights on global vacation rental markets</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Legal Documentation Templates</h4>
                      <p className="text-sm text-muted-foreground">Standardized contracts and agreements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="updates" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Live Property Updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Villa Oaxaca - Weekly Inspection Complete</h4>
                      <p className="text-sm text-muted-foreground">All systems operational • 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Rental Payment Received</h4>
                      <p className="text-sm text-muted-foreground">$2,850 deposited to your account • 1 day ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Global Community?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Start your journey as a global real estate investor with local expertise and community support every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Browse Properties
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Community;
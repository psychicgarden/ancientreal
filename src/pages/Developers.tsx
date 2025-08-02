import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header"; // Fixed import
import baliJungleResort from "@/assets/bali-jungle-resort.jpg";
import ecoSmartCity from "@/assets/eco-smart-city.jpg";
import bohoColivingSpace from "@/assets/boho-coliving-space.jpg";
import { 
  Rocket, 
  Users, 
  DollarSign, 
  Code, 
  Shield, 
  Star,
  Clock,
  TrendingUp,
  Award,
  Upload,
  Vote,
  Zap
} from "lucide-react";

const Developers = () => {
  // Best Sold-Out Success Stories (Featured at Top)
  const soldOutStories = [
    {
      id: 1,
      title: "Bali Eco Resort Complex",
      creator: "Tropical Builders Co.",
      description: "Luxury eco-resort with 45 units in Canggu. Sold out in 4 days after DAO funding.",
      initialFunding: 850000,
      currentValue: 1200000,
      roi: "41%",
      timeline: "18 months",
      backers: 234,
      image: baliJungleResort,
      tags: ["Real Estate", "Eco-Tourism"],
      selloutTime: "4 days",
      developerProfit: 350000,
      developerStory: "Zero upfront cost. We provided full funding after community validation.",
      presalePercentage: 100
    },
    {
      id: 2,
      title: "Smart City Infrastructure",
      creator: "NextGen Urban",
      description: "IoT-enabled smart city project with blockchain integration for 200+ residential units",
      initialFunding: 1200000,
      currentValue: 1950000,
      roi: "63%",
      timeline: "24 months",
      backers: 456,
      image: ecoSmartCity,
      tags: ["Smart City", "IoT", "Blockchain"],
      selloutTime: "6 days",
      developerProfit: 750000,
      developerStory: "Community funded, DAO approved. Developer kept 60% equity with zero risk.",
      presalePercentage: 100
    },
    {
      id: 3,
      title: "Renewable Energy Villas",
      creator: "GreenTech Developments",
      description: "Self-sustaining villa complex with solar integration. Sold out in 2.5 weeks.",
      initialFunding: 650000,
      currentValue: 920000,
      roi: "42%",
      timeline: "15 months",
      backers: 189,
      image: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=800&h=600&fit=crop",
      tags: ["Renewable Energy", "Sustainability"],
      selloutTime: "2.5 weeks",
      developerProfit: 270000,
      developerStory: "From idea to fully funded in 45 days. No personal investment required.",
      presalePercentage: 100
    }
  ];

  // Current Projects Seeking Presales (80% threshold for greenlight)
  const currentProjects = [
    {
      id: 4,
      title: "Digital Nomad Coliving Hub",
      creator: "Remote Work Studios",
      description: "Modern coliving spaces with integrated coworking facilities across Southeast Asia.",
      targetFunding: 450000,
      currentFunding: 382500,
      roi: "Est. 29%",
      timeline: "12 months",
      backers: 167,
      image: bohoColivingSpace,
      tags: ["Coliving", "Remote Work", "Community"],
      presalePercentage: 85,
      minInvestment: 500,
      estimatedYield: "14.2%",
      developerStory: "DAO funding eliminated our biggest risk - we focus purely on building."
    },
    {
      id: 5,
      title: "Berber Eco Luxury Riad Retreat",
      creator: "Atlas Desert Developments",
      description: "Authentic Berber-style eco luxury riad retreat center in Morocco's Sahara with traditional architecture.",
      targetFunding: 750000,
      currentFunding: 525000,
      roi: "Est. 38%",
      timeline: "20 months",
      backers: 298,
      image: "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?w=800&h=600&fit=crop",
      tags: ["Berber Architecture", "Eco-Luxury", "Desert Retreat"],
      presalePercentage: 70,
      minInvestment: 300,
      estimatedYield: "12.8%",
      developerStory: "Traditional funding rejected us 3 times. DAO believed in our vision."
    },
    {
      id: 6,
      title: "Urban Vertical Farm Complex",
      creator: "AgriTech Builders",
      description: "Vertical farming towers with residential units - food production meets urban living.",
      targetFunding: 920000,
      currentFunding: 734000,
      roi: "Est. 45%",
      timeline: "16 months",
      backers: 421,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
      tags: ["AgriTech", "Urban", "Innovation"],
      presalePercentage: 80,
      minInvestment: 750,
      estimatedYield: "16.5%",
      developerStory: "We reached 80% presale threshold! Greenlit for full DAO funding."
    }
  ];

  const benefits = [
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Instant Funding Access",
      description: "Get funded within 24-48 hours of DAO approval. No lengthy bank processes or VC meetings."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community-Driven",
      description: "Real users vote and fund projects they want to see. Build with your future users from day one."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Smart Contract Protection",
      description: "Funds held in escrow smart contracts. Milestone-based releases ensure accountability."
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Technical Validation",
      description: "Our expert DAO members review code quality, technical feasibility, and innovation potential."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Growth Support",
      description: "Get access to our network of advisors, marketing support, and partnership opportunities."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Revenue Sharing",
      description: "Keep majority ownership while sharing success with your early supporters and the DAO."
    }
  ];

  const howItWorks = [
    {
      step: 1,
      icon: <Upload className="h-6 w-6" />,
      title: "Upload Project Blueprint",
      description: "Share renderings, 3D models, videos, and design story to showcase your vision"
    },
    {
      step: 2,
      icon: <Shield className="h-6 w-6" />,
      title: "Prove Ownership & Show Past Work",
      description: "Upload deeds, contracts, permits, and portfolio of past builds with testimonials"
    },
    {
      step: 3,
      icon: <Users className="h-6 w-6" />,
      title: "Create Presale Tiers & Set Goals",
      description: "Token-gated or public presales for early backers with funding goals and milestones"
    },
    {
      step: 4,
      icon: <Vote className="h-6 w-6" />,
      title: "DAO Vetting & Community Voting",
      description: "Gain DAO approval, feedback, and ranking before funding unlocks"
    },
    {
      step: 5,
      icon: <Zap className="h-6 w-6" />,
      title: "Get Funded & Build",
      description: "Receive milestone-based funding and sell out in 4 days to 2 months"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              🚀 DAO-Powered Funding Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Get Your Project Funded by the Community
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Skip traditional VCs. Present your blockchain project to our DAO and get funded by the community that will actually use it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                Submit Your Project
              </Button>
              <Button size="lg" variant="outline">
                View Success Stories
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">$4.2M+</div>
                <div className="text-muted-foreground">Developer Profits</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">156</div>
                <div className="text-muted-foreground">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">&lt; 1 Week</div>
                <div className="text-muted-foreground">Average Sellout Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">47%</div>
                <div className="text-muted-foreground">Average ROI</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sold-Out Success Stories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-600/10 text-green-600 border-green-600/20">
              🚀 Best Sold-Out Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Developers Sold Out in 4 Days to 2.5 Weeks</h2>
            <p className="text-xl text-muted-foreground">
              Real developers, real projects, real profits. Zero upfront cost, maximum returns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {soldOutStories.map((project) => (
              <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20 relative overflow-hidden">
                {/* Sold out badge */}
                <div className="absolute top-4 right-4 z-10 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  SOLD OUT IN {project.selloutTime.toUpperCase()}
                </div>
                
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  {/* ROI overlay */}
                  <div className="absolute bottom-3 left-3 bg-green-600/90 text-white px-2 py-1 rounded text-sm font-bold">
                    +{project.roi} ROI
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className="bg-green-600/10 text-green-600">
                      Completed
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {project.timeline}
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">by {project.creator}</p>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  {/* Financial highlights */}
                  <div className="bg-muted/30 rounded-lg p-4 mb-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Initial DAO Funding</span>
                      <span className="font-bold text-green-600">${project.initialFunding.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Current Value</span>
                      <span className="font-bold">${project.currentValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Developer Profit</span>
                      <span className="font-bold text-green-600">${project.developerProfit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Community Backers</span>
                      <span className="font-semibold">{project.backers}</span>
                    </div>
                  </div>

                  {/* Developer testimonial */}
                  <div className="bg-primary/5 rounded-lg p-3 mb-4">
                    <p className="text-sm italic text-muted-foreground">
                      "{project.developerStory}"
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full" variant="outline">
                    View Case Study
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Current Projects Seeking Presales */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-600/10 text-blue-600 border-blue-600/20">
              🎯 Active Project Campaigns
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Projects Seeking 80% Presale for Greenlight</h2>
            <p className="text-xl text-muted-foreground">
              Once 80% presold, we greenlight full DAO funding. Get in early.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProjects.map((project) => (
              <Card key={project.id} className="bg-gradient-card border-accent/20 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="aspect-video bg-cover bg-center rounded-lg mb-4 relative overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Presale percentage overlay */}
                    <div className="absolute top-3 right-3 bg-blue-600/90 text-white px-2 py-1 rounded text-sm font-bold">
                      {project.presalePercentage}% PRESOLD
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-2">by {project.creator}</p>
                  <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                  
                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Presale Progress: {project.presalePercentage}%</span>
                      <span className="text-sm font-semibold">${project.targetFunding.toLocaleString()} Target</span>
                    </div>
                    <Progress value={project.presalePercentage} className="h-2" />
                    {project.presalePercentage >= 80 && (
                      <div className="text-xs text-green-600 font-semibold mt-1">✅ Greenlit for DAO funding!</div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground">Min. Investment:</span>
                    <span className="text-sm font-semibold text-gold">${project.minInvestment}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground">Est. Annual Yield:</span>
                    <span className="text-sm font-semibold text-green-500">{project.estimatedYield}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground">Community Backers:</span>
                    <span className="text-sm font-semibold">{project.backers}</span>
                  </div>

                  {/* Developer testimonial */}
                  <div className="bg-primary/5 rounded-lg p-3 mb-4">
                    <p className="text-xs italic text-muted-foreground">
                      "{project.developerStory}"
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button className="w-full" variant={project.presalePercentage >= 80 ? "default" : "outline"}>
                    {project.presalePercentage >= 80 ? "View Greenlit Project" : "Support Project"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From idea to funding in 5 detailed steps. Our comprehensive process ensures project success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-bold text-accent-foreground">
                    {step.step}
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-border -translate-y-0.5" 
                         style={{ width: 'calc(100% - 2rem)' }} />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose DAO Funding?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Traditional funding is broken. Get funded by the people who will actually use your product.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Project Requirements */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Project Requirements</h2>
              <p className="text-xl text-muted-foreground">
                What you need to submit for DAO consideration
              </p>
            </div>

            <Tabs defaultValue="technical" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="legal">Legal</TabsTrigger>
              </TabsList>
              
              <TabsContent value="technical" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      Technical Documentation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Required</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Working prototype or MVP</li>
                          <li>• Complete codebase on GitHub</li>
                          <li>• Technical architecture documentation</li>
                          <li>• Smart contract audits (if applicable)</li>
                          <li>• Development roadmap</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Preferred</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Live demo or testnet deployment</li>
                          <li>• API documentation</li>
                          <li>• Security best practices</li>
                          <li>• Performance benchmarks</li>
                          <li>• Open source commitment</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="business" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Business Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Market Analysis</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Target market size and opportunity</li>
                          <li>• Competitor analysis</li>
                          <li>• Unique value proposition</li>
                          <li>• Go-to-market strategy</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Financials</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Detailed budget breakdown</li>
                          <li>• Revenue model</li>
                          <li>• Token economics (if applicable)</li>
                          <li>• Milestone-based funding plan</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="legal" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Legal & Compliance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Documentation</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Team member verification</li>
                          <li>• Company registration documents</li>
                          <li>• Intellectual property rights</li>
                          <li>• Terms of service & privacy policy</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Compliance</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Regulatory compliance plan</li>
                          <li>• KYC/AML procedures</li>
                          <li>• Data protection measures</li>
                          <li>• Risk assessment</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Your Project Funded?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of successful developers who have raised funding through our DAO. 
              Your next big idea is just one submission away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Start Your Application
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Schedule a Call
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Developers;
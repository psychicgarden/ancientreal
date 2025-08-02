import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header"; // Fixed import
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
  const featuredProjects = [
    {
      id: 1,
      title: "DeFi Yield Optimizer",
      creator: "BlockChain Builders",
      description: "Advanced smart contract protocol for maximizing DeFi yields across multiple chains",
      raised: 45000,
      goal: 50000,
      backers: 128,
      timeLeft: "3 days",
      image: "/placeholder.svg",
      tags: ["DeFi", "Smart Contracts", "Yield Farming"],
      status: "funding"
    },
    {
      id: 2,
      title: "NFT Marketplace 3.0",
      creator: "Digital Art Labs",
      description: "Next-generation NFT platform with AI-powered pricing and cross-chain compatibility",
      raised: 75000,
      goal: 60000,
      backers: 245,
      timeLeft: "Funded",
      image: "/placeholder.svg",
      tags: ["NFT", "AI", "Cross-chain"],
      status: "funded"
    },
    {
      id: 3,
      title: "Privacy DEX Protocol",
      creator: "Anonymous Devs",
      description: "Zero-knowledge proof based decentralized exchange for ultimate privacy",
      raised: 32000,
      goal: 80000,
      backers: 89,
      timeLeft: "12 days",
      image: "/placeholder.svg",
      tags: ["Privacy", "DEX", "ZK-Proofs"],
      status: "funding"
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
      title: "Submit Your Project",
      description: "Upload your project details, codebase, demo, and funding requirements"
    },
    {
      step: 2,
      icon: <Shield className="h-6 w-6" />,
      title: "Technical Review",
      description: "Our expert validators review your code, feasibility, and innovation potential"
    },
    {
      step: 3,
      icon: <Vote className="h-6 w-6" />,
      title: "Community Voting",
      description: "DAO members and community vote on funding your project based on merit and potential"
    },
    {
      step: 4,
      icon: <Zap className="h-6 w-6" />,
      title: "Get Funded & Build",
      description: "Receive funding in tranches based on milestones and start building your vision"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">$2.4M+</div>
                <div className="text-muted-foreground">Total Funded</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">156</div>
                <div className="text-muted-foreground">Projects Launched</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">89%</div>
                <div className="text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-xl text-muted-foreground">
              Discover innovative projects currently seeking funding from our DAO
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-t-lg flex items-center justify-center">
                  <Rocket className="h-12 w-12 text-primary/60" />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={project.status === 'funded' ? 'default' : 'secondary'}>
                      {project.status === 'funded' ? 'Funded' : 'Funding'}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {project.timeLeft}
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
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Raised</span>
                      <span className="font-semibold">${project.raised.toLocaleString()}</span>
                    </div>
                    <Progress value={(project.raised / project.goal) * 100} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{project.backers} backers</span>
                      <span className="text-muted-foreground">Goal: ${project.goal.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full" variant={project.status === 'funded' ? 'outline' : 'default'}>
                    {project.status === 'funded' ? 'View Project' : 'Support Project'}
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
              From idea to funding in 4 simple steps. Our streamlined process gets you building faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
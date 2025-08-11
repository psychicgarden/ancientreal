import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProjectInvestmentModal } from "@/components/ProjectInvestmentModal";
import { ProjectSubmissionForm } from "@/components/ProjectSubmissionForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Rocket, Users, DollarSign, Code, Shield, Star, Clock, TrendingUp, Award, Upload, Vote, Zap } from "lucide-react";
const Developers = () => {
  const {
    toast
  } = useToast();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [investmentModalOpen, setInvestmentModalOpen] = useState(false);
  const [submissionFormOpen, setSubmissionFormOpen] = useState(false);

  // Fetch real projects from database and merge with display data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('developer_projects').select('*').order('created_at', {
          ascending: false
        });
        if (error) {
          console.error('Error fetching projects:', error);
          toast({
            title: "Error",
            description: "Failed to load projects",
            variant: "destructive"
          });
          return;
        }
        setProjects(data || []);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [toast]);

  // Merge live funding data with hardcoded display data
  const mergeProjectData = (hardcodedProjects: any[], dbProjects: any[]) => {
    return hardcodedProjects.map(hardcodedProject => {
      const dbProject = dbProjects.find(db => db.id === hardcodedProject.id);
      if (dbProject) {
        const fundingPercentage = dbProject.target_funding > 0 ? (dbProject.current_funding / dbProject.target_funding) * 100 : 0;
        const thresholdNeeded = Math.max(0, (dbProject.target_funding * 0.8) - dbProject.current_funding);
        
        return {
          ...hardcodedProject,
          current_funding: dbProject.current_funding,
          target_funding: dbProject.target_funding,
          presale_percentage: Math.round(fundingPercentage),
          threshold_needed: thresholdNeeded,
          project_status: dbProject.project_status
        };
      }
      return hardcodedProject;
    });
  };

  // SEO: set title, description, and canonical
  useEffect(() => {
    document.title = "Developers — DAO Funding Platform";
    const desc = "Get your project funded by our community DAO with milestone-based releases.";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);
  }, []);

  // Mock success stories matching the exact format from screenshots
  const soldOutStories = [{
    id: 'success-1',
    title: 'Bali Eco Resort Complex',
    creator_name: 'Tropical Builders Co.',
    description: 'Luxury eco-resort with 45 units in Canggu. Sold out in 4 days DAO funding.',
    initial_funding: 850000,
    current_value: 1200000,
    developer_profit: 350000,
    community_backers: 234,
    timeline: 'SOLD OUT IN 4 DAYS',
    development_time: '18 months',
    roi_percentage: 41,
    quote: "Zero upfront cost. We provided full funding after community validation.",
    image_url: '/src/assets/bali-jungle-resort.jpg'
  }, {
    id: 'success-2',
    title: 'Smart City Infrastructure',
    creator_name: 'NextGen Urban',
    description: 'IoT-enabled smart city project with blockchain integration for 200+ residential units',
    initial_funding: 1200000,
    current_value: 1950000,
    developer_profit: 750000,
    community_backers: 456,
    timeline: 'SOLD OUT IN 6 DAYS',
    development_time: '24 months',
    roi_percentage: 63,
    quote: "Community funded, DAO approved. Developer kept 60% equity with zero risk.",
    image_url: '/src/assets/eco-smart-city.jpg'
  }, {
    id: 'success-3',
    title: 'Renewable Energy Villas',
    creator_name: 'GreenTech Developments',
    description: 'Self-sustaining villa complex with solar integration. Sold out in 2.5 weeks.',
    initial_funding: 650000,
    current_value: 920000,
    developer_profit: 270000,
    community_backers: 189,
    timeline: 'SOLD OUT IN 2.5 WEEKS',
    development_time: '15 months',
    roi_percentage: 42,
    quote: "From idea to fully funded in 45 days. No personal investment required.",
    image_url: '/src/assets/villa-bali.jpg'
  }];

  // Current projects seeking 80% - hardcoded to match screenshot
  const currentProjects = [{
    id: 'a47ac10b-58cc-4372-a567-0e02b2c3d478',
    title: 'Digital Nomad Coliving Hub',
    creator_name: 'Remote Work Studios',
    description: 'Modern coliving spaces in Bali designed for digital nomads with high-speed internet, coworking areas, and community events in tropical paradise.',
    target_funding: 450000,
    current_funding: 90000,
    presale_price: 90000,
    min_investment: 45000,
    estimated_yield: 22,
    project_status: 'presale_active',
    timeline: '12 months',
    image_url: '/src/assets/coworking-mallorca.jpg',
    presale_percentage: 20,
    status_badge: 'Presale Active',
    units_sold: '2/10',
    public_markup: '+17.6%',
    threshold_needed: 270000,
    category: 'Real Estate'
  }, {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    title: 'Berber Eco Luxury Riad Retreat',
    creator_name: 'Atlas Desert Developments',
    description: 'Authentic Moroccan riad converted into an eco-luxury retreat with traditional architecture and modern sustainability features.',
    target_funding: 750000,
    current_funding: 525000,
    presale_price: 525000,
    min_investment: 75000,
    estimated_yield: 28,
    project_status: 'presale_active',
    timeline: '18 months',
    image_url: '/src/assets/desert-oasis-morocco.jpg',
    presale_percentage: 70,
    status_badge: 'Presale Active',
    units_sold: '7/10',
    public_markup: '+17.6%',
    threshold_needed: 75000,
    category: 'Hospitality'
  }, {
    id: 'b47ac10b-58cc-4372-a567-0e02b2c3d480',
    title: 'Urban Vertical Farm Complex',
    creator_name: 'AgriTech Builders',
    description: 'Innovative vertical farming facility using hydroponic technology to produce organic vegetables in urban environments.',
    target_funding: 920000,
    current_funding: 734000,
    presale_price: 734000,
    min_investment: 75000,
    estimated_yield: 31,
    project_status: 'funded',
    timeline: '15 months',
    image_url: '/src/assets/eco-smart-city.jpg',
    presale_percentage: 80,
    status_badge: 'Funded - Development Starting',
    units_sold: '8/10',
    public_markup: '+17.6%',
    development_approved: true,
    category: 'Agriculture'
  }];
  const benefits = [{
    icon: <DollarSign className="h-8 w-8" />,
    title: "Instant Funding Access",
    description: "Get funded within 24-48 hours of DAO approval. No lengthy bank processes or VC meetings."
  }, {
    icon: <Users className="h-8 w-8" />,
    title: "Community-Driven",
    description: "Real users vote and fund projects they want to see. Build with your future users from day one."
  }, {
    icon: <Shield className="h-8 w-8" />,
    title: "Smart Contract Protection",
    description: "Funds held in escrow smart contracts. Milestone-based releases ensure accountability."
  }, {
    icon: <Code className="h-8 w-8" />,
    title: "Technical Validation",
    description: "Our expert DAO members review code quality, technical feasibility, and innovation potential."
  }, {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Growth Support",
    description: "Get access to our network of advisors, marketing support, and partnership opportunities."
  }, {
    icon: <Award className="h-8 w-8" />,
    title: "Revenue Sharing",
    description: "Keep majority ownership while sharing success with your early supporters and the DAO."
  }];
  const howItWorks = [{
    step: 1,
    icon: <Upload className="h-6 w-6" />,
    title: "Upload Project Blueprint",
    description: "Share renderings, 3D models, videos, and design story to showcase your vision"
  }, {
    step: 2,
    icon: <Shield className="h-6 w-6" />,
    title: "Prove Ownership & Show Past Work",
    description: "Upload deeds, contracts, permits, and portfolio of past builds with testimonials"
  }, {
    step: 3,
    icon: <Users className="h-6 w-6" />,
    title: "Create Presale Tiers & Set Goals",
    description: "Token-gated or public presales for early backers with funding goals and milestones"
  }, {
    step: 4,
    icon: <Vote className="h-6 w-6" />,
    title: "DAO Vetting & Community Voting",
    description: "Gain DAO approval, feedback, and ranking before funding unlocks"
  }, {
    step: 5,
    icon: <Zap className="h-6 w-6" />,
    title: "Get Funded & Build",
    description: "Receive milestone-based funding and sell out in 4 days to 2 months"
  }];
  const handleInvestClick = (project: any) => {
    setSelectedProject(project);
    setInvestmentModalOpen(true);
  };
  if (loading) {
    return <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <Header />
      <main role="main">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 my-[30px]">
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
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90" onClick={() => setSubmissionFormOpen(true)}>
                Submit Your Project
              </Button>
              <Button size="lg" variant="outline">
                View Success Stories
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">$4.2M+</div>
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
                <div className="text-3xl font-bold text-accent">47%</div>
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
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              🚀 Best Sold-Out Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Developers Sold Out in 4 Days to 2.5 Weeks</h2>
            <p className="text-xl text-muted-foreground">
              Real developers, real projects, real profits. Zero upfront cost, maximum returns.
            </p>
          </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {soldOutStories.map(project => <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-accent/20 relative overflow-hidden">
                {/* Success badge overlay */}
                <div className="absolute top-4 left-4 z-10 bg-accent text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  {project.timeline}
                </div>
                
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                  <img src={project.image_url} alt={project.title} loading="lazy" className="w-full h-full object-cover" />
                  {/* ROI overlay */}
                  <div className="absolute bottom-4 left-4 bg-accent/90 text-primary-foreground px-3 py-2 rounded text-lg font-bold shadow-lg">
                    +{project.roi_percentage}% ROI
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className="bg-accent/15 text-accent-foreground border border-accent/30">
                      Completed
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {project.development_time}
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-accent transition-colors">
                    {project.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">by {project.creator_name}</p>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  {/* Financial metrics */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Initial DAO Funding</span>
                      <span className="font-bold text-accent">${project.initial_funding?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Current Value</span>
                      <span className="font-bold">${project.current_value?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Developer Profit</span>
                      <span className="font-bold text-accent">${project.developer_profit?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Community Backers</span>
                      <span className="font-bold">{project.community_backers}</span>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg mb-4 italic text-sm text-muted-foreground">
                    "{project.quote}"
                  </div>

                  <Button className="w-full">
                    View Full Case Study
                  </Button>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Current Projects Seeking Presales */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              🎯 Active Project Campaigns
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Projects Seeking 80% Presale for Greenlight</h2>
            <p className="text-xl text-muted-foreground">
              Once 80% presold, we greenlight full DAO funding. Get in early.
            </p>
          </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {(() => {
               const mergedProjects = mergeProjectData(currentProjects, projects);
               return mergedProjects.length > 0 ? mergedProjects.map(project => {
                 const fundingPercentage = project.target_funding > 0 ? project.current_funding / project.target_funding * 100 : 0;
              return <Card key={project.id} className="bg-gradient-card border-accent/20 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="aspect-video bg-cover bg-center rounded-lg mb-4 relative overflow-hidden">
                      {project.image_url ? <img src={project.image_url} alt={project.title} loading="lazy" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-muted-foreground">
                          No Image
                        </div>}
                      {/* Presale percentage overlay */}
                      <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground px-2 py-1 rounded text-sm font-bold">
                        {project.presale_percentage}% PRESOLD
                      </div>
                      
                      {/* Development Approved notification */}
                      {project.development_approved && <div className="absolute top-3 left-3 bg-accent/90 text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
                          🎉 Development Approved!
                        </div>}
                      
                      {/* Threshold needed notification */}
                      {project.threshold_needed && <div className="absolute bottom-3 left-3 bg-gold/90 text-gold-foreground px-2 py-1 rounded text-xs font-semibold">
                          ${project.threshold_needed?.toLocaleString()} needed to reach threshold
                        </div>}
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground mb-2">by {project.creator_name}</p>
                    
                    {/* Status badge */}
                    <div className="mb-3">
                      <Badge className={`${project.project_status === 'funded' ? 'bg-accent/15 text-accent-foreground border-accent/30' : 'bg-gold/15 text-gold-foreground border-gold/30'}`}>
                        {project.status_badge}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                    
                    {/* Presale Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Presale Progress</span>
                        <span className="font-semibold">{project.presale_percentage}%</span>
                      </div>
                      <Progress value={project.presale_percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Units Sold: {project.units_sold}</span>
                        <span>Public Markup: {project.public_markup}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Funding Goal</p>
                        <p className="font-semibold">${project.target_funding?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Presale Price</p>
                        <p className="font-semibold">${project.presale_price?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Timeline</p>
                        <p className="font-semibold">{project.timeline || 'TBD'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Min Investment</p>
                        <p className="font-semibold">${project.min_investment?.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-4 mb-4">
                      <Badge variant="secondary" className="text-xs">
                        {project.category || 'Development'}
                      </Badge>
                    </div>
                    
                    {/* Show different button based on funding status */}
                    {fundingPercentage >= 80 ? (
                      <Button className="w-full" variant="secondary" disabled>
                        Development Approved ✓
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={() => handleInvestClick(project)}>
                        Invest Now
                      </Button>
                    )}
                  </CardContent>
                </Card>;
               }) : <div className="col-span-full text-center py-8">
                 <p className="text-muted-foreground">No active projects seeking funding.</p>
               </div>;
              })()}
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
            {howItWorks.map((step, index) => <div key={step.step} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-bold text-accent-foreground">
                    {step.step}
                  </div>
                  {index < howItWorks.length - 1 && <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-border -translate-y-0.5" style={{
                  width: 'calc(100% - 2rem)'
                }} />}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>)}
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
            {benefits.map((benefit, index) => <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>)}
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

      </main>
      <Footer />
      {/* Investment Modal */}
      {selectedProject && <ProjectInvestmentModal open={investmentModalOpen} onOpenChange={setInvestmentModalOpen} project={{
      ...selectedProject,
      id: String(selectedProject.id)
    }} />}

      {/* Project Submission Modal */}
      <Dialog open={submissionFormOpen} onOpenChange={setSubmissionFormOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
          <ProjectSubmissionForm onClose={() => setSubmissionFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>;
};
export default Developers;
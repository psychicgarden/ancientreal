import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Search, CreditCard, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ClearInvestmentFlow = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Search,
      number: "01",
      title: "Browse Properties",
      description: "Explore our curated portfolio of verified luxury properties across 25+ countries",
      action: "View Properties",
      route: "/investor"
    },
    {
      icon: CreditCard,
      number: "02", 
      title: "Invest Instantly",
      description: "Start with as little as $1,000. Fractional ownership makes global real estate accessible",
      action: "Start Investing",
      route: "/investor"
    },
    {
      icon: Home,
      number: "03",
      title: "Own & Earn",
      description: "Receive rental income monthly and watch your property appreciate over time",
      action: "View Portfolio",
      route: "/portfolio"
    }
  ];

  return (
    <section className="py-24 bg-gradient-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-accent-foreground mb-4">
            Three Simple Steps to Global Property Ownership
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            No complex paperwork, no international banking headaches, no minimum investment barriers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="h-full border-border/20 hover:shadow-luxury transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  {/* Step Number */}
                  <div className="text-6xl font-light text-gold/20 mb-4">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="flex items-center justify-center w-16 h-16 bg-accent/10 rounded-xl mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                    <step.icon className="w-8 h-8 text-accent" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-semibold text-accent-foreground mb-4">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    {step.description}
                  </p>

                  {/* CTA Button */}
                  <Button 
                    variant="outline" 
                    className="w-full border-accent/20 hover:bg-accent hover:text-accent-foreground"
                    onClick={() => navigate(step.route)}
                  >
                    {step.action}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Arrow connector (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-gold/40" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Main CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="text-lg px-8 py-4 bg-gradient-primary hover:shadow-button transition-all duration-300"
            onClick={() => navigate('/investor')}
          >
            Start Your Investment Journey
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Join 12,000+ investors already building wealth through global property ownership
          </p>
        </div>
      </div>
    </section>
  );
};

export default ClearInvestmentFlow;
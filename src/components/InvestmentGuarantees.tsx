import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, RefreshCw, FileCheck, Headphones } from "lucide-react";

const InvestmentGuarantees = () => {
  const guarantees = [
    {
      icon: RefreshCw,
      title: "30-Day Money Back",
      description: "Not satisfied with your investment? Get a full refund within 30 days of your first purchase.",
      highlight: "100% Refund Guarantee"
    },
    {
      icon: Shield,
      title: "Property Insurance",
      description: "All properties are fully insured against natural disasters, structural damage, and rental income loss.",
      highlight: "Up to $2M Coverage"
    },
    {
      icon: FileCheck,
      title: "Legal Protection",
      description: "Your ownership rights are protected by international law and recorded on immutable blockchain.",
      highlight: "Legally Binding Ownership"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Get expert help anytime with our dedicated investor support team and property managers.",
      highlight: "Always Available"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-accent-foreground mb-4">
            Invest with Complete Confidence
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your investment is protected by multiple layers of security, insurance, and legal safeguards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {guarantees.map((guarantee, index) => (
            <Card key={index} className="text-center border-border/20 hover:shadow-card transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center w-16 h-16 bg-accent/10 rounded-xl mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <guarantee.icon className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-xl text-accent-foreground">
                  {guarantee.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-semibold text-gold mb-3">
                  {guarantee.highlight}
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {guarantee.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Legal Compliance Footer */}
        <div className="mt-16 p-6 bg-accent/5 rounded-xl border border-border/20">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-accent-foreground mb-2">
              Regulatory Compliance & Security
            </h3>
            <p className="text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              Boho Shares operates under full regulatory compliance with SEC guidelines for investment securities. 
              All properties undergo thorough due diligence, legal verification, and continuous monitoring. 
              Your funds are held in segregated accounts and protected by FDIC insurance up to $250,000 per investor.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentGuarantees;
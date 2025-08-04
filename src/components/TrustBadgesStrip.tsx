import { Shield, Award, Users, DollarSign, Building, Zap } from "lucide-react";

const TrustBadgesStrip = () => {
  const badges = [
    {
      icon: Shield,
      label: "SEC Compliant",
      sublabel: "Regulated Investment"
    },
    {
      icon: Award,
      label: "SOC 2 Certified",
      sublabel: "Security Audited"
    },
    {
      icon: Users,
      label: "12,000+ Investors",
      sublabel: "Global Community"
    },
    {
      icon: DollarSign,
      label: "$2.3B+ AUM",
      sublabel: "Assets Under Management"
    },
    {
      icon: Building,
      label: "500+ Properties",
      sublabel: "Verified Portfolio"
    },
    {
      icon: Zap,
      label: "14.2% Avg Returns",
      sublabel: "Historical Performance"
    }
  ];

  return (
    <section className="py-12 bg-accent/5 border-y border-border/20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {badges.map((badge, index) => (
            <div key={index} className="text-center group">
              <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-xl mx-auto mb-3 group-hover:bg-accent/20 transition-colors">
                <badge.icon className="w-6 h-6 text-accent" />
              </div>
              <div className="text-sm font-semibold text-accent-foreground mb-1">
                {badge.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {badge.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadgesStrip;
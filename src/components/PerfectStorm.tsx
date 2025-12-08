import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Building2, 
  Laptop, 
  TrendingDown, 
  Clock, 
  Wallet, 
  Building, 
  MapPin, 
  CreditCard 
} from "lucide-react";

const trends = [
  {
    icon: Globe,
    title: "Digital Nomad Boom",
    stat: "35M → 100M",
    description: "Global nomad population tripling by 2030",
    color: "text-blue-500"
  },
  {
    icon: Building2,
    title: "Tokenized Real Estate",
    stat: "$300B by 2030",
    description: "Real-world assets moving on-chain",
    color: "text-purple-500"
  },
  {
    icon: Laptop,
    title: "Remote Work Default",
    stat: "70% Hybrid",
    description: "Location independence is the new normal",
    color: "text-green-500"
  },
  {
    icon: TrendingDown,
    title: "Affordability Crisis",
    stat: "Home Prices 5x Income",
    description: "Traditional markets pricing out buyers",
    color: "text-red-500"
  },
  {
    icon: Clock,
    title: "Delayed Homeownership",
    stat: "Age 34 → 40+",
    description: "First-time buyers pushed to their 40s",
    color: "text-orange-500"
  },
  {
    icon: Wallet,
    title: "Millennial Capital",
    stat: "$73T Transfer",
    description: "Largest wealth transfer in history incoming",
    color: "text-emerald-500"
  },
  {
    icon: Building,
    title: "BlackRock Scale-Up",
    stat: "$10T AUM",
    description: "Institutions racing into real assets",
    color: "text-slate-500"
  },
  {
    icon: MapPin,
    title: "50+ Countries",
    stat: "Digital Nomad Visas",
    description: "Governments competing for remote workers",
    color: "text-cyan-500"
  },
  {
    icon: CreditCard,
    title: "$750B Mortgage Blackout",
    stat: "Zero Access",
    description: "Credit-invisible buyers locked out globally",
    color: "text-pink-500"
  }
];

const PerfectStorm = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary"></div>
            <Badge variant="outline" className="text-sm font-medium text-primary uppercase tracking-wider border-primary/50">
              Market Timing
            </Badge>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The Perfect Storm: <span className="text-primary">Why Now?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Nine converging megatrends creating a once-in-a-generation opportunity
          </p>
        </div>

        {/* 9-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trends.map((trend, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-muted/50 ${trend.color} group-hover:scale-110 transition-transform duration-300`}>
                    <trend.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 text-foreground">
                      {trend.title}
                    </h3>
                    <div className={`text-2xl font-bold mb-2 ${trend.color}`}>
                      {trend.stat}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {trend.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground">
            <span className="font-semibold text-foreground">The window is open.</span> These trends won't wait.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PerfectStorm;

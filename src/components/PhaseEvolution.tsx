import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Network, Globe, ArrowRight, Building, Users, TrendingUp } from "lucide-react";

const PhaseEvolution = () => {
  const phases = [
    {
      phase: 1,
      title: "Proof Engine",
      subtitle: "Seed Stage",
      timeline: "Years 0-2",
      icon: Zap,
      color: "primary",
      metrics: [
        "2 strategic flips (Peru + Brazil)",
        "32 units prove legal & tech rails",
        "~$4.5M GMV validates model",
        "OCCR credit data foundation"
      ],
      value: "$4.5M",
      valueLabel: "GMV"
    },
    {
      phase: 2,
      title: "Developer Platform",
      subtitle: "Series A",
      timeline: "Years 2-5",
      icon: Network,
      color: "emerald",
      metrics: [
        "Open protocol to 3rd party developers",
        "1,000+ partner-financed units",
        "Stop building, start financing",
        "Institutional debt facility secured"
      ],
      value: "$75M",
      valueLabel: "GMV"
    },
    {
      phase: 3,
      title: "Network State",
      subtitle: "Series B+",
      timeline: "Years 5-10",
      icon: Globe,
      color: "blue",
      metrics: [
        "10,000+ properties globally",
        "OCCR data licensing dominant",
        "$150M+ annual revenue",
        "Securitization & institutional scale"
      ],
      value: "$1.5B+",
      valueLabel: "GMV"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
      primary: {
        bg: "from-primary/5 to-primary/10",
        border: "border-primary/20",
        text: "text-primary",
        iconBg: "bg-primary/20"
      },
      emerald: {
        bg: "from-emerald-500/5 to-emerald-500/10",
        border: "border-emerald-500/20",
        text: "text-emerald-500",
        iconBg: "bg-emerald-500/20"
      },
      blue: {
        bg: "from-blue-500/5 to-blue-500/10",
        border: "border-blue-500/20",
        text: "text-blue-500",
        iconBg: "bg-blue-500/20"
      }
    };
    return colors[color] || colors.primary;
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Mission Statement Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
            Strategic Evolution
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            From Engine → Ecosystem
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We build 32 homes to prove the rails work. Then we finance 10,000+ without touching concrete.
          </p>
          
          {/* Mission Statement */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 max-w-4xl mx-auto border border-primary/20">
            <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed">
              <span className="text-primary">"</span>
              Hardware-enabled software play: We build homes to prove the legal rails, 
              then finance thousands globally without laying a brick.
              <span className="text-primary">"</span>
            </p>
          </div>
        </div>

        {/* Three Phase Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {phases.map((phase, idx) => {
            const colors = getColorClasses(phase.color);
            const Icon = phase.icon;
            
            return (
              <Card 
                key={phase.phase} 
                className={`relative overflow-hidden border-2 ${colors.border} bg-gradient-to-br ${colors.bg}`}
              >
                <CardContent className="p-8">
                  <div className="text-center space-y-5">
                    {/* Phase Number Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge variant="outline" className={`${colors.border} ${colors.text}`}>
                        Phase {phase.phase}
                      </Badge>
                    </div>
                    
                    {/* Icon */}
                    <div className={`w-20 h-20 ${colors.iconBg} rounded-full flex items-center justify-center mx-auto mt-4`}>
                      <Icon className={`w-10 h-10 ${colors.text}`} />
                    </div>
                    
                    {/* Title */}
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{phase.title}</h3>
                      <div className={`text-sm font-medium ${colors.text}`}>{phase.subtitle}</div>
                      <div className="text-sm text-muted-foreground">{phase.timeline}</div>
                    </div>
                    
                    {/* Value */}
                    <div className="py-3 px-4 bg-background/50 rounded-lg">
                      <div className={`text-3xl font-bold ${colors.text}`}>{phase.value}</div>
                      <div className="text-sm text-muted-foreground">{phase.valueLabel}</div>
                    </div>
                    
                    {/* Metrics */}
                    <div className="space-y-2 text-left">
                      {phase.metrics.map((metric, mIdx) => (
                        <div key={mIdx} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 ${colors.text.replace('text-', 'bg-')} rounded-full mt-2 flex-shrink-0`}></div>
                          <span className="text-sm text-muted-foreground">{metric}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                
                {/* Arrow connector (not on last card) */}
                {idx < phases.length - 1 && (
                  <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center border-2 border-border">
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Value Progression Flow */}
        <Card className="bg-gradient-to-r from-primary/5 via-emerald-500/5 to-blue-500/5 border-border/50">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">$4.5M</div>
                <div className="text-sm text-muted-foreground">Seed Phase GMV</div>
                <div className="text-xs text-muted-foreground/70">32 units, 2 countries</div>
              </div>
              
              <div className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block" />
                <div className="text-center px-4 py-2 bg-background/50 rounded-lg">
                  <div className="text-xs font-medium text-emerald-500">Platform Opens</div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block" />
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-500 mb-1">$75M</div>
                <div className="text-sm text-muted-foreground">Year 5 GMV</div>
                <div className="text-xs text-muted-foreground/70">1,000+ partner units</div>
              </div>
              
              <div className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block" />
                <div className="text-center px-4 py-2 bg-background/50 rounded-lg">
                  <div className="text-xs font-medium text-blue-500">Securitization</div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block" />
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-1">$1.5B+</div>
                <div className="text-sm text-muted-foreground">Year 10 GMV</div>
                <div className="text-xs text-muted-foreground/70">10,000+ properties</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PhaseEvolution;

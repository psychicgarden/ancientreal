import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, ArrowRight, TrendingUp, Shield, Smartphone, Globe, BarChart3 } from 'lucide-react';

const PlatformAssessment = () => {
  const techSufficiencyAssessment = [
    {
      category: "Smart Contracts",
      status: "production-ready",
      progress: 95,
      details: [
        "MazunteMortgageV2.sol - Security audit complete",
        "Secondary marketplace contracts deployed",
        "Multi-signature wallet integration",
        "KYC verification with cryptographic signatures"
      ]
    },
    {
      category: "Frontend Platform",
      status: "production-ready", 
      progress: 90,
      details: [
        "React/TypeScript architecture complete",
        "Mobile-responsive design system",
        "Real-time portfolio analytics",
        "Multi-currency support framework"
      ]
    },
    {
      category: "Database & Backend",
      status: "production-ready",
      progress: 85,
      details: [
        "Supabase integration with RLS policies",
        "Property fractionalization system",
        "User transaction tracking",
        "Rental income distribution automation"
      ]
    },
    {
      category: "Multi-Jurisdiction Support",
      status: "needs-development",
      progress: 40,
      details: [
        "Basic framework for multiple countries",
        "KYC compliance structure in place",
        "Legal document templates needed",
        "Local payment gateway integrations required"
      ]
    }
  ];

  const currentBudgetAllocation = {
    "Platform & Tech": 350000,
    "Contingency": 465000,
    "Audit Ring-fence": 50000
  };

  const enhancementPriorities = [
    {
      priority: "Phase 1 (Pre-Flip 1)",
      icon: <Smartphone className="w-5 h-5" />,
      items: [
        "Mobile app for property management",
        "Enhanced KYC for Mexican jurisdiction", 
        "Spanish language support",
        "Local payment gateway (Mexico)"
      ],
      budget: "$75K",
      timeline: "3 months"
    },
    {
      priority: "Phase 2 (Pre-Flip 2)",
      icon: <BarChart3 className="w-5 h-5" />,
      items: [
        "Advanced investor analytics dashboard",
        "Portuguese language support",
        "Brazilian compliance integration",
        "Multi-property portfolio tracking"
      ],
      budget: "$85K",
      timeline: "6 months"
    },
    {
      priority: "Phase 3 (Scale Phase)",
      icon: <Globe className="w-5 h-5" />,
      items: [
        "European compliance (Greece/Spain)",
        "Multi-language support (Greek/Turkish)",
        "Advanced secondary marketplace",
        "Institutional investor tools"
      ],
      budget: "$140K",
      timeline: "12 months"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Platform Assessment & Budget Optimization</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Comprehensive analysis of current platform readiness and strategic budget allocation for the $6.5M development flywheel
        </p>
      </div>

      {/* Current Platform Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Current Platform Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {techSufficiencyAssessment.map((assessment, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{assessment.category}</h4>
                  <Badge 
                    variant={assessment.status === 'production-ready' ? 'default' : 'secondary'}
                    className={assessment.status === 'production-ready' ? 'bg-green-500/10 text-green-600 border-green-500/20' : ''}
                  >
                    {assessment.status === 'production-ready' ? (
                      <><CheckCircle className="w-3 h-3 mr-1" /> Ready</>
                    ) : (
                      <><AlertTriangle className="w-3 h-3 mr-1" /> Needs Work</>
                    )}
                  </Badge>
                </div>
                <Progress value={assessment.progress} className="h-2" />
                <div className="text-sm text-muted-foreground space-y-1">
                  {assessment.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Budget Allocation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Current Budget Allocation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                <span className="font-medium">Platform & Tech</span>
                <span className="font-mono text-primary font-semibold">
                  ${currentBudgetAllocation["Platform & Tech"].toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <span className="font-medium">Contingency</span>
                <span className="font-mono">${currentBudgetAllocation["Contingency"].toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                <span className="font-medium">Audit Ring-fence</span>
                <span className="font-mono text-amber-700">${currentBudgetAllocation["Audit Ring-fence"].toLocaleString()}</span>
              </div>
            </div>
            <div className="text-center text-sm text-primary">
              Total Tech Budget: <span className="font-semibold">5.4%</span> of total cap ($400K total)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhancement Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Enhancement Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {enhancementPriorities.map((phase, index) => (
              <div key={index} className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    {phase.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{phase.priority}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{phase.budget}</span>
                        <span>{phase.timeline}</span>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-2">
                      {phase.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {index < enhancementPriorities.length - 1 && (
                  <div className="flex justify-center my-4">
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Mitigation Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Risk Mitigation Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">Technical Risks - LOW</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Core platform 85%+ complete</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Smart contracts audited & secure</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Ring-fenced audit budget</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-amber-600">Localization Risks - MEDIUM</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Multi-jurisdiction compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Phased rollout by flip</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Local partnerships planned</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-600">Scale Preparation</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Series A readiness post-Flip 2</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Institutional investor tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Advanced marketplace features</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformAssessment;
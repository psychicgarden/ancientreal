import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Award, Users, CheckCircle, Lock, Globe } from "lucide-react";

export const TrustSignals = () => {
  const legalPartners = [
    { name: "Nevis Island Administration", logo: "🏛️", type: "Government Entity" },
    { name: "Mexican Property Registry", logo: "🇲🇽", type: "Official Registry" },
    { name: "Blockchain Audit Co.", logo: "🔍", type: "Smart Contract Audit" }
  ];

  const securityFeatures = [
    { icon: <Shield className="h-5 w-5" />, title: "Multi-Sig Wallet", desc: "Time-locked admin operations" },
    { icon: <Lock className="h-5 w-5" />, title: "Circuit Breakers", desc: "Automated withdrawal limits" },
    { icon: <CheckCircle className="h-5 w-5" />, title: "Oracle Network", desc: "Decentralized property valuations" },
    { icon: <Award className="h-5 w-5" />, title: "Yield Farming", desc: "Auto-compounding strategies" }
  ];

  const complianceStats = [
    { metric: "22.5k+", label: "KYC Verified Users", color: "text-green-600" },
    { metric: "€32M+", label: "Assets Under Management", color: "text-blue-600" },
    { metric: "156", label: "Properties Tokenized", color: "text-purple-600" },
    { metric: "99.7%", label: "Uptime Guarantee", color: "text-green-600" }
  ];

  return (
    <div className="space-y-8">
      {/* Security & Compliance Overview */}
      <Card className="bg-gradient-to-r from-green-50/50 to-blue-50/50 border-green-200/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-600" />
            Industry-Leading Security & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {complianceStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.metric}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                <div className="text-blue-600">{feature.icon}</div>
                <div>
                  <div className="font-semibold text-sm">{feature.title}</div>
                  <div className="text-xs text-muted-foreground">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legal Partners */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6" />
            Legal Partners & Registrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {legalPartners.map((partner, index) => (
              <div key={index} className="flex items-center gap-3 p-4 border rounded-lg">
                <div className="text-2xl">{partner.logo}</div>
                <div>
                  <div className="font-semibold">{partner.name}</div>
                  <Badge variant="secondary" className="text-xs">{partner.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="p-6">
            <Award className="h-12 w-12 text-gold mx-auto mb-3" />
            <div className="font-semibold">Smart Contract Audited</div>
            <div className="text-sm text-muted-foreground">OpenZeppelin Standards</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-3" />
            <div className="font-semibold">DAO Governed</div>
            <div className="text-sm text-muted-foreground">Community Validation</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <Shield className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <div className="font-semibold">Regulatory Compliant</div>
            <div className="text-sm text-muted-foreground">Multi-Jurisdiction</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
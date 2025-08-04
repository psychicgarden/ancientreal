import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Star, Shield, Zap, Globe } from "lucide-react";

export const CompetitorComparison = () => {
  const features = [
    { feature: "Smart Contract Security", boho: true, reental: false, realt: false, binaryx: false },
    { feature: "Multi-Sig Admin Functions", boho: true, reental: false, realt: false, binaryx: false },
    { feature: "Circuit Breaker Protection", boho: true, reental: false, realt: false, binaryx: false },
    { feature: "Oracle Price Feeds", boho: true, reental: false, realt: false, binaryx: false },
    { feature: "Yield Farming", boho: true, reental: true, realt: false, binaryx: false },
    { feature: "Secondary Marketplace", boho: true, reental: true, realt: true, binaryx: false },
    { feature: "Fractional Ownership", boho: true, reental: true, realt: true, binaryx: true },
    { feature: "Legal Compliance Portal", boho: true, reental: false, realt: false, binaryx: false },
    { feature: "Multi-Jurisdiction Structure", boho: true, reental: false, realt: false, binaryx: false },
    { feature: "Automated Income Distribution", boho: true, reental: true, realt: true, binaryx: true }
  ];

  const platforms = [
    {
      name: "Boho Shares",
      logo: "🏡",
      aum: "$4.2M+",
      users: "22.5k+",
      properties: "156",
      avgRoi: "47%",
      highlights: ["Most Advanced Smart Contracts", "Best Security Features", "Multi-Jurisdiction Legal"],
      color: "border-primary bg-primary/5"
    },
    {
      name: "Reental",
      logo: "🏢",
      aum: "€32M+",
      users: "22.5k+",
      properties: "200+",
      avgRoi: "12%",
      highlights: ["Established Market", "Good Liquidity", "Simple Interface"],
      color: "border-gray-300 bg-gray-50"
    },
    {
      name: "RealT",
      logo: "🏠",
      aum: "$100M+",
      users: "15k+",
      properties: "400+",
      avgRoi: "9%",
      highlights: ["Large Portfolio", "US Focus", "Daily Yields"],
      color: "border-gray-300 bg-gray-50"
    },
    {
      name: "BinaryX",
      logo: "🌴",
      aum: "$15M+",
      users: "8k+",
      properties: "50+",
      avgRoi: "15%",
      highlights: ["Bali Focus", "Tourism Properties", "Simple Tokens"],
      color: "border-gray-300 bg-gray-50"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {platforms.map((platform, index) => (
          <Card key={index} className={platform.color}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{platform.logo}</span>
                <CardTitle className="text-lg">{platform.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">AUM</span>
                  <span className="font-semibold">{platform.aum}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Users</span>
                  <span className="font-semibold">{platform.users}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Properties</span>
                  <span className="font-semibold">{platform.properties}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg ROI</span>
                  <span className="font-semibold text-green-600">{platform.avgRoi}</span>
                </div>
              </div>
              
              <div className="mt-4 space-y-1">
                {platform.highlights.map((highlight, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-6 w-6 text-gold" />
            Technical & Feature Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Feature</th>
                  <th className="text-center p-3 font-semibold text-primary">Boho Shares</th>
                  <th className="text-center p-3 font-semibold">Reental</th>
                  <th className="text-center p-3 font-semibold">RealT</th>
                  <th className="text-center p-3 font-semibold">BinaryX</th>
                </tr>
              </thead>
              <tbody>
                {features.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-muted/30">
                    <td className="p-3 font-medium">{row.feature}</td>
                    <td className="text-center p-3">
                      {row.boho ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-3">
                      {row.reental ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-3">
                      {row.realt ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-3">
                      {row.binaryx ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Our Advantages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Security Leadership
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Only platform with multi-sig wallets, circuit breakers, and time-locked operations.
            </p>
            <Badge className="bg-primary/10 text-primary">Industry First</Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50/50 to-blue-50/50 border-green-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-green-600" />
              DeFi Innovation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Advanced yield farming, oracle integration, and secondary marketplace AMM.
            </p>
            <Badge className="bg-green-100 text-green-700">Most Advanced</Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 border-blue-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-blue-600" />
              Legal Innovation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Nevis + Mexican structure with integrated compliance portal.
            </p>
            <Badge className="bg-blue-100 text-blue-700">Most Compliant</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Star,
  Crown,
  Award,
  Plane,
  Vote,
  Calendar
} from "lucide-react";

export const FractionalInvestingExplanation = () => {
  return (
    <div className="space-y-6">
      {/* Main Explanation */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Fractional Property Investing</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-muted-foreground">
            Own a piece of premium real estate without buying the whole property. Purchase fractional tokens 
            representing shares in vacation homes, rental properties, and development projects worldwide.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-green-500 mt-1" />
              <div>
                <h4 className="font-semibold">Low Entry Point</h4>
                <p className="text-sm text-muted-foreground">Start investing with as little as $50</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-500 mt-1" />
              <div>
                <h4 className="font-semibold">Property Appreciation</h4>
                <p className="text-sm text-muted-foreground">Benefit from real estate value growth</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-purple-500 mt-1" />
              <div>
                <h4 className="font-semibold">Peer-to-Peer Trading</h4>
                <p className="text-sm text-muted-foreground">Trade your tokens with other investors</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ancient Investor Tier System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            Ancient Investor Tier System
          </CardTitle>
          <p className="text-muted-foreground">
            Unlock exclusive travel benefits and perks as you grow your investment portfolio
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bronze Nomad */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-600" />
                  <h3 className="font-semibold">Bronze Nomad</h3>
                </div>
                <Badge variant="outline" className="text-amber-600 border-amber-600">$500+</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>50% off 1 week stay per year</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span>Early access to new properties</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Annual Value: $500
                </div>
              </div>
            </div>

            {/* Silver Voyager */}
            <div className="border rounded-lg p-4 space-y-3 border-blue-200 bg-blue-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Silver Voyager</h3>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-600">$5,000+</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-muted-foreground" />
                  <span>1 free week per year</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>10% discount on all stays</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span>Priority booking access</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Annual Value: $2,500
                </div>
              </div>
            </div>

            {/* Gold Wayfarer */}
            <div className="border rounded-lg p-4 space-y-3 border-yellow-200 bg-yellow-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-semibold">Gold Wayfarer</h3>
                </div>
                <Badge variant="outline" className="text-yellow-600 border-yellow-600">$10,000+</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-muted-foreground" />
                  <span>2 free weeks per year</span>
                </div>
                <div className="flex items-center gap-2">
                  <Vote className="h-4 w-4 text-muted-foreground" />
                  <span>DAO voting rights</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Private investor events</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Annual Value: $5,000
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
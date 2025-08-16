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

export const MortgageGroupsExplanation = () => {
  return (
    <div className="space-y-6">
      {/* Main Explanation */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Mortgage Group Investing</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-muted-foreground">
            Join small groups to collectively purchase vacation properties. Pool your resources 
            with 3-6 other investors to own premium real estate in exotic locations worldwide.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-green-500 mt-1" />
              <div>
                <h4 className="font-semibold">Group Down Payment</h4>
                <p className="text-sm text-muted-foreground">Split the 20% down payment among group members</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Home className="h-5 w-5 text-blue-500 mt-1" />
              <div>
                <h4 className="font-semibold">Shared Ownership</h4>
                <p className="text-sm text-muted-foreground">Each member owns an equal share of the property</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-purple-500 mt-1" />
              <div>
                <h4 className="font-semibold">Rental Income</h4>
                <p className="text-sm text-muted-foreground">Split monthly rental profits proportionally</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};
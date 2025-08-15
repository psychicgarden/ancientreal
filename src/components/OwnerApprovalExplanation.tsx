import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Shield, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

export const OwnerApprovalExplanation = () => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Owner-Approved Fractional Investments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          All properties shown here have been explicitly approved by their owners for fractional investment. 
          This ensures authenticity and property owner consent.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Owner Verified</h4>
              <p className="text-xs text-muted-foreground">
                Property owners set their own valuations and rental income data
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Real Market Data</h4>
              <p className="text-xs text-muted-foreground">
                Returns based on actual rental income, not estimates
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Community Driven</h4>
              <p className="text-xs text-muted-foreground">
                Property owners actively participate in the marketplace
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-blue-200">
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Owner Listed
          </Badge>
          <span className="text-sm text-muted-foreground">
            This badge indicates properties with owner approval
          </span>
          <div className="flex-1"></div>
          <Button asChild variant="outline" size="sm">
            <Link to="/property-owner">
              List Your Property
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
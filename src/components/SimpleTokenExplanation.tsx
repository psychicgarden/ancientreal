import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Coins, 
  DollarSign, 
  TrendingUp, 
  Zap
} from "lucide-react";

export const SimpleTokenExplanation = () => {
  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Coins className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Buy Property Tokens</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg text-muted-foreground">
          Purchase tokens representing ownership shares in individual properties. 
          Start with small amounts and build your real estate portfolio token by token.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h4 className="font-semibold">Flexible Investment</h4>
              <p className="text-sm text-muted-foreground">Buy any amount starting from $50</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-blue-500 mt-1" />
            <div>
              <h4 className="font-semibold">Instant Liquidity</h4>
              <p className="text-sm text-muted-foreground">Trade your tokens anytime on our marketplace</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-purple-500 mt-1" />
            <div>
              <h4 className="font-semibold">Immediate Returns</h4>
              <p className="text-sm text-muted-foreground">Earn rental income from day one</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
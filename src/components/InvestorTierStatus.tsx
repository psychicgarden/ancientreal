import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Crown, Star, Trophy, User } from "lucide-react";
import { calculateInvestorTier, getNextTierThreshold, getTierProgress } from "@/lib/utils";

interface InvestorTierStatusProps {
  totalInvestmentAmount: number;
  propertyName?: string;
  className?: string;
}

const tierIcons = {
  none: User,
  bronze: Star,
  silver: Trophy,
  gold: Crown
};

const tierColors = {
  none: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  bronze: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  silver: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200", 
  gold: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
};

export const InvestorTierStatus: React.FC<InvestorTierStatusProps> = ({ 
  totalInvestmentAmount,
  propertyName,
  className = ""
}) => {
  const currentTier = calculateInvestorTier(totalInvestmentAmount);
  const nextThreshold = getNextTierThreshold(currentTier.name);
  const progress = getTierProgress(totalInvestmentAmount, currentTier.name);
  const TierIcon = tierIcons[currentTier.name as keyof typeof tierIcons] || User;

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Ancient Investor Status</CardTitle>
          <Badge className={tierColors[currentTier.name as keyof typeof tierColors] || tierColors.none}>
            <TierIcon className="w-4 h-4 mr-1" />
            {currentTier.displayName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Total Investment: {formatCurrency(totalInvestmentAmount)}</span>
            {nextThreshold && <span>Next Tier: {formatCurrency(nextThreshold)}</span>}
          </div>
          {nextThreshold && (
            <Progress value={progress} className="h-2" />
          )}
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Your Tier Benefits{propertyName ? ` at ${propertyName}` : ''}:</h4>
          <ul className="space-y-1">
            {currentTier.benefits.map((benefit, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start">
                <span className="text-green-500 mr-2">•</span>
                {propertyName ? benefit.replace('at any owned property', `at ${propertyName}`) : benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Annual Tier Value: <span className="font-semibold text-foreground">{formatCurrency(currentTier.annualValue)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
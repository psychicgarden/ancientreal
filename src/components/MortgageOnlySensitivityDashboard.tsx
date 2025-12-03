import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { calculateMortgageOnlyScenario, ScenarioInputs } from "@/lib/revenueScenarios";
import { TrendingUp, DollarSign, Percent, Home } from "lucide-react";
export const MortgageOnlySensitivityDashboard: React.FC = () => {
  const [apr, setApr] = useState(10.5);
  const [cashRate, setCashRate] = useState(20);
  const [termYears, setTermYears] = useState(15);
  const inputs: ScenarioInputs = {
    apr,
    cashPurchaseRate: cashRate / 100,
    totalUnits: 147,
    avgPropertyPrice: 142366,
    // Weighted average across flips
    platformFeeRate: 0.03,
    termYears,
    appreciationRate: 0.07,
    // Not used in mortgage-only
    samShare: 0 // No SAM
  };
  const result = calculateMortgageOnlyScenario(inputs, "Mortgage-Only");
  const getRecommendation = () => {
    if (apr >= 10 && cashRate >= 30) {
      return "Conservative model with higher APR and cash rates. Strong interest revenue with minimal appreciation risk exposure.";
    } else if (apr <= 7 && cashRate <= 15) {
      return "Buyer-friendly rates maximize adoption. Lower revenue compensated by higher volume potential.";
    } else if (termYears <= 10) {
      return "Accelerated payback period improves IRR. Consider for cash-focused strategy.";
    } else {
      return "Balanced mortgage model. Provides steady interest income without SAM complexity.";
    }
  };
  return <Card className="w-full border-border/50 shadow-lg">
      
    </Card>;
};
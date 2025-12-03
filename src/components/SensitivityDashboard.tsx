import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { calculateScenario, ScenarioInputs } from "@/lib/revenueScenarios";
import { TrendingUp, DollarSign, Percent } from "lucide-react";
export const SensitivityDashboard: React.FC = () => {
  const [apr, setApr] = useState(10.5);
  const [cashRate, setCashRate] = useState(20);
  const [termYears, setTermYears] = useState(15);
  const inputs: ScenarioInputs = {
    apr,
    cashPurchaseRate: cashRate / 100,
    totalUnits: 112,
    avgPropertyPrice: 143000,
    platformFeeRate: 0.035,
    termYears,
    appreciationRate: 0.07,
    samShare: 0.30
  };
  const result = calculateScenario(inputs, "Custom Scenario");
  return <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
      
    </Card>;
};
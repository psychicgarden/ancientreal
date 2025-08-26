import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link2, TestTube } from "lucide-react";

export type PropertyMode = "onchain" | "demo";

interface PropertyModeToggleProps {
  mode: PropertyMode;
  onModeChange: (mode: PropertyMode) => void;
  onChainCount: number;
  demoCount: number;
  className?: string;
}

export const PropertyModeToggle = ({
  mode,
  onModeChange,
  onChainCount,
  demoCount,
  className = ""
}: PropertyModeToggleProps) => {
  // Persist mode to localStorage
  useEffect(() => {
    localStorage.setItem("portfolio-property-mode", mode);
  }, [mode]);

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">View:</span>
            <div className="flex gap-2">
              <Button
                variant={mode === "onchain" ? "default" : "outline"}
                size="sm"
                onClick={() => onModeChange("onchain")}
                className="flex items-center gap-2"
              >
                <Link2 className="h-3 w-3" />
                On-Chain Properties
                <Badge variant="secondary" className="ml-1">
                  {onChainCount}
                </Badge>
              </Button>
              <Button
                variant={mode === "demo" ? "default" : "outline"}
                size="sm"
                onClick={() => onModeChange("demo")}
                className="flex items-center gap-2"
              >
                <TestTube className="h-3 w-3" />
                Demo Properties
                <Badge variant="secondary" className="ml-1">
                  {demoCount}
                </Badge>
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {mode === "onchain" 
              ? "Showing real blockchain properties" 
              : "Showing demo properties for testing"
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Utility functions to identify property types
export const isOnChainProperty = (property: any): boolean => {
  // Handle both raw property objects and transformed PropertyMortgageData objects
  const rawProperty = property.userProperty || property;
  
  const uniqueKey = rawProperty.unique_purchase_key || rawProperty.uniquePurchaseKey;
  const mortgageId = rawProperty.mortgage_id || rawProperty.mortgageId;
  
  // On-chain if unique_purchase_key starts with "0x" (transaction hash)
  // OR mortgage_id doesn't start with "demo_" (or is null/undefined)
  return (uniqueKey && uniqueKey.startsWith("0x")) || 
         (mortgageId && !mortgageId.startsWith("demo_")) ||
         (!mortgageId && uniqueKey && !uniqueKey.startsWith("demo_"));
};

export const isDemoProperty = (property: any): boolean => {
  // Handle both raw property objects and transformed PropertyMortgageData objects
  const rawProperty = property.userProperty || property;
  
  const uniqueKey = rawProperty.unique_purchase_key || rawProperty.uniquePurchaseKey;
  const mortgageId = rawProperty.mortgage_id || rawProperty.mortgageId;
  
  // Demo if unique_purchase_key OR mortgage_id starts with "demo_"
  return (uniqueKey && uniqueKey.startsWith("demo_")) || 
         (mortgageId && mortgageId.startsWith("demo_"));
};

export const filterPropertiesByMode = (properties: any[], mode: PropertyMode): any[] => {
  return properties.filter(property => {
    if (mode === "onchain") {
      return isOnChainProperty(property);
    } else {
      return isDemoProperty(property);
    }
  });
};

export const getPropertyCounts = (properties: any[]): { onChainCount: number; demoCount: number } => {
  const onChainCount = properties.filter(isOnChainProperty).length;
  const demoCount = properties.filter(isDemoProperty).length;
  return { onChainCount, demoCount };
};

// Hook for managing property mode state
export const usePropertyMode = (): [PropertyMode, (mode: PropertyMode) => void] => {
  const [mode, setMode] = useState<PropertyMode>(() => {
    const saved = localStorage.getItem("portfolio-property-mode");
    return (saved === "demo" || saved === "onchain") ? saved : "onchain";
  });

  return [mode, setMode];
};
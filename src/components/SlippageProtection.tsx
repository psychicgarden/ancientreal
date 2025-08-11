import React, { useState } from 'react';
import { AlertTriangle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface SlippageProtectionProps {
  expectedPrice: number;
  actualPrice: number;
  priceImpact: number;
  slippageTolerance: number;
  onSlippageChange: (tolerance: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isVisible: boolean;
}

export const SlippageProtection: React.FC<SlippageProtectionProps> = ({
  expectedPrice,
  actualPrice,
  priceImpact,
  slippageTolerance,
  onSlippageChange,
  onConfirm,
  onCancel,
  isVisible
}) => {
  const [customTolerance, setCustomTolerance] = useState(slippageTolerance.toString());
  
  if (!isVisible) return null;

  const isHighSlippage = priceImpact > 0.05; // 5%
  const isVeryHighSlippage = priceImpact > 0.15; // 15%

  return (
    <Card className="border-warning bg-warning/5">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <h3 className="font-semibold">Price Impact Warning</h3>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Expected Price:</span>
            <span>${expectedPrice.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span>Actual Price:</span>
            <span>${actualPrice.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span>Price Impact:</span>
            <Badge variant={isVeryHighSlippage ? "destructive" : "secondary"}>
              {(priceImpact * 100).toFixed(2)}%
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Slippage Tolerance</Label>
          <div className="flex gap-2">
            <div className="flex gap-1">
              {[0.5, 1, 2.5, 5].map((tolerance) => (
                <Button
                  key={tolerance}
                  variant={slippageTolerance === tolerance / 100 ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSlippageChange(tolerance / 100)}
                >
                  {tolerance}%
                </Button>
              ))}
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="space-y-2">
                  <Label>Custom Tolerance (%)</Label>
                  <Input
                    value={customTolerance}
                    onChange={(e) => setCustomTolerance(e.target.value)}
                    placeholder="0.5"
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                  />
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      const tolerance = parseFloat(customTolerance) / 100;
                      if (tolerance >= 0 && tolerance <= 0.5) {
                        onSlippageChange(tolerance);
                      }
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={onConfirm} 
            variant={isVeryHighSlippage ? "destructive" : "default"}
            className="flex-1"
          >
            {isVeryHighSlippage ? "Accept High Risk" : "Confirm Trade"}
          </Button>
          <Button onClick={onCancel} variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>

        {isVeryHighSlippage && (
          <p className="text-xs text-destructive">
            ⚠️ Very high price impact detected. Consider reducing trade size.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
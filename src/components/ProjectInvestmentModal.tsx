import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, TrendingUp, Home, Calculator } from "lucide-react";

interface ProjectInvestmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    id: number;
    title: string;
    presalePrice: number;
    publicPrice: number;
    targetFunding: number;
    currentFunding: number;
    minInvestment: number;
    estimatedYield: string;
    status: "presale" | "funded" | "public" | "completed";
    timeline: string;
  };
}

export const ProjectInvestmentModal: React.FC<ProjectInvestmentModalProps> = ({ 
  open, 
  onOpenChange, 
  project 
}) => {
  const [investment, setInvestment] = useState(project.minInvestment);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isConnected, connectWallet } = useWallet();
  const { toast } = useToast();

  useEffect(() => {
    setInvestment(project.minInvestment);
  }, [project.minInvestment]);

  // Calculate investment metrics
  const ownershipPercentage = (investment / project.targetFunding) * 100;
  const projectedValue = (investment / project.presalePrice) * project.publicPrice;
  const projectedProfit = projectedValue - investment;
  const roi = ((projectedValue - investment) / investment) * 100;
  const remainingFunding = project.targetFunding - project.currentFunding;

  const handleInvestment = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    setIsProcessing(true);
    try {
      // TODO: Integrate with smart contracts for actual investment
      console.log(`Investing $${investment} in project ${project.id}`);
      
      // Simulate investment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Investment Successful!",
        description: `You've invested $${investment.toLocaleString()} in ${project.title}`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Investment failed:', error);
      toast({
        title: "Investment Failed",
        description: "There was an error processing your investment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Invest in {project.title}
          </DialogTitle>
          <DialogDescription>
            Presale investment with 15% markup opportunity when project goes public
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Investment Amount Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="investment">Investment Amount</Label>
              <Badge variant="secondary">${investment.toLocaleString()}</Badge>
            </div>
            
            <Slider
              value={[investment]}
              onValueChange={(value) => setInvestment(value[0])}
              min={project.minInvestment}
              max={Math.min(remainingFunding, 100000)}
              step={100}
              className="w-full"
            />
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Min: ${project.minInvestment.toLocaleString()}</span>
              <span>Max: ${Math.min(remainingFunding, 100000).toLocaleString()}</span>
            </div>

            <div className="flex gap-2">
              <Input
                type="number"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                min={project.minInvestment}
                max={remainingFunding}
                step={100}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={() => setInvestment(project.minInvestment * 5)}
                disabled={project.minInvestment * 5 > remainingFunding}
              >
                5x Min
              </Button>
            </div>
          </div>

          {/* Investment Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Ownership</span>
                </div>
                <div className="text-2xl font-bold">{ownershipPercentage.toFixed(3)}%</div>
                <div className="text-sm text-muted-foreground">of total project</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Projected Value</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  ${projectedValue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">at public sale</div>
              </CardContent>
            </Card>
          </div>

          {/* Investment Options */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Home className="h-5 w-5" />
                Your Investment Options at Completion
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-background/50 rounded-lg border">
                  <div className="font-medium text-green-600 mb-2">Option A: Cash Out</div>
                  <div className="text-2xl font-bold">${projectedProfit.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">
                    Profit ({roi.toFixed(1)}% ROI)
                  </div>
                </div>
                
                <div className="p-4 bg-background/50 rounded-lg border">
                  <div className="font-medium text-blue-600 mb-2">Option B: Buy Property</div>
                  <div className="text-2xl font-bold">${investment.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">
                    Use your original investment as full payment
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="text-sm">
                  <div className="font-medium text-blue-700 dark:text-blue-300">
                    Best Case Scenario:
                  </div>
                  <div className="text-muted-foreground mt-1">
                    Cash out your ${projectedProfit.toLocaleString()} profit, then use it as a down payment to buy the property with a mortgage - effectively getting 15% off!
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Status */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="font-medium">Project Timeline</div>
              <div className="text-sm text-muted-foreground">{project.timeline} to completion</div>
            </div>
            <Badge variant={project.status === "presale" ? "secondary" : "default"}>
              {project.status === "presale" ? "Presale Active" : project.status}
            </Badge>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleInvestment}
            disabled={isProcessing || investment < project.minInvestment}
            className="min-w-[120px]"
          >
            {isProcessing ? (
              "Processing..."
            ) : !isConnected ? (
              "Connect Wallet"
            ) : (
              `Invest $${investment.toLocaleString()}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
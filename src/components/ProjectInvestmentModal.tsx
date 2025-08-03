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

  // Calculate investment metrics with 3% platform fee
  const platformFee = investment * 0.03; // 3% platform fee for development investments
  const netInvestment = investment - platformFee; // Amount that goes to project funding
  const ownershipPercentage = (netInvestment / project.targetFunding) * 100;
  const projectedValue = netInvestment * 1.15; // 15% markup from presale to public (on net investment)
  const projectedProfit = projectedValue - investment; // Total profit after fee
  const roi = ((projectedValue - investment) / investment) * 100; // ROI on total investment including fee
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
            
            {/* Platform Fee Notice */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm">
              <div>
                <span className="font-medium">Platform Fee (3%):</span>
                <span className="text-muted-foreground ml-2">Covers smart contracts, legal, and operations</span>
              </div>
              <Badge variant="outline">${platformFee.toLocaleString()}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg text-sm">
              <span className="font-medium">Amount to Project Funding:</span>
              <Badge variant="default">${netInvestment.toLocaleString()}</Badge>
            </div>
            
            <Slider
              value={[investment]}
              onValueChange={(value) => setInvestment(value[0])}
              min={project.minInvestment}
              max={remainingFunding}
              step={100}
              className="w-full"
            />
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Min: ${project.minInvestment.toLocaleString()}</span>
              <span>Max: ${remainingFunding.toLocaleString()}</span>
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

          {/* Investment Returns */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Your Profit at Project Completion
              </h3>
              
              <div className="text-center p-6 bg-background/50 rounded-lg border">
                <div className="font-medium text-green-600 mb-2">Cash Out Profit</div>
                <div className="text-3xl font-bold text-green-600">${projectedProfit.toLocaleString()}</div>
                <div className="text-lg text-muted-foreground mt-2">
                  {roi.toFixed(1)}% ROI on your ${investment.toLocaleString()} investment
                </div>
                <div className="text-sm text-muted-foreground mt-3">
                  Use your profit for anything - property down payments, other investments, or cash out entirely
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
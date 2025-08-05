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
import { supabase } from "@/integrations/supabase/client";

interface ProjectInvestmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    id: string;
    title: string;
    presale_price: number;
    target_funding: number;
    current_funding: number;
    min_investment: number;
    estimated_yield: number;
    project_status: string;
    timeline: string;
  };
}

export const ProjectInvestmentModal: React.FC<ProjectInvestmentModalProps> = ({ 
  open, 
  onOpenChange, 
  project 
}) => {
  const [investment, setInvestment] = useState(project.min_investment || 100);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isConnected, connectWallet, account } = useWallet();
  const { toast } = useToast();

  useEffect(() => {
    setInvestment(project.min_investment || 100);
  }, [project.min_investment]);

  // Calculate investment metrics with 3% platform fee
  const platformFee = investment * 0.03; // 3% platform fee for development investments
  const netInvestment = investment - platformFee; // Amount that goes to project funding
  const ownershipPercentage = (netInvestment / (project.target_funding || 1)) * 100;
  const projectedValue = netInvestment * 1.15; // 15% markup from presale to public (on net investment)
  const projectedProfit = projectedValue - investment; // Total profit after fee
  const roi = ((projectedValue - investment) / investment) * 100; // ROI on total investment including fee
  const remainingFunding = Math.max((project.target_funding || 0) - (project.current_funding || 0), project.min_investment || 100);

  const handleInvestment = async () => {
    if (!isConnected || !account) {
      await connectWallet();
      return;
    }

    setIsProcessing(true);
    try {
      // First, ensure the project exists in the database
      let projectId = project.id;
      
      // Check if project exists, if not create it
      const { data: existingProject, error: checkError } = await supabase
        .from('developer_projects')
        .select('id')
        .eq('id', project.id)
        .single();

      if (checkError && checkError.code === 'PGRST116') {
        // Project doesn't exist, create it
        const { data: newProject, error: createError } = await supabase
          .from('developer_projects')
          .insert({
            id: project.id,
            title: project.title,
            creator_name: 'Mock Creator',
            creator_wallet_address: '0x0000000000000000000000000000000000000000',
            description: 'Mock project for testing purposes',
            target_funding: project.target_funding,
            current_funding: project.current_funding || 0,
            presale_price: project.presale_price,
            min_investment: project.min_investment,
            estimated_yield: project.estimated_yield,
            project_status: project.project_status === 'presale_active' ? 'presale' : project.project_status || 'active',
            timeline: project.timeline
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating project:', createError);
          throw new Error('Failed to create project record');
        }
        projectId = newProject.id;
      } else if (checkError) {
        console.error('Error checking project:', checkError);
        throw new Error('Failed to verify project');
      }

      // Create the investment record
      const { data: investmentData, error: investmentError } = await supabase
        .from('developer_investments')
        .insert({
          user_wallet_address: account.toLowerCase(),
          project_id: projectId,
          investment_amount: investment,
          ownership_percentage: ownershipPercentage,
          platform_fee: platformFee,
          net_investment: netInvestment,
          projected_value: projectedValue,
          projected_profit: projectedProfit,
          investment_status: 'active',
          transaction_hash: `0x${Math.random().toString(16).substr(2, 64)}` // Mock hash for now
        })
        .select()
        .single();

      if (investmentError) {
        console.error('Investment error:', investmentError);
        throw new Error('Failed to create investment record');
      }

      // Update project funding
      const { error: projectError } = await supabase
        .from('developer_projects')
        .update({
          current_funding: (project.current_funding || 0) + investment
        })
        .eq('id', projectId);

      if (projectError) {
        console.warn('Failed to update project funding:', projectError);
      }

      // Create transaction record for tracking
      const { error: transactionError } = await supabase
        .from('user_transactions')
        .insert({
          user_wallet_address: account.toLowerCase(),
          transaction_type: 'developer_investment',
          amount: investment,
          currency: 'USDT',
          status: 'completed',
          transaction_hash: investmentData.transaction_hash,
          metadata: {
            project_id: projectId,
            project_title: project.title,
            ownership_percentage: ownershipPercentage,
            investment_id: investmentData.id
          }
        });

      if (transactionError) {
        console.warn('Failed to create transaction record:', transactionError);
      }

      console.log(`Investment completed: $${investment} in ${project.title}`);
      
      toast({
        title: "Investment Successful!",
        description: `You have invested $${investment.toLocaleString()} in ${project.title}. Check your portfolio to track progress.`,
      });
      
      onOpenChange(false);
      
      // Navigate to portfolio after successful investment
      setTimeout(() => {
        window.location.href = '/portfolio';
      }, 1500);
      
    } catch (error) {
      console.error('Investment error:', error);
      toast({
        title: "Investment Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
              min={project.min_investment || 100}
              max={Math.max(remainingFunding, project.min_investment || 100)}
              step={100}
              className="w-full"
            />
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Min: ${(project.min_investment || 100).toLocaleString()}</span>
              <span>Max: ${Math.max(remainingFunding, project.min_investment || 100).toLocaleString()}</span>
            </div>

            <div className="flex gap-2">
              <Input
                type="number"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                min={project.min_investment || 100}
                max={Math.max(remainingFunding, project.min_investment || 100)}
                step={100}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={() => setInvestment((project.min_investment || 100) * 5)}
                disabled={(project.min_investment || 100) * 5 > Math.max(remainingFunding, project.min_investment || 100)}
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
            <Badge variant={project.project_status === "presale" ? "secondary" : "default"}>
              {project.project_status === "presale" ? "Presale Active" : project.project_status}
            </Badge>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleInvestment}
            disabled={isProcessing || investment < (project.min_investment || 100)}
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
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useWallet } from "@/contexts/WalletContext";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, DollarSign, Calendar, Target, BarChart3, Eye } from "lucide-react";

interface DeveloperInvestment {
  id: string;
  project_id: string;
  investment_amount: number;
  ownership_percentage: number;
  platform_fee: number;
  net_investment: number;
  projected_value: number;
  projected_profit: number;
  investment_status: string;
  created_at: string;
  developer_projects?: {
    title: string;
    project_status: string;
    current_funding: number;
    target_funding: number;
    timeline: string;
    estimated_yield: number;
  };
}

export const DeveloperInvestmentsAnalytics: React.FC = () => {
  const [investments, setInvestments] = useState<DeveloperInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvestment, setSelectedInvestment] = useState<DeveloperInvestment | null>(null);
  const { account } = useWallet();

  useEffect(() => {
    if (account) {
      fetchInvestments();
    }
  }, [account]);

  const fetchInvestments = async () => {
    if (!account) return;

    try {
      const { data, error } = await supabase
        .from('developer_investments')
        .select(`
          *,
          developer_projects (
            title,
            project_status,
            current_funding,
            target_funding,
            timeline,
            estimated_yield
          )
        `)
        .eq('user_wallet_address', account?.toLowerCase() ?? '')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvestments(data || []);
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.investment_amount, 0);
  const totalProjectedValue = investments.reduce((sum, inv) => sum + inv.projected_value, 0);
  const totalProjectedProfit = investments.reduce((sum, inv) => sum + inv.projected_profit, 0);
  const avgROI = totalInvested > 0 ? ((totalProjectedProfit / totalInvested) * 100) : 0;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading developer investments...</div>
        </CardContent>
      </Card>
    );
  }

  if (!account) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Connect your wallet to view developer investments
          </div>
        </CardContent>
      </Card>
    );
  }

  if (investments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No developer investments found. Visit the Developers page to start investing!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total Invested</span>
            </div>
            <div className="text-2xl font-bold">${totalInvested.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              {investments.length} investment{investments.length !== 1 ? 's' : ''}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Projected Value</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              ${totalProjectedValue.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">At project completion</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Expected Profit</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              ${totalProjectedProfit.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total projected gain</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Avg. ROI</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {avgROI.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Expected return</div>
          </CardContent>
        </Card>
      </div>

      {/* Investment List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Your Developer Investments
          </CardTitle>
          <CardDescription>
            Track the progress and performance of your development project investments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investments.map((investment) => {
              const project = investment.developer_projects;
              const fundingProgress = project ? 
                (project.current_funding / project.target_funding) * 100 : 0;
              
              return (
                <div key={investment.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {project?.title || 'Unknown Project'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={project?.project_status === 'completed' ? 'default' : 'secondary'}>
                          {project?.project_status || 'unknown'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Invested: {new Date(investment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedInvestment(
                        selectedInvestment?.id === investment.id ? null : investment
                      )}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {selectedInvestment?.id === investment.id ? 'Hide' : 'Details'}
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Your Investment</div>
                      <div className="font-semibold">
                        ${investment.investment_amount.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Ownership</div>
                      <div className="font-semibold">
                        {investment.ownership_percentage.toFixed(3)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Projected Value</div>
                      <div className="font-semibold text-green-600">
                        ${investment.projected_value.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Expected Profit</div>
                      <div className="font-semibold text-purple-600">
                        ${investment.projected_profit.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {project && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Project Funding Progress</span>
                        <span>{fundingProgress.toFixed(1)}%</span>
                      </div>
                      <Progress value={fundingProgress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>${project.current_funding.toLocaleString()} raised</span>
                        <span>${project.target_funding.toLocaleString()} target</span>
                      </div>
                    </div>
                  )}

                  {selectedInvestment?.id === investment.id && (
                    <div className="mt-4 p-4 bg-muted/30 rounded-lg space-y-3">
                      <h4 className="font-medium">Investment Breakdown</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Platform Fee (3%):</span>
                          <span className="float-right">${investment.platform_fee.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Net Investment:</span>
                          <span className="float-right">${investment.net_investment.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Timeline:</span>
                          <span className="float-right">{project?.timeline || 'TBD'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expected Yield:</span>
                          <span className="float-right">{project?.estimated_yield || 0}%</span>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="text-sm">
                          <span className="text-muted-foreground">ROI Calculation:</span>
                          <span className="float-right font-medium">
                            {((investment.projected_profit / investment.investment_amount) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
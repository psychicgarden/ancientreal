import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_CONFIG } from '@/config/demo';
import { Trash2, RotateCcw, Settings } from "lucide-react";

interface DeveloperProject {
  id: string;
  title: string;
  target_funding: number;
  current_funding: number;
  project_status: string;
  creator_name: string;
}

export const DeveloperProjectResetTools: React.FC = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<DeveloperProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('developer_projects')
        .select('id, title, target_funding, current_funding, project_status, creator_name')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetProjectFunding = async (projectId?: string) => {
    if (!DEMO_CONFIG.isEnabled) {
      toast({
        title: "Error",
        description: "Project reset is only available in demo mode",
        variant: "destructive"
      });
      return;
    }

    setResetting(projectId || 'all');
    
    try {
      const { data, error } = await supabase
        .rpc('reset_developer_project_funding', { 
          p_project_id: projectId || null 
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: projectId 
          ? `Project funding reset successfully`
          : `All projects reset to 15% funding`,
        variant: "default"
      });

      // Refresh the projects list
      await fetchProjects();
      
    } catch (error) {
      console.error('Error resetting project:', error);
      toast({
        title: "Error", 
        description: "Failed to reset project funding",
        variant: "destructive"
      });
    } finally {
      setResetting(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Developer Project Reset Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Developer Project Reset Tools
          {DEMO_CONFIG.isEnabled && (
            <Badge variant="secondary" className="bg-accent/20 text-accent">
              Demo Mode
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!DEMO_CONFIG.isEnabled && (
          <div className="bg-muted/50 p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">
              Project reset tools are only available in demo mode for testing purposes.
            </p>
          </div>
        )}

        {DEMO_CONFIG.isEnabled && (
          <>
            {/* Global Reset */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Global Reset</h3>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => resetProjectFunding()}
                  disabled={resetting === 'all'}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  {resetting === 'all' ? 'Resetting...' : 'Reset All Projects to 15%'}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Sets all projects to 15% funding and deletes all developer investments
                </p>
              </div>
            </div>

            {/* Individual Project Reset */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Individual Project Reset</h3>
              <div className="space-y-3">
                {projects.map((project) => {
                  const fundingPercentage = project.target_funding > 0 
                    ? (project.current_funding / project.target_funding) * 100 
                    : 0;

                  return (
                    <div key={project.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium">{project.title}</h4>
                          <p className="text-sm text-muted-foreground">by {project.creator_name}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>Funding: ${project.current_funding.toLocaleString()} / ${project.target_funding.toLocaleString()}</span>
                            <Badge variant={project.project_status === 'active' ? 'default' : 'secondary'}>
                              {project.project_status}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          onClick={() => resetProjectFunding(project.id)}
                          disabled={resetting === project.id}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="h-3 w-3" />
                          {resetting === project.id ? 'Resetting...' : 'Reset to 0%'}
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Funding Progress</span>
                          <span>{Math.round(fundingPercentage)}%</span>
                        </div>
                        <Progress value={fundingPercentage} className="h-2" />
                        
                        {fundingPercentage >= 80 && (
                          <div className="flex items-center gap-2 text-sm text-accent">
                            <div className="h-2 w-2 bg-accent rounded-full"></div>
                            Above 80% threshold - Testing escrow release triggers
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
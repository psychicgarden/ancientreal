import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, TrendingUp } from "lucide-react";

interface PresaleProgressProps {
  project: {
    id: number;
    title: string;
    progress: number;
    presaleThreshold: number;
    currentFunding: number;
    targetFunding: number;
    presalePrice: number;
    publicPrice: number;
    status: "presale" | "funded" | "public" | "completed";
    daoFunded: number;
    publicFunding: number;
    unitsTotal: number;
    unitsSold: number;
  };
}

export const PresaleProgress: React.FC<PresaleProgressProps> = ({ project }) => {
  const markup = ((project.publicPrice - project.presalePrice) / project.presalePrice * 100).toFixed(1);
  const thresholdReached = project.progress >= project.presaleThreshold;
  const remainingForThreshold = Math.max(0, (project.presaleThreshold / 100 * project.targetFunding) - project.currentFunding);
  
  const getStatusBadge = () => {
    switch (project.status) {
      case "presale":
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
          <Clock className="w-3 h-3 mr-1" />
          Presale Active
        </Badge>;
      case "funded":
        return <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          Funded - Development Starting
        </Badge>;
      case "public":
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
          <TrendingUp className="w-3 h-3 mr-1" />
          Public Sale Live
        </Badge>;
      case "completed":
        return <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 border-purple-500/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Status and Threshold */}
          <div className="flex items-center justify-between">
            {getStatusBadge()}
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Threshold Required</div>
              <div className="font-semibold">{project.presaleThreshold}%</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Presale Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <div className="relative">
              <Progress 
                value={project.progress} 
                className="h-3" 
              />
              {/* Threshold line */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-border"
                style={{ left: `${project.presaleThreshold}%` }}
              />
              <div 
                className="absolute -top-6 text-xs text-muted-foreground transform -translate-x-1/2"
                style={{ left: `${project.presaleThreshold}%` }}
              >
                {project.presaleThreshold}%
              </div>
            </div>
          </div>

          {/* Funding Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">DAO Presale</div>
              <div className="font-semibold">${project.daoFunded.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Public Sale</div>
              <div className="font-semibold">${project.publicFunding.toLocaleString()}</div>
            </div>
          </div>

          {/* Units and Pricing */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Units Sold</div>
              <div className="font-semibold">{project.unitsSold} / {project.unitsTotal}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Public Markup</div>
              <div className="font-semibold text-green-600">+{markup}%</div>
            </div>
          </div>

          {/* Threshold Status */}
          {!thresholdReached && (
            <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
              <div className="text-sm">
                <div className="font-medium text-yellow-700 dark:text-yellow-300">
                  ${remainingForThreshold.toLocaleString()} needed to reach threshold
                </div>
                <div className="text-muted-foreground mt-1">
                  Once 80% is presold by the DAO, development begins and remaining units go public at ${project.publicPrice.toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {thresholdReached && project.status === "funded" && (
            <div className="p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
              <div className="text-sm">
                <div className="font-medium text-green-700 dark:text-green-300">
                  🎉 Development Approved!
                </div>
                <div className="text-muted-foreground mt-1">
                  Presale threshold reached. Development is starting and remaining units are now available to the public.
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
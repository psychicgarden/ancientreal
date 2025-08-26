// Admin Navigation Component
// Quick navigation links for admin functionality

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Rocket, 
  BarChart3, 
  ExternalLink 
} from 'lucide-react';

export const AdminNavigation = () => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/admin/projects'}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Project Submissions
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/admin/smart-contracts'}
            className="flex items-center gap-2"
          >
            <Rocket className="w-4 h-4" />
            Smart Contracts
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/portfolio?tab=platform'}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Platform Analytics
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('https://testnet.snowtrace.io', '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Blockchain Explorer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
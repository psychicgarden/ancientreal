import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Lock, CheckCircle, AlertCircle, Clock, ArrowRight } from 'lucide-react';

interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  required: boolean;
  estimatedTime?: string;
  action?: () => void;
}

interface ComplianceGatingProps {
  onComplianceComplete: () => void;
  allowedActions: string[];
  children: React.ReactNode;
}

export const ComplianceGating: React.FC<ComplianceGatingProps> = ({
  onComplianceComplete,
  allowedActions,
  children
}) => {
  const [requirements, setRequirements] = useState<ComplianceRequirement[]>([
    {
      id: 'kyc',
      name: 'Identity Verification (KYC)',
      description: 'Verify your identity through our secure KYC process',
      status: 'completed',
      required: true,
      estimatedTime: '5-10 minutes'
    },
    {
      id: 'aml',
      name: 'AML Screening',
      description: 'Anti-money laundering background check',
      status: 'completed',
      required: true,
      estimatedTime: '1-2 minutes'
    },
    {
      id: 'accredited',
      name: 'Accredited Investor Verification',
      description: 'Verify your accredited investor status',
      status: 'completed',
      required: true,
      estimatedTime: '10-15 minutes'
    },
    {
      id: 'documents',
      name: 'Legal Document Review',
      description: 'Review and sign required legal documents',
      status: 'completed',
      required: true,
      estimatedTime: '15-20 minutes'
    },
    {
      id: 'risk-assessment',
      name: 'Risk Assessment',
      description: 'Complete investment risk assessment questionnaire',
      status: 'completed',
      required: false,
      estimatedTime: '5 minutes'
    },
    {
      id: 'wallet-verification',
      name: 'Wallet Verification',
      description: 'Verify ownership of your crypto wallet',
      status: 'completed',
      required: true,
      estimatedTime: '2 minutes'
    }
  ]);

  const [isCompliant, setIsCompliant] = useState(false);

  useEffect(() => {
    const requiredCompleted = requirements
      .filter(req => req.required)
      .every(req => req.status === 'completed');
    
    setIsCompliant(requiredCompleted);
    
    if (requiredCompleted) {
      onComplianceComplete();
    }
  }, [requirements, onComplianceComplete]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const calculateProgress = () => {
    const totalRequired = requirements.filter(req => req.required).length;
    const completedRequired = requirements
      .filter(req => req.required && req.status === 'completed').length;
    
    return (completedRequired / totalRequired) * 100;
  };

  const handleRequirementAction = (requirementId: string) => {
    setRequirements(prev => 
      prev.map(req => 
        req.id === requirementId 
          ? { ...req, status: req.status === 'pending' ? 'in-progress' : req.status }
          : req
      )
    );
  };

  if (isCompliant) {
    return (
      <div className="space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Compliance Verified</h3>
                <p className="text-sm text-green-700">
                  You have successfully completed all compliance requirements and can access all platform features.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {children}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5" />
            <span>Compliance Requirements</span>
          </CardTitle>
          <CardDescription>
            Complete all required compliance steps to access investment opportunities
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(calculateProgress())}% Complete</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>

          <div className="space-y-4">
            {requirements.map((requirement) => (
              <div key={requirement.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(requirement.status)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{requirement.name}</h4>
                      {requirement.required && (
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{requirement.description}</p>
                    {requirement.estimatedTime && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Estimated time: {requirement.estimatedTime}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {getStatusBadge(requirement.status)}
                  {requirement.status === 'pending' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleRequirementAction(requirement.id)}
                    >
                      Start
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                  {requirement.status === 'in-progress' && (
                    <Button variant="outline" size="sm">
                      Continue
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              All required compliance steps must be completed before you can make investments. 
              Your data is encrypted and stored securely in compliance with financial regulations.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Restricted Content */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-3 text-gray-500">
            <Lock className="w-6 h-6" />
            <div className="text-center">
              <h3 className="font-medium">Content Restricted</h3>
              <p className="text-sm">Complete compliance requirements to access this content</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
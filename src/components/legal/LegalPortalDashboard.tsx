import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Shield, FileText, CheckCircle, AlertCircle, Clock, Download } from 'lucide-react';

interface ComplianceStatus {
  kyc: 'pending' | 'verified' | 'rejected';
  accredited: 'pending' | 'verified' | 'rejected';
  documents: 'incomplete' | 'complete' | 'signed';
  aml: 'pending' | 'cleared' | 'flagged';
}

interface LegalDocument {
  id: string;
  name: string;
  type: 'agreement' | 'disclosure' | 'tax' | 'compliance';
  status: 'pending' | 'signed' | 'executed';
  signedDate?: Date;
  downloadUrl?: string;
}

export const LegalPortalDashboard: React.FC = () => {
  const [complianceStatus] = useState<ComplianceStatus>({
    kyc: 'verified',
    accredited: 'verified',
    documents: 'complete',
    aml: 'cleared'
  });

  const [documents] = useState<LegalDocument[]>([
    {
      id: '1',
      name: 'Investment Agreement',
      type: 'agreement',
      status: 'signed',
      signedDate: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Risk Disclosure',
      type: 'disclosure',
      status: 'signed',
      signedDate: new Date('2024-01-15')
    },
    {
      id: '3',
      name: 'Tax Certification',
      type: 'tax',
      status: 'pending'
    },
    {
      id: '4',
      name: 'AML Compliance Form',
      type: 'compliance',
      status: 'executed',
      signedDate: new Date('2024-01-15')
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
      case 'cleared':
      case 'complete':
      case 'signed':
      case 'executed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
      case 'incomplete':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected':
      case 'flagged':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'verified' || status === 'cleared' || status === 'complete' || status === 'signed' || status === 'executed'
      ? 'default'
      : status === 'pending' || status === 'incomplete'
      ? 'secondary'
      : 'destructive';
    
    return <Badge variant={variant}>{status}</Badge>;
  };

  const calculateComplianceProgress = () => {
    const statuses = Object.values(complianceStatus);
    const completed = statuses.filter(status => 
      status === 'verified' || status === 'cleared' || status === 'complete'
    ).length;
    return (completed / statuses.length) * 100;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Legal Portal</h1>
          <p className="text-muted-foreground">Manage your compliance status and legal documents</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Shield className="w-4 h-4 mr-2" />
          Compliant
        </Badge>
      </div>

      {/* Compliance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Overview</CardTitle>
          <CardDescription>Your current regulatory compliance status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Compliance</span>
              <span className="text-2xl font-bold text-green-600">{calculateComplianceProgress().toFixed(0)}%</span>
            </div>
            <Progress value={calculateComplianceProgress()} className="h-2" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">KYC Status</p>
                  {getStatusBadge(complianceStatus.kyc)}
                </div>
                {getStatusIcon(complianceStatus.kyc)}
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Accredited Investor</p>
                  {getStatusBadge(complianceStatus.accredited)}
                </div>
                {getStatusIcon(complianceStatus.accredited)}
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Documents</p>
                  {getStatusBadge(complianceStatus.documents)}
                </div>
                {getStatusIcon(complianceStatus.documents)}
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">AML Screening</p>
                  {getStatusBadge(complianceStatus.aml)}
                </div>
                {getStatusIcon(complianceStatus.aml)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="documents">Legal Documents</TabsTrigger>
          <TabsTrigger value="kyc">KYC/AML</TabsTrigger>
          <TabsTrigger value="accredited">Accreditation</TabsTrigger>
          <TabsTrigger value="compliance">Reporting</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Legal Documents</CardTitle>
              <CardDescription>View and manage your signed legal documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {doc.signedDate ? `Signed on ${doc.signedDate.toLocaleDateString()}` : 'Pending signature'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(doc.status)}
                      {doc.downloadUrl && (
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc">
          <Card>
            <CardHeader>
              <CardTitle>KYC/AML Verification</CardTitle>
              <CardDescription>Identity verification and anti-money laundering screening</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-medium text-green-900">Identity Verified</h3>
                      <p className="text-sm text-green-700">Verified on January 15, 2024</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-600">Verified</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-medium text-green-900">AML Screening Passed</h3>
                      <p className="text-sm text-green-700">No adverse findings</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-600">Cleared</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accredited">
          <Card>
            <CardHeader>
              <CardTitle>Accredited Investor Status</CardTitle>
              <CardDescription>Verification of accredited investor qualification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-medium text-green-900">Accredited Investor Verified</h3>
                      <p className="text-sm text-green-700">Income verification completed</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-600">Verified</Badge>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Qualification Method</h4>
                  <p className="text-sm text-muted-foreground">
                    Income-based qualification: Annual income exceeding $200,000 for the past two years
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Reporting</CardTitle>
              <CardDescription>Compliance reporting and regulatory filings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Nevis Jurisdiction</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Filing</span>
                      <span className="text-sm font-medium">January 2024</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant="default" className="bg-green-600">Current</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Mexican Jurisdiction</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Filing</span>
                      <span className="text-sm font-medium">January 2024</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant="default" className="bg-green-600">Current</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Automated Compliance</h4>
                  <p className="text-sm text-blue-700">
                    All regulatory reporting is automated through our smart contract system. 
                    Reports are generated and filed automatically based on your investment activity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
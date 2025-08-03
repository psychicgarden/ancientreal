import React, { useState } from 'react';
import Header from '@/components/Header';
import { LegalPortalDashboard } from '@/components/legal/LegalPortalDashboard';
import { AccreditedInvestorVerification } from '@/components/legal/AccreditedInvestorVerification';
import { ComplianceGating } from '@/components/legal/ComplianceGating';
import { KYCVerification } from '@/components/KYCVerification';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Shield, FileText, UserCheck, Building, AlertTriangle } from 'lucide-react';

const LegalPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCompliant, setIsCompliant] = useState(false);

  const handleComplianceComplete = () => {
    setIsCompliant(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Legal Portal</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your comprehensive compliance and legal documentation center for secure real estate investments
            </p>
          </div>

          {/* Compliance Status Banner */}
          <div className="mb-8">
            {isCompliant ? (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-900">Fully Compliant</h3>
                        <p className="text-sm text-green-700">
                          All regulatory requirements completed. You can participate in all investment opportunities.
                        </p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-600">Verified</Badge>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-yellow-900">Compliance Required</h3>
                        <p className="text-sm text-yellow-700">
                          Complete compliance requirements to access investment opportunities.
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="bg-white"
                      onClick={() => setActiveTab('compliance')}
                    >
                      Complete Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 h-12">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="compliance" className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4" />
                <span>Compliance</span>
              </TabsTrigger>
              <TabsTrigger value="kyc" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>KYC/AML</span>
              </TabsTrigger>
              <TabsTrigger value="accredited" className="flex items-center space-x-2">
                <Building className="w-4 h-4" />
                <span>Accredited</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Documents</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <LegalPortalDashboard />
            </TabsContent>

            <TabsContent value="compliance">
              <ComplianceGating
                onComplianceComplete={handleComplianceComplete}
                allowedActions={['invest', 'withdraw', 'transfer']}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Investment Opportunities</CardTitle>
                    <CardDescription>Access granted after compliance completion</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      You will see available investment opportunities here once compliance is complete.
                    </p>
                  </CardContent>
                </Card>
              </ComplianceGating>
            </TabsContent>

            <TabsContent value="kyc">
              <Card>
                <CardHeader>
                  <CardTitle>Know Your Customer (KYC) & Anti-Money Laundering (AML)</CardTitle>
                  <CardDescription>
                    Identity verification and background screening for regulatory compliance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <KYCVerification onVerificationComplete={() => {}} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="accredited">
              <AccreditedInvestorVerification />
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Legal Document Center</CardTitle>
                  <CardDescription>
                    Access and manage all your investment-related legal documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">Investment Agreements</h3>
                          <p className="text-sm text-muted-foreground">View and download signed agreements</p>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">Risk Disclosures</h3>
                          <p className="text-sm text-muted-foreground">Important risk information</p>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">Property Deeds</h3>
                          <p className="text-sm text-muted-foreground">Mexican property documentation</p>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">Tax Documents</h3>
                          <p className="text-sm text-muted-foreground">Tax forms and certifications</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Footer Notice */}
          <Card className="mt-8 border-muted">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground mb-2">Legal Notice</h4>
                  <p className="text-sm text-muted-foreground">
                    This platform operates under both Nevis and Mexican regulatory frameworks. All investments 
                    are subject to applicable securities laws and regulations. Past performance does not guarantee 
                    future results. Please consult with your financial and legal advisors before making investment decisions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LegalPortal;
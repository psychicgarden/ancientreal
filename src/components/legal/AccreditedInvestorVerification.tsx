import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, DollarSign, Building, CheckCircle, AlertCircle } from 'lucide-react';

interface AccreditedInvestorData {
  qualificationMethod: 'income' | 'networth' | 'professional' | 'entity';
  annualIncome?: number;
  netWorth?: number;
  professionalDesignation?: string;
  entityType?: string;
  documentUploads: {
    taxReturns: boolean;
    bankStatements: boolean;
    financialStatements: boolean;
    professionalCertification: boolean;
  };
  spousalIncome?: number;
  verification: {
    thirdPartyVerified: boolean;
    selfCertified: boolean;
    cpaVerified: boolean;
  };
}

export const AccreditedInvestorVerification: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVerified, setIsVerified] = useState(false);
  const [data, setData] = useState<AccreditedInvestorData>({
    qualificationMethod: 'income',
    documentUploads: {
      taxReturns: false,
      bankStatements: false,
      financialStatements: false,
      professionalCertification: false
    },
    verification: {
      thirdPartyVerified: false,
      selfCertified: false,
      cpaVerified: false
    }
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleQualificationChange = (method: string) => {
    setData(prev => ({ ...prev, qualificationMethod: method as any }));
  };

  const handleIncomeChange = (value: string) => {
    setData(prev => ({ ...prev, annualIncome: parseFloat(value) || 0 }));
  };

  const handleNetWorthChange = (value: string) => {
    setData(prev => ({ ...prev, netWorth: parseFloat(value) || 0 }));
  };

  const handleDocumentUpload = (docType: keyof typeof data.documentUploads) => {
    setData(prev => ({
      ...prev,
      documentUploads: {
        ...prev.documentUploads,
        [docType]: !prev.documentUploads[docType]
      }
    }));
  };

  const isQualified = () => {
    switch (data.qualificationMethod) {
      case 'income':
        return (data.annualIncome || 0) >= 200000 || 
               ((data.annualIncome || 0) + (data.spousalIncome || 0)) >= 300000;
      case 'networth':
        return (data.netWorth || 0) >= 1000000;
      case 'professional':
        return !!data.professionalDesignation;
      case 'entity':
        return !!data.entityType;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Qualification Method</h3>
              <RadioGroup
                value={data.qualificationMethod}
                onValueChange={handleQualificationChange}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="income" id="income" />
                  <div className="flex-1">
                    <Label htmlFor="income" className="font-medium">Income-Based</Label>
                    <p className="text-sm text-muted-foreground">
                      $200,000+ annual income (individual) or $300,000+ (joint)
                    </p>
                  </div>
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="networth" id="networth" />
                  <div className="flex-1">
                    <Label htmlFor="networth" className="font-medium">Net Worth-Based</Label>
                    <p className="text-sm text-muted-foreground">
                      $1,000,000+ net worth (excluding primary residence)
                    </p>
                  </div>
                  <Building className="w-5 h-5 text-muted-foreground" />
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="professional" id="professional" />
                  <div className="flex-1">
                    <Label htmlFor="professional" className="font-medium">Professional Designation</Label>
                    <p className="text-sm text-muted-foreground">
                      Series 7, 65, 82 licenses or knowledgeable employees
                    </p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-muted-foreground" />
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="entity" id="entity" />
                  <div className="flex-1">
                    <Label htmlFor="entity" className="font-medium">Entity-Based</Label>
                    <p className="text-sm text-muted-foreground">
                      Bank, insurance company, or entity with $5M+ assets
                    </p>
                  </div>
                  <Building className="w-5 h-5 text-muted-foreground" />
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Financial Information</h3>
            
            {data.qualificationMethod === 'income' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="income">Annual Income (USD)</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="200,000"
                    onChange={(e) => handleIncomeChange(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="spousal-income">Spousal Income (Optional)</Label>
                  <Input
                    id="spousal-income"
                    type="number"
                    placeholder="100,000"
                    onChange={(e) => setData(prev => ({ ...prev, spousalIncome: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>
            )}

            {data.qualificationMethod === 'networth' && (
              <div>
                <Label htmlFor="networth">Net Worth (USD, excluding primary residence)</Label>
                <Input
                  id="networth"
                  type="number"
                  placeholder="1,000,000"
                  onChange={(e) => handleNetWorthChange(e.target.value)}
                />
              </div>
            )}

            {data.qualificationMethod === 'professional' && (
              <div>
                <Label htmlFor="designation">Professional Designation</Label>
                <Input
                  id="designation"
                  placeholder="Series 7, Series 65, etc."
                  onChange={(e) => setData(prev => ({ ...prev, professionalDesignation: e.target.value }))}
                />
              </div>
            )}

            {data.qualificationMethod === 'entity' && (
              <div>
                <Label htmlFor="entity-type">Entity Type</Label>
                <Input
                  id="entity-type"
                  placeholder="Bank, Insurance Company, Investment Advisor, etc."
                  onChange={(e) => setData(prev => ({ ...prev, entityType: e.target.value }))}
                />
              </div>
            )}

            {isQualified() && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Based on the information provided, you appear to qualify as an accredited investor.
                </AlertDescription>
              </Alert>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Document Upload</h3>
            <p className="text-muted-foreground">
              Please upload the required documents to verify your accredited investor status.
            </p>
            
            <div className="space-y-4">
              {data.qualificationMethod === 'income' && (
                <>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={data.documentUploads.taxReturns}
                        onCheckedChange={() => handleDocumentUpload('taxReturns')}
                      />
                      <div>
                        <Label>Tax Returns (Last 2 Years)</Label>
                        <p className="text-sm text-muted-foreground">Form 1040 or equivalent</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={data.documentUploads.bankStatements}
                        onCheckedChange={() => handleDocumentUpload('bankStatements')}
                      />
                      <div>
                        <Label>Bank Statements (Last 3 Months)</Label>
                        <p className="text-sm text-muted-foreground">Recent account statements</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </>
              )}

              {data.qualificationMethod === 'networth' && (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={data.documentUploads.financialStatements}
                      onCheckedChange={() => handleDocumentUpload('financialStatements')}
                    />
                    <div>
                      <Label>Financial Statements</Label>
                      <p className="text-sm text-muted-foreground">CPA-prepared net worth statement</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              )}

              {data.qualificationMethod === 'professional' && (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={data.documentUploads.professionalCertification}
                      onCheckedChange={() => handleDocumentUpload('professionalCertification')}
                    />
                    <div>
                      <Label>Professional Certification</Label>
                      <p className="text-sm text-muted-foreground">License or certification documents</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Verification Method</h3>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Checkbox
                    checked={data.verification.thirdPartyVerified}
                    onCheckedChange={(checked) => 
                      setData(prev => ({
                        ...prev,
                        verification: { ...prev.verification, thirdPartyVerified: !!checked }
                      }))
                    }
                  />
                  <Label className="font-medium">Third-Party Verification</Label>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">Recommended</Badge>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Professional verification through our accredited third-party service provider.
                  Most secure and fastest approval process.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Checkbox
                    checked={data.verification.cpaVerified}
                    onCheckedChange={(checked) => 
                      setData(prev => ({
                        ...prev,
                        verification: { ...prev.verification, cpaVerified: !!checked }
                      }))
                    }
                  />
                  <Label className="font-medium">CPA Verification</Label>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Submit a letter from your CPA confirming your accredited investor status.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Checkbox
                    checked={data.verification.selfCertified}
                    onCheckedChange={(checked) => 
                      setData(prev => ({
                        ...prev,
                        verification: { ...prev.verification, selfCertified: !!checked }
                      }))
                    }
                  />
                  <Label className="font-medium">Self-Certification</Label>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Additional Review Required</Badge>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Certify your status under penalty of perjury. May require additional documentation.
                </p>
              </div>
            </div>

            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                Your verification method will determine the processing time. Third-party verification 
                typically completes within 24-48 hours.
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Simulate verification process
    setIsVerified(true);
  };

  if (isVerified) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-900 mb-2">Verification Complete</h2>
          <p className="text-green-700 mb-6">
            Your accredited investor status has been successfully verified. You can now participate in private offerings.
          </p>
          <Badge variant="default" className="bg-green-600 text-lg px-4 py-2">
            Accredited Investor Verified
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Accredited Investor Verification</CardTitle>
        <CardDescription>
          Complete the verification process to access private investment opportunities
        </CardDescription>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {renderStep()}
        
        <div className="flex justify-between pt-6">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < totalSteps ? (
            <Button onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              Submit for Verification
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Shield, CheckCircle, Clock, Upload } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface KYCVerificationProps {
  onVerificationComplete: (kycData: KYCData) => void;
  isLoading?: boolean;
}

interface KYCData {
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    ssn: string;
    address: string;
  };
  financialInfo: {
    annualIncome: number;
    netWorth: number;
    investmentExperience: string;
    riskTolerance: string;
  };
  documents: {
    idDocument: File | null;
    proofOfIncome: File | null;
    proofOfAddress: File | null;
  };
  accreditation: {
    isAccredited: boolean;
    accreditationType: string;
  };
  agreements: {
    termsOfService: boolean;
    privacyPolicy: boolean;
    investmentRisks: boolean;
    coolingOffPeriod: boolean;
  };
}

export function KYCVerification({ onVerificationComplete, isLoading = false }: KYCVerificationProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [kycData, setKycData] = useState<KYCData>({
    personalInfo: {
      fullName: '',
      dateOfBirth: '',
      ssn: '',
      address: '',
    },
    financialInfo: {
      annualIncome: 0,
      netWorth: 0,
      investmentExperience: '',
      riskTolerance: '',
    },
    documents: {
      idDocument: null,
      proofOfIncome: null,
      proofOfAddress: null,
    },
    accreditation: {
      isAccredited: false,
      accreditationType: '',
    },
    agreements: {
      termsOfService: false,
      privacyPolicy: false,
      investmentRisks: false,
      coolingOffPeriod: false,
    },
  });

  const steps = [
    { id: 1, title: 'Personal Information', icon: <Shield className="h-4 w-4" /> },
    { id: 2, title: 'Financial Profile', icon: <AlertCircle className="h-4 w-4" /> },
    { id: 3, title: 'Document Upload', icon: <Upload className="h-4 w-4" /> },
    { id: 4, title: 'Accreditation Check', icon: <CheckCircle className="h-4 w-4" /> },
    { id: 5, title: 'Legal Agreements', icon: <Clock className="h-4 w-4" /> },
  ];

  const handleInputChange = (section: keyof KYCData, field: string, value: any) => {
    setKycData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setKycData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file,
      },
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          kycData.personalInfo.fullName &&
          kycData.personalInfo.dateOfBirth &&
          kycData.personalInfo.ssn &&
          kycData.personalInfo.address
        );
      case 2:
        return (
          kycData.financialInfo.annualIncome >= 50000 &&
          kycData.financialInfo.netWorth >= 100000 &&
          kycData.financialInfo.investmentExperience !== '' &&
          kycData.financialInfo.riskTolerance !== ''
        );
      case 3:
        return (
          kycData.documents.idDocument &&
          kycData.documents.proofOfIncome &&
          kycData.documents.proofOfAddress
        ) !== null;
      case 4:
        return kycData.accreditation.isAccredited && kycData.accreditation.accreditationType !== '';
      case 5:
        return (
          kycData.agreements.termsOfService &&
          kycData.agreements.privacyPolicy &&
          kycData.agreements.investmentRisks &&
          kycData.agreements.coolingOffPeriod
        );
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    } else {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = () => {
    if (validateStep(5)) {
      onVerificationComplete(kycData);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Legal Name *</Label>
                <Input
                  id="fullName"
                  value={kycData.personalInfo.fullName}
                  onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                  placeholder="Enter your full legal name"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={kycData.personalInfo.dateOfBirth}
                  onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="ssn">Social Security Number *</Label>
              <Input
                id="ssn"
                type="password"
                value={kycData.personalInfo.ssn}
                onChange={(e) => handleInputChange('personalInfo', 'ssn', e.target.value)}
                placeholder="XXX-XX-XXXX"
              />
            </div>
            <div>
              <Label htmlFor="address">Full Address *</Label>
              <Input
                id="address"
                value={kycData.personalInfo.address}
                onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                placeholder="Street, City, State, ZIP"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Minimum requirements: $50,000 annual income, $100,000 net worth
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="annualIncome">Annual Income (USD) *</Label>
                <Input
                  id="annualIncome"
                  type="number"
                  value={kycData.financialInfo.annualIncome}
                  onChange={(e) => handleInputChange('financialInfo', 'annualIncome', parseInt(e.target.value))}
                  placeholder="50000"
                />
              </div>
              <div>
                <Label htmlFor="netWorth">Net Worth (USD) *</Label>
                <Input
                  id="netWorth"
                  type="number"
                  value={kycData.financialInfo.netWorth}
                  onChange={(e) => handleInputChange('financialInfo', 'netWorth', parseInt(e.target.value))}
                  placeholder="100000"
                />
              </div>
            </div>
              <div>
                <Label htmlFor="investmentExperience">Investment Experience *</Label>
                <select
                  id="investmentExperience"
                  className="w-full p-2 border rounded-md"
                  value={kycData.financialInfo.investmentExperience}
                  onChange={(e) => handleInputChange('financialInfo', 'investmentExperience', e.target.value)}
                >
                  <option value="">Select experience level</option>
                  <option value="beginner">Beginner (0-2 years)</option>
                  <option value="intermediate">Intermediate (3-7 years)</option>
                  <option value="advanced">Advanced (8+ years)</option>
                  <option value="professional">Professional Investor</option>
                </select>
              </div>
            <div>
              <Label htmlFor="riskTolerance">Risk Tolerance *</Label>
              <select
                id="riskTolerance"
                className="w-full p-2 border rounded-md"
                value={kycData.financialInfo.riskTolerance}
                onChange={(e) => handleInputChange('financialInfo', 'riskTolerance', e.target.value)}
              >
                <option value="">Select risk tolerance</option>
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
                <option value="speculative">Speculative</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Alert>
              <Upload className="h-4 w-4" />
              <AlertDescription>
                Upload clear, readable documents. Accepted formats: PDF, JPG, PNG (max 5MB each)
              </AlertDescription>
            </Alert>
            <div className="space-y-4">
              <div>
                <Label htmlFor="idDocument">Government-issued ID *</Label>
                <Input
                  id="idDocument"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('idDocument', e.target.files?.[0] || null)}
                />
              </div>
              <div>
                <Label htmlFor="proofOfIncome">Proof of Income *</Label>
                <Input
                  id="proofOfIncome"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('proofOfIncome', e.target.files?.[0] || null)}
                />
              </div>
              <div>
                <Label htmlFor="proofOfAddress">Proof of Address *</Label>
                <Input
                  id="proofOfAddress"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('proofOfAddress', e.target.files?.[0] || null)}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Accredited investor status is required for this investment opportunity
              </AlertDescription>
            </Alert>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isAccredited"
                checked={kycData.accreditation.isAccredited}
                onCheckedChange={(checked) => handleInputChange('accreditation', 'isAccredited', checked)}
              />
              <Label htmlFor="isAccredited">I am an accredited investor</Label>
            </div>
            {kycData.accreditation.isAccredited && (
              <div>
                <Label htmlFor="accreditationType">Accreditation Type *</Label>
                <select
                  id="accreditationType"
                  className="w-full p-2 border rounded-md"
                  value={kycData.accreditation.accreditationType}
                  onChange={(e) => handleInputChange('accreditation', 'accreditationType', e.target.value)}
                >
                  <option value="">Select accreditation type</option>
                  <option value="income">Income Test ($200k+ individual, $300k+ joint)</option>
                  <option value="net-worth">Net Worth Test ($1M+ excluding primary residence)</option>
                  <option value="professional">Investment Professional</option>
                  <option value="entity">Qualified Institutional Buyer</option>
                </select>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Please review and agree to all terms. You will have a 72-hour cooling-off period.
              </AlertDescription>
            </Alert>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="termsOfService"
                  checked={kycData.agreements.termsOfService}
                  onCheckedChange={(checked) => handleInputChange('agreements', 'termsOfService', checked)}
                />
                <Label htmlFor="termsOfService">I agree to the Terms of Service</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="privacyPolicy"
                  checked={kycData.agreements.privacyPolicy}
                  onCheckedChange={(checked) => handleInputChange('agreements', 'privacyPolicy', checked)}
                />
                <Label htmlFor="privacyPolicy">I agree to the Privacy Policy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="investmentRisks"
                  checked={kycData.agreements.investmentRisks}
                  onCheckedChange={(checked) => handleInputChange('agreements', 'investmentRisks', checked)}
                />
                <Label htmlFor="investmentRisks">I understand the investment risks</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="coolingOffPeriod"
                  checked={kycData.agreements.coolingOffPeriod}
                  onCheckedChange={(checked) => handleInputChange('agreements', 'coolingOffPeriod', checked)}
                />
                <Label htmlFor="coolingOffPeriod">I understand the 72-hour cooling-off period</Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          KYC Verification & Compliance
        </CardTitle>
        <CardDescription>
          Complete verification to access investment opportunities
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  step.id <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step.id < currentStep
                      ? 'bg-primary text-primary-foreground border-primary'
                      : step.id === currentStep
                      ? 'border-primary text-primary'
                      : 'border-muted-foreground'
                  }`}
                >
                  {step.id < currentStep ? <CheckCircle className="h-5 w-5" /> : step.icon}
                </div>
                <span className="text-xs mt-2 text-center">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">
            Step {currentStep}: {steps[currentStep - 1].title}
          </h3>
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1 || isLoading}
          >
            Previous
          </Button>
          <div className="flex gap-2">
            <Badge variant="secondary">
              {currentStep} of {steps.length}
            </Badge>
          </div>
          <Button
            onClick={nextStep}
            disabled={!validateStep(currentStep) || isLoading}
          >
            {currentStep === 5 ? 'Submit for Verification' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
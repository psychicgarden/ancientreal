import React from 'react';
import { ValidatedForm } from '@/components/ui/validated-form';
import { TextField, NumberField, SelectField, TextareaField, DateField } from '@/components/ui/form-fields';
import { projectSubmissionSchema, ProjectSubmissionForm } from '@/lib/validation-schemas';
import { api } from '@/lib/api';
import { useWallet } from '@/contexts/WalletContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { FileText, DollarSign, Calendar, User } from 'lucide-react';

interface EnhancedProjectSubmissionFormProps {
  onSuccess: (projectId: string) => void;
  onCancel?: () => void;
}

export const EnhancedProjectSubmissionForm: React.FC<EnhancedProjectSubmissionFormProps> = ({
  onSuccess,
  onCancel
}) => {
  const { account } = useWallet();
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 4;

  const categoryOptions = [
    { value: 'development', label: 'Property Development' },
    { value: 'renovation', label: 'Renovation Project' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'community', label: 'Community Initiative' },
  ];

  const handleSubmit = async (data: ProjectSubmissionForm) => {
    const result = await api.supabase.createDeveloperInvestment({
      title: data.projectTitle,
      description: data.projectDescription,
      category: data.projectCategory,
      target_funding: data.targetFunding,
      min_investment: data.minInvestment,
      max_investment: data.maxInvestment,
      estimated_yield: data.estimatedYield,
      timeline: data.timeline,
      funding_deadline: data.fundingDeadline,
      creator_name: data.creatorName,
      creator_email: data.creatorEmail,
      creator_wallet_address: account,
      business_plan: data.businessPlan,
      github_repo_url: data.githubRepoUrl,
      demo_url: data.demoUrl,
      project_status: 'active',
      current_funding: 0,
    });

    if (!result.success) {
      throw new Error(result.error || 'Project submission failed');
    }

    onSuccess(result.data.id);
  };

  const defaultValues: Partial<ProjectSubmissionForm> = {
    projectCategory: 'development',
    estimatedYield: 15,
    minInvestment: 100,
    creatorWalletAddress: account || '',
    fundingDeadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
  };

  const renderStepContent = (form: any) => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <FileText className="h-5 w-5" />
              Project Information
            </div>
            
            <TextField
              form={form}
              name="projectTitle"
              label="Project Title"
              placeholder="Enter your project title"
              description="A clear, descriptive title for your project"
              required
            />

            <SelectField
              form={form}
              name="projectCategory"
              label="Project Category"
              options={categoryOptions}
              description="Choose the category that best fits your project"
              required
            />

            <TextareaField
              form={form}
              name="projectDescription"
              label="Project Description"
              placeholder="Provide a detailed description of your project..."
              rows={6}
              maxLength={5000}
              description="Detailed description of your project, goals, and expected outcomes"
              required
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <DollarSign className="h-5 w-5" />
              Financial Details
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NumberField
                form={form}
                name="targetFunding"
                label="Target Funding"
                currency
                min={10000}
                placeholder="500000"
                description="Total funding goal for the project"
                required
              />

              <NumberField
                form={form}
                name="estimatedYield"
                label="Estimated Yield"
                suffix="%"
                min={1}
                max={100}
                placeholder="15"
                description="Expected annual return percentage"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NumberField
                form={form}
                name="minInvestment"
                label="Minimum Investment"
                currency
                min={100}
                placeholder="1000"
                description="Minimum amount per investor"
                required
              />

              <NumberField
                form={form}
                name="maxInvestment"
                label="Maximum Investment (Optional)"
                currency
                placeholder="50000"
                description="Maximum amount per investor (if applicable)"
              />
            </div>

            <TextareaField
              form={form}
              name="revenueModel"
              label="Revenue Model"
              placeholder="Describe how the project will generate returns..."
              rows={4}
              description="Explain how investors will earn returns"
              required
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Calendar className="h-5 w-5" />
              Timeline & Planning
            </div>

            <TextareaField
              form={form}
              name="timeline"
              label="Project Timeline"
              placeholder="Phase 1: Planning (0-3 months)..."
              rows={4}
              description="Detailed timeline with key milestones"
              required
            />

            <DateField
              form={form}
              name="fundingDeadline"
              label="Funding Deadline"
              description="When funding must be completed"
              disabledDates={(date) => date < new Date()}
              required
            />

            <div className="space-y-4">
              <h4 className="font-medium">Business Plan Details</h4>
              
              <TextareaField
                form={form}
                name="businessPlan.summary"
                label="Executive Summary"
                placeholder="Provide a concise overview of your business plan..."
                rows={3}
                description="Brief summary of the business opportunity"
                required
              />

              <TextareaField
                form={form}
                name="businessPlan.marketAnalysis"
                label="Market Analysis"
                placeholder="Analyze the market opportunity and competition..."
                rows={3}
                description="Market size, competition, and positioning"
                required
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <User className="h-5 w-5" />
              Creator Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField
                form={form}
                name="creatorName"
                label="Full Name"
                placeholder="John Smith"
                description="Your full legal name"
                required
              />

              <TextField
                form={form}
                name="creatorEmail"
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                description="Contact email for project updates"
                required
              />
            </div>

            <TextField
              form={form}
              name="githubRepoUrl"
              label="GitHub Repository (Optional)"
              type="url"
              placeholder="https://github.com/username/project"
              description="Link to project repository if applicable"
            />

            <TextField
              form={form}
              name="demoUrl"
              label="Demo URL (Optional)"
              type="url"
              placeholder="https://demo.yourproject.com"
              description="Link to live demo or prototype"
            />

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Review Your Submission</h4>
              <p className="text-sm text-blue-700">
                Please review all information carefully. Once submitted, your project will be 
                reviewed by our team within 5-7 business days. You'll receive email updates 
                on the status of your submission.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Your Project</CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
        </div>
      </CardHeader>

      <CardContent>
        <ValidatedForm
          schema={projectSubmissionSchema}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          resetOnSuccess={false}
          successMessage="Project submitted successfully!"
          loadingMessage="Submitting your project..."
          submitText={currentStep === totalSteps ? "Submit Project" : "Continue"}
          showSubmitButton={false}
        >
          {(form) => (
            <div className="space-y-6">
              {renderStepContent(form)}

              <Separator />

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                <div className="flex gap-2">
                  {onCancel && (
                    <Button type="button" variant="ghost" onClick={onCancel}>
                      Cancel
                    </Button>
                  )}
                  
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                      disabled={!form.formState.isValid}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!form.formState.isValid || form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? 'Submitting...' : 'Submit Project'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </ValidatedForm>
      </CardContent>
    </Card>
  );
};
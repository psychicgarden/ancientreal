import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Upload, FileText, Check, Clock, AlertCircle, Github, Globe, FileCheck, Building, Scale } from 'lucide-react';

interface ProjectSubmissionFormProps {
  onClose?: () => void;
}

interface FormData {
  creator_name: string;
  creator_email: string;
  project_title: string;
  project_description: string;
  project_category: string;
  target_funding: number;
  estimated_yield: number;
  min_investment: number;
  max_investment?: number;
  funding_deadline?: string;
  timeline: string;
  github_repo_url?: string;
  demo_url?: string;
  market_analysis: string;
  revenue_model: string;
}

export const ProjectSubmissionForm: React.FC<ProjectSubmissionFormProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>({});
  const totalSteps = 4;

  const form = useForm<FormData>({
    defaultValues: {
      project_category: 'development',
      estimated_yield: 15,
      min_investment: 100,
    }
  });

  const handleFileUpload = async (category: string, files: FileList) => {
    const fileArray = Array.from(files);
    setUploadedFiles(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), ...fileArray]
    }));
  };

  const removeFile = (category: string, index: number) => {
    setUploadedFiles(prev => ({
      ...prev,
      [category]: prev[category]?.filter((_, i) => i !== index) || []
    }));
  };

  const uploadFilesToStorage = async (walletAddress: string) => {
    const uploadedPaths: string[] = [];
    
    for (const [category, files] of Object.entries(uploadedFiles)) {
      for (const file of files) {
        const fileName = `${walletAddress}/${category}/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('project-documents')
          .upload(fileName, file);
          
        if (error) {
          console.error('File upload error:', error);
          throw new Error(`Failed to upload ${file.name}`);
        }
        
        uploadedPaths.push(data.path);
      }
    }
    
    return uploadedPaths;
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // For demo purposes, we'll use a placeholder wallet address
      const walletAddress = 'demo-wallet-' + Date.now();
      
      // Upload files to storage
      const documentPaths = await uploadFilesToStorage(walletAddress);
      
      // Submit project data
      const { data: submissionData, error } = await supabase
        .from('project_submissions')
        .insert({
          creator_wallet_address: walletAddress,
          creator_name: data.creator_name,
          creator_email: data.creator_email,
          project_title: data.project_title,
          project_description: data.project_description,
          project_category: data.project_category,
          target_funding: data.target_funding,
          estimated_yield: data.estimated_yield,
          min_investment: data.min_investment,
          max_investment: data.max_investment,
          funding_deadline: data.funding_deadline ? new Date(data.funding_deadline).toISOString() : null,
          timeline: data.timeline,
          github_repo_url: data.github_repo_url,
          demo_url: data.demo_url,
          market_analysis: data.market_analysis,
          revenue_model: data.revenue_model,
          uploaded_documents: documentPaths,
        })
        .select()
        .single();

      if (error) throw error;

      // Send notification to admin
      await supabase.functions.invoke('send-project-notification', {
        body: {
          type: 'new_submission',
          submission: submissionData,
          adminEmail: 'admin@mazunte.io' // Configure this as needed
        }
      });

      toast({ title: "Project submitted", description: "We'll review it within 5 business days." });
      onClose?.();
    } catch (error) {
      console.error('Submission error:', error);
      toast({ title: "Failed to submit project", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Basic Project Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="creator_name"
                  rules={{ required: "Creator name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Creator Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="creator_email"
                  rules={{ required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="project_title"
                rules={{ required: "Project title is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your project title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="project_description"
                rules={{ required: "Project description is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your project, its purpose, and what makes it unique..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="project_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="defi">DeFi</SelectItem>
                        <SelectItem value="nft">NFT</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                        <SelectItem value="infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Funding Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="target_funding"
                rules={{ required: "Target funding is required", min: { value: 1000, message: "Minimum funding is $1,000" } }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Funding (USD) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="50000" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estimated_yield"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Yield (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="15" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="min_investment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Investment (USD)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="100" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_investment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Investment (USD)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="10000" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="funding_deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funding Deadline</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="timeline"
              rules={{ required: "Timeline is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Development Timeline *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your development milestones and timeline..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Technical & Business Requirements</h3>
            
            <Tabs defaultValue="technical" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="technical" className="flex items-center">
                  <Github className="mr-2 h-4 w-4" />
                  Technical
                </TabsTrigger>
                <TabsTrigger value="business" className="flex items-center">
                  <Building className="mr-2 h-4 w-4" />
                  Business
                </TabsTrigger>
                <TabsTrigger value="legal" className="flex items-center">
                  <Scale className="mr-2 h-4 w-4" />
                  Legal
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="technical" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="github_repo_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub Repository URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://github.com/username/repo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="demo_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Live Demo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://your-demo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Required Documents:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Working prototype or MVP</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Complete codebase on GitHub</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Technical architecture documentation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Smart contract audits (if applicable)</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="technical-docs">Upload Technical Documentation</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Drag & drop files or click to browse</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => e.target.files && handleFileUpload('technical', e.target.files)}
                      className="mt-2"
                    />
                  </div>
                  {uploadedFiles.technical && (
                    <div className="mt-2 space-y-1">
                      {uploadedFiles.technical.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeFile('technical', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="business" className="space-y-4">
                <FormField
                  control={form.control}
                  name="market_analysis"
                  rules={{ required: "Market analysis is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market Analysis *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your target market, competition, and market opportunity..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="revenue_model"
                  rules={{ required: "Revenue model is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Revenue Model *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Explain how your project will generate revenue..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <Label htmlFor="business-docs">Upload Business Documents</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Business plan, financial projections, etc.</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      onChange={(e) => e.target.files && handleFileUpload('business', e.target.files)}
                      className="mt-2"
                    />
                  </div>
                  {uploadedFiles.business && (
                    <div className="mt-2 space-y-1">
                      {uploadedFiles.business.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeFile('business', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="legal" className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Legal Compliance:</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span>Intellectual property documentation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span>Regulatory compliance status</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span>Terms of service and privacy policy</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="legal-docs">Upload Legal Documents</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Legal agreements, compliance docs, etc.</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => e.target.files && handleFileUpload('legal', e.target.files)}
                      className="mt-2"
                    />
                  </div>
                  {uploadedFiles.legal && (
                    <div className="mt-2 space-y-1">
                      {uploadedFiles.legal.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeFile('legal', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Review & Submit</h3>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Project Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Title:</span> {form.watch('project_title')}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {form.watch('project_category')}
                    </div>
                    <div>
                      <span className="font-medium">Target Funding:</span> ${form.watch('target_funding')?.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Estimated Yield:</span> {form.watch('estimated_yield')}%
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Uploaded Documents</h4>
                  <div className="space-y-2">
                    {Object.entries(uploadedFiles).map(([category, files]) => (
                      <div key={category}>
                        <span className="font-medium capitalize">{category}:</span> {files.length} files
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  What happens next?
                </h4>
                <ul className="text-sm space-y-1">
                  <li>• Your submission will be reviewed by our team within 5 business days</li>
                  <li>• We'll contact you if additional information is needed</li>
                  <li>• Approved projects will be added to our investment platform</li>
                  <li>• You'll receive updates on funding progress via email</li>
                </ul>
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
        <CardTitle className="text-2xl">Submit Your Project</CardTitle>
        <CardDescription>
          Get your blockchain project funded by our community DAO
        </CardDescription>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderStepContent()}
            
            <Separator />
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              <div className="space-x-2">
                {onClose && (
                  <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                )}
                
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Project'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
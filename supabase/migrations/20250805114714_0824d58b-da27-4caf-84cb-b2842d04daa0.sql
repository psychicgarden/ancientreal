-- Create storage bucket for project documents
INSERT INTO storage.buckets (id, name, public) VALUES ('project-documents', 'project-documents', false);

-- Create project submissions table
CREATE TABLE public.project_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_wallet_address TEXT NOT NULL,
  creator_name TEXT NOT NULL,
  creator_email TEXT NOT NULL,
  project_title TEXT NOT NULL,
  project_description TEXT NOT NULL,
  project_category TEXT NOT NULL DEFAULT 'development',
  target_funding NUMERIC NOT NULL,
  estimated_yield NUMERIC NOT NULL DEFAULT 15,
  min_investment NUMERIC NOT NULL DEFAULT 100,
  max_investment NUMERIC,
  funding_deadline TIMESTAMP WITH TIME ZONE,
  timeline TEXT,
  
  -- Technical requirements
  github_repo_url TEXT,
  demo_url TEXT,
  technical_docs JSONB DEFAULT '{}',
  
  -- Business requirements  
  business_plan JSONB DEFAULT '{}',
  market_analysis TEXT,
  revenue_model TEXT,
  team_info JSONB DEFAULT '{}',
  
  -- Legal requirements
  legal_docs JSONB DEFAULT '{}',
  compliance_status TEXT DEFAULT 'pending',
  
  -- Document storage paths
  uploaded_documents JSONB DEFAULT '[]',
  
  -- Submission status
  submission_status TEXT NOT NULL DEFAULT 'pending' CHECK (submission_status IN ('pending', 'under_review', 'approved', 'rejected', 'needs_revision')),
  review_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own project submissions" 
ON public.project_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own project submissions" 
ON public.project_submissions 
FOR SELECT 
USING (creator_wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));

CREATE POLICY "Users can update their own project submissions" 
ON public.project_submissions 
FOR UPDATE 
USING (creator_wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));

-- Admins can view all submissions (for review)
CREATE POLICY "Admins can view all project submissions" 
ON public.project_submissions 
FOR SELECT 
USING (true);

-- Create storage policies for project documents
CREATE POLICY "Users can upload their own project documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'project-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own project documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'project-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own project documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'project-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create trigger for updated_at
CREATE TRIGGER update_project_submissions_updated_at
BEFORE UPDATE ON public.project_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
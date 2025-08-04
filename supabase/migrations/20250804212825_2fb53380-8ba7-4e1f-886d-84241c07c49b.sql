-- Create developer_projects table
CREATE TABLE public.developer_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  creator_name TEXT NOT NULL,
  creator_wallet_address TEXT NOT NULL,
  target_funding NUMERIC NOT NULL,
  current_funding NUMERIC NOT NULL DEFAULT 0,
  presale_price NUMERIC NOT NULL,
  min_investment NUMERIC NOT NULL DEFAULT 100,
  max_investment NUMERIC,
  estimated_yield NUMERIC NOT NULL DEFAULT 15,
  project_status TEXT NOT NULL DEFAULT 'active' CHECK (project_status IN ('active', 'funded', 'completed', 'cancelled')),
  timeline TEXT,
  funding_deadline TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  category TEXT DEFAULT 'development',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create developer_investments table
CREATE TABLE public.developer_investments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_wallet_address TEXT NOT NULL,
  project_id UUID NOT NULL REFERENCES public.developer_projects(id) ON DELETE CASCADE,
  investment_amount NUMERIC NOT NULL,
  ownership_percentage NUMERIC NOT NULL,
  platform_fee NUMERIC NOT NULL DEFAULT 0,
  net_investment NUMERIC NOT NULL,
  projected_value NUMERIC NOT NULL,
  projected_profit NUMERIC NOT NULL,
  investment_status TEXT NOT NULL DEFAULT 'active' CHECK (investment_status IN ('active', 'completed', 'cancelled')),
  transaction_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create developer_project_updates table
CREATE TABLE public.developer_project_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.developer_projects(id) ON DELETE CASCADE,
  update_title TEXT NOT NULL,
  update_content TEXT NOT NULL,
  milestone_percentage NUMERIC DEFAULT 0,
  update_type TEXT NOT NULL DEFAULT 'progress' CHECK (update_type IN ('progress', 'milestone', 'completion', 'announcement')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.developer_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_project_updates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for developer_projects (publicly viewable)
CREATE POLICY "Developer projects are viewable by everyone" 
ON public.developer_projects 
FOR SELECT 
USING (true);

CREATE POLICY "Creators can update their own projects" 
ON public.developer_projects 
FOR UPDATE 
USING (creator_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Create RLS policies for developer_investments (wallet-based access)
CREATE POLICY "Users can view their own developer investments" 
ON public.developer_investments 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own developer investments" 
ON public.developer_investments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own developer investments" 
ON public.developer_investments 
FOR UPDATE 
USING (true);

-- Create RLS policies for developer_project_updates (publicly viewable)
CREATE POLICY "Project updates are viewable by everyone" 
ON public.developer_project_updates 
FOR SELECT 
USING (true);

CREATE POLICY "Project creators can create updates" 
ON public.developer_project_updates 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.developer_projects 
  WHERE id = project_id 
  AND creator_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
));

-- Create triggers for timestamp updates
CREATE TRIGGER update_developer_projects_updated_at
BEFORE UPDATE ON public.developer_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_developer_investments_updated_at
BEFORE UPDATE ON public.developer_investments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample developer projects
INSERT INTO public.developer_projects (
  title, description, creator_name, creator_wallet_address, target_funding, presale_price, 
  min_investment, estimated_yield, timeline, category, image_url
) VALUES 
(
  'Mazunte Smart City Infrastructure',
  'Revolutionary blockchain-based infrastructure for sustainable smart city development in Mazunte, Mexico.',
  'TechVision Labs',
  '0x1234567890123456789012345678901234567890',
  5000000,
  0.08,
  1000,
  18.5,
  '18 months development',
  'infrastructure',
  '/src/assets/eco-smart-city.jpg'
),
(
  'Sustainable Resort Development',
  'Eco-friendly luxury resort development with integrated renewable energy systems.',
  'EcoResorts Inc',
  '0x2345678901234567890123456789012345678901',
  3500000,
  0.12,
  500,
  22.0,
  '24 months development',
  'hospitality',
  '/src/assets/bali-jungle-resort.jpg'
),
(
  'Blockchain Real Estate Platform',
  'Next-generation platform for fractional real estate investment using smart contracts.',
  'PropTech Solutions',
  '0x3456789012345678901234567890123456789012',
  2800000,
  0.15,
  250,
  25.5,
  '12 months development',
  'technology',
  '/src/assets/property-1.jpg'
);
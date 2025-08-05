-- Allow users to create developer projects
CREATE POLICY "Users can create developer projects" 
ON public.developer_projects 
FOR INSERT 
WITH CHECK (true);
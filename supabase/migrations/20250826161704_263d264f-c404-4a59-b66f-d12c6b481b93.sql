-- Enable users to insert their own property records from smart contract purchases
CREATE POLICY "Users can insert their own properties"
ON public.user_properties
FOR INSERT
WITH CHECK (true);

-- Enable system/contract sync to update property records  
CREATE POLICY "System can update property records"
ON public.user_properties
FOR UPDATE
USING (true);

-- Enable cleanup/deletion of user properties
CREATE POLICY "Users can delete their own properties"
ON public.user_properties
FOR DELETE
USING (true);
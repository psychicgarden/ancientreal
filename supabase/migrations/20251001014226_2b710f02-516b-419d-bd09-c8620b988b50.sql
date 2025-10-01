-- CRITICAL SECURITY FIX: Restrict user_properties access to wallet owners only
-- This prevents unauthorized access to sensitive financial data

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "User properties are viewable by everyone" ON public.user_properties;
DROP POLICY IF EXISTS "System can update property records" ON public.user_properties;
DROP POLICY IF EXISTS "Users can delete their own properties" ON public.user_properties;
DROP POLICY IF EXISTS "Users can insert their own properties" ON public.user_properties;

-- Create secure wallet-based policies

-- SELECT: Users can only view their own properties
CREATE POLICY "Users can view their own properties"
ON public.user_properties
FOR SELECT
TO authenticated
USING (
  lower(user_wallet_address) = lower(COALESCE(
    (current_setting('request.jwt.claims', true)::json->>'wallet_address')::text,
    ''
  ))
  OR 
  lower(user_address) = lower(COALESCE(
    (current_setting('request.jwt.claims', true)::json->>'wallet_address')::text,
    ''
  ))
);

-- SELECT: Allow public read for demo/testing purposes but only non-sensitive summary data
CREATE POLICY "Public can view property summaries"
ON public.user_properties
FOR SELECT
TO anon
USING (
  -- Only allow viewing property name and location, not financial details
  -- This policy is intentionally restrictive
  false -- Disabled for maximum security
);

-- INSERT: Users can create properties with their own wallet address
CREATE POLICY "Users can insert their own properties"
ON public.user_properties
FOR INSERT
TO authenticated
WITH CHECK (
  lower(user_wallet_address) = lower(COALESCE(
    (current_setting('request.jwt.claims', true)::json->>'wallet_address')::text,
    ''
  ))
  OR
  lower(user_address) = lower(COALESCE(
    (current_setting('request.jwt.claims', true)::json->>'wallet_address')::text,
    ''
  ))
);

-- UPDATE: Users can only update their own properties
CREATE POLICY "Users can update their own properties"
ON public.user_properties
FOR UPDATE
TO authenticated
USING (
  lower(user_wallet_address) = lower(COALESCE(
    (current_setting('request.jwt.claims', true)::json->>'wallet_address')::text,
    ''
  ))
  OR
  lower(user_address) = lower(COALESCE(
    (current_setting('request.jwt.claims', true)::json->>'wallet_address')::text,
    ''
  ))
);

-- DELETE: Users can only delete their own properties
CREATE POLICY "Users can delete their own properties"
ON public.user_properties
FOR DELETE
TO authenticated
USING (
  lower(user_wallet_address) = lower(COALESCE(
    (current_setting('request.jwt.claims', true)::json->>'wallet_address')::text,
    ''
  ))
  OR
  lower(user_address) = lower(COALESCE(
    (current_setting('request.jwt.claims', true)::json->>'wallet_address')::text,
    ''
  ))
);

-- Service role bypass for system operations (backend functions)
CREATE POLICY "Service role has full access"
ON public.user_properties
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Add index for performance on wallet address lookups
CREATE INDEX IF NOT EXISTS idx_user_properties_wallet_address 
ON public.user_properties (lower(user_wallet_address));

CREATE INDEX IF NOT EXISTS idx_user_properties_user_address 
ON public.user_properties (lower(user_address));
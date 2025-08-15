-- Add owner approval fields to property_fractionalization table
ALTER TABLE public.property_fractionalization 
ADD COLUMN IF NOT EXISTS owner_approved_listing boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS owner_listing_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS owner_set_valuation boolean DEFAULT false;

-- Approve existing demo properties for backward compatibility
UPDATE public.property_fractionalization 
SET owner_approved_listing = true,
    owner_listing_date = now(),
    owner_set_valuation = false
WHERE is_active = true;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_property_fractionalization_owner_approved 
ON public.property_fractionalization(owner_approved_listing);
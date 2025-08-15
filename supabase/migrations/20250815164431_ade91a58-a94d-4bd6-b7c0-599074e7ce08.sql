-- Phase 1: Add Mortgage Groups functionality to property_fractionalization table

-- Add new columns for mortgage groups functionality
ALTER TABLE public.property_fractionalization 
ADD COLUMN investment_type TEXT DEFAULT 'fractional' CHECK (investment_type IN ('fractional', 'mortgage_group')),
ADD COLUMN group_size_limit INTEGER DEFAULT NULL,
ADD COLUMN down_payment_per_person NUMERIC DEFAULT NULL,
ADD COLUMN mortgage_down_payment_total NUMERIC DEFAULT NULL;

-- Add helpful comments
COMMENT ON COLUMN public.property_fractionalization.investment_type IS 'Type of investment: fractional (tokens) or mortgage_group (shared mortgage)';
COMMENT ON COLUMN public.property_fractionalization.group_size_limit IS 'Maximum number of people who can join this mortgage group';
COMMENT ON COLUMN public.property_fractionalization.down_payment_per_person IS 'Individual contribution needed to join the mortgage group';
COMMENT ON COLUMN public.property_fractionalization.mortgage_down_payment_total IS 'Total down payment needed for the property mortgage';

-- Convert 2 existing properties to mortgage_group type for testing
-- Update the first property to be a mortgage group
UPDATE public.property_fractionalization 
SET 
    investment_type = 'mortgage_group',
    group_size_limit = 5,
    mortgage_down_payment_total = 70000,
    down_payment_per_person = 14000
WHERE property_name ILIKE '%mazunte%' OR property_name ILIKE '%art deco%'
LIMIT 1;

-- Update the second property to be a mortgage group  
UPDATE public.property_fractionalization 
SET 
    investment_type = 'mortgage_group',
    group_size_limit = 6,
    mortgage_down_payment_total = 60000,
    down_payment_per_person = 10000
WHERE property_name ILIKE '%bahia%' OR property_name ILIKE '%beach%'
LIMIT 1;

-- Leave remaining properties as 'fractional' (default) for comparison
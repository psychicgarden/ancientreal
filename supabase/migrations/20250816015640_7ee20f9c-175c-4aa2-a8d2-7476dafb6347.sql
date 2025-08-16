-- First, make the current properties visible by setting owner_approved_listing = true
UPDATE public.property_fractionalization 
SET owner_approved_listing = true,
    owner_listing_date = now()
WHERE property_name IN ('Mazunte Beach Villa', 'Bahia Ocean Villa', 'Ericeira Coastal Villa');

-- Check if we can find any traces of original property names in existing data
-- This will help us understand what properties were originally there
-- Phase 1: Add image_url column to user_properties
ALTER TABLE public.user_properties 
ADD COLUMN image_url TEXT;

-- Phase 4: Create payment_history table for tracking mortgage payments
CREATE TABLE public.payment_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_wallet_address TEXT NOT NULL,
  property_id UUID REFERENCES public.user_properties(id),
  payment_amount NUMERIC NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  payment_type TEXT NOT NULL DEFAULT 'mortgage_payment',
  transaction_hash TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  remaining_balance_after NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on payment_history
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- Create policy for payment_history
CREATE POLICY "Allow wallet-based access for payment history" 
ON public.payment_history 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Add trigger for payment_history updated_at
CREATE TRIGGER update_payment_history_updated_at
  BEFORE UPDATE ON public.payment_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update existing user_properties with sample images
UPDATE public.user_properties 
SET image_url = CASE 
  WHEN property_name ILIKE '%villa%' THEN '/src/assets/villa-bali.jpg'
  WHEN property_name ILIKE '%apartment%' THEN '/src/assets/apartment-nyc.jpg'
  WHEN property_name ILIKE '%beach%' THEN '/src/assets/beach-house-maldives.jpg'
  WHEN property_name ILIKE '%penthouse%' THEN '/src/assets/penthouse-mexico.jpg'
  ELSE '/src/assets/property-1.jpg'
END
WHERE image_url IS NULL;
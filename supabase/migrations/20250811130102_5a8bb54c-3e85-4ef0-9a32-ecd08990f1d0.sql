-- Fix the search path security issue for the update_tokens_sold function
CREATE OR REPLACE FUNCTION update_tokens_sold()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Update the tokens_sold in property_fractionalization table
  UPDATE public.property_fractionalization 
  SET tokens_sold = tokens_sold + NEW.token_amount,
      updated_at = now()
  WHERE id = NEW.property_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
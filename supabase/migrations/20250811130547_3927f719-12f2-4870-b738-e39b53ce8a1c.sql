-- Add foreign key constraint between fractional_investments and property_fractionalization
ALTER TABLE public.fractional_investments 
ADD CONSTRAINT fk_fractional_investments_property_id 
FOREIGN KEY (property_id) REFERENCES public.property_fractionalization(id);

-- Create trigger to apply the update_tokens_sold function
CREATE TRIGGER trigger_update_tokens_sold
  AFTER INSERT ON public.fractional_investments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tokens_sold();

-- Update property status logic: when a property gets fractionalized, mark user_properties as inactive
CREATE OR REPLACE FUNCTION handle_property_fractionalization()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- When a property fractionalization is created, update related user_properties
  UPDATE public.user_properties 
  SET is_active = false,
      updated_at = now()
  WHERE property_name = NEW.property_name 
    AND property_location = NEW.property_location;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for property fractionalization
CREATE TRIGGER trigger_handle_property_fractionalization
  AFTER INSERT ON public.property_fractionalization
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_property_fractionalization();
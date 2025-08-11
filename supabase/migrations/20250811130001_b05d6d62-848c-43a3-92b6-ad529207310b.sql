-- Create trigger to automatically update tokens_sold when fractional investments are created
CREATE OR REPLACE FUNCTION update_tokens_sold()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the tokens_sold in property_fractionalization table
  UPDATE property_fractionalization 
  SET tokens_sold = tokens_sold + NEW.token_amount,
      updated_at = now()
  WHERE id = NEW.property_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER trigger_update_tokens_sold
  AFTER INSERT ON fractional_investments
  FOR EACH ROW
  EXECUTE FUNCTION update_tokens_sold();

-- Fix existing tokens_sold data by recalculating from actual investments
UPDATE property_fractionalization 
SET tokens_sold = (
  SELECT COALESCE(SUM(token_amount), 0)
  FROM fractional_investments 
  WHERE property_id = property_fractionalization.id 
    AND status = 'active'
),
updated_at = now();
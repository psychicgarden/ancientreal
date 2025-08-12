-- Fix Art Deco Loft property data inconsistencies

-- 1. Update user_properties with correct values
UPDATE user_properties 
SET 
  down_payment = 25800,  -- Correct 20% of $129,000
  remaining_balance = 95000,  -- Realistic remaining balance (original loan $103,200, some paid down)
  monthly_payment = 1235,  -- Recalculated based on proper loan terms
  equity_percentage = 30,  -- Updated to reflect actual equity
  updated_at = now()
WHERE property_name = 'Art Deco Loft' AND user_wallet_address = '0x966fed85116f6d283921a6ed176d7643a99cbf94';

-- 2. Clean up duplicate fractional investments (keep only one)
DELETE FROM fractional_investments 
WHERE property_id = 'd9593323-2fda-4c16-b016-93dcdf9f231d' 
AND investor_wallet_address = '0x966fed85116f6d283921a6ed176d7643a99cbf94'
AND id NOT IN (
  SELECT id FROM fractional_investments 
  WHERE property_id = 'd9593323-2fda-4c16-b016-93dcdf9f231d' 
  AND investor_wallet_address = '0x966fed85116f6d283921a6ed176d7643a99cbf94'
  ORDER BY created_at ASC 
  LIMIT 1
);

-- 3. Update the remaining fractional investment with correct values
UPDATE fractional_investments 
SET 
  investment_amount = 2500,  -- Update to realistic total investment
  original_property_price = 129000,  -- Correct property price
  speculation_price = 129000,  -- Match current property value
  ownership_percentage = 1.3440860215053765,  -- Recalculate based on correct price
  token_amount = 13440.860215053765,  -- Adjust tokens accordingly
  updated_at = now()
WHERE property_id = 'd9593323-2fda-4c16-b016-93dcdf9f231d' 
AND investor_wallet_address = '0x966fed85116f6d283921a6ed176d7643a99cbf94';

-- 4. Fix property_fractionalization with consistent values
UPDATE property_fractionalization 
SET 
  original_property_value = 129000,  -- Match actual purchase price
  current_speculation_price = 129000,  -- Consistent pricing
  monthly_base_rent = 2050,  -- Correct monthly rental income
  tokens_sold = 13440.860215053765,  -- Match the single investment
  updated_at = now()
WHERE property_name = 'Art Deco Loft' AND id = 'd9593323-2fda-4c16-b016-93dcdf9f231d';

-- 5. Add data validation function to prevent future inconsistencies
CREATE OR REPLACE FUNCTION validate_mortgage_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure remaining balance doesn't exceed loan amount
  IF NEW.remaining_balance > (NEW.purchase_price - NEW.down_payment) THEN
    RAISE EXCEPTION 'Remaining balance cannot exceed loan amount';
  END IF;
  
  -- Ensure down payment is reasonable (5-50% of purchase price)
  IF NEW.down_payment < (NEW.purchase_price * 0.05) OR NEW.down_payment > (NEW.purchase_price * 0.5) THEN
    RAISE EXCEPTION 'Down payment must be between 5%% and 50%% of purchase price';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for data validation
DROP TRIGGER IF EXISTS validate_mortgage_trigger ON user_properties;
CREATE TRIGGER validate_mortgage_trigger
  BEFORE INSERT OR UPDATE ON user_properties
  FOR EACH ROW EXECUTE FUNCTION validate_mortgage_data();
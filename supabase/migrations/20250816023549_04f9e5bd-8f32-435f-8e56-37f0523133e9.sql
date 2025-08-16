-- Create trigger function to sync platform fee transactions to platform_fees table
CREATE OR REPLACE FUNCTION public.sync_platform_fee_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process platform_fee transactions
  IF NEW.transaction_type = 'platform_fee' AND NEW.status = 'completed' THEN
    -- Insert into platform_fees table
    INSERT INTO public.platform_fees (
      user_wallet_address,
      property_id,
      fee_amount_usd,
      fee_amount_base,
      property_value_usd,
      fee_percentage,
      transaction_hash,
      payment_status
    ) VALUES (
      NEW.user_wallet_address,
      (NEW.metadata->>'property_id')::uuid,
      NEW.amount,
      (NEW.amount * 1000000)::bigint, -- Convert to base units (6 decimals for USDC)
      (NEW.metadata->>'property_value')::numeric,
      COALESCE((NEW.metadata->>'fee_percentage')::numeric, 3.0),
      NEW.transaction_hash,
      'completed'
    )
    ON CONFLICT DO NOTHING; -- Prevent duplicates
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
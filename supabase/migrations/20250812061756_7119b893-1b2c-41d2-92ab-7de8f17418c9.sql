-- Clean up existing fractional_investments with mixed case wallet addresses
UPDATE public.fractional_investments 
SET investor_wallet_address = LOWER(investor_wallet_address)
WHERE investor_wallet_address != LOWER(investor_wallet_address);
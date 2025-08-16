-- Remove test purchase data for Oceanview Loft to reset "1/15 sold" to "0/15 sold"
-- This removes ONLY the test purchase, not the property itself

DELETE FROM public.user_properties 
WHERE id = '50471818-ec9f-48d7-926c-5ee01284832b' 
  AND property_name = 'Oceanview Loft'
  AND user_wallet_address = '0xabcdef1234567890abcdef1234567890abcdef12';
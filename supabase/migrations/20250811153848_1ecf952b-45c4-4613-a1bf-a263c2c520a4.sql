-- Reactivate the user's whole Art Deco Loft property since they do own it
UPDATE public.user_properties 
SET is_active = true,
    updated_at = now()
WHERE property_name = 'Art Deco Loft' 
  AND property_location = 'Mazunte, Mexico' 
  AND user_wallet_address = '0x966fed85116f6d283921a6ed176d7643a99cbf94';

-- One-time data correction: update old Art Deco Loft records to the new values
update public.user_properties
set
  purchase_price = 129000,
  current_value = 129000,
  image_url = '/src/assets/boho-art-deco-loft-mexico.jpg',
  updated_at = now()
where property_name = 'Art Deco Loft'
  and (
    purchase_price = 186000
    or image_url = '/src/assets/villa-tulum.jpg'
  );

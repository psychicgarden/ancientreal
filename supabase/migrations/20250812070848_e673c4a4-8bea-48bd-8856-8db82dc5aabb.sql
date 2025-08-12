-- Update backfill function to handle both 'purchase' and 'property_purchase' transaction types
CREATE OR REPLACE FUNCTION public.backfill_user_properties_from_transactions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    transaction_record RECORD;
    property_id_val bigint;
BEGIN
    -- Loop through completed purchase transactions (both 'purchase' and 'property_purchase') that don't have corresponding user_properties
    FOR transaction_record IN 
        SELECT DISTINCT 
            ut.user_wallet_address,
            ut.amount,
            ut.created_at,
            ut.metadata
        FROM public.user_transactions ut
        WHERE ut.transaction_type IN ('property_purchase', 'purchase')
          AND ut.status = 'completed'
          AND NOT EXISTS (
              SELECT 1 FROM public.user_properties up 
              WHERE up.user_wallet_address = ut.user_wallet_address 
                AND up.property_name = (ut.metadata->>'property_name')
          )
    LOOP
        -- Determine property_id based on property name
        CASE 
            WHEN transaction_record.metadata->>'property_name' ILIKE '%art deco loft%' THEN
                property_id_val := 1;
            WHEN transaction_record.metadata->>'property_name' ILIKE '%bahia%' THEN
                property_id_val := 2;
            ELSE
                property_id_val := NULL;
        END CASE;
        
        -- Insert into user_properties
        INSERT INTO public.user_properties (
            user_wallet_address,
            property_name,
            property_location,
            purchase_price,
            down_payment,
            remaining_balance,
            monthly_payment,
            current_value,
            purchase_date,
            property_id,
            image_url
        ) VALUES (
            transaction_record.user_wallet_address,
            COALESCE(transaction_record.metadata->>'property_name', 'Unknown Property'),
            COALESCE(transaction_record.metadata->>'property_location', 'Unknown Location'),
            transaction_record.amount,
            transaction_record.amount * 0.2, -- Assuming 20% down payment
            transaction_record.amount * 0.8, -- Remaining 80%
            (transaction_record.amount * 0.8 * 0.05) / 12, -- Rough monthly payment estimate
            transaction_record.amount,
            transaction_record.created_at,
            property_id_val,
            COALESCE(transaction_record.metadata->>'image_url', '/placeholder.svg')
        );
    END LOOP;
END;
$$;

-- Run the backfill function to process both transaction types
SELECT public.backfill_user_properties_from_transactions();
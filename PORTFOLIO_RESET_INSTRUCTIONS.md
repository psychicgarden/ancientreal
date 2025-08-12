# Portfolio Reset Instructions

## Manual Portfolio Reset (if needed)

If you need to reset your fractional portfolio data manually, run these SQL commands in the Supabase SQL Editor:

### Step 1: Clear Your Fractional Portfolio Data
```sql
-- Replace 'YOUR_WALLET_ADDRESS' with your actual wallet address (lowercase)
-- Example: '0x966fed85116f6d283921a6ed176d7643a99cbf94'

-- Archive existing data (backup)
INSERT INTO public.fractional_investments_archive
SELECT * FROM public.fractional_investments
WHERE lower(investor_wallet_address) = lower('YOUR_WALLET_ADDRESS');

INSERT INTO public.investor_rental_claims_archive
SELECT * FROM public.investor_rental_claims
WHERE lower(investor_wallet_address) = lower('YOUR_WALLET_ADDRESS');

INSERT INTO public.secondary_orders_archive
SELECT * FROM public.secondary_orders
WHERE lower(owner_wallet_address) = lower('YOUR_WALLET_ADDRESS');

INSERT INTO public.secondary_trades_archive
SELECT * FROM public.secondary_trades
WHERE lower(buyer_wallet_address) = lower('YOUR_WALLET_ADDRESS')
   OR lower(seller_wallet_address) = lower('YOUR_WALLET_ADDRESS');

-- Delete current data
DELETE FROM public.investor_rental_claims
WHERE lower(investor_wallet_address) = lower('YOUR_WALLET_ADDRESS');

DELETE FROM public.secondary_orders
WHERE lower(owner_wallet_address) = lower('YOUR_WALLET_ADDRESS');

DELETE FROM public.secondary_trades
WHERE lower(buyer_wallet_address) = lower('YOUR_WALLET_ADDRESS')
   OR lower(seller_wallet_address) = lower('YOUR_WALLET_ADDRESS');

DELETE FROM public.fractional_investments
WHERE lower(investor_wallet_address) = lower('YOUR_WALLET_ADDRESS');
```

### Step 2: Recompute Property Token Sales
```sql
-- Update tokens_sold for all properties to maintain consistency
UPDATE public.property_fractionalization 
SET tokens_sold = COALESCE((
    SELECT SUM(fi.token_amount)
    FROM public.fractional_investments fi
    WHERE fi.property_id = property_fractionalization.id 
      AND fi.status = 'active'
), 0),
updated_at = now();
```

### Step 3: Verify Reset
```sql
-- Check that your data is cleared
SELECT COUNT(*) as remaining_investments
FROM public.fractional_investments
WHERE lower(investor_wallet_address) = lower('YOUR_WALLET_ADDRESS');

-- Should return 0 if reset was successful
```

## After Reset

1. Refresh your browser page
2. Make a fresh investment purchase through the UI
3. Your portfolio should immediately display the new investment
4. Real-time updates should work correctly

## Troubleshooting

If you still don't see investments after a purchase:

1. Check the browser console for any errors
2. Verify the purchase transaction completed successfully  
3. Run this query to see if the investment was recorded:

```sql
SELECT * FROM public.fractional_investments
WHERE lower(investor_wallet_address) = lower('YOUR_WALLET_ADDRESS')
ORDER BY created_at DESC;
```

4. Check that the RPC function works:

```sql
SELECT * FROM public.get_user_fractional_investments('YOUR_WALLET_ADDRESS');
```
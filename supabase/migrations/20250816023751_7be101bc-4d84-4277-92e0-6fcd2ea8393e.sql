-- Backfill existing platform fee transactions to platform_fees table with proper null handling
INSERT INTO public.platform_fees (
  user_wallet_address,
  property_id,
  fee_amount_usd,
  fee_amount_base,
  property_value_usd,
  fee_percentage,
  transaction_hash,
  payment_status
)
SELECT 
  ut.user_wallet_address,
  (ut.metadata->>'property_id')::uuid,
  ut.amount,
  (ut.amount * 1000000)::bigint,
  COALESCE((ut.metadata->>'property_value')::numeric, ut.amount / 0.03), -- Estimate property value if missing
  COALESCE((ut.metadata->>'fee_percentage')::numeric, 3.0),
  ut.transaction_hash,
  'completed'
FROM public.user_transactions ut
WHERE ut.transaction_type = 'platform_fee' 
  AND ut.status = 'completed'
ON CONFLICT DO NOTHING;
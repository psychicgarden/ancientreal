-- Create the trigger to automatically sync platform fee transactions
CREATE TRIGGER trigger_sync_platform_fee
  AFTER INSERT OR UPDATE ON public.user_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_platform_fee_transaction();

-- Backfill existing platform fee transactions to platform_fees table
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
  (ut.metadata->>'property_value')::numeric,
  COALESCE((ut.metadata->>'fee_percentage')::numeric, 3.0),
  ut.transaction_hash,
  'completed'
FROM public.user_transactions ut
WHERE ut.transaction_type = 'platform_fee' 
  AND ut.status = 'completed'
ON CONFLICT DO NOTHING;
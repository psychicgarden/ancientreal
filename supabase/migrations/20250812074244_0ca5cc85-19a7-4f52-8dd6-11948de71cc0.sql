-- Fixing quoting error and applying full plan

-- 1) Unique index to support ON CONFLICT (user_address, unique_purchase_key)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM   pg_indexes
    WHERE  schemaname = 'public'
    AND    indexname  = 'user_properties_user_address_unique_purchase_key_key'
  ) THEN
    EXECUTE 'CREATE UNIQUE INDEX user_properties_user_address_unique_purchase_key_key
             ON public.user_properties (user_address, unique_purchase_key)';
  END IF;
END $$;

-- 2) AFTER INSERT trigger on user_transactions to backfill user_properties automatically
DROP TRIGGER IF EXISTS after_user_tx_backfill ON public.user_transactions;
CREATE TRIGGER after_user_tx_backfill
AFTER INSERT ON public.user_transactions
FOR EACH ROW
EXECUTE FUNCTION public.trg_after_user_tx_backfill();

-- 3) Optional index to speed wallet lookups
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname='public' AND indexname='idx_user_transactions_wallet_created_at'
  ) THEN
    EXECUTE 'CREATE INDEX idx_user_transactions_wallet_created_at
             ON public.user_transactions (lower(user_wallet_address), created_at DESC)';
  END IF;
END $$;

-- 4) Replay recent transactions (function internally skips non-completed)
WITH recent AS (
  SELECT id
  FROM public.user_transactions
  WHERE transaction_type IN ('purchase','property_purchase')
  ORDER BY created_at DESC
  LIMIT 50
)
SELECT public.backfill_user_property_from_tx(id) FROM recent;
-- Phase 1.1: Allow multiple purchases per property by removing old uniqueness and enabling per-purchase keys

-- A) Drop legacy uniqueness that forced one row per (user_address, property_id)
-- Try as constraint first, then as index (covers both cases safely)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'uniq_user_property_partial'
      AND conrelid = 'public.user_properties'::regclass
  ) THEN
    EXECUTE 'ALTER TABLE public.user_properties DROP CONSTRAINT uniq_user_property_partial';
  END IF;
END $$;

DROP INDEX IF EXISTS public.uniq_user_property_partial;

-- B) Ensure unique index for (user_address, unique_purchase_key)
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

-- C) Ensure AFTER INSERT trigger exists
DROP TRIGGER IF EXISTS after_user_tx_backfill ON public.user_transactions;
CREATE TRIGGER after_user_tx_backfill
AFTER INSERT ON public.user_transactions
FOR EACH ROW
EXECUTE FUNCTION public.trg_after_user_tx_backfill();

-- D) Replay recent transactions to upsert/refresh user_properties
WITH recent AS (
  SELECT id
  FROM public.user_transactions
  WHERE transaction_type IN ('purchase','property_purchase')
  ORDER BY created_at DESC
  LIMIT 50
)
SELECT public.backfill_user_property_from_tx(id) FROM recent;
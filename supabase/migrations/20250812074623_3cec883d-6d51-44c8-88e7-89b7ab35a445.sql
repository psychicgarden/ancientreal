-- Phase 1.4: Targeted cleanup of legacy uniqueness (avoid PK), then ensure trigger and backfill

-- A) Drop UNIQUE constraints enforcing old composites
DO $$
DECLARE
  r RECORD;
  def TEXT;
BEGIN
  FOR r IN
    SELECT oid, conname
    FROM pg_constraint
    WHERE conrelid = 'public.user_properties'::regclass
      AND contype = 'u'
  LOOP
    SELECT pg_get_constraintdef(r.oid) INTO def;
    IF def ILIKE '%(user_address, property_id)%' OR def ILIKE '%(user_wallet_address, property_name, property_location)%' THEN
      EXECUTE format('ALTER TABLE public.user_properties DROP CONSTRAINT %I', r.conname);
    END IF;
  END LOOP;
END $$;

-- B) Drop UNIQUE indexes enforcing old composites (skip PK)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT indexname, indexdef
    FROM pg_indexes
    WHERE schemaname='public' AND tablename='user_properties'
  LOOP
    IF r.indexname NOT ILIKE '%pkey' AND r.indexdef ILIKE 'CREATE UNIQUE INDEX %' AND (
         r.indexdef ILIKE '%(user_address, property_id)%'
      OR r.indexdef ILIKE '%(user_wallet_address, property_name, property_location)%'
    ) THEN
      EXECUTE format('DROP INDEX IF EXISTS public.%I', r.indexname);
    END IF;
  END LOOP;
END $$;

-- C) Ensure desired unique index exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname='public' AND indexname='user_properties_user_address_unique_purchase_key_key'
  ) THEN
    EXECUTE 'CREATE UNIQUE INDEX user_properties_user_address_unique_purchase_key_key
             ON public.user_properties (user_address, unique_purchase_key)';
  END IF;
END $$;

-- D) Ensure AFTER INSERT trigger exists
DROP TRIGGER IF EXISTS after_user_tx_backfill ON public.user_transactions;
CREATE TRIGGER after_user_tx_backfill
AFTER INSERT ON public.user_transactions
FOR EACH ROW
EXECUTE FUNCTION public.trg_after_user_tx_backfill();

-- E) Replay recent transactions
WITH recent AS (
  SELECT id
  FROM public.user_transactions
  WHERE transaction_type IN ('purchase','property_purchase')
  ORDER BY created_at DESC
  LIMIT 50
)
SELECT public.backfill_user_property_from_tx(id) FROM recent;
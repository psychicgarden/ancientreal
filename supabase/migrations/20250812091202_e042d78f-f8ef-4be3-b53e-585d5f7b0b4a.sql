
-- 1) Ensure the unique composite index used by backfill ON CONFLICT exists
CREATE UNIQUE INDEX IF NOT EXISTS user_properties_user_address_unique_purchase_key_idx
ON public.user_properties (user_address, unique_purchase_key);

-- 2) Create trigger to backfill after INSERT for completed purchase transactions
DROP TRIGGER IF EXISTS trg_user_tx_after_insert_backfill ON public.user_transactions;
CREATE TRIGGER trg_user_tx_after_insert_backfill
AFTER INSERT ON public.user_transactions
FOR EACH ROW
WHEN (
  (NEW.transaction_type IN ('purchase', 'property_purchase'))
  AND NEW.status = 'completed'
)
EXECUTE FUNCTION public.trg_after_user_tx_backfill();

-- 3) Create trigger to backfill after status UPDATE to completed
DROP TRIGGER IF EXISTS trg_user_tx_after_update_backfill ON public.user_transactions;
CREATE TRIGGER trg_user_tx_after_update_backfill
AFTER UPDATE OF status ON public.user_transactions
FOR EACH ROW
WHEN (
  (NEW.transaction_type IN ('purchase', 'property_purchase'))
  AND NEW.status = 'completed'
  AND (OLD.status IS DISTINCT FROM NEW.status)
)
EXECUTE FUNCTION public.trg_after_user_tx_backfill();

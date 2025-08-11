
-- 1) Enable full row data for realtime
ALTER TABLE public.secondary_orders REPLICA IDENTITY FULL;
ALTER TABLE public.secondary_trades REPLICA IDENTITY FULL;

-- 2) Add tables to supabase_realtime publication (idempotent)
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.secondary_orders;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.secondary_trades;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END$$;

-- 3) Enforce trusted updates on order fill/status (attach trigger if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_enforce_trusted_order_update'
      AND tgrelid = 'public.secondary_orders'::regclass
  ) THEN
    CREATE TRIGGER trg_enforce_trusted_order_update
    BEFORE UPDATE ON public.secondary_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_trusted_order_update();
  END IF;
END$$;

-- 4) Tighten RLS policies

-- secondary_orders: keep SELECT for everyone, keep the narrow trusted update policy, drop permissive UPDATE policy
DROP POLICY IF EXISTS "Users can update secondary orders" ON public.secondary_orders;

-- secondary_trades: trades should be immutable after insert
DROP POLICY IF EXISTS "Users can update secondary trades" ON public.secondary_trades;

-- secondary_trades: prevent direct client inserts; allow only via trusted RPC flag
DROP POLICY IF EXISTS "Only trusted RPC can insert trades" ON public.secondary_trades;

CREATE POLICY "Only trusted RPC can insert trades"
ON public.secondary_trades
FOR INSERT
TO public
WITH CHECK (COALESCE(current_setting('mazunte.trusted_fill', true), '') = '1');

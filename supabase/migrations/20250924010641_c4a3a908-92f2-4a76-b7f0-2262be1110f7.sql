-- Create contract event cursors table for tracking indexed blocks
CREATE TABLE IF NOT EXISTS public.contract_event_cursors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_address text NOT NULL,
  network text NOT NULL DEFAULT 'fuji',
  event_name text NOT NULL,
  last_block_scanned bigint NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(contract_address, network, event_name)
);

-- Enable RLS
ALTER TABLE public.contract_event_cursors ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Service role can manage event cursors" 
ON public.contract_event_cursors 
FOR ALL 
USING (current_setting('request.jwt.claim.role', true) = 'service_role')
WITH CHECK (current_setting('request.jwt.claim.role', true) = 'service_role');

-- Add AVAX to USD ratio to app_settings
INSERT INTO public.app_settings (key, value, description)
VALUES ('avax_to_usd_ratio', '1000000', 'AVAX wei to USD conversion ratio (1 AVAX = $1 for demo)')
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  description = EXCLUDED.description;

-- Add unique constraint to mortgage_payments_ledger to prevent duplicate tx_hash entries
CREATE UNIQUE INDEX IF NOT EXISTS idx_mortgage_payments_ledger_tx_hash 
ON public.mortgage_payments_ledger (tx_hash) 
WHERE tx_hash IS NOT NULL;

-- Create trigger to automatically call backfill function when user_transactions are inserted
CREATE OR REPLACE FUNCTION public.trg_after_user_tx_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process purchase transactions
  IF NEW.transaction_type IN ('purchase', 'property_purchase') AND NEW.status = 'completed' THEN
    PERFORM public.backfill_user_property_from_tx(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create the trigger
DROP TRIGGER IF EXISTS trg_user_transactions_backfill ON public.user_transactions;
CREATE TRIGGER trg_user_transactions_backfill
  AFTER INSERT ON public.user_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_after_user_tx_insert();
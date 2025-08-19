-- BACKUP STRATEGY: Complete Database Snapshot for Smart Contract Development Safety
-- This creates a comprehensive backup view of all critical tables
-- Run this before any smart contract modifications to ensure data safety

-- Create backup functions for complete data export
CREATE OR REPLACE FUNCTION public.create_platform_backup()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  backup_data jsonb := '{}';
  table_data jsonb;
BEGIN
  -- Backup user_properties (core mortgage data)
  SELECT jsonb_agg(row_to_json(up.*)) INTO table_data
  FROM public.user_properties up;
  backup_data := jsonb_set(backup_data, '{user_properties}', COALESCE(table_data, '[]'::jsonb));
  
  -- Backup property_fractionalization (property listings)
  SELECT jsonb_agg(row_to_json(pf.*)) INTO table_data
  FROM public.property_fractionalization pf;
  backup_data := jsonb_set(backup_data, '{property_fractionalization}', COALESCE(table_data, '[]'::jsonb));
  
  -- Backup user_transactions (payment history)
  SELECT jsonb_agg(row_to_json(ut.*)) INTO table_data
  FROM public.user_transactions ut;
  backup_data := jsonb_set(backup_data, '{user_transactions}', COALESCE(table_data, '[]'::jsonb));
  
  -- Backup fractional_investments (investor data)
  SELECT jsonb_agg(row_to_json(fi.*)) INTO table_data
  FROM public.fractional_investments fi;
  backup_data := jsonb_set(backup_data, '{fractional_investments}', COALESCE(table_data, '[]'::jsonb));
  
  -- Backup mortgage_payments_ledger (financial records)
  SELECT jsonb_agg(row_to_json(mpl.*)) INTO table_data
  FROM public.mortgage_payments_ledger mpl;
  backup_data := jsonb_set(backup_data, '{mortgage_payments_ledger}', COALESCE(table_data, '[]'::jsonb));
  
  -- Backup platform_fees (fee tracking)
  SELECT jsonb_agg(row_to_json(pf.*)) INTO table_data
  FROM public.platform_fees pf;
  backup_data := jsonb_set(backup_data, '{platform_fees}', COALESCE(table_data, '[]'::jsonb));
  
  -- Add backup metadata
  backup_data := jsonb_set(backup_data, '{backup_timestamp}', to_jsonb(now()));
  backup_data := jsonb_set(backup_data, '{backup_reason}', '"Smart contract development safety backup"');
  
  RETURN backup_data;
END;
$$;

-- Create a table to store backup snapshots
CREATE TABLE IF NOT EXISTS public.platform_backups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  backup_name text NOT NULL,
  backup_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  backup_type text DEFAULT 'full_platform',
  notes text
);

-- Enable RLS on backup table (admin only access)
ALTER TABLE public.platform_backups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service role can access backups"
ON public.platform_backups
FOR ALL
USING (current_setting('request.jwt.claim.role', true) = 'service_role');

-- Create initial backup snapshot
INSERT INTO public.platform_backups (backup_name, backup_data, notes)
SELECT 
  'pre_smart_contract_development_' || to_char(now(), 'YYYY_MM_DD_HH24_MI_SS'),
  public.create_platform_backup(),
  'Complete platform backup before smart contract development. All current functionality isolated to Supabase only.';

-- Create smart contract isolation flag
INSERT INTO public.app_settings (key, value, description)
VALUES (
  'smart_contract_mode',
  'isolated_development',
  'Smart contracts in development mode - platform runs on Supabase only'
) ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = now();
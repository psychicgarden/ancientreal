-- Complete the backup setup (skip existing policy)
-- Create initial backup snapshot and set isolation flag
INSERT INTO public.platform_backups (backup_name, backup_data, notes)
SELECT 
  'pre_smart_contract_development_' || to_char(now(), 'YYYY_MM_DD_HH24_MI_SS'),
  public.create_platform_backup(),
  'Complete platform backup before smart contract development. All current functionality isolated to Supabase only.'
WHERE NOT EXISTS (
  SELECT 1 FROM public.platform_backups 
  WHERE backup_name LIKE 'pre_smart_contract_development_%'
);

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
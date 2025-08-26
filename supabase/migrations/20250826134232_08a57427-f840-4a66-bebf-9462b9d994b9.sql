-- Create comprehensive platform backup before smart contract implementation
INSERT INTO public.platform_backups (
  backup_name,
  backup_data,
  backup_type,
  notes
) 
SELECT 
  'pre_smart_contract_implementation_' || to_char(now(), 'YYYY_MM_DD_HH24_MI_SS'),
  create_platform_backup(),
  'full_platform',
  'Complete backup before implementing smart contract property storage and fixing AVAX integration. Includes user_properties, property_fractionalization, user_transactions, fractional_investments, mortgage_payments_ledger, platform_fees, and all other critical tables. Created at: ' || now();

-- Verify the backup was created
SELECT 
  backup_name,
  backup_type,
  notes,
  created_at
FROM public.platform_backups 
WHERE backup_name LIKE 'pre_smart_contract_implementation_%'
ORDER BY created_at DESC 
LIMIT 1;
-- Create comprehensive platform backup before smart contract implementation
-- This will capture all current data for safe rollback if needed

DO $$
DECLARE
  backup_result jsonb;
  backup_id uuid;
BEGIN
  -- Create the backup using the existing function
  SELECT create_platform_backup() INTO backup_result;
  
  -- Store the backup in platform_backups table with metadata
  INSERT INTO public.platform_backups (
    backup_name,
    backup_data,
    backup_type,
    notes
  ) VALUES (
    'pre_smart_contract_implementation_' || to_char(now(), 'YYYY_MM_DD_HH24_MI_SS'),
    backup_result,
    'full_platform',
    'Complete backup before implementing smart contract property storage and fixing AVAX integration. Includes all 32+ tables with user properties, transactions, contracts, and fractionalization data.'
  ) RETURNING id INTO backup_id;
  
  -- Log the backup creation
  RAISE NOTICE 'Platform backup created successfully with ID: %', backup_id;
  RAISE NOTICE 'Backup contains % tables of data', jsonb_object_keys(backup_result);
  
END $$;
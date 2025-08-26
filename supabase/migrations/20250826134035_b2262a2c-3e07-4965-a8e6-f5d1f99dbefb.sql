-- Create comprehensive platform backup before smart contract implementation
-- This will capture all current data for safe rollback if needed

DO $$
DECLARE
  backup_result jsonb;
  backup_id uuid;
  table_count integer;
BEGIN
  -- Create the backup using the existing function
  SELECT create_platform_backup() INTO backup_result;
  
  -- Count the number of tables in the backup
  SELECT jsonb_object_length(backup_result) - 2 INTO table_count; -- Subtract 2 for metadata fields
  
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
    'Complete backup before implementing smart contract property storage and fixing AVAX integration. Includes all ' || table_count || ' tables with user properties, transactions, contracts, and fractionalization data. Created at: ' || now()
  ) RETURNING id INTO backup_id;
  
  -- Log the backup creation
  RAISE NOTICE 'Platform backup created successfully with ID: %', backup_id;
  RAISE NOTICE 'Backup contains % tables of data', table_count;
  
END $$;
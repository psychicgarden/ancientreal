import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `pre-smart-contract-deployment-${timestamp}`;
  const backupDir = path.join(__dirname, 'backups', backupName);
  
  console.log('🔄 Creating comprehensive backup...');
  console.log(`📁 Backup directory: ${backupDir}`);
  
  // Create backup directory
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  try {
    // 1. Backup user data
    console.log('📊 Backing up user data...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');
    
    if (usersError) throw usersError;
    fs.writeFileSync(path.join(backupDir, 'users.json'), JSON.stringify(users, null, 2));
    console.log(`✅ Users backed up: ${users?.length || 0} records`);
    
    // 2. Backup user properties
    console.log('�� Backing up user properties...');
    const { data: userProperties, error: propertiesError } = await supabase
      .from('user_properties')
      .select('*');
    
    if (propertiesError) throw propertiesError;
    fs.writeFileSync(path.join(backupDir, 'user_properties.json'), JSON.stringify(userProperties, null, 2));
    console.log(`✅ User properties backed up: ${userProperties?.length || 0} records`);
    
    // 3. Backup mortgage data
    console.log('🏦 Backing up mortgage data...');
    const { data: mortgages, error: mortgagesError } = await supabase
      .from('mortgages')
      .select('*');
    
    if (mortgagesError) throw mortgagesError;
    fs.writeFileSync(path.join(backupDir, 'mortgages.json'), JSON.stringify(mortgages, null, 2));
    console.log(`✅ Mortgages backed up: ${mortgages?.length || 0} records`);
    
    // 4. Backup payment history
    console.log('💰 Backing up payment history...');
    const { data: payments, error: paymentsError } = await supabase
      .from('payment_history')
      .select('*');
    
    if (paymentsError) throw paymentsError;
    fs.writeFileSync(path.join(backupDir, 'payment_history.json'), JSON.stringify(payments, null, 2));
    console.log(`✅ Payment history backed up: ${payments?.length || 0} records`);
    
    // 5. Backup staking data
    console.log('📈 Backing up staking data...');
    const { data: staking, error: stakingError } = await supabase
      .from('staking_transactions')
      .select('*');
    
    if (stakingError) throw stakingError;
    fs.writeFileSync(path.join(backupDir, 'staking_transactions.json'), JSON.stringify(staking, null, 2));
    console.log(`✅ Staking transactions backed up: ${staking?.length || 0} records`);
    
    // 6. Backup contract addresses
    console.log('🔗 Backing up contract addresses...');
    const { data: contracts, error: contractsError } = await supabase
      .from('contract_addresses')
      .select('*');
    
    if (contractsError) throw contractsError;
    fs.writeFileSync(path.join(backupDir, 'contract_addresses.json'), JSON.stringify(contracts, null, 2));
    console.log(`✅ Contract addresses backed up: ${contracts?.length || 0} records`);
    
    // 7. Backup app settings
    console.log('⚙️ Backing up app settings...');
    const { data: settings, error: settingsError } = await supabase
      .from('app_settings')
      .select('*');
    
    if (settingsError) throw settingsError;
    fs.writeFileSync(path.join(backupDir, 'app_settings.json'), JSON.stringify(settings, null, 2));
    console.log(`✅ App settings backed up: ${settings?.length || 0} records`);
    
    // 8. Backup platform fees
    console.log('💸 Backing up platform fees...');
    const { data: fees, error: feesError } = await supabase
      .from('platform_fees')
      .select('*');
    
    if (feesError) throw feesError;
    fs.writeFileSync(path.join(backupDir, 'platform_fees.json'), JSON.stringify(fees, null, 2));
    console.log(`✅ Platform fees backed up: ${fees?.length || 0} records`);
    
    // 9. Create backup metadata
    const backupMetadata = {
      backupName,
      timestamp,
      description: 'Pre-smart contract deployment backup',
      tables: [
        'users',
        'user_properties', 
        'mortgages',
        'payment_history',
        'staking_transactions',
        'contract_addresses',
        'app_settings',
        'platform_fees'
      ],
      recordCounts: {
        users: users?.length || 0,
        userProperties: userProperties?.length || 0,
        mortgages: mortgages?.length || 0,
        payments: payments?.length || 0,
        staking: staking?.length || 0,
        contracts: contracts?.length || 0,
        settings: settings?.length || 0,
        fees: fees?.length || 0
      },
      environment: {
        supabaseUrl,
        demoMode: process.env.VITE_DEMO_MODE,
        chainId: process.env.VITE_CHAIN_ID,
        networkName: process.env.VITE_CHAIN_NAME
      }
    };
    
    fs.writeFileSync(path.join(backupDir, 'backup-metadata.json'), JSON.stringify(backupMetadata, null, 2));
    
    // 10. Create restore script
    const restoreScript = `#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);

async function restoreBackup() {
  const backupDir = '${backupDir}';
  const metadataPath = path.join(backupDir, 'backup-metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.error('❌ Backup metadata not found');
    return;
  }
  
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  console.log('🔄 Restoring backup:', metadata.backupName);
  
  try {
    // Restore each table
    const tables = ['users', 'user_properties', 'mortgages', 'payment_history', 'staking_transactions', 'contract_addresses', 'app_settings', 'platform_fees'];
    
    for (const table of tables) {
      const dataPath = path.join(backupDir, \`\${table}.json\`);
      if (fs.existsSync(dataPath)) {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        console.log(\`📊 Restoring \${table}...\`);
        
        // Clear existing data
        await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
        
        // Insert backup data
        if (data.length > 0) {
          const { error } = await supabase.from(table).insert(data);
          if (error) {
            console.error(\`❌ Error restoring \${table}:\`, error);
          } else {
            console.log(\`✅ \${table} restored: \${data.length} records\`);
          }
        }
      }
    }
    
    console.log('✅ Backup restoration completed');
  } catch (error) {
    console.error('❌ Restore failed:', error);
  }
}

restoreBackup();
`;
    
    fs.writeFileSync(path.join(backupDir, 'restore-backup.mjs'), restoreScript);
    fs.chmodSync(path.join(backupDir, 'restore-backup.mjs'), '755');
    
    // 11. Create backup in Supabase platform_backups table
    console.log('💾 Creating backup record in database...');
    const { error: backupError } = await supabase
      .from('platform_backups')
      .insert({
        backup_name: backupName,
        backup_type: 'pre_smart_contract_deployment',
        backup_data: backupMetadata,
        notes: 'Comprehensive backup before smart contract deployment to Fuji testnet'
      });
    
    if (backupError) {
      console.warn('⚠️ Could not create backup record in database:', backupError.message);
    } else {
      console.log('✅ Backup record created in database');
    }
    
    // 12. Create summary
    const summary = {
      backupName,
      timestamp,
      location: backupDir,
      totalRecords: Object.values(backupMetadata.recordCounts).reduce((a, b) => a + b, 0),
      restoreCommand: `node ${path.join(backupDir, 'restore-backup.mjs')}`,
      nextSteps: [
        'Smart contracts can now be safely deployed',
        'If issues occur, run the restore script to revert',
        'Backup is stored locally and in Supabase platform_backups table'
      ]
    };
    
    fs.writeFileSync(path.join(backupDir, 'BACKUP_SUMMARY.md'), `# Backup Summary

## Backup Details
- **Name**: ${backupName}
- **Timestamp**: ${timestamp}
- **Location**: ${backupDir}
- **Total Records**: ${summary.totalRecords}

## Restore Instructions
To restore this backup, run:
\`\`\`bash
node ${path.join(backupDir, 'restore-backup.mjs')}
\`\`\`

## Tables Backed Up
${backupMetadata.tables.map(table => `- ${table}`).join('\n')}

## Record Counts
${Object.entries(backupMetadata.recordCounts).map(([key, count]) => `- ${key}: ${count}`).join('\n')}

## Environment
- Demo Mode: ${process.env.VITE_DEMO_MODE}
- Chain ID: ${process.env.VITE_CHAIN_ID}
- Network: ${process.env.VITE_CHAIN_NAME}
`);
    
    console.log('\n🎉 BACKUP COMPLETED SUCCESSFULLY!');
    console.log('📁 Backup location:', backupDir);
    console.log('📊 Total records backed up:', summary.totalRecords);
    console.log('🔄 Restore command:', summary.restoreCommand);
    console.log('\n✅ You can now safely proceed with smart contract deployment');
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  }
}

createBackup();

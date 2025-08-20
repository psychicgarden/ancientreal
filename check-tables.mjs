import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('🔍 Checking available tables in Supabase...');
  
  try {
    // Try to get table information
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (error) {
      console.log('❌ Could not query information_schema:', error.message);
      
      // Try common table names
      const commonTables = [
        'users', 'user_properties', 'mortgages', 'payment_history', 
        'staking_transactions', 'contract_addresses', 'app_settings', 
        'platform_fees', 'platform_backups', 'properties', 'investments'
      ];
      
      console.log('🔍 Trying to access common tables...');
      
      for (const table of commonTables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('count')
            .limit(1);
          
          if (error) {
            console.log(`❌ Table "${table}" does not exist: ${error.message}`);
          } else {
            console.log(`✅ Table "${table}" exists`);
          }
        } catch (e) {
          console.log(`❌ Table "${table}" error: ${e.message}`);
        }
      }
    } else {
      console.log('📊 Available tables:');
      data.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking tables:', error);
  }
}

checkTables();

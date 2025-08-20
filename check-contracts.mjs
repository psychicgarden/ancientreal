import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkContracts() {
  console.log('🔍 Checking contract addresses in database...');
  
  try {
    const { data, error } = await supabase
      .from('contract_addresses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching contracts:', error);
      return;
    }
    
    console.log('📋 CONTRACT ADDRESSES IN DATABASE:');
    console.log('=====================================');
    data.forEach(contract => {
      console.log(`${contract.contract_name}: ${contract.address} (${contract.status})`);
    });
    
    console.log('\n🔍 ANALYSIS:');
    console.log('============');
    
    // Check for the specific issues mentioned
    const usdtContract = data.find(c => c.contract_name === 'USDT');
    const testUsdtContract = data.find(c => c.contract_name === 'TestUSDT');
    const platformTreasury = data.find(c => c.contract_name === 'PlatformTreasury');
    const simpleMortgage = data.find(c => c.contract_name === 'SIMPLE_MORTGAGE');
    
    if (usdtContract) {
      console.log(`✅ USDT found: ${usdtContract.address} (${usdtContract.status})`);
    } else {
      console.log('❌ USDT not found in database');
    }
    
    if (testUsdtContract) {
      console.log(`⚠️  TestUSDT found: ${testUsdtContract.address} (${testUsdtContract.status})`);
    } else {
      console.log('ℹ️  TestUSDT not found in database');
    }
    
    if (platformTreasury) {
      console.log(`✅ PlatformTreasury found: ${platformTreasury.address} (${platformTreasury.status})`);
    } else {
      console.log('❌ PlatformTreasury not found in database');
    }
    
    if (simpleMortgage) {
      console.log(`⚠️  SIMPLE_MORTGAGE found: ${simpleMortgage.address} (${simpleMortgage.status})`);
      if (simpleMortgage.address === '0x0000000000000000000000000000000000000001') {
        console.log('❌ SIMPLE_MORTGAGE has invalid placeholder address');
      }
    } else {
      console.log('ℹ️  SIMPLE_MORTGAGE not found in database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkContracts();

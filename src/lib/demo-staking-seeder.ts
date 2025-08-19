import { supabase } from '@/integrations/supabase/client';
import { isDemoMode, DEMO_CONFIG } from '@/config/demo';

export async function seedDemoStakingData() {
  if (!isDemoMode()) return;

  const demoWallet = DEMO_CONFIG.testWalletAddress;

  try {
    // Check if demo staking data already exists
    const { data: existingStaking } = await supabase
      .from('user_staking')
      .select('*')
      .eq('user_wallet_address', demoWallet)
      .single();

    if (!existingStaking) {
      // Insert demo staking data
      await supabase
        .from('user_staking')
        .insert({
          user_wallet_address: demoWallet,
          total_staked: 5000.00,
          total_earned: 245.50,
          current_apy: 8.0,
          is_active: true
        });
    }

    // Check if demo transactions exist
    const { data: existingTransactions } = await supabase
      .from('staking_transactions')
      .select('*')
      .eq('user_wallet_address', demoWallet);

    if (!existingTransactions || existingTransactions.length === 0) {
      // Insert demo transactions
      await supabase
        .from('staking_transactions')
        .insert([
          {
            user_wallet_address: demoWallet,
            transaction_type: 'deposit',
            amount: 5000.00,
            status: 'completed',
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            user_wallet_address: demoWallet,
            transaction_type: 'yield',
            amount: 12.25,
            status: 'completed',
            created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            user_wallet_address: demoWallet,
            transaction_type: 'yield',
            amount: 11.98,
            status: 'completed',
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]);
    }

    console.log('Demo staking data seeded successfully');
  } catch (error) {
    console.log('Demo data seeding failed (this is normal in demo mode):', error);
  }
}
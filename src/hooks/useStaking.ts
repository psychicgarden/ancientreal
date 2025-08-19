import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { api } from '@/lib/api';
import { useErrorHandler } from '@/lib/error-handler';
import { isDemoMode, DEMO_CONFIG } from '@/config/demo';
import { seedDemoStakingData } from '@/lib/demo-staking-seeder';

interface StakingData {
  id: string;
  total_staked: number;
  total_earned: number;
  current_apy: number;
  last_yield_calculation: string;
  is_active: boolean;
}

interface StakingTransaction {
  id: string;
  transaction_type: string;
  amount: number;
  transaction_hash: string | null;
  status: string;
  created_at: string;
}

export const useStaking = () => {
  const { account } = useWallet();
  const { handleError } = useErrorHandler();
  const [stakingData, setStakingData] = useState<StakingData | null>(null);
  const [transactions, setTransactions] = useState<StakingTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStakingData = async () => {
    if (!account) {
      setLoading(false);
      return;
    }

    try {
      // In demo mode, provide fallback wallet address if needed
      const walletAddress = isDemoMode() ? DEMO_CONFIG.testWalletAddress : account;
      const result = await api.supabase.getUserStaking(walletAddress);
      
      if (result.success && result.data && result.data.length > 0) {
        setStakingData(result.data[0]); // getUserStaking returns an array, take first item
      } else {
        // In demo mode, create default data if none exists
        if (isDemoMode()) {
          setStakingData({
            id: 'demo-staking',
            total_staked: 5000,
            total_earned: 245.50,
            current_apy: 8.0,
            last_yield_calculation: new Date().toISOString(),
            is_active: true
          });
        } else {
          handleError(new Error(result.error || 'No staking data found'), {
            operation: 'load_staking_data',
            component: 'useStaking'
          });
        }
      }
    } catch (error) {
      // In demo mode, provide fallback data
      if (isDemoMode()) {
        setStakingData({
          id: 'demo-staking',
          total_staked: 5000,
          total_earned: 245.50,
          current_apy: 8.0,
          last_yield_calculation: new Date().toISOString(),
          is_active: true
        });
      } else {
        handleError(error, {
          operation: 'load_staking_data',
          component: 'useStaking'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    if (!account) return;

    try {
      // In demo mode, provide fallback wallet address if needed
      const walletAddress = isDemoMode() ? DEMO_CONFIG.testWalletAddress : account;
      const result = await api.supabase.getUserStakingTransactions(walletAddress);
      
      if (result.success && result.data) {
        setTransactions(result.data);
      } else if (isDemoMode()) {
        // Provide demo transactions
        setTransactions([
          {
            id: 'demo-tx-1',
            transaction_type: 'deposit',
            amount: 5000,
            transaction_hash: null,
            status: 'completed',
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'demo-tx-2',
            transaction_type: 'yield',
            amount: 12.25,
            transaction_hash: null,
            status: 'completed',
            created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]);
      }
    } catch (error) {
      if (isDemoMode()) {
        // Provide demo transactions as fallback
        setTransactions([
          {
            id: 'demo-tx-1',
            transaction_type: 'deposit',
            amount: 5000,
            transaction_hash: null,
            status: 'completed',
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]);
      } else {
        handleError(error, {
          operation: 'load_staking_transactions',
          component: 'useStaking'
        });
      }
    }
  };

  const createStakingTransaction = async (type: string, amount: number) => {
    if (!account) throw new Error('Wallet not connected');

    // In demo mode, use demo wallet address and simulate transaction
    const walletAddress = isDemoMode() ? DEMO_CONFIG.testWalletAddress : account;
    
    const result = await api.supabase.createStakingTransaction({
      user_wallet_address: walletAddress.toLowerCase(),
      transaction_type: type,
      amount,
      status: 'pending'
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to create transaction');
    }

    return result.data;
  };

  useEffect(() => {
    if (isDemoMode()) {
      seedDemoStakingData();
    }
    loadStakingData();
    loadTransactions();
  }, [account]);

  return {
    stakingData,
    transactions,
    loading,
    loadStakingData,
    loadTransactions,
    createStakingTransaction
  };
};
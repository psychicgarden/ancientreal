import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { api } from '@/lib/api';
import { useErrorHandler } from '@/lib/error-handler';

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
      const result = await api.supabase.getUserStaking(account);
      
      if (result.success) {
        setStakingData(result.data || null);
      } else {
        handleError(new Error(result.error), {
          operation: 'load_staking_data',
          component: 'useStaking'
        });
      }
    } catch (error) {
      handleError(error, {
        operation: 'load_staking_data',
        component: 'useStaking'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    if (!account) return;

    try {
      const result = await api.supabase.getUserTransactions(account);
      
      if (result.success && result.data) {
        // Filter for staking transactions
        const stakingTxs = result.data.filter((tx: any) => 
          ['deposit', 'withdrawal', 'yield'].includes(tx.transaction_type)
        );
        setTransactions(stakingTxs);
      }
    } catch (error) {
      handleError(error, {
        operation: 'load_staking_transactions',
        component: 'useStaking'
      });
    }
  };

  const createStakingTransaction = async (type: string, amount: number) => {
    if (!account) throw new Error('Wallet not connected');

    const result = await api.supabase.createStakingTransaction({
      user_wallet_address: account.toLowerCase(),
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
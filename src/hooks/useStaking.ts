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
    // In demo mode, always use demo wallet; otherwise require account
    const walletAddress = isDemoMode() ? DEMO_CONFIG.testWalletAddress : account;
    
    if (!walletAddress) {
      setLoading(false);
      return;
    }

    try {
      console.log('Loading staking data for wallet:', walletAddress);
      const result = await api.supabase.getUserStaking(walletAddress);
      
      if (result.success && result.data) {
        // Handle both array and object responses
        const stakingInfo = Array.isArray(result.data) ? result.data[0] : result.data;
        if (stakingInfo) {
          console.log('Staking data loaded successfully:', stakingInfo);
          setStakingData(stakingInfo);
          setLoading(false);
          return;
        }
      }
      
      console.log('No staking data found, result:', result);
      // Set to null if no data found
      setStakingData(null);
      
    } catch (error) {
      console.error('Error loading staking data:', error);
      // Set to null on error
      setStakingData(null);
      handleError(error, {
        operation: 'load_staking_data',
        component: 'useStaking'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    // In demo mode, always use demo wallet; otherwise require account
    const walletAddress = isDemoMode() ? DEMO_CONFIG.testWalletAddress : account;
    
    if (!walletAddress) return;

    try {
      console.log('Loading transactions for wallet:', walletAddress);
      const result = await api.supabase.getUserStakingTransactions(walletAddress);
      
      if (result.success && result.data) {
        console.log('Transactions loaded successfully:', result.data);
        setTransactions(result.data);
        return;
      }
      
      console.log('No transactions found, setting empty array');
      setTransactions([]);
      
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
      handleError(error, {
        operation: 'load_staking_transactions',
        component: 'useStaking'
      });
    }
  };

  const createStakingTransaction = async (type: string, amount: number) => {
    // In demo mode, always allow transactions even without wallet connection
    const walletAddress = isDemoMode() ? DEMO_CONFIG.testWalletAddress : account;
    
    if (!walletAddress) {
      throw new Error('Wallet not connected');
    }

    console.log('Creating staking transaction:', { type, amount, walletAddress });

    // Create the initial transaction
    const result = await api.supabase.createStakingTransaction({
      user_wallet_address: walletAddress.toLowerCase(),
      transaction_type: type,
      amount,
      status: 'pending'
    });

    if (!result.success) {
      console.error('Failed to create transaction:', result.error);
      throw new Error(result.error || 'Failed to create transaction');
    }

    const transaction = result.data;
    console.log('Transaction created:', transaction);

    // Immediately complete the transaction (simulating successful blockchain tx)
    const mockTxHash = `0x${Math.random().toString(16).substring(2)}${Date.now().toString(16)}`;
    
    console.log('Updating transaction status to completed...');
    const updateResult = await api.supabase.updateStakingTransaction(transaction.id, {
      status: 'completed',
      transaction_hash: mockTxHash
    });

    if (!updateResult.success) {
      console.error('Failed to update transaction status:', updateResult.error);
      // Don't throw here, continue with the flow but log the error
    } else {
      console.log('Transaction status updated successfully');
    }

    // Update user staking balance
    console.log('Updating user staking balance...');
    if (type === 'deposit') {
      await updateUserStakingBalance(walletAddress, amount);
    } else if (type === 'withdraw') {
      await updateUserStakingBalance(walletAddress, -amount);
    }

    // Reload data to reflect changes
    console.log('Reloading staking data and transactions...');
    await loadStakingData();
    await loadTransactions();

    return { ...transaction, status: 'completed', transaction_hash: mockTxHash };
  };

  const updateUserStakingBalance = async (walletAddress: string, amountDelta: number) => {
    try {
      // Get current staking data
      const currentResult = await api.supabase.getUserStaking(walletAddress);
      let currentStaking = null;

      if (currentResult.success && currentResult.data) {
        currentStaking = Array.isArray(currentResult.data) ? currentResult.data[0] : currentResult.data;
      }

      const newTotalStaked = (currentStaking?.total_staked || 0) + amountDelta;
      
      const stakingData = {
        user_wallet_address: walletAddress.toLowerCase(),
        total_staked: Math.max(0, newTotalStaked), // Don't allow negative balances
        total_earned: currentStaking?.total_earned || 0,
        current_apy: currentStaking?.current_apy || 8.0,
        is_active: true,
        last_yield_calculation: new Date().toISOString()
      };

      await api.supabase.upsertUserStaking(stakingData);
    } catch (error) {
      console.error('Failed to update staking balance:', error);
    }
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
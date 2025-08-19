import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { api } from '@/lib/api';
import { useErrorHandler } from '@/lib/error-handler';

interface DeveloperInvestment {
  id: string;
  project_id: string;
  investment_amount: number;
  ownership_percentage: number;
  platform_fee: number;
  net_investment: number;
  projected_value: number;
  projected_profit: number;
  investment_status: string;
  created_at: string;
  developer_projects?: {
    title: string;
    project_status: string;
    current_funding: number;
    target_funding: number;
    timeline: string;
    estimated_yield: number;
  };
}

export const useDeveloperInvestments = () => {
  const { account } = useWallet();
  const { handleError } = useErrorHandler();
  const [investments, setInvestments] = useState<DeveloperInvestment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvestments = async () => {
    if (!account) {
      setLoading(false);
      return;
    }

    try {
      const result = await api.supabase.getUserDeveloperInvestments(account);
      
      if (result.success) {
        setInvestments(result.data || []);
      } else {
        handleError(new Error(result.error), {
          operation: 'fetch_developer_investments',
          component: 'useDeveloperInvestments'
        });
      }
    } catch (error) {
      handleError(error, {
        operation: 'fetch_developer_investments',
        component: 'useDeveloperInvestments'
      });
    } finally {
      setLoading(false);
    }
  };

  const createInvestment = async (investmentData: any) => {
    const result = await api.supabase.createDeveloperInvestment(investmentData);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create investment');
    }

    await fetchInvestments(); // Refresh data
    return result.data;
  };

  useEffect(() => {
    fetchInvestments();
  }, [account]);

  return {
    investments,
    loading,
    fetchInvestments,
    createInvestment
  };
};
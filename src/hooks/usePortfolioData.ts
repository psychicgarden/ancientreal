import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { api } from '@/lib/api';
import { useErrorHandler } from '@/lib/error-handler';

interface PortfolioData {
  userProperties: any[];
  fractionalInvestments: any[];
  developerInvestments: any[];
}

export const usePortfolioData = () => {
  const { account, isConnected } = useWallet();
  const { handleError } = useErrorHandler();
  const [data, setData] = useState<PortfolioData>({
    userProperties: [],
    fractionalInvestments: [],
    developerInvestments: []
  });
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    if (!isConnected || !account) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch all portfolio data in parallel
      const [propertiesResult, fractionalResult, developerResult] = await Promise.all([
        api.supabase.getUserProperties(account),
        api.supabase.getFractionalInvestments(account),
        api.supabase.getUserDeveloperInvestments(account)
      ]);

      const newData: PortfolioData = {
        userProperties: propertiesResult.success ? propertiesResult.data : [],
        fractionalInvestments: fractionalResult.success ? fractionalResult.data : [],
        developerInvestments: developerResult.success ? developerResult.data : []
      };

      // Handle errors for any failed requests
      if (!propertiesResult.success) {
        handleError(new Error(propertiesResult.error), {
          operation: 'fetch_user_properties',
          component: 'usePortfolioData'
        });
      }

      if (!fractionalResult.success) {
        handleError(new Error(fractionalResult.error), {
          operation: 'fetch_fractional_investments',
          component: 'usePortfolioData'
        });
      }

      if (!developerResult.success) {
        handleError(new Error(developerResult.error), {
          operation: 'fetch_developer_investments',
          component: 'usePortfolioData'
        });
      }

      setData(newData);
    } catch (error) {
      handleError(error, {
        operation: 'fetch_portfolio_data',
        component: 'usePortfolioData'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [isConnected, account]);

  return {
    ...data,
    loading,
    refetch: fetchAllData
  };
};
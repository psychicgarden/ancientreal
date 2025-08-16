import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { supabase } from '@/integrations/supabase/client';

interface FractionalInvestment {
  id: string;
  property_id: string;
  investment_amount: number;
  token_amount: number;
  ownership_percentage: number;
  property_name: string;
  property_location: string;
  property_image_url: string;
  current_speculation_price: number;
  monthly_base_rent: number;
  investment_date: string;
  status: string;
}

export const useFractionalInvestments = () => {
  const { account } = useWallet();
  const [investments, setInvestments] = useState<FractionalInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvestments = async () => {
    if (!account) {
      setInvestments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('fractional_investments')
        .select(`
          id,
          property_id,
          investment_amount,
          token_amount,
          ownership_percentage,
          investment_date,
          status,
          property_fractionalization!inner(
            property_name,
            property_location,
            property_image_url,
            current_speculation_price,
            monthly_base_rent
          )
        `)
        .eq('investor_wallet_address', account.toLowerCase())
        .eq('status', 'active');

      if (fetchError) throw fetchError;

      // Transform the data to flatten the nested property information
      const transformedInvestments = (data || []).map(investment => ({
        id: investment.id,
        property_id: investment.property_id,
        investment_amount: investment.investment_amount,
        token_amount: investment.token_amount,
        ownership_percentage: investment.ownership_percentage,
        investment_date: investment.investment_date,
        status: investment.status,
        property_name: investment.property_fractionalization.property_name,
        property_location: investment.property_fractionalization.property_location,
        property_image_url: investment.property_fractionalization.property_image_url,
        current_speculation_price: investment.property_fractionalization.current_speculation_price,
        monthly_base_rent: investment.property_fractionalization.monthly_base_rent,
      }));

      setInvestments(transformedInvestments);
    } catch (err) {
      console.error('Error fetching fractional investments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch investments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, [account]);

  // Calculate derived values
  const totalInvestment = investments.reduce((sum, inv) => sum + inv.investment_amount, 0);
  const totalValue = investments.reduce((sum, inv) => {
    const currentValue = (inv.current_speculation_price * inv.ownership_percentage) / 100;
    return sum + currentValue;
  }, 0);
  const monthlyIncome = investments.reduce((sum, inv) => {
    const monthlyShare = (inv.monthly_base_rent * inv.ownership_percentage) / 100;
    return sum + monthlyShare;
  }, 0);

  return {
    investments,
    loading,
    error,
    totalInvestment,
    totalValue,
    monthlyIncome,
    refetch: fetchInvestments
  };
};
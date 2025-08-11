// Real-time yield tracking hook
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { YieldCalculator, YieldCalculation, PricingData } from '@/lib/yieldCalculator';

export const useRealTimeYield = (propertyId?: string, investmentAmount?: number) => {
  const [yieldData, setYieldData] = useState<YieldCalculation | null>(null);
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) return;

    const fetchYieldData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get property data
        const { data: property, error: propError } = await supabase
          .from('property_fractionalization')
          .select('*')
          .eq('id', propertyId)
          .single();

        if (propError) throw propError;

        // Calculate yield if investment amount provided
        if (investmentAmount && property) {
          const yieldResult = YieldCalculator.calculateYield(investmentAmount, property);
          setYieldData(yieldResult);
        }

        // Get real-time pricing
        const pricing = await YieldCalculator.getRealTimePricing(propertyId);
        setPricingData(pricing);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch yield data');
      } finally {
        setLoading(false);
      }
    };

    fetchYieldData();

    // Set up real-time updates
    const channel = supabase
      .channel(`yield-${propertyId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'secondary_trades',
          filter: `property_fractionalization_id=eq.${propertyId}`
        },
        () => {
          fetchYieldData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rental_income_distributions',
          filter: `property_fractionalization_id=eq.${propertyId}`
        },
        () => {
          fetchYieldData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [propertyId, investmentAmount]);

  return { yieldData, pricingData, loading, error };
};

export const usePortfolioYield = (walletAddress?: string) => {
  const [portfolioYield, setPortfolioYield] = useState<{
    totalValue: number;
    totalYield: number;
    monthlyIncome: number;
    investments: any[];
  }>({
    totalValue: 0,
    totalYield: 0,
    monthlyIncome: 0,
    investments: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchPortfolioYield = async () => {
      setLoading(true);
      
      try {
        const { data: investments, error } = await supabase
          .from('fractional_investments')
          .select(`
            *,
            property_fractionalization:property_id (*)
          `)
          .eq('investor_wallet_address', walletAddress.toLowerCase())
          .eq('status', 'active');

        if (error) throw error;

        let totalValue = 0;
        let totalYield = 0;
        let monthlyIncome = 0;
        const enrichedInvestments = [];

        for (const investment of investments || []) {
          const property = investment.property_fractionalization;
          if (!property) continue;

          const yieldCalc = YieldCalculator.calculateYield(
            Number(investment.investment_amount),
            property
          );

          totalValue += Number(investment.investment_amount);
          totalYield += yieldCalc.annualYield;
          monthlyIncome += yieldCalc.monthlyIncome;

          enrichedInvestments.push({
            ...investment,
            yieldData: yieldCalc
          });
        }

        setPortfolioYield({
          totalValue,
          totalYield: investments.length > 0 ? totalYield / investments.length : 0,
          monthlyIncome,
          investments: enrichedInvestments
        });

      } catch (err) {
        console.error('Error fetching portfolio yield:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioYield();

    // Real-time updates for portfolio
    const channel = supabase
      .channel(`portfolio-${walletAddress}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fractional_investments',
          filter: `investor_wallet_address=eq.${walletAddress.toLowerCase()}`
        },
        () => {
          fetchPortfolioYield();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [walletAddress]);

  return { portfolioYield, loading };
};
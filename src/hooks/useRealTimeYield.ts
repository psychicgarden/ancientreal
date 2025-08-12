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
    if (!walletAddress) {
      setPortfolioYield({ totalValue: 0, totalYield: 0, monthlyIncome: 0, investments: [] });
      return;
    }

    const fetchPortfolioYield = async () => {
      setLoading(true);
      
      try {
        const wallet = walletAddress.toLowerCase();
        const { data, error } = await supabase.rpc('get_user_fractional_investments', { wallet_address: wallet });
        if (error) {
          console.error('RPC get_user_fractional_investments failed', error);
          setPortfolioYield({ totalValue: 0, totalYield: 0, monthlyIncome: 0, investments: [] });
          return;
        }

        const rows = Array.isArray(data) ? data : [];
        let totalValue = 0;
        let totalYield = 0;
        let monthlyIncome = 0;
        const enrichedInvestments: any[] = [];

        for (const row of rows) {
          const investmentAmount = Number(row.investment_amount ?? 0);
          const propertyData = {
            property_name: row.property_name,
            property_location: row.property_location,
            property_image_url: row.property_image_url,
            current_speculation_price: Number(row.current_speculation_price ?? 0),
            monthly_base_rent: Number(row.monthly_base_rent ?? 0),
            total_tokens_available: Number(row.total_tokens_available ?? 0),
          } as any;

          const yieldCalc = YieldCalculator.calculateYield(investmentAmount, propertyData);

          totalValue += investmentAmount;
          totalYield += yieldCalc.annualYield;
          monthlyIncome += yieldCalc.monthlyIncome;

          enrichedInvestments.push({
            ...row,
            yieldData: yieldCalc,
          });
        }

        setPortfolioYield({
          totalValue,
          totalYield: rows.length > 0 ? totalYield / rows.length : 0,
          monthlyIncome,
          investments: enrichedInvestments,
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
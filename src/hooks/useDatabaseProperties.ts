import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { computeMonthlyPaymentUSD } from '@/lib/finance';

export interface DatabasePropertyData {
  id: string;
  property_name: string;
  property_location: string;
  current_speculation_price: number;
  monthly_base_rent: number;
  mortgage_apr_bps: number;
  mortgage_term_months: number;
  projected_appreciation_percent: number;
}

export interface CalculatedPropertyData extends DatabasePropertyData {
  downPayment: number;
  monthlyPayment: number;
  monthlyProfit: number;
  cashFlowYield: number;
  networkValue: number;
  expectedReturn: number;
}

export const useDatabaseProperties = () => {
  const [properties, setProperties] = useState<CalculatedPropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculatePropertyMetrics = (prop: DatabasePropertyData): CalculatedPropertyData => {
    const downPayment = prop.current_speculation_price * 0.2; // 20% down payment
    const loanAmount = prop.current_speculation_price - downPayment;
    
    // Use standardized mortgage calculation
    const monthlyPayment = computeMonthlyPaymentUSD(
      loanAmount, 
      prop.mortgage_apr_bps, 
      prop.mortgage_term_months
    );
    
    const monthlyProfit = prop.monthly_base_rent - monthlyPayment;
    const cashFlowYield = downPayment > 0 ? (monthlyProfit * 12 / downPayment) * 100 : 0;
    
    // Calculate network value with appreciation
    const appreciationMultiplier = 1 + (prop.projected_appreciation_percent / 100);
    const networkValue = prop.current_speculation_price * appreciationMultiplier;
    
    const expectedReturn = prop.current_speculation_price > 0 
      ? ((prop.monthly_base_rent * 12) / prop.current_speculation_price) * 100 
      : 0;

    return {
      ...prop,
      downPayment,
      monthlyPayment,
      monthlyProfit,
      cashFlowYield,
      networkValue,
      expectedReturn
    };
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('property_fractionalization')
        .select(`
          id,
          property_name,
          property_location,
          current_speculation_price,
          monthly_base_rent,
          mortgage_apr_bps,
          mortgage_term_months,
          projected_appreciation_percent
        `)
        .eq('is_active', true)
        .not('property_name', 'is', null)
        .not('property_location', 'is', null)
        .order('listing_date', { ascending: false });

      if (error) throw error;

      const calculatedProperties = (data || []).map(calculatePropertyMetrics);
      setProperties(calculatedProperties);
    } catch (err) {
      console.error('Error fetching database properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties
  };
};
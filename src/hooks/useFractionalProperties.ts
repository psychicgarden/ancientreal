import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FractionalProperty {
  id: string;
  property_name: string;
  property_location: string;
  property_description: string;
  property_image_url: string;
  original_purchase_price: number;
  current_speculation_price: number;
  monthly_base_rent: number;
  total_tokens_available: number;
  tokens_sold: number;
  min_investment: number;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
}

export interface PropertyInvestmentData {
  id: string;
  name: string;
  location: string;
  image: string;
  totalValue: number;
  downPayment: number;
  monthlyPayment: number;
  expectedReturn: number;
  availableShares: number;
  totalShares: number;
  sharePrice: number;
  isBlockchain?: boolean;
  isVillage?: boolean;
}

export const useFractionalProperties = () => {
  const [properties, setProperties] = useState<PropertyInvestmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformProperty = (prop: FractionalProperty): PropertyInvestmentData => {
    const availableTokens = prop.total_tokens_available - prop.tokens_sold;
    const tokenPrice = prop.current_speculation_price / prop.total_tokens_available;
    const downPayment = prop.current_speculation_price * 0.2; // 20% down payment
    const loanAmount = prop.current_speculation_price - downPayment;
    const monthlyPayment = loanAmount * 0.006; // Rough 7.2% APR calculation
    const expectedReturn = ((prop.monthly_base_rent * 12) / prop.current_speculation_price) * 100;

    return {
      id: prop.id,
      name: prop.property_name,
      location: prop.property_location,
      image: prop.property_image_url,
      totalValue: prop.current_speculation_price,
      downPayment,
      monthlyPayment,
      expectedReturn,
      availableShares: availableTokens,
      totalShares: prop.total_tokens_available,
      sharePrice: tokenPrice,
      isBlockchain: true,
      isVillage: prop.property_location.includes('Mexico') || prop.property_location.includes('Brazil')
    };
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('property_fractionalization')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedProperties = data?.map(transformProperty) || [];
      setProperties(transformedProperties);
    } catch (err) {
      console.error('Error fetching fractional properties:', err);
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
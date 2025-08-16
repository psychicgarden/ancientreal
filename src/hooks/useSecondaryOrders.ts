import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SecondaryOrder {
  id: string;
  owner_wallet_address: string;
  property_fractionalization_id: string;
  order_type: string;
  token_amount: number;
  price_per_token: number;
  tokens_filled: number;
  status: string;
  created_at: string;
  expiry?: string;
  // Property details from join
  property_name?: string;
  property_location?: string;
  property_image_url?: string;
  original_purchase_price?: number;
  monthly_base_rent?: number;
  total_tokens_available?: number;
}

export const useSecondaryOrders = () => {
  const [orders, setOrders] = useState<SecondaryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSecondaryOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('secondary_orders')
        .select(`
          *,
          property_fractionalization!inner(
            property_name,
            property_location,
            property_image_url,
            original_purchase_price,
            monthly_base_rent,
            total_tokens_available
          )
        `)
        .eq('status', 'open')
        .eq('order_type', 'sell')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching secondary orders:', fetchError);
        setError(fetchError.message);
        return;
      }

      // Transform the data to flatten the property details
      const transformedOrders: SecondaryOrder[] = (data || []).map(order => {
        const propertyData = order.property_fractionalization as any;
        return {
          ...order,
          property_name: propertyData?.property_name,
          property_location: propertyData?.property_location,
          property_image_url: propertyData?.property_image_url,
          original_purchase_price: propertyData?.original_purchase_price,
          monthly_base_rent: propertyData?.monthly_base_rent,
          total_tokens_available: propertyData?.total_tokens_available,
        };
      });

      setOrders(transformedOrders);
    } catch (err) {
      console.error('Error in fetchSecondaryOrders:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecondaryOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    refetch: fetchSecondaryOrders
  };
};
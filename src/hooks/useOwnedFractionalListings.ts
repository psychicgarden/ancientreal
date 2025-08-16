import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { supabase } from '@/integrations/supabase/client';

interface OwnedListing {
  id: string;
  property_name: string;
  property_location: string;
  property_image_url: string;
  current_speculation_price: number;
  original_property_value: number;
  monthly_base_rent: number;
  total_tokens_available: number;
  tokens_sold: number;
  created_at: string;
  listing_date: string;
  is_listed_fractionally: boolean;
  source_property_id: string;
}

export const useOwnedFractionalListings = () => {
  const { account } = useWallet();
  const [listings, setListings] = useState<OwnedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOwnedListings = async () => {
    if (!account) {
      setListings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('property_fractionalization')
        .select(`
          id,
          property_name,
          property_location,
          property_image_url,
          current_speculation_price,
          original_property_value,
          monthly_base_rent,
          total_tokens_available,
          tokens_sold,
          created_at,
          listing_date,
          is_listed_fractionally,
          source_property_id
        `)
        .eq('owner_wallet_address', account.toLowerCase())
        .eq('is_active', true)
        .order('listing_date', { ascending: false });

      if (error) throw error;

      setListings(data || []);
    } catch (err) {
      console.error('Error fetching owned listings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnedListings();
  }, [account]);

  return {
    listings,
    loading,
    error,
    refetch: fetchOwnedListings
  };
};
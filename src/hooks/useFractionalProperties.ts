import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { computeMetrics } from '@/lib/investmentMath';
import bohoArtDecoLoft from '@/assets/boho-art-deco-loft-mexico.jpg';
import luxuryBohoBungalow from '@/assets/luxury-boho-beach-bungalow-bahia.jpg';
import artDecoCoastalEriceira from '@/assets/art-deco-coastal-ericeira.jpg';

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
  projected_appreciation_percent?: number;
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
  monthlyRent: number; // Add missing field for calculator
  networkValue: number; // Add missing field for calculator
  projected_appreciation_percent?: number;
  expectedReturn: number;
  availableShares: number;
  totalShares: number;
  sharePrice: number;
  wholePropertiesSold: number; // Count of whole properties sold
  isBlockchain?: boolean;
  isVillage?: boolean;
}

const imageOverrides: Record<string, string> = {
  'Art Deco Loft': bohoArtDecoLoft,
  'Bahia Ocean Villa': luxuryBohoBungalow,
  'Oceanview Loft': artDecoCoastalEriceira,
};

// Property-specific mortgage payments to preserve baseline values
function getPropertyMortgage(propertyName: string): number {
  switch (propertyName) {
    case 'Bahia Ocean Villa':
      return 1262;
    case 'Oceanview Loft':
      return 1519;
    case 'Art Deco Loft':
      return 1418;
    default:
      return undefined; // Will use calculated PMT
  }
}

export const useFractionalProperties = () => {
  const [properties, setProperties] = useState<PropertyInvestmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformProperty = (prop: FractionalProperty & { whole_properties_sold?: number }): PropertyInvestmentData => {
    const availableTokens = prop.total_tokens_available - prop.tokens_sold;
    const tokenPrice = prop.current_speculation_price / prop.total_tokens_available;
    
    // Get correct citizenship cost based on property name
    const getCitizenshipCost = (propertyName: string): number => {
      switch (propertyName) {
        case 'Bahia Ocean Villa':
          return 26000;
        case 'Oceanview Loft':
          return 30000;
        case 'Art Deco Loft':
          return 25800;
        default:
          return prop.min_investment; // fallback
      }
    };

    // Use simplified math utility with correct values
    const metrics = computeMetrics({
      price: prop.current_speculation_price,
      downPayment: getCitizenshipCost(prop.property_name),
      grossRent: prop.monthly_base_rent,
      mortgage: getPropertyMortgage(prop.property_name),
      utilities: 65,
      taxPct: 0.0015,
    });
    
    const expectedReturn = ((prop.monthly_base_rent * 12) / prop.current_speculation_price) * 100;

    // Handle null values with fallbacks
    const propertyName = prop.property_name || `Property ${prop.id.slice(0, 8)}`;
    const propertyLocation = prop.property_location || 'Location TBD';
    const propertyImage = imageOverrides[propertyName] ?? prop.property_image_url ?? '/placeholder.svg';

    return {
      id: prop.id,
      name: propertyName,
      location: propertyLocation,
      image: propertyImage,
      totalValue: prop.current_speculation_price,
      downPayment: getCitizenshipCost(prop.property_name), // Use correct citizenship cost
      monthlyPayment: metrics.mortgage,
      monthlyRent: prop.monthly_base_rent || (prop.current_speculation_price * 0.015), // Use actual rent or estimate
      projected_appreciation_percent: prop.projected_appreciation_percent || 181,
      networkValue: metrics.monthlyNetworkValue, // Use computed value
      expectedReturn,
      availableShares: availableTokens,
      totalShares: prop.total_tokens_available,
      sharePrice: tokenPrice,
      wholePropertiesSold: prop.whole_properties_sold || 0, // Add whole property sales count
      isBlockchain: true,
      isVillage: propertyLocation.includes('Mexico') || propertyLocation.includes('Brazil') || propertyLocation.includes('Portugal')
    };
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      // Fetch properties with whole property sales count
      const { data, error } = await supabase
        .from('property_fractionalization')
        .select(`
          *,
          whole_properties_sold:user_properties(count)
        `)
        .eq('is_active', true)
        .eq('is_listed_fractionally', true)
        .eq('owner_approved_listing', true) // Only show owner-approved listings
        .not('property_name', 'is', null)
        .not('property_location', 'is', null)
        .not('owner_wallet_address', 'eq', '0x1234567890123456789012345678901234567890') // Exclude test data
        .order('listing_date', { ascending: false });

      if (error) throw error;

      // Filter out any remaining invalid entries and transform with whole property count
      const validProperties = data?.filter(prop => 
        prop.property_name && 
        prop.property_location && 
        prop.owner_wallet_address &&
        prop.owner_wallet_address !== '0x1234567890123456789012345678901234567890'
      ) || [];

      // Count whole properties sold for each fractionalized property
      const propertiesWithCounts = await Promise.all(
        validProperties.map(async (prop) => {
          const { count } = await supabase
            .from('user_properties')
            .select('*', { count: 'exact', head: true })
            .eq('property_name', prop.property_name)
            .eq('property_location', prop.property_location)
            .eq('is_active', true);
          
          return {
            ...prop,
            whole_properties_sold: count || 0
          };
        })
      );

      const transformedProperties = propertiesWithCounts.map(transformProperty);
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
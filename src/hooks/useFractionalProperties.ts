import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculatePropertyAppreciation } from '@/lib/finance';

// Import available property assets
import beachHouseMykonos from '@/assets/beach-house-mykonos.jpg';
import greekApartment from '@/assets/greek-mediterranean-boho-apartment.jpg';
// Use available images as placeholders for missing assets
const bohoArtDecoLoft = beachHouseMykonos;
const luxuryBohoBungalow = beachHouseMykonos;
const artDecoCoastalEriceira = greekApartment;
const villaTulum = beachHouseMykonos;
const villaEriceira = greekApartment;
const villaBahia = beachHouseMykonos;
const villaBali = beachHouseMykonos;
const villaGreece = greekApartment;
const villaMexico = beachHouseMykonos;
const beachChalet = beachHouseMykonos;
const beachHouseMaldives = beachHouseMykonos;
const apartmentNyc = beachHouseMykonos;
const apartmentGreece = greekApartment;
const penthouseMexico = beachHouseMykonos;
const loftBahia = beachHouseMykonos;
const desertOasisMorocco = beachHouseMykonos;
const desertOasisBahia = beachHouseMykonos;
const jungleLodgeCostarica = beachHouseMykonos;
const baliJungleResort = beachHouseMykonos;
const ericeiraCoastalApartment = greekApartment;
const artisticBohoCoastalEriceira = greekApartment;
const artDecoLoftMexico = beachHouseMykonos;
const bahiaBeachBungalow = beachHouseMykonos;
const villaCorfu = greekApartment;

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

// Comprehensive image mapping for property names and asset paths
const imageOverrides: Record<string, string> = {
  // Property name overrides - exact matches for database entries
  'Art Deco Loft': bohoArtDecoLoft,
  'Bahia Ocean Villa': luxuryBohoBungalow,
  'Oceanview Loft': artDecoCoastalEriceira,
  'Villa Tulum': villaTulum,
  'Villa Ericeira': villaEriceira,
  'Villa Bahia': villaBahia,
  'Villa Bali': villaBali,
  'Villa Greece': villaGreece,
  'Villa Mexico': villaMexico,
  'Beach Chalet': beachChalet,
  'Beach House Maldives': beachHouseMaldives,
  'Beach House Mykonos': beachHouseMykonos,
  'Apartment NYC': apartmentNyc,
  'Apartment Greece': apartmentGreece,
  'Penthouse Mexico': penthouseMexico,
  'Loft Bahia': loftBahia,
  'Desert Oasis Morocco': desertOasisMorocco,
  'Desert Oasis Bahia': desertOasisBahia,
  'Jungle Lodge Costa Rica': jungleLodgeCostarica,
  'Bali Jungle Resort': baliJungleResort,
  'Ericeira Coastal Apartment': ericeiraCoastalApartment,
  'Artistic Boho Coastal Ericeira': artisticBohoCoastalEriceira,
  'Art Deco Loft Mexico': artDecoLoftMexico,
  'Bahia Beach Bungalow': bahiaBeachBungalow,
  'Villa Corfu': villaCorfu,
};

// Asset path mapping for development asset URLs
const assetPathMapping: Record<string, string> = {
  'villa-tulum.jpg': villaTulum,
  'villa-ericeira-portugal.jpg': villaEriceira,
  'villa-bahia.jpg': villaBahia,
  'villa-bali.jpg': villaBali,
  'villa-greece.jpg': villaGreece,
  'villa-mexico.jpg': villaMexico,
  'beach-chalet.jpg': beachChalet,
  'beach-house-maldives.jpg': beachHouseMaldives,
  'beach-house-mykonos.jpg': beachHouseMykonos,
  'apartment-nyc.jpg': apartmentNyc,
  'apartment-greece.jpg': apartmentGreece,
  'penthouse-mexico.jpg': penthouseMexico,
  'loft-bahia.jpg': loftBahia,
  'desert-oasis-morocco.jpg': desertOasisMorocco,
  'desert-oasis-bahia.jpg': desertOasisBahia,
  'jungle-lodge-costarica.jpg': jungleLodgeCostarica,
  'bali-jungle-resort.jpg': baliJungleResort,
  'ericeira-coastal-apartment.jpg': ericeiraCoastalApartment,
  'artistic-boho-coastal-ericeira.jpg': artisticBohoCoastalEriceira,
  'art-deco-loft-mexico.jpg': artDecoLoftMexico,
  'boho-art-deco-loft-mexico.jpg': bohoArtDecoLoft,
  'luxury-boho-beach-bungalow-bahia.jpg': luxuryBohoBungalow,
  'art-deco-coastal-ericeira.jpg': artDecoCoastalEriceira,
  'bahia-beach-bungalow.jpg': bahiaBeachBungalow,
  'villa-corfu-greece.jpg': villaCorfu,
};

// Function to resolve image path
const resolveImagePath = (propertyName: string, imageUrl: string): string => {
  // First try property name override
  if (imageOverrides[propertyName]) {
    return imageOverrides[propertyName];
  }
  
  // If imageUrl starts with /src/assets/, extract filename and map it
  if (imageUrl?.startsWith('/src/assets/')) {
    const filename = imageUrl.split('/').pop();
    if (filename && assetPathMapping[filename]) {
      return assetPathMapping[filename];
    }
  }
  
  // Return original URL or placeholder as fallback
  return imageUrl || '/placeholder.svg';
};

export const useFractionalProperties = () => {
  const [properties, setProperties] = useState<PropertyInvestmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformProperty = (prop: FractionalProperty & { whole_properties_sold?: number }): PropertyInvestmentData => {
    const availableTokens = prop.total_tokens_available - prop.tokens_sold;
    const tokenPrice = prop.current_speculation_price / prop.total_tokens_available;
    
    // Platform fee is separate upfront cost (3% of property value)
    const platformFee = prop.current_speculation_price * 0.03;
    // Down payment is 20% of property value (separate from platform fee)
    const downPayment = prop.current_speculation_price * 0.2;
    // Loan amount is 80% of property value (not affected by platform fee)
    const loanAmount = prop.current_speculation_price * 0.8;
    
    // Use standardized mortgage calculation with 8% APR, 10-year term
    const aprBps = 800; // 8% APR in basis points
    const termMonths = 120; // 10 years
    const monthlyRate = (aprBps / 10000) / 12; // Convert bps to monthly rate
    
    const monthlyPayment = loanAmount > 0 && monthlyRate > 0
      ? loanAmount * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -termMonths)))
      : 0;
    
    // Calculate cash flow yield based on total upfront cost (down payment + platform fee)
    const totalUpfrontCost = downPayment + platformFee;
    const monthlyCashFlow = prop.monthly_base_rent - monthlyPayment;
    const expectedReturn = totalUpfrontCost > 0 ? ((monthlyCashFlow * 12) / totalUpfrontCost) * 100 : 0;

    // Handle null values with fallbacks
    const propertyName = prop.property_name || `Property ${prop.id.slice(0, 8)}`;
    const propertyLocation = prop.property_location || 'Location TBD';
    const propertyImage = resolveImagePath(propertyName, prop.property_image_url);

    return {
      id: prop.id,
      name: propertyName,
      location: propertyLocation,
      image: propertyImage,
      totalValue: prop.current_speculation_price,
      downPayment: totalUpfrontCost, // Include platform fee in total upfront cost
      monthlyPayment: Math.round(monthlyPayment),
      monthlyRent: prop.monthly_base_rent, // Use actual rent from database
      projected_appreciation_percent: prop.projected_appreciation_percent || 181,
      networkValue: (() => {
        const appreciation = calculatePropertyAppreciation(prop.current_speculation_price, prop.projected_appreciation_percent || 181, 0.5);
        return Math.round(appreciation.buyerTotalEquity);
      })(),
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
      // Fetch properties with mortgage terms and whole property sales count
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
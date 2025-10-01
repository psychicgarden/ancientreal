import artDecoLoftMexico from '@/assets/boho-art-deco-loft-mexico.jpg';

interface PropertyWithImage {
  image_url?: string;
  property_name?: string;
}

/**
 * Maps broken database image URLs to correct asset imports
 * Handles Art Deco Loft property variations and provides fallback
 */
export const getPropertyImage = (property: PropertyWithImage): string => {
  const imageUrl = property.image_url?.toLowerCase() || '';
  const propertyName = property.property_name?.toLowerCase() || '';
  
  // Map broken database URLs to correct assets - catch all Art Deco Loft variations
  if (imageUrl.includes('art-deco-loft') || 
      imageUrl.includes('boho-art-deco') ||
      propertyName.includes('art deco')) {
    return artDecoLoftMexico;
  }
  
  return property.image_url || artDecoLoftMexico; // Fallback
};
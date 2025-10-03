import artDecoLoftMexico from '@/assets/boho-art-deco-loft-mexico.jpg';
import antalyaVilla from '@/assets/antalya-turkey-villa.jpg';
import mallorcanOceanview from '@/assets/mallorca-oceanview-villa.jpg';
import bahiaTropicalHaven from '@/assets/bahia-tropical-haven.jpg';
import ericeiraCoastal from '@/assets/ericeira-coastal-apartment.jpg';

interface PropertyWithImage {
  image_url?: string;
  property_name?: string;
}

/**
 * Maps broken database image URLs to correct asset imports
 * Handles property variations and provides robust fallback matching
 */
export const getPropertyImage = (property: PropertyWithImage): string => {
  const imageUrl = property.image_url?.toLowerCase() || '';
  const propertyName = property.property_name?.toLowerCase() || '';
  
  // Extract basename from image_url for matching
  const urlBasename = imageUrl.split('/').pop()?.split('.')[0] || '';
  
  // Map broken database URLs to correct assets - catch all variations
  if (imageUrl.includes('art-deco-loft') || 
      imageUrl.includes('boho-art-deco') ||
      propertyName.includes('art deco')) {
    return artDecoLoftMexico;
  }
  
  if (imageUrl.includes('antalya') || 
      imageUrl.includes('turkey-villa') ||
      urlBasename.includes('antalya') ||
      propertyName.includes('antalya')) {
    return antalyaVilla;
  }
  
  if (imageUrl.includes('mallorca-oceanview') || 
      imageUrl.includes('oceanview') ||
      urlBasename.includes('mallorca') ||
      propertyName.includes('mallorca')) {
    return mallorcanOceanview;
  }
  
  if (imageUrl.includes('bahia-tropical') || 
      urlBasename.includes('bahia') ||
      propertyName.includes('bahia')) {
    return bahiaTropicalHaven;
  }
  
  if (imageUrl.includes('ericeira') || 
      urlBasename.includes('ericeira') ||
      propertyName.includes('ericeira')) {
    return ericeiraCoastal;
  }
  
  return property.image_url || artDecoLoftMexico; // Fallback
};
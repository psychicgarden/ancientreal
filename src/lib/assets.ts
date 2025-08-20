// Centralized asset configuration for reliable image loading
import { PLATFORM } from '@/config/chain';

// Core application images (imported for bundling)
import heroImage from '@/assets/hero-image.jpg';
import villaTulum from '@/assets/villa-tulum.jpg';
import beachChalet from '@/assets/beach-chalet.jpg';
import villaEriceira from '@/assets/villa-ericeira-portugal.jpg';
import baliJungleResort from '@/assets/bali-jungle-resort.jpg';
import desertOasisMorocco from '@/assets/desert-oasis-morocco.jpg';
import beachHouseMykonos from '@/assets/beach-house-mykonos.jpg';
// New boho luxury property images
import mazunteBohoVilla from '@/assets/mazunte-boho-villa.jpg';
import mallorcaOceanviewVilla from '@/assets/mallorca-oceanview-villa.jpg';
import bahiaTropicalHaven from '@/assets/bahia-tropical-haven.jpg';

// Asset management utilities
export const ASSETS = {
  // Hero section
  HERO_IMAGE: heroImage,
  
  // Featured properties
  VILLA_TULUM: villaTulum,
  BEACH_CHALET: beachChalet,
  VILLA_ERICEIRA: villaEriceira,
  BALI_JUNGLE_RESORT: baliJungleResort,
  DESERT_OASIS_MOROCCO: desertOasisMorocco,
  BEACH_HOUSE_MYKONOS: beachHouseMykonos,
  ART_DECO_LOFT_MEXICO: mazunteBohoVilla,
  LUXURY_BOHO_BUNGALOW: bahiaTropicalHaven,
  COASTAL_APARTMENT_ERICEIRA: mallorcaOceanviewVilla,
  
  // Fallback images
  PLACEHOLDER: '/placeholder.svg',
  DEFAULT_PROPERTY: villaEriceira,
} as const;

// Property image collections
export const PROPERTY_IMAGES = [
  ASSETS.VILLA_TULUM,
  ASSETS.BALI_JUNGLE_RESORT, 
  ASSETS.DESERT_OASIS_MOROCCO,
  ASSETS.BEACH_HOUSE_MYKONOS
] as const;

// Image loading utilities
export interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  aspectRatio?: 'square' | 'video' | 'photo' | 'wide';
  placeholder?: boolean;
  onError?: () => void;
}

export const getImageProps = (
  src: string,
  alt: string,
  options: Partial<OptimizedImageProps> = {}
): OptimizedImageProps => {
  const {
    className = '',
    loading = 'lazy',
    aspectRatio = 'photo',
    placeholder = true,
    onError
  } = options;

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video', 
    photo: 'aspect-[4/3]',
    wide: 'aspect-[16/9]'
  };

  return {
    src,
    alt,
    className: `w-full h-full object-cover ${aspectClasses[aspectRatio]} ${className}`.trim(),
    loading,
    placeholder,
    onError: onError || (() => {
      console.warn(`Failed to load image: ${src}`);
    })
  };
};

// Optimized image component props
export const createImageComponent = ({ src, alt, ...options }: OptimizedImageProps) => {
  const props = getImageProps(src, alt, options);
  
  return {
    ...props,
    onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.currentTarget;
      if (target.src !== ASSETS.PLACEHOLDER) {
        target.src = ASSETS.PLACEHOLDER;
        props.onError?.();
      }
    }
  };
};

// Base URL management
export const getAssetUrl = (path: string): string => {
  if (path.startsWith('http') || path.startsWith('/')) {
    return path;
  }
  
  const baseUrl = PLATFORM.assetsBaseUrl || '';
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

// Preload critical images
export const preloadCriticalImages = () => {
  if (typeof window === 'undefined') return;
  
  const criticalImages = [
    ASSETS.HERO_IMAGE,
    ASSETS.VILLA_TULUM,
    ASSETS.BEACH_CHALET
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};
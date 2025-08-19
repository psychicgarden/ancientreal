// Optimized Image Component with reliable loading and fallbacks
import React, { useState } from 'react';
import { createImageComponent, ASSETS, OptimizedImageProps } from '@/lib/assets';

interface ImageProps extends OptimizedImageProps {
  fallbackSrc?: string;
  showPlaceholder?: boolean;
}

export const OptimizedImage: React.FC<ImageProps> = ({
  src,
  alt,
  fallbackSrc = ASSETS.PLACEHOLDER,
  showPlaceholder = true,
  className = '',
  loading = 'lazy',
  aspectRatio = 'photo',
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    if (currentSrc !== fallbackSrc && !hasError) {
      setCurrentSrc(fallbackSrc);
      setHasError(true);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const imageProps = createImageComponent({
    src: currentSrc,
    alt,
    className,
    loading,
    aspectRatio,
    ...props
  });

  return (
    <div className={`relative ${imageProps.className}`}>
      {/* Loading placeholder */}
      {isLoading && showPlaceholder && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}
      
      {/* Actual image */}
      <img
        {...imageProps}
        onError={handleError}
        onLoad={handleLoad}
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
      
      {/* Error state */}
      {hasError && currentSrc === fallbackSrc && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Image unavailable</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
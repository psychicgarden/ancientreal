import React, { Suspense } from 'react';
import { useLazyComponent } from '@/hooks/useLazyLoad';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorBoundary } from '@/components/ui/error-boundary';

interface LazyComponentProps {
  importFunc: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  className?: string;
  componentProps?: any;
  threshold?: number;
  rootMargin?: string;
}

export const LazyComponent: React.FC<LazyComponentProps> = ({
  importFunc,
  fallback = <LoadingState variant="card" message="Loading component..." />,
  errorFallback,
  className,
  componentProps = {},
  threshold = 0.1,
  rootMargin = '50px'
}) => {
  const { ref, Component, loading, error, isIntersecting } = useLazyComponent(
    importFunc,
    { threshold, rootMargin }
  );

  if (error) {
    return (
      <div ref={ref as any} className={className}>
        {errorFallback || (
          <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/10">
            <p className="text-destructive text-sm">Failed to load component</p>
          </div>
        )}
      </div>
    );
  }

  if (!isIntersecting || loading || !Component) {
    return (
      <div ref={ref as any} className={className}>
        {fallback}
      </div>
    );
  }

  return (
    <div className={className}>
      <ErrorBoundary fallback={errorFallback}>
        <Suspense fallback={fallback}>
          <Component {...componentProps} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

// Higher-order component for lazy loading
export const withLazyLoading = <P extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
  options: {
    fallback?: React.ReactNode;
    errorFallback?: React.ReactNode;
    threshold?: number;
    rootMargin?: string;
  } = {}
) => {
  return (props: P) => (
    <LazyComponent
      importFunc={importFunc}
      componentProps={props}
      {...options}
    />
  );
};

// Preload function for critical components
export const preloadComponent = (importFunc: () => Promise<{ default: React.ComponentType<any> }>) => {
  return importFunc().catch(error => {
    console.warn('Failed to preload component:', error);
  });
};
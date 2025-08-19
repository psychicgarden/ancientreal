import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  variant?: 'skeleton' | 'spinner' | 'card' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  rows?: number;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'skeleton',
  size = 'md',
  message = 'Loading...',
  rows = 3,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8'
  };

  const spinnerSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  if (variant === 'spinner') {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        <Loader2 className={`animate-spin ${spinnerSizes[size]}`} />
        {message && <span className="text-sm text-muted-foreground">{message}</span>}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">{message}</span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-muted-foreground">{message}</span>
            </div>
            {Array.from({ length: rows }).map((_, index) => (
              <Skeleton key={index} className={sizeClasses[size]} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default skeleton variant
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className={sizeClasses[size]} />
      ))}
    </div>
  );
};

interface DataStateProps {
  loading: boolean;
  error: string | null;
  data: any;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  emptyMessage?: string;
}

export const DataState: React.FC<DataStateProps> = ({
  loading,
  error,
  data,
  children,
  loadingComponent,
  errorComponent,
  emptyComponent,
  emptyMessage = 'No data available'
}) => {
  if (loading) {
    return <>{loadingComponent || <LoadingState variant="card" />}</>;
  }

  if (error) {
    return (
      <>
        {errorComponent || (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-destructive">
                <p className="font-medium">Error loading data</p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </>
    );
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <>
        {emptyComponent || (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <p>{emptyMessage}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </>
    );
  }

  return <>{children}</>;
};
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LoadingState, DataState } from '@/components/ui/loading-state';

interface LoadingContextType {
  setLoading: (key: string, loading: boolean) => void;
  isLoading: (key: string) => boolean;
  setError: (key: string, error: string | null) => void;
  getError: (key: string) => string | null;
  clearErrors: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [errorStates, setErrorStates] = useState<Record<string, string | null>>({});

  const setLoading = (key: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading
    }));
  };

  const isLoading = (key: string) => Boolean(loadingStates[key]);

  const setError = (key: string, error: string | null) => {
    setErrorStates(prev => ({
      ...prev,
      [key]: error
    }));
  };

  const getError = (key: string) => errorStates[key] || null;

  const clearErrors = () => {
    setErrorStates({});
  };

  return (
    <LoadingContext.Provider value={{
      setLoading,
      isLoading,
      setError,
      getError,
      clearErrors
    }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

// Higher-order component for wrapping components with loading state
export const withLoading = <P extends object>(
  Component: React.ComponentType<P>,
  loadingKey: string
) => {
  const WrappedComponent = (props: P) => {
    const { isLoading, getError } = useLoading();
    
    return (
      <DataState
        loading={isLoading(loadingKey)}
        error={getError(loadingKey)}
        data={true} // Always render when not loading/erroring
      >
        <Component {...props} />
      </DataState>
    );
  };

  WrappedComponent.displayName = `withLoading(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};
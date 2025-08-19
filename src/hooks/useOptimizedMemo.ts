import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';

// Enhanced useMemo with dependency tracking
export const useOptimizedMemo = <T>(
  factory: () => T,
  deps: React.DependencyList,
  debugName?: string
): T => {
  const previousDeps = useRef<React.DependencyList>();
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current++;
  });

  return useMemo(() => {
    const hasChanged = !previousDeps.current || 
      deps.some((dep, index) => dep !== previousDeps.current![index]);

    if (process.env.NODE_ENV === 'development' && debugName) {
      if (hasChanged) {
        const changedIndices = deps
          .map((dep, index) => previousDeps.current && dep !== previousDeps.current[index] ? index : -1)
          .filter(index => index !== -1);
        
        console.log(`${debugName} memoized value recalculated. Changed dependencies at indices:`, changedIndices);
      }
    }

    previousDeps.current = deps;
    return factory();
  }, deps);
};

// Optimized useCallback with usage tracking
export const useOptimizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
  debugName?: string
): T => {
  const callCount = useRef(0);
  const previousDeps = useRef<React.DependencyList>();

  return useCallback((...args: Parameters<T>) => {
    callCount.current++;
    
    if (process.env.NODE_ENV === 'development' && debugName && callCount.current % 10 === 0) {
      console.log(`${debugName} callback called ${callCount.current} times`);
    }
    
    return callback(...args);
  }, deps) as T;
};

// Debounced value hook for performance
export const useDebouncedValue = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Memoized component factory
export const createMemoizedComponent = <P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  const MemoizedComponent = React.memo(Component, areEqual);
  
  if (process.env.NODE_ENV === 'development') {
    MemoizedComponent.displayName = `Memoized(${Component.displayName || Component.name})`;
  }
  
  return MemoizedComponent;
};

// Hook for expensive calculations with caching
export const useExpensiveCalculation = <T, Args extends any[]>(
  calculation: (...args: Args) => T,
  args: Args,
  cacheSize = 10
): T => {
  const cache = useRef<Map<string, T>>(new Map());
  
  return useMemo(() => {
    const key = JSON.stringify(args);
    
    if (cache.current.has(key)) {
      return cache.current.get(key)!;
    }
    
    const result = calculation(...args);
    
    // Implement LRU cache
    if (cache.current.size >= cacheSize) {
      const firstKey = cache.current.keys().next().value;
      cache.current.delete(firstKey);
    }
    
    cache.current.set(key, result);
    return result;
  }, [JSON.stringify(args), calculation, cacheSize]);
};


import { useEffect, useRef, useCallback } from 'react';

interface PerformanceEntry {
  name: string;
  duration: number;
  timestamp: number;
}

interface UsePerformanceMonitorOptions {
  enableLogging?: boolean;
  threshold?: number;
  onSlowOperation?: (entry: PerformanceEntry) => void;
}

export const usePerformanceMonitor = (options: UsePerformanceMonitorOptions = {}) => {
  const {
    enableLogging = process.env.NODE_ENV === 'development',
    threshold = 100,
    onSlowOperation
  } = options;

  const measurements = useRef<PerformanceEntry[]>([]);

  const startMeasurement = useCallback((name: string) => {
    if (!enableLogging) return () => {};

    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      const entry: PerformanceEntry = {
        name,
        duration,
        timestamp: Date.now()
      };

      measurements.current.push(entry);

      if (enableLogging && duration > threshold) {
        console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
        onSlowOperation?.(entry);
      }

      // Keep only last 100 measurements
      if (measurements.current.length > 100) {
        measurements.current = measurements.current.slice(-100);
      }
    };
  }, [enableLogging, threshold, onSlowOperation]);

  const measureAsync = useCallback(async <T>(
    name: string,
    asyncOperation: () => Promise<T>
  ): Promise<T> => {
    const endMeasurement = startMeasurement(name);
    try {
      const result = await asyncOperation();
      return result;
    } finally {
      endMeasurement();
    }
  }, [startMeasurement]);

  const getAverageTime = useCallback((operationName: string) => {
    const relevantMeasurements = measurements.current.filter(m => m.name === operationName);
    if (relevantMeasurements.length === 0) return 0;
    
    const total = relevantMeasurements.reduce((sum, m) => sum + m.duration, 0);
    return total / relevantMeasurements.length;
  }, []);

  const getAllMeasurements = useCallback(() => {
    return [...measurements.current];
  }, []);

  const clearMeasurements = useCallback(() => {
    measurements.current = [];
  }, []);

  // Monitor component render time
  useEffect(() => {
    if (!enableLogging) return;

    const componentName = 'Component Render';
    const endMeasurement = startMeasurement(componentName);
    
    return endMeasurement;
  });

  return {
    startMeasurement,
    measureAsync,
    getAverageTime,
    getAllMeasurements,
    clearMeasurements
  };
};

// Hook for monitoring specific operations
export const useOperationTimer = (operationName: string, enabled = true) => {
  const timerRef = useRef<number | null>(null);
  
  const start = useCallback(() => {
    if (!enabled) return;
    timerRef.current = performance.now();
  }, [enabled]);

  const end = useCallback(() => {
    if (!enabled || timerRef.current === null) return 0;
    
    const duration = performance.now() - timerRef.current;
    timerRef.current = null;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${operationName}: ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }, [enabled, operationName]);

  return { start, end };
};

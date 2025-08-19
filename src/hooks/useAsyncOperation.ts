import { useCallback, useRef } from 'react';

interface AsyncOperationOptions {
  retries?: number;
  delay?: number;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
}

export const useAsyncOperation = () => {
  const operationsRef = useRef(new Map<string, AbortController>());

  const execute = useCallback(async <T>(
    operation: () => Promise<T>,
    options: AsyncOperationOptions & { key?: string } = {}
  ): Promise<T | null> => {
    const {
      retries = 0,
      delay = 1000,
      onSuccess,
      onError,
      onFinally,
      key
    } = options;

    // Cancel previous operation with same key if exists
    if (key && operationsRef.current.has(key)) {
      operationsRef.current.get(key)?.abort();
    }

    const controller = new AbortController();
    if (key) {
      operationsRef.current.set(key, controller);
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        if (controller.signal.aborted) {
          return null;
        }

        const result = await operation();
        
        onSuccess?.(result);
        onFinally?.();
        
        if (key) {
          operationsRef.current.delete(key);
        }
        
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < retries && !controller.signal.aborted) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
        }
      }
    }

    if (!controller.signal.aborted) {
      onError?.(lastError!);
    }
    
    onFinally?.();
    
    if (key) {
      operationsRef.current.delete(key);
    }
    
    throw lastError;
  }, []);

  const cancel = useCallback((key: string) => {
    const controller = operationsRef.current.get(key);
    if (controller) {
      controller.abort();
      operationsRef.current.delete(key);
    }
  }, []);

  const cancelAll = useCallback(() => {
    operationsRef.current.forEach(controller => controller.abort());
    operationsRef.current.clear();
  }, []);

  return {
    execute,
    cancel,
    cancelAll
  };
};
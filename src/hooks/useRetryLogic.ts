// Retry logic hook for failed operations
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RetryConfig {
  maxAttempts: number;
  delay: number;
  backoffMultiplier: number;
  retryableErrors: string[];
}

const defaultConfig: RetryConfig = {
  maxAttempts: 3,
  delay: 1000,
  backoffMultiplier: 2,
  retryableErrors: [
    'network error',
    'timeout',
    'connection failed',
    'transaction underpriced',
    'insufficient funds for gas',
    'nonce too low'
  ]
};

export const useRetryLogic = (config: Partial<RetryConfig> = {}) => {
  const { toast } = useToast();
  const [isRetrying, setIsRetrying] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  
  const finalConfig = { ...defaultConfig, ...config };

  const isRetryableError = useCallback((error: any): boolean => {
    const errorMessage = error?.message?.toLowerCase() || error?.toString()?.toLowerCase() || '';
    return finalConfig.retryableErrors.some(retryableError => 
      errorMessage.includes(retryableError.toLowerCase())
    );
  }, [finalConfig.retryableErrors]);

  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string = 'operation'
  ): Promise<T> => {
    setIsRetrying(true);
    setAttemptCount(0);
    
    let lastError: any;
    
    for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
      setAttemptCount(attempt);
      
      try {
        const result = await operation();
        setIsRetrying(false);
        setAttemptCount(0);
        
        if (attempt > 1) {
          toast({
            title: "Operation Successful",
            description: `${operationName} completed after ${attempt} attempts`
          });
        }
        
        return result;
      } catch (error) {
        lastError = error;
        
        if (attempt === finalConfig.maxAttempts || !isRetryableError(error)) {
          break;
        }
        
        const delay = finalConfig.delay * Math.pow(finalConfig.backoffMultiplier, attempt - 1);
        
        toast({
          title: `Attempt ${attempt} Failed`,
          description: `Retrying ${operationName} in ${delay / 1000}s...`,
          variant: "destructive"
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    setIsRetrying(false);
    setAttemptCount(0);
    
    toast({
      title: "Operation Failed",
      description: `${operationName} failed after ${finalConfig.maxAttempts} attempts: ${lastError?.message || 'Unknown error'}`,
      variant: "destructive"
    });
    
    throw lastError;
  }, [finalConfig, isRetryableError, toast]);

  const executeWithFallback = useCallback(async <T>(
    primaryOperation: () => Promise<T>,
    fallbackOperation: () => Promise<T>,
    operationName: string = 'operation'
  ): Promise<T> => {
    try {
      return await executeWithRetry(primaryOperation, operationName);
    } catch (error) {
      toast({
        title: "Switching to Fallback",
        description: `Primary ${operationName} failed, trying alternative method...`
      });
      
      return await executeWithRetry(fallbackOperation, `fallback ${operationName}`);
    }
  }, [executeWithRetry, toast]);

  return {
    executeWithRetry,
    executeWithFallback,
    isRetrying,
    attemptCount,
    maxAttempts: finalConfig.maxAttempts
  };
};
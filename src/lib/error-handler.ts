// Error handling utilities and user-friendly error messages
import { logger } from './logger';
import { useToast } from '@/hooks/use-toast';

export interface ErrorContext {
  operation: string;
  component?: string;
  userAction?: string;
  additionalData?: Record<string, any>;
}

export interface UserFriendlyError {
  title: string;
  message: string;
  action?: string;
  variant: 'default' | 'destructive';
}

// Error classification and user-friendly messages
export class ErrorHandler {
  private static getNetworkErrorMessage(): UserFriendlyError {
    return {
      title: "Connection Error",
      message: "Unable to connect to our servers. Please check your internet connection and try again.",
      action: "Retry",
      variant: "destructive"
    };
  }

  private static getAuthErrorMessage(): UserFriendlyError {
    return {
      title: "Authentication Required",
      message: "Please connect your wallet to continue.",
      action: "Connect Wallet",
      variant: "destructive"
    };
  }

  private static getValidationErrorMessage(message: string): UserFriendlyError {
    return {
      title: "Invalid Input",
      message: message || "Please check your input and try again.",
      variant: "destructive"
    };
  }

  private static getServerErrorMessage(): UserFriendlyError {
    return {
      title: "Service Unavailable",
      message: "Our servers are temporarily unavailable. Please try again in a few moments.",
      action: "Retry",
      variant: "destructive"
    };
  }

  private static getInsufficientFundsMessage(): UserFriendlyError {
    return {
      title: "Insufficient Funds",
      message: "You don't have enough funds to complete this transaction.",
      action: "Add Funds",
      variant: "destructive"
    };
  }

  private static getGenericErrorMessage(): UserFriendlyError {
    return {
      title: "Something Went Wrong",
      message: "An unexpected error occurred. Please try again.",
      action: "Retry",
      variant: "destructive"
    };
  }

  // Convert technical errors to user-friendly messages
  static getUserFriendlyError(error: any, context: ErrorContext): UserFriendlyError {
    logger.error(`Error in ${context.operation}`, {
      error,
      context
    }, 'ErrorHandler');

    // Network errors
    if (error?.message?.includes('fetch') || 
        error?.message?.includes('network') ||
        error?.code === 'NETWORK_ERROR') {
      return this.getNetworkErrorMessage();
    }

    // Authentication errors
    if (error?.message?.includes('authentication') ||
        error?.message?.includes('unauthorized') ||
        error?.status === 401) {
      return this.getAuthErrorMessage();
    }

    // Validation errors
    if (error?.message?.includes('validation') ||
        error?.message?.includes('invalid') ||
        error?.status === 400) {
      return this.getValidationErrorMessage(error.message);
    }

    // Server errors
    if (error?.status >= 500 || 
        error?.message?.includes('server') ||
        error?.message?.includes('internal')) {
      return this.getServerErrorMessage();
    }

    // Insufficient funds (common in DeFi)
    if (error?.message?.includes('insufficient') ||
        error?.message?.includes('balance') ||
        error?.code === 'INSUFFICIENT_FUNDS') {
      return this.getInsufficientFundsMessage();
    }

    // Specific Supabase error handling
    if (error?.code === '23505') { // Unique constraint violation
      return {
        title: "Duplicate Entry",
        message: "This record already exists. Please check and try again.",
        variant: "destructive"
      };
    }

    if (error?.code === '23503') { // Foreign key constraint violation
      return {
        title: "Invalid Reference",
        message: "The referenced item no longer exists. Please refresh and try again.",
        variant: "destructive"
      };
    }

    // Return generic error for unknown cases
    return this.getGenericErrorMessage();
  }
}

// Hook for handling errors with toast notifications
export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = (error: any, context: ErrorContext) => {
    const userError = ErrorHandler.getUserFriendlyError(error, context);
    
    toast({
      title: userError.title,
      description: userError.message,
      variant: userError.variant,
    });

    return userError;
  };

  const handleSuccess = (message: string, title = "Success") => {
    toast({
      title,
      description: message,
    });
  };

  return {
    handleError,
    handleSuccess
  };
};

// Retry mechanism for failed operations
export class RetryHandler {
  static async withRetry<T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    maxRetries = 3,
    delayMs = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        logger.debug(`Attempting ${context.operation} (attempt ${attempt}/${maxRetries})`, 
          undefined, 'RetryHandler');
        
        const result = await operation();
        
        if (attempt > 1) {
          logger.info(`${context.operation} succeeded after ${attempt} attempts`, 
            undefined, 'RetryHandler');
        }
        
        return result;
        
      } catch (error) {
        lastError = error;
        logger.warn(`${context.operation} failed on attempt ${attempt}`, 
          { error, attempt, maxRetries }, 'RetryHandler');
        
        if (attempt < maxRetries) {
          // Exponential backoff
          const delay = delayMs * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // All retries failed
    logger.error(`${context.operation} failed after ${maxRetries} attempts`, 
      lastError, 'RetryHandler');
    
    throw lastError;
  }
}
import { z } from 'zod';

// Wallet address validation
export const validateWalletAddress = (address: string): boolean => {
  const walletRegex = /^0x[a-fA-F0-9]{40}$/;
  return walletRegex.test(address);
};

// Transaction hash validation
export const validateTransactionHash = (hash: string): boolean => {
  const hashRegex = /^0x[a-fA-F0-9]{64}$/;
  return hashRegex.test(hash);
};

// Input sanitization
export const sanitizeString = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Amount validation for financial inputs
export const amountSchema = z
  .number()
  .positive('Amount must be positive')
  .finite('Amount must be finite')
  .max(1000000, 'Amount too large')
  .refine((val) => Number(val.toFixed(6)) === val, {
    message: 'Maximum 6 decimal places allowed',
  });

// Safe number parsing
export const parseSecureAmount = (value: string): number | null => {
  const numericValue = parseFloat(value);
  
  if (isNaN(numericValue) || !isFinite(numericValue)) {
    return null;
  }
  
  try {
    amountSchema.parse(numericValue);
    return numericValue;
  } catch {
    return null;
  }
};

// Secure random string generation
export const generateSecureId = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Rate limiting utility
export class RequestThrottler {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private maxRequests: number = 10,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(timestamp => now - timestamp < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }
  
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

// Security headers for API responses
export const getSecurityHeaders = () => ({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
});

// Secure error responses (no sensitive data leakage)
export const createSecureErrorResponse = (message: string, status: number = 400) => {
  const safeMessage = sanitizeString(message);
  return {
    error: safeMessage,
    timestamp: new Date().toISOString(),
    // Never include stack traces or internal details in production
  };
};
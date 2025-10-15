/**
 * Ancient Lending Protocol - TypeScript Type Definitions
 * 
 * Use these types for type-safe contract interactions in your frontend.
 */

/**
 * Mortgage data structure returned by getMortgage(tokenId)
 */
export interface Mortgage {
  propertyOwner: string;        // address
  propertyPrice: bigint;         // uint256 (USDT amount, 6 decimals)
  downPayment: bigint;           // uint256 (USDT amount, 6 decimals)
  loanAmount: bigint;            // uint256 (USDT amount, 6 decimals)
  monthlyPayment: bigint;        // uint256 (USDT amount, 6 decimals)
  remainingBalance: bigint;      // uint256 (USDT amount, 6 decimals)
  startTime: bigint;             // uint256 (Unix timestamp)
  termMonths: bigint;            // uint256
  paymentsMade: bigint;          // uint256
  isActive: boolean;             // bool
}

/**
 * Appraisal data structure
 */
export interface Appraisal {
  appraisedValue: bigint;        // uint256 (USDT amount, 6 decimals)
  appreciationAmount: bigint;    // uint256 (USDT amount, 6 decimals)
  timestamp: bigint;             // uint256 (Unix timestamp)
  distributed: boolean;          // bool
}

/**
 * Platform configuration
 */
export interface PlatformConfig {
  DOWN_PAYMENT_PERCENT: 20;     // 20%
  PLATFORM_FEE_PERCENT: 3;      // 3%
  TERM_MONTHS: 120;             // 10 years
  APR_BPS: 800;                 // 8% (800 basis points)
}

/**
 * USDT configuration (Base Sepolia)
 */
export interface USDTConfig {
  decimals: 6;                   // USDT uses 6 decimals
  symbol: 'USDT';
}

/**
 * Contract method parameters
 */
export interface PurchasePropertyParams {
  propertyPrice: bigint;         // Total property price in USDT (6 decimals)
}

export interface MakePaymentParams {
  tokenId: bigint;               // NFT token ID representing the mortgage
}

export interface AppraisePropertyParams {
  tokenId: bigint;               // NFT token ID
  appraisedValue: bigint;        // New appraised value in USDT (6 decimals)
}

export interface DistributeAppreciationParams {
  tokenId: bigint;               // NFT token ID
}

/**
 * Helper to convert USDT amount (with decimals) to display string
 */
export function formatUSDT(amount: bigint): string {
  const decimals = 6;
  const divisor = BigInt(10 ** decimals);
  const whole = amount / divisor;
  const fraction = amount % divisor;
  return `${whole}.${fraction.toString().padStart(decimals, '0')}`;
}

/**
 * Helper to convert display string to USDT amount (with decimals)
 */
export function parseUSDT(amount: string): bigint {
  const decimals = 6;
  const [whole, fraction = ''] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole + paddedFraction);
}

/**
 * Calculate down payment (20%)
 */
export function calculateDownPayment(propertyPrice: bigint): bigint {
  return (propertyPrice * BigInt(20)) / BigInt(100);
}

/**
 * Calculate platform fee (3%)
 */
export function calculatePlatformFee(propertyPrice: bigint): bigint {
  return (propertyPrice * BigInt(3)) / BigInt(100);
}

/**
 * Calculate loan amount (80% - 3% fee)
 */
export function calculateLoanAmount(propertyPrice: bigint): bigint {
  const downPayment = calculateDownPayment(propertyPrice);
  const platformFee = calculatePlatformFee(propertyPrice);
  return propertyPrice - downPayment - platformFee;
}

/**
 * Calculate total approval needed for purchase
 * (down payment + platform fee)
 */
export function calculateTotalApproval(propertyPrice: bigint): bigint {
  return calculateDownPayment(propertyPrice) + calculatePlatformFee(propertyPrice);
}


// Property ID mapping for consistent database lookups
// Maps UI catalog IDs to database property_id integers
export const PROPERTY_ID_MAP: Record<string, number> = {
  "mazunte-mexico-villa": 1,
  "bahia-brazil-villa": 2,
  "ericeira-portugal-villa": 3,
};

// Reverse mapping for convenience
export const PROPERTY_ID_REVERSE_MAP: Record<number, string> = {
  1: "mazunte-mexico-villa",
  2: "bahia-brazil-villa", 
  3: "ericeira-portugal-villa",
};

// Realistic exchange rate: 1 AVAX = $40 USD for better UX
export const TESTING_EXCHANGE_RATE = {
  USD_PER_AVAX: 40, // $40 per AVAX for realistic amounts
  AVAX_PER_USD: 1 / 40, // 0.025 AVAX per USD
  REFERENCE_USD: 129000, // Reference amount in USD
  REFERENCE_AVAX: 129000 / 40, // 3225 AVAX equivalent
} as const;

// Currency conversion utilities
export const convertUSDToAVAX = (usdAmount: number): string => {
  const avaxAmount = usdAmount * TESTING_EXCHANGE_RATE.AVAX_PER_USD;
  return avaxAmount.toFixed(18); // High precision for small AVAX amounts
};

export const convertAVAXToUSD = (avaxAmount: number): number => {
  return avaxAmount * TESTING_EXCHANGE_RATE.USD_PER_AVAX;
};

export const formatAVAXAmount = (avaxAmount: string | number): string => {
  const amount = typeof avaxAmount === 'string' ? parseFloat(avaxAmount) : avaxAmount;
  if (amount >= 1) return amount.toFixed(4);
  if (amount >= 0.01) return amount.toFixed(6);
  return amount.toFixed(8); // More precision for tiny amounts
};
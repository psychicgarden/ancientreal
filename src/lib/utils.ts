import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Ancient Investor Tier System
export interface InvestorTier {
  name: string;
  displayName: string;
  threshold: number;
  benefits: string[];
  annualValue: number;
}

export const investorTiers: InvestorTier[] = [
  {
    name: "bronze",
    displayName: "🟤 Bronze Nomad",
    threshold: 500,
    benefits: [
      "50% off 1 week stay/year at any owned property",
      "Early access to new listings"
    ],
    annualValue: 700 // Conservative estimate for 50% off 1 week stay
  },
  {
    name: "silver", 
    displayName: "🥈 Silver Voyager",
    threshold: 5000,
    benefits: [
      "1 free week/year stay at any owned property",
      "10% discount on extra nights",
      "Priority access to new investments"
    ],
    annualValue: 1400 // 1 free week + discount value
  },
  {
    name: "gold",
    displayName: "🥇 Gold Wayfarer", 
    threshold: 10000,
    benefits: [
      "2 free weeks/year",
      "DAO governance voting rights",
      "Access to private events & community calls"
    ],
    annualValue: 2800 // 2 free weeks value
  }
];

export function calculateInvestorTier(totalInvestment: number): InvestorTier {
  // Find the highest tier the user qualifies for
  const qualifiedTiers = investorTiers.filter(tier => totalInvestment >= tier.threshold);
  return qualifiedTiers.length > 0 
    ? qualifiedTiers[qualifiedTiers.length - 1]
    : { name: "none", displayName: "No Tier", threshold: 0, benefits: [], annualValue: 0 };
}

export function getNextTierThreshold(currentTierName: string): number | null {
  const currentIndex = investorTiers.findIndex(tier => tier.name === currentTierName);
  if (currentIndex === -1 || currentIndex === investorTiers.length - 1) return null;
  return investorTiers[currentIndex + 1].threshold;
}

export function getTierProgress(totalInvestment: number, currentTierName: string): number {
  const nextThreshold = getNextTierThreshold(currentTierName);
  if (!nextThreshold) return 100;
  
  const currentTier = investorTiers.find(tier => tier.name === currentTierName);
  const currentThreshold = currentTier?.threshold || 0;
  
  const progress = ((totalInvestment - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

// Calculate total user investments across all tables
export async function calculateTotalUserInvestments(
  userWalletAddress: string,
  supabase: any
): Promise<number> {
  if (!userWalletAddress) return 0;

  try {
    // Get user properties (down payments)
    const { data: userProperties } = await supabase
      .from('user_properties')
      .select('down_payment')
      .eq('user_wallet_address', userWalletAddress)
      .eq('is_active', true);

    // Get fractional investments
    const { data: fractionalInvestments } = await supabase
      .from('fractional_investments')
      .select('investment_amount')
      .eq('investor_wallet_address', userWalletAddress)
      .eq('status', 'active');

    // Get developer investments
    const { data: developerInvestments } = await supabase
      .from('developer_investments')
      .select('investment_amount')
      .eq('user_wallet_address', userWalletAddress)
      .eq('investment_status', 'active');

    // Sum all investments
    const propertyInvestments = userProperties?.reduce((sum, property) => sum + Number(property.down_payment || 0), 0) || 0;
    const fractionalTotal = fractionalInvestments?.reduce((sum, investment) => sum + Number(investment.investment_amount || 0), 0) || 0;
    const developerTotal = developerInvestments?.reduce((sum, investment) => sum + Number(investment.investment_amount || 0), 0) || 0;

    return propertyInvestments + fractionalTotal + developerTotal;
  } catch (error) {
    console.error('Error calculating total investments:', error);
    return 0;
  }
}

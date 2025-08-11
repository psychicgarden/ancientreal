// Real-time yield calculations and financial logic
import { supabase } from "@/integrations/supabase/client";

export interface YieldCalculation {
  annualYield: number;
  monthlyIncome: number;
  totalReturn: number;
  appreciationYield: number;
  rentalYield: number;
}

export interface PricingData {
  currentPrice: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  lastUpdate: Date;
}

export class YieldCalculator {
  // Calculate real-time yield based on investment amount and property data
  static calculateYield(
    investmentAmount: number,
    propertyData: any,
    currentMarketPrice?: number
  ): YieldCalculation {
    const propertyValue = propertyData.current_speculation_price || propertyData.original_purchase_price;
    const monthlyRent = propertyData.monthly_base_rent || 0;
    const ownershipPercentage = investmentAmount / propertyValue;
    
    // Monthly rental income
    const monthlyIncome = monthlyRent * ownershipPercentage * 0.85; // 85% after fees
    
    // Annual rental yield
    const annualRentalIncome = monthlyIncome * 12;
    const rentalYield = (annualRentalIncome / investmentAmount) * 100;
    
    // Appreciation yield (projected)
    const appreciationPercent = propertyData.projected_appreciation_percent || 181;
    const appreciationYield = (appreciationPercent * 0.5) / 10; // 50% investor share over 10 years
    
    // Total annual yield
    const annualYield = rentalYield + (appreciationYield / 10); // Spread appreciation over 10 years
    
    return {
      annualYield,
      monthlyIncome,
      totalReturn: investmentAmount * (1 + annualYield / 100),
      appreciationYield,
      rentalYield
    };
  }

  // Calculate AMM pricing with slippage protection
  static calculateAMMPrice(
    tokenReserve: number,
    usdtReserve: number,
    tokenAmount: number,
    isBuy: boolean,
    slippageTolerance: number = 0.05 // 5% default
  ): { price: number; priceImpact: number; slippage: number } {
    if (tokenReserve <= 0 || usdtReserve <= 0) {
      return { price: 0, priceImpact: 0, slippage: 0 };
    }

    const k = tokenReserve * usdtReserve;
    
    if (isBuy) {
      // Buying tokens with USDT
      const newUsdtReserve = usdtReserve + tokenAmount;
      const newTokenReserve = k / newUsdtReserve;
      const tokensOut = tokenReserve - newTokenReserve;
      const price = tokenAmount / tokensOut;
      
      const spotPrice = usdtReserve / tokenReserve;
      const priceImpact = Math.abs((price - spotPrice) / spotPrice);
      const slippage = Math.max(0, priceImpact - slippageTolerance);
      
      return { price, priceImpact, slippage };
    } else {
      // Selling tokens for USDT
      const newTokenReserve = tokenReserve + tokenAmount;
      const newUsdtReserve = k / newTokenReserve;
      const usdtOut = usdtReserve - newUsdtReserve;
      const price = usdtOut / tokenAmount;
      
      const spotPrice = usdtReserve / tokenReserve;
      const priceImpact = Math.abs((price - spotPrice) / spotPrice);
      const slippage = Math.max(0, priceImpact - slippageTolerance);
      
      return { price, priceImpact, slippage };
    }
  }

  // Get real-time pricing data for a property token
  static async getRealTimePricing(propertyId: string): Promise<PricingData> {
    try {
      // Get recent trades for pricing
      const { data: trades, error } = await supabase
        .from('secondary_trades')
        .select('price_per_token, token_amount, created_at')
        .eq('property_fractionalization_id', propertyId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      if (!trades || trades.length === 0) {
        // No trades yet, use initial pricing
        const { data: property } = await supabase
          .from('property_fractionalization')
          .select('current_speculation_price, total_tokens_available')
          .eq('id', propertyId)
          .single();

        const basePrice = property?.current_speculation_price || 1;
        const totalTokens = property?.total_tokens_available || 1000000;
        
        return {
          currentPrice: basePrice / totalTokens,
          priceChange24h: 0,
          volume24h: 0,
          liquidity: basePrice * 0.1, // Assume 10% liquidity
          lastUpdate: new Date()
        };
      }

      // Calculate current price (weighted average of recent trades)
      const recentTrades = trades.slice(0, 10);
      const totalVolume = recentTrades.reduce((sum, t) => sum + Number(t.token_amount), 0);
      const currentPrice = recentTrades.reduce((sum, t) => 
        sum + (Number(t.price_per_token) * Number(t.token_amount)), 0
      ) / totalVolume;

      // Calculate 24h change
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const dayOldTrades = trades.filter(t => new Date(t.created_at) <= oneDayAgo);
      const oldPrice = dayOldTrades.length > 0 ? 
        dayOldTrades.reduce((sum, t) => sum + Number(t.price_per_token), 0) / dayOldTrades.length :
        currentPrice;
      
      const priceChange24h = ((currentPrice - oldPrice) / oldPrice) * 100;

      // Calculate 24h volume
      const volume24h = trades
        .filter(t => new Date(t.created_at) >= oneDayAgo)
        .reduce((sum, t) => sum + (Number(t.price_per_token) * Number(t.token_amount)), 0);

      return {
        currentPrice,
        priceChange24h,
        volume24h,
        liquidity: volume24h * 2, // Estimate liquidity as 2x daily volume
        lastUpdate: new Date()
      };
    } catch (error) {
      console.error('Error calculating real-time pricing:', error);
      return {
        currentPrice: 1,
        priceChange24h: 0,
        volume24h: 0,
        liquidity: 0,
        lastUpdate: new Date()
      };
    }
  }

  // Calculate compound yield with reinvestment
  static calculateCompoundYield(
    principal: number,
    annualRate: number,
    compoundingFrequency: number = 12, // Monthly
    years: number = 10
  ): number {
    return principal * Math.pow(1 + (annualRate / 100) / compoundingFrequency, compoundingFrequency * years);
  }

  // Risk-adjusted returns calculation
  static calculateRiskAdjustedReturn(
    expectedReturn: number,
    volatility: number,
    riskFreeRate: number = 4.5 // Current US Treasury rate
  ): number {
    // Sharpe ratio calculation
    const excessReturn = expectedReturn - riskFreeRate;
    return volatility > 0 ? excessReturn / volatility : 0;
  }
}
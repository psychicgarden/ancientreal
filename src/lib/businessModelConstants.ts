/**
 * Canonical Business Model Constants
 * Single source of truth for all financial model calculations
 * 
 * IMPORTANT: $1.9M seed → 32 units (2 flips) → Platform pivot
 */

// ===========================================
// SEED RAISE TERMS
// ===========================================
export const SEED_RAISE = {
  amount: 1.9,                // $1.9M raise
  safeCap: 12,                // $12M SAFE cap (negotiable)
  targetOwnership: 0.15,      // ~15% target ownership
  instrument: "SAFE",         // Standard SAFE
  
  useOfFunds: {
    construction: 0.79,       // 79% - Build 32 units
    techLegal: 0.10,          // 10% - Protocol + SPVs
    team: 0.06,               // 6% - Operations
    marketing: 0.05,          // 5% - HELOC partnerships
  },
};

// ===========================================
// SEED PHASE ECONOMICS (Years 1-2)
// ===========================================
export const SEED_PHASE = {
  capital: 1.9,              // $1.9M seed investment
  units: 32,                 // 15 Peru + 17 Brazil
  mortgages: 32,             // ALL 32 units generate mortgages (per deck)
  mortgageBook: 3.46,        // $3.46M total mortgage principal (per deck)
  annualRevenue: 0.345,      // $345K/year @ 10% APR (per deck)
  treasuryRemaining: 0.494,  // $494K treasury after seed round (per deck)
  downPaymentPercent: 0.30,  // 30% down payment (uniform)
  flips: 2,                  // Peru + Brazil only
  countries: 2,
  buildCost: 75_000,         // $75K per unit
  
  // Flip details
  flip1: {
    name: "Peru Genesis",
    units: 15,
    salePrice: 135_000,
    grossSales: 2.025,       // $2.025M
    buildCost: 1.125,        // $1.125M
    netProfit: 0.9,          // $900K
  },
  flip2: {
    name: "Brazil Scale",
    units: 17,
    salePrice: 145_000,
    grossSales: 2.465,       // $2.465M
    buildCost: 1.275,        // $1.275M
    netProfit: 1.19,         // $1.19M
  },
  
  // Totals
  totalGrossSales: 4.49,     // $4.49M
  totalBuildCost: 2.4,       // $2.4M
  totalNetProfit: 2.09,      // $2.09M
  finalCapital: 3.99,        // ~$4M after 2 flips
};

// ===========================================
// BUYER SEGMENT MIX
// ===========================================
export const BUYER_SEGMENTS = {
  cash: 0.20,               // 20% cash buyers
  btcCollateral: 0.50,      // 50% BTC-collateralized
  nomad: 0.30,              // 30% Nomad OCCR
};

// ===========================================
// VC BRIDGE LENDER ECONOMICS (Until institutional)
// ===========================================
export const VC_BRIDGE = {
  rate: 0.10,               // 10% APR to borrowers
  annualRevenue: 0.345,     // $345K/year on $3.46M book (per deck)
  targetInstitutional: 24,  // Month 18-24 for credit facility
};

// ===========================================
// EXIT SCENARIOS - TIERED (Conservative/Base/Optimistic)
// ===========================================
// EXIT SCENARIOS - Aligned with Pitch Deck Slide 19
export const EXIT_SCENARIOS_TIERED = {
  conservative: {
    description: "Achievable with seed phase only. No institutional capital required.",
    year3: {
      label: "Seed Exit",
      revenue: 2,
      multiple: 5,
      valuation: 10,           // $10-12M per deck
      stakeValue: 1.5,
      multipleOnCapital: 0.8,
      exitType: "M&A / Acqui-hire",
      phase: "seed",
      note: "32 units built, $2M DevCo profit, protocol proven",
    },
    year5: {
      label: "Modest Growth",
      revenue: 10,
      multiple: 7,
      valuation: 70,           // Low end of $70-100M
      stakeValue: 10.5,
      multipleOnCapital: 5.5,
      exitType: "M&A",
      phase: "platform",
      note: "Limited platform scaling, 50-100 partner units",
    },
  },
  base: {
    description: "Requires $5-20M institutional facility by Year 3. Deck-aligned valuations.",
    seed: {
      label: "Seed",
      revenue: 2,
      multiple: 5,
      valuation: 11,           // $10-12M per deck
      stakeValue: 1.65,
      multipleOnCapital: 0.9,
      exitType: "Seed Round",
      phase: "seed",
      note: "32 mortgages, $3.46M book, protocol proven",
    },
    seriesA: {
      label: "Series A",
      revenue: 8,
      multiple: 10,
      valuation: 85,           // $70-100M per deck (Post 2 Flips)
      stakeValue: 12.75,
      multipleOnCapital: 6.7,
      exitType: "Series A / M&A",
      phase: "platform",
      note: "Post 2 Flips, Credit Line Secured",
    },
    seriesB: {
      label: "Series B",
      revenue: 50,
      multiple: 8,
      valuation: 400,          // $300-500M per deck (5k+ Mortgages)
      stakeValue: 60,
      multipleOnCapital: 32,
      exitType: "Series B / Growth",
      phase: "platform",
      note: "5,000+ mortgages originated",
    },
    exit: {
      label: "Exit / IPO",
      revenue: 150,
      multiple: 15,
      valuation: 2250,         // $1.5B-$3B per deck
      stakeValue: 337.5,
      multipleOnCapital: 178,
      exitType: "IPO / Strategic",
      phase: "data",
      note: "Global Mortgage Bank or On-Chain Credit Bureau",
    },
  },
  optimistic: {
    description: "Requires platform dominance + OCCR becoming global standard.",
    seriesA: {
      label: "Series A",
      revenue: 10,
      multiple: 10,
      valuation: 100,          // High end of $70-100M
      stakeValue: 15,
      multipleOnCapital: 7.9,
      exitType: "Series A",
      phase: "platform",
      note: "Strong credit facility, validated OCCR",
    },
    seriesB: {
      label: "Series B",
      revenue: 60,
      multiple: 8,
      valuation: 500,          // High end of $300-500M
      stakeValue: 75,
      multipleOnCapital: 39,
      exitType: "Series B / Pre-IPO",
      phase: "platform",
      note: "5,000+ mortgages, institutional adoption",
    },
    exit: {
      label: "Exit / IPO",
      revenue: 200,
      multiple: 15,
      valuation: 3000,         // High end of $1.5B-$3B
      stakeValue: 450,
      multipleOnCapital: 237,
      exitType: "IPO / TGE",
      phase: "data",
      note: "Global standard for borderless credit",
    },
  },
};

// Legacy format for backward compatibility - Deck-aligned milestones
export const EXIT_SCENARIOS = {
  seed: EXIT_SCENARIOS_TIERED.base.seed,
  seriesA: EXIT_SCENARIOS_TIERED.base.seriesA,
  seriesB: EXIT_SCENARIOS_TIERED.base.seriesB,
  exit: EXIT_SCENARIOS_TIERED.base.exit,
  // Legacy year-based format
  year3: {
    label: "Series A",
    revenue: 8,
    multiple: 10,
    valuation: 85,
    stakeValue: 12.75,
    multipleOnCapital: 6.7,
    exitType: "Series A / M&A",
    phase: "platform",
    note: "Post 2 Flips, Credit Line Secured",
  },
  year5: {
    label: "Series B",
    revenue: 50,
    multiple: 8,
    valuation: 400,
    stakeValue: 60,
    multipleOnCapital: 32,
    exitType: "Series B / Growth",
    phase: "platform",
    note: "5,000+ mortgages originated",
  },
  year7: {
    label: "Pre-IPO",
    revenue: 100,
    multiple: 12,
    valuation: 1200,
    stakeValue: 180,
    multipleOnCapital: 95,
    exitType: "Pre-IPO / Strategic",
    phase: "data",
    note: "Platform dominance, OCCR data growing",
  },
  year10: EXIT_SCENARIOS_TIERED.base.exit,
};

// ===========================================
// 10-YEAR PROJECTION (Platform Pivot Model)
// ===========================================
// Y1: 15 units × $135K = $2.025M GMV
// - Platform fees: 3% = $61K
// - Dev profit: $60K × 15 = $900K
// - Mortgage interest: $1.62M × 10% = $162K
// - Total Revenue: $1.12M
// - Mortgage Book: 80% × $2.025M = $1.62M
// Valuation: Revenue × 4x + Book Value = $6M
export const TEN_YEAR_PROJECTION = [
  {
    year: "Y1",
    label: "Peru Genesis",
    internalUnits: 15,
    partnerUnits: 0,
    gmv: 2.025,
    devCoProfit: 0.9,
    originationFees: 0.061,
    developerFee: 0,
    mortgageSpread: 0.162,
    dataLicensing: 0,
    totalRevenue: 1.12,
    mortgageBook: 1.62,
    multiple: 4,
    valuation: 6,
    phase: "seed",
    funded: "seed",
  },
  {
    year: "Y2",
    label: "Brazil Scale",
    internalUnits: 17,
    partnerUnits: 0,
    gmv: 2.465,
    devCoProfit: 1.19,
    originationFees: 0.074,
    developerFee: 0,
    mortgageSpread: 0.197,
    dataLicensing: 0,
    totalRevenue: 1.46,
    mortgageBook: 3.59, // Cumulative: Y1 + Y2
    multiple: 5,
    valuation: 11,
    phase: "seed",
    funded: "seed",
  },
  {
    year: "Y3",
    label: "Platform Launch",
    internalUnits: 0,
    partnerUnits: 100,
    gmv: 15,
    devCoProfit: 0,
    originationFees: 0.45,
    developerFee: 0.6,
    mortgageSpread: 1.2,
    dataLicensing: 0.25,
    totalRevenue: 2.5,
    mortgageBook: 12, // $12M book from 100 partner units
    multiple: 6,
    valuation: 15,
    phase: "platform",
    funded: "institutional",
  },
  {
    year: "Y5",
    label: "Protocol Scale",
    internalUnits: 0,
    partnerUnits: 500,
    gmv: 75,
    devCoProfit: 0,
    originationFees: 2.25,
    developerFee: 3.0,
    mortgageSpread: 6.0,
    dataLicensing: 3.75,
    totalRevenue: 15,
    mortgageBook: 60, // $60M cumulative book
    multiple: 10,
    valuation: 150,
    phase: "platform",
    funded: "institutional",
  },
  {
    year: "Y7",
    label: "Global Network",
    internalUnits: 0,
    partnerUnits: 2500,
    gmv: 375,
    devCoProfit: 0,
    originationFees: 11.25,
    developerFee: 15,
    mortgageSpread: 15,
    dataLicensing: 18.75,
    totalRevenue: 60,
    mortgageBook: 300, // $300M cumulative
    multiple: 15,
    valuation: 900,
    phase: "data",
    funded: "institutional",
  },
  {
    year: "Y10",
    label: "Credit Bureau",
    internalUnits: 0,
    partnerUnits: 10000,
    gmv: 1500,
    devCoProfit: 0,
    originationFees: 45,
    developerFee: 60,
    mortgageSpread: 30,
    dataLicensing: 15,
    totalRevenue: 150,
    mortgageBook: 1200, // $1.2B book
    multiple: 15,
    valuation: 2250,
    phase: "data",
    funded: "institutional",
  },
];

// ===========================================
// MULTIPLE JUSTIFICATION
// ===========================================
export const MULTIPLE_JUSTIFICATION = [
  {
    years: "1-2",
    multiple: "4×",
    reason: "Real estate company. Revenue from construction margins. RE multiples apply.",
    phase: "seed",
  },
  {
    years: "3-5",
    multiple: "6-10×",
    reason: "Platform revenue grows (origination, spread). Hybrid RE/Fintech.",
    phase: "platform",
  },
  {
    years: "7-10",
    multiple: "15-20×",
    reason: "OCCR data licensing dominates. We're Experian for global credit.",
    phase: "data",
  },
];

// ===========================================
// HELPER FUNCTIONS
// ===========================================
export function formatCurrency(value: number, showDecimals = true): string {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}B`;
  }
  return showDecimals ? `$${value.toFixed(1)}M` : `$${Math.round(value)}M`;
}

export function getPhaseColor(phase: string): { bg: string; text: string; border: string } {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    seed: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
    platform: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
    data: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
    institutional: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30" },
  };
  return colors[phase] || colors.seed;
}

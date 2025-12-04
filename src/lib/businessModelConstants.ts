/**
 * Canonical Business Model Constants
 * Single source of truth for all financial model calculations
 * 
 * IMPORTANT: $1.9M seed → 32 units (2 flips) → Platform pivot
 */

// ===========================================
// CAPITAL STACK (VC Audit Response)
// ===========================================
export const CAPITAL_STACK = {
  seedCapital: 1.9,           // VC seed borrowed against BTC
  btcCollateral: 5.0,         // $5M BTC deposited
  ltv: 0.35,                  // 35% LTV (conservative)
  liquidationThreshold: 1.5,  // 150% LTV triggers liquidation
  interestRate: 0.10,         // ~10% APR on borrowed USDC
  
  buyerCashFlow: {
    cashSalesUnits: 6,        // 20% of 32 units
    cashSalesRevenue: 0.84,   // 6 × $140K avg
    downPaymentUnits: 26,     // 80% of 32 units (financed)
    downPaymentPercent: 0.30, // 30% down
    downPaymentRevenue: 1.09, // 26 × 30% × $140K
    total: 1.93,              // Total buyer cash at closing
  },
  
  totalCapitalAvailable: 3.83, // Seed + buyer cash flow
  
  uses: {
    construction: 2.4,        // 32 × $75K
    techLegal: 0.4,           // Protocol, SPVs, legal
    teamOps: 0.1,             // Team salaries
    marketing: 0.1,           // HELOC partnerships
    contingency: 0.05,        // Buffer
  },
};

// ===========================================
// SEED PHASE ECONOMICS (Years 1-2)
// ===========================================
export const SEED_PHASE = {
  capital: 1.9,              // $1.9M seed investment
  units: 32,                 // 15 Peru + 17 Brazil
  mortgages: 26,             // 80% of 32 = ~26 mortgages
  mortgageBook: 2.55,        // $2.55M total mortgage principal
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
  annualRevenue: 0.255,     // $255K/year on $2.55M book
  targetInstitutional: 24,  // Month 18-24 for credit facility
};

// ===========================================
// EXIT SCENARIOS - TIERED (Conservative/Base/Optimistic)
// ===========================================
export const EXIT_SCENARIOS_TIERED = {
  conservative: {
    description: "Achievable with seed phase only. No institutional capital required.",
    year3: {
      label: "Seed Exit",
      revenue: 1.5,
      multiple: 5,
      valuation: 7.5,
      stakeValue: 1.125,
      multipleOnCapital: 0.6,
      exitType: "M&A / Acqui-hire",
      phase: "seed",
      note: "32 units built, $2M DevCo profit, protocol proven",
    },
    year5: {
      label: "Modest Growth",
      revenue: 5,
      multiple: 8,
      valuation: 40,
      stakeValue: 6,
      multipleOnCapital: 3.2,
      exitType: "M&A",
      phase: "platform",
      note: "Limited platform scaling, 50-100 partner units",
    },
  },
  base: {
    description: "Requires $5-20M institutional facility by Year 3.",
    year3: {
      label: "Platform Launch",
      revenue: 2.5,
      multiple: 6,
      valuation: 15,
      stakeValue: 2.25,
      multipleOnCapital: 1.2,
      exitType: "Series A / M&A",
      phase: "platform",
      note: "Institutional capital secured, 100 partner units",
    },
    year5: {
      label: "Series B/C",
      revenue: 15,
      multiple: 10,
      valuation: 150,
      stakeValue: 22.5,
      multipleOnCapital: 12,
      exitType: "Growth Round / M&A",
      phase: "platform",
      note: "500 partner units, proven OCCR data",
    },
    year10: {
      label: "Full Scale",
      revenue: 100,
      multiple: 15,
      valuation: 1500,
      stakeValue: 225,
      multipleOnCapital: 118,
      exitType: "IPO / Strategic",
      phase: "data",
      note: "5,000+ partner units, OCCR licensing ($15M)",
    },
  },
  optimistic: {
    description: "Requires platform dominance + OCCR becoming global standard.",
    year5: {
      label: "Breakout Growth",
      revenue: 25,
      multiple: 12,
      valuation: 300,
      stakeValue: 45,
      multipleOnCapital: 24,
      exitType: "Series C / Pre-IPO",
      phase: "platform",
      note: "1,000 partner units, institutional adoption",
    },
    year10: {
      label: "Global Standard",
      revenue: 150,
      multiple: 20,
      valuation: 3000,
      stakeValue: 450,
      multipleOnCapital: 237,
      exitType: "IPO / TGE",
      phase: "data",
      note: "10,000 units, OCCR = global credit identity",
    },
  },
};

// Legacy format for backward compatibility
export const EXIT_SCENARIOS = {
  year3: EXIT_SCENARIOS_TIERED.base.year3,
  year5: EXIT_SCENARIOS_TIERED.base.year5,
  year7: {
    label: "IPO-Ready",
    revenue: 50,
    multiple: 15,
    valuation: 750,
    stakeValue: 112.5,
    multipleOnCapital: 59,
    exitType: "IPO / Strategic",
    phase: "platform",
    note: "Platform dominance, OCCR data growing",
  },
  year10: EXIT_SCENARIOS_TIERED.base.year10,
};

// ===========================================
// 10-YEAR PROJECTION (Platform Pivot Model)
// ===========================================
export const TEN_YEAR_PROJECTION = [
  {
    year: "Year 1",
    label: "Peru Genesis",
    internalUnits: 15,
    partnerUnits: 0,
    gmv: 2.0,
    devCoProfit: 0.9,
    originationFees: 0.06,
    developerFee: 0,
    mortgageSpread: 0.05,
    dataLicensing: 0,
    totalRevenue: 1.0,
    multiple: 4,
    valuation: 4,
    phase: "seed",
    funded: "seed",
  },
  {
    year: "Year 2",
    label: "Brazil Scale",
    internalUnits: 17,
    partnerUnits: 0,
    gmv: 2.5,
    devCoProfit: 1.2,
    originationFees: 0.08,
    developerFee: 0,
    mortgageSpread: 0.15,
    dataLicensing: 0,
    totalRevenue: 1.4,
    multiple: 4,
    valuation: 5.6,
    phase: "seed",
    funded: "seed",
  },
  {
    year: "Year 3",
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
    multiple: 6,
    valuation: 15,
    phase: "platform",
    funded: "institutional",
  },
  {
    year: "Year 5",
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
    multiple: 10,
    valuation: 150,
    phase: "platform",
    funded: "institutional",
  },
  {
    year: "Year 7",
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
    multiple: 15,
    valuation: 900,
    phase: "data",
    funded: "institutional",
  },
  {
    year: "Year 10",
    label: "Credit Bureau",
    internalUnits: 0,
    partnerUnits: 10000,
    gmv: 1500,
    devCoProfit: 0,
    originationFees: 45,
    developerFee: 60,
    mortgageSpread: 30,
    dataLicensing: 15,       // REDUCED from $75M - strategic optionality, not core thesis
    totalRevenue: 150,       // Adjusted total
    multiple: 15,            // Adjusted multiple (more conservative)
    valuation: 2250,         // Adjusted valuation
    phase: "data",
    funded: "institutional",
    note: "Data licensing = optionality, not requirement",
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

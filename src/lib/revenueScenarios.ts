/**
 * Revenue Model Scenario Calculations
 * Two-Pocket Model: DevCo (Development) + FinCo (Protocol/Liquidity Pool)
 */

// Business Model Constants
const BUILD_COST = 75_000; // $75k all-in build cost per unit (land + construction)
const FEE_RATE = 0.03; // 3% platform fee on all sales
const INITIAL_CAPITAL = 1.9; // $1.9M seed investment (Two-Pocket: DevCo only)

// FinCo Economics (Two-Pocket Model)
export const FINCO_ECONOMICS = {
  borrowerRate: 0.10,    // 10% to borrowers
  stakerYield: 0.07,     // 7% to liquidity providers
  nim: 0.03,             // 3% Net Interest Margin (10% - 7%)
};

// Phase Mix Strategy (Blend for Liquidity Management)
export const PHASE_MIX = {
  phase1: { cash: 0.40, mortgage: 0.60, name: "Cash Heavy", timeline: "Years 1-2" },
  phase2: { cash: 0.10, mortgage: 0.90, name: "Debt Scale", timeline: "Years 3-5" },
  phase3: { cash: 0.05, mortgage: 0.95, name: "BlackRock Turn", timeline: "Year 5+" },
};

// Canonical 6-flip structure matching SixFlipRoadmap
interface Flip {
  flip: string;
  price: number;
  units: number;
  financedUnits: number;
  cashUnits: number;
}

/**
 * Get canonical 6-flip schedule (147 units total)
 * Matches SixFlipRoadmap: Peru, Brazil, Greece, Thailand, Mexico, Turkey
 */
function getFlips(): Flip[] {
  return [
    { flip: 'Flip 1', price: 135_000, units: 15, financedUnits: 12, cashUnits: 3 }, // Peru - Genesis
    { flip: 'Flip 2', price: 145_000, units: 21, financedUnits: 17, cashUnits: 4 }, // Brazil - Scale
    { flip: 'Flip 3', price: 165_000, units: 16, financedUnits: 13, cashUnits: 3 }, // Greece - Club
    { flip: 'Flip 4', price: 110_000, units: 25, financedUnits: 20, cashUnits: 5 }, // Thailand - Leasehold
    { flip: 'Flip 5', price: 250_000, units: 20, financedUnits: 16, cashUnits: 4 }, // Mexico - Whale Haven
    { flip: 'Flip 6', price: 160_000, units: 50, financedUnits: 40, cashUnits: 10 }, // Turkey - Citadel
  ];
}

/**
 * Get weighted average sale price across all flips
 */
function getWeightedAvgPrice(): number {
  const flips = getFlips();
  const totalValue = flips.reduce((sum, f) => sum + f.price * f.units, 0);
  const totalUnits = flips.reduce((sum, f) => sum + f.units, 0);
  return totalValue / totalUnits;
}

/**
 * Development Flywheel - Operational cash flow (NOT included in 15-year IRR)
 */
export interface FlywheelFlip {
  flip: string;
  units: number;
  buildCost: number;
  grossSales: number;
  downPayments: number;
  platformFees: number;
  cashSales: number;
  immediateCash: number;
  deferredPrincipal: number;
  constructionProfit: number;
}

export function calculateDevelopmentFlywheel(): {
  flips: FlywheelFlip[];
  totalConstructionProfit: number;
  totalPlatformFees: number;
  totalImmediateCash: number;
  totalDeferredPrincipal: number;
  totalGrossSales: number;
  totalConstructionCost: number;
} {
  const flips = getFlips();
  const results: FlywheelFlip[] = [];
  
  for (const flip of flips) {
    const buildCost = BUILD_COST * flip.units;
    const grossSales = flip.price * flip.units;
    const downPayments = flip.price * 0.20 * flip.financedUnits;
    const cashSales = flip.price * flip.cashUnits;
    const platformFees = FEE_RATE * grossSales;
    const immediateCash = downPayments + cashSales + platformFees;
    const deferredPrincipal = flip.price * 0.80 * flip.financedUnits;
    const constructionProfit = (flip.price - BUILD_COST) * flip.units;
    
    results.push({
      flip: flip.flip,
      units: flip.units,
      buildCost,
      grossSales,
      downPayments,
      platformFees,
      cashSales,
      immediateCash,
      deferredPrincipal,
      constructionProfit,
    });
  }
  
  const totalConstructionProfit = results.reduce((sum, f) => sum + f.constructionProfit, 0);
  const totalPlatformFees = results.reduce((sum, f) => sum + f.platformFees, 0);
  const totalImmediateCash = results.reduce((sum, f) => sum + f.immediateCash, 0);
  const totalDeferredPrincipal = results.reduce((sum, f) => sum + f.deferredPrincipal, 0);
  const totalGrossSales = results.reduce((sum, f) => sum + f.grossSales, 0);
  const totalConstructionCost = results.reduce((sum, f) => sum + f.buildCost, 0);
  
  return {
    flips: results,
    totalConstructionProfit,
    totalPlatformFees,
    totalImmediateCash,
    totalDeferredPrincipal,
    totalGrossSales,
    totalConstructionCost,
  };
}

export interface ScenarioInputs {
  apr: number; // Annual percentage rate (e.g., 8 for 8%)
  cashPurchaseRate: number; // Percentage of cash purchases (e.g., 0.2 for 20%)
  totalUnits: number;
  avgPropertyPrice: number;
  platformFeeRate: number; // As decimal (e.g., 0.035 for 3.5%)
  termYears: number;
  appreciationRate: number; // Annual appreciation (e.g., 0.07 for 7%)
  samShare: number; // Platform's share of appreciation (e.g., 0.30 for 30%)
}

export interface ScenarioResults {
  name: string;
  totalRevenue: number;
  constructionProfit: number;
  platformFees: number;
  mortgageInterest: number;
  appreciationShare: number;
  irr: number;
  cashMultiple: number;
  financedUnits: number;
  cashUnits: number;
  avgMonthlyPayment: number;
  totalLoanAmount: number;
  investorPaybackMonths?: number; // Months until investor capital is returned
  developmentPhaseCash?: number; // Total cash collected in Years 0-5
}

/**
 * Phased cash flow breakdown for investor timeline
 */
export interface PhasedCashFlows {
  developmentPhase: {
    year: number;
    flip: string;
    immediateCash: number;
    deferredPrincipal: number;
  }[];
  mortgagePhase: {
    year: number;
    interestIncome: number;
  }[];
  exitPhase: {
    year: number;
    appreciationShare: number;
  };
}

/**
 * Calculate platform fees on ALL sales (cash + financed) using exact flip schedule
 */
function calculatePlatformFees(): number {
  const flips = getFlips();
  return flips.reduce((sum, f) => sum + FEE_RATE * f.price * f.units, 0);
}

/**
 * Calculate construction profit (for display only - NOT included in 15-year revenue)
 */
function calculateConstructionProfit(): number {
  const flips = getFlips();
  return flips.reduce((sum, f) => sum + (f.price - BUILD_COST) * f.units, 0);
}

/**
 * Newton-Raphson IRR solver for 15-year financial revenue only
 */
function newtonRaphsonIRR(cashFlows: number[]): number {
  let rate = 0.18; // Initial guess: 18%
  const maxIterations = 100;
  const tolerance = 0.0001;
  
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let npv = 0;
    let dnpv = 0; // Derivative of NPV
    
    for (let i = 0; i < cashFlows.length; i++) {
      const discountFactor = Math.pow(1 + rate, i);
      npv += cashFlows[i] / discountFactor;
      dnpv -= (i * cashFlows[i]) / Math.pow(1 + rate, i + 1);
    }
    
    if (Math.abs(npv) < tolerance) break;
    rate = rate - npv / dnpv;
  }
  
  return rate * 100; // Return as percentage
}

/**
 * Build 15-year financial cash flows (Platform Fees + Mortgage Interest + SAM)
 * EXCLUDES construction profit - that's in the Development Flywheel
 */
function build15YearCashflows(
  platformFeesM: number,
  mortgageInterestM: number,
  appreciationShareM: number,
  termYears: number
): number[] {
  const cashFlows: number[] = [];
  const annualInterest = mortgageInterestM / termYears;
  
  // Year 0: Platform fees minus initial investment
  cashFlows[0] = platformFeesM - INITIAL_CAPITAL;
  
  // Years 1-14: Annual mortgage interest
  for (let year = 1; year < termYears; year++) {
    cashFlows[year] = annualInterest;
  }
  
  // Year 15: Mortgage interest + appreciation share
  cashFlows[termYears] = annualInterest + appreciationShareM;
  
  return cashFlows;
}

/**
 * Build mortgage-only 15-year cash flows (no SAM)
 */
function buildMortgageOnly15YearCashflows(
  platformFeesM: number,
  mortgageInterestM: number,
  termYears: number
): number[] {
  const cashFlows: number[] = [];
  const annualInterest = mortgageInterestM / termYears;
  
  // Year 0: Platform fees minus initial investment
  cashFlows[0] = platformFeesM - INITIAL_CAPITAL;
  
  // Years 1-15: Annual mortgage interest
  for (let year = 1; year <= termYears; year++) {
    cashFlows[year] = annualInterest;
  }
  
  return cashFlows;
}

/**
 * Calculate revenue for scenario with SAM (15-year financial revenue only)
 */
export function calculateScenario(inputs: ScenarioInputs, name: string): ScenarioResults {
  const { apr, termYears, appreciationRate, samShare } = inputs;

  const flips = getFlips();
  const totalUnits = flips.reduce((sum, f) => sum + f.units, 0);
  const financedUnits = flips.reduce((sum, f) => sum + f.financedUnits, 0);
  const cashUnits = flips.reduce((sum, f) => sum + f.cashUnits, 0);

  // Construction profit (for display only - NOT in 15-year revenue)
  const constructionProfit = calculateConstructionProfit();

  // Calculate immediate cash from cash sales
  const cashSalesRevenue = flips.reduce((sum, flip) => {
    return sum + (flip.price * flip.cashUnits);
  }, 0);
  
  // Calculate down payments from financed units (20% down)
  const downPaymentRevenue = flips.reduce((sum, flip) => {
    return sum + (flip.price * 0.20 * flip.financedUnits);
  }, 0);

  // Platform fees (3.5% on ALL sales)
  const platformFees = calculatePlatformFees();

  // Calculate mortgage interest per flip and aggregate
  let totalLoanAmount = 0;
  let totalMortgageInterest = 0;
  
  for (const flip of flips) {
    const loanPerUnit = flip.price * 0.80; // 20% down
    const loanAmount = loanPerUnit * flip.financedUnits;
    totalLoanAmount += loanAmount;
    
    const monthlyRate = apr / 100 / 12;
    const numPayments = termYears * 12;
    const monthlyPayment = loanAmount > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : 0;
    
    const totalPaid = monthlyPayment * numPayments;
    totalMortgageInterest += totalPaid - loanAmount;
  }

  // Calculate appreciation share (30% SAM at year 15)
  const weightedAvgPrice = getWeightedAvgPrice();
  const finalValue = totalUnits * weightedAvgPrice * Math.pow(1 + appreciationRate, termYears);
  const totalAppreciation = finalValue - (totalUnits * weightedAvgPrice);
  const appreciationShare = totalAppreciation * samShare;

  // 15-Year Total Revenue (Platform Fees + Mortgage Interest + SAM)
  const totalRevenue = platformFees + totalMortgageInterest + appreciationShare;

  // Convert to millions
  const totalRevenueM = totalRevenue / 1_000_000;
  const constructionProfitM = constructionProfit / 1_000_000;
  const platformFeesM = platformFees / 1_000_000;
  const mortgageInterestM = totalMortgageInterest / 1_000_000;
  const appreciationShareM = appreciationShare / 1_000_000;

  // Calculate total immediate cash for Year 0 (includes cash sales + down payments + platform fees)
  const totalImmediateCash = (cashSalesRevenue + downPaymentRevenue + platformFees) / 1_000_000;

  // Calculate IRR with corrected Year 0 cash flow
  const cashFlows: number[] = [];
  const annualInterest = mortgageInterestM / termYears;
  
  // Year 0: ALL IMMEDIATE CASH minus initial investment
  cashFlows[0] = totalImmediateCash - INITIAL_CAPITAL;
  
  // Years 1-14: Annual mortgage interest
  for (let year = 1; year < termYears; year++) {
    cashFlows[year] = annualInterest;
  }
  
  // Year 15: Mortgage interest + appreciation share
  cashFlows[termYears] = annualInterest + appreciationShareM;
  
  const irr = newtonRaphsonIRR(cashFlows);
  const cashMultiple = totalRevenueM / INITIAL_CAPITAL;

  return {
    name,
    totalRevenue: totalRevenueM,
    constructionProfit: constructionProfitM,
    platformFees: platformFeesM,
    mortgageInterest: mortgageInterestM,
    appreciationShare: appreciationShareM,
    irr,
    cashMultiple,
    financedUnits,
    cashUnits,
    avgMonthlyPayment: totalLoanAmount > 0 ? (totalMortgageInterest * 1_000_000 / termYears / 12) / financedUnits : 0,
    totalLoanAmount: totalLoanAmount / 1_000_000,
  };
}

/**
 * Pre-defined scenarios (Two-Pocket Model: 10% borrower rate)
 */
export const SCENARIO_PRESETS = {
  current: {
    apr: 10.0, // 10% borrower rate (Two-Pocket: 7% staker yield + 3% NIM)
    cashPurchaseRate: 0.20,
    totalUnits: 147, // Updated to canonical 147-unit model
    avgPropertyPrice: 159524, // Weighted average from canonical pricing
    platformFeeRate: 0.035,
    termYears: 15,
    appreciationRate: 0.07,
    samShare: 0.15, // 15% SAM share
  },
  accelerated: {
    apr: 10.0,
    cashPurchaseRate: 0.20,
    totalUnits: 147,
    avgPropertyPrice: 159524,
    platformFeeRate: 0.035,
    termYears: 10,
    appreciationRate: 0.07,
    samShare: 0.15,
  },
  hybrid: {
    apr: 10.0,
    cashPurchaseRate: 0.20,
    totalUnits: 147,
    avgPropertyPrice: 159524,
    platformFeeRate: 0.035,
    termYears: 12.5,
    appreciationRate: 0.07,
    samShare: 0.15,
  },
  aggressive: {
    apr: 10.0,
    cashPurchaseRate: 0.30,
    totalUnits: 147,
    avgPropertyPrice: 159524,
    platformFeeRate: 0.035,
    termYears: 15,
    appreciationRate: 0.07,
    samShare: 0.15,
  },
  tiered: {
    apr: 10.0,
    cashPurchaseRate: 0.25,
    totalUnits: 147,
    avgPropertyPrice: 159524,
    platformFeeRate: 0.035,
    termYears: 15,
    appreciationRate: 0.07,
    samShare: 0.15,
  },
  // Tiered portfolio presets with phased cash-to-mortgage evolution
  cashOptimized: {
    apr: 10.0,
    cashPurchaseRate: 0.40,
    mortgageRate: 0.60, // Phase 1: 40/60 cash/mortgage
    samRate: 0,
    mortgageAPR: 10.0,
    samAPR: 8.0,
    samShare: 0.15,
    totalUnits: 147,
    avgPropertyPrice: 159524,
    platformFeeRate: 0.035,
    termYears: 15,
    appreciationRate: 0.07,
  },
  mortgageHeavy: {
    apr: 10.0,
    cashPurchaseRate: 0.10, // Phase 2: 10/90 cash/mortgage
    mortgageRate: 0.90,
    samRate: 0,
    mortgageAPR: 10.0,
    samAPR: 8.0,
    samShare: 0.15,
    totalUnits: 147,
    avgPropertyPrice: 159524,
    platformFeeRate: 0.035,
    termYears: 15,
    appreciationRate: 0.07,
  },
  helocStrategy: {
    apr: 10.0,
    cashPurchaseRate: 0.50,
    mortgageRate: 0.50,
    samRate: 0,
    mortgageAPR: 10.0,
    samAPR: 8.0,
    samShare: 0.15,
    totalUnits: 147,
    avgPropertyPrice: 159524,
    platformFeeRate: 0.035,
    termYears: 15,
    appreciationRate: 0.07,
  },
};

/**
 * Generate current scenario
 */
export function getCurrentScenario(): ScenarioResults {
  return calculateScenario(SCENARIO_PRESETS.current, "Current Model");
}

/**
 * Generate aggressive scenario
 */
export function getAggressiveScenario(): ScenarioResults {
  return calculateScenario(SCENARIO_PRESETS.aggressive, "Aggressive Model");
}

/**
 * Generate accelerated (10-year) scenario
 */
export function getAcceleratedScenario(): ScenarioResults {
  return calculateScenario(SCENARIO_PRESETS.accelerated, "Accelerated (10-Year)");
}

/**
 * Generate hybrid scenario
 */
export function getHybridScenario(): ScenarioResults {
  return calculateScenario(SCENARIO_PRESETS.hybrid, "Hybrid Model");
}

/**
 * Generate tiered scenario
 */
export function getTieredScenario(): ScenarioResults {
  return calculateScenario(SCENARIO_PRESETS.tiered, "Tiered Model");
}

/**
 * Calculate mortgage-only scenario (no SAM - 15-year financial revenue only)
 */
export function calculateMortgageOnlyScenario(inputs: ScenarioInputs, name: string): ScenarioResults {
  const { apr, termYears } = inputs;

  const flips = getFlips();
  const totalUnits = flips.reduce((sum, f) => sum + f.units, 0);
  const financedUnits = flips.reduce((sum, f) => sum + f.financedUnits, 0);
  const cashUnits = flips.reduce((sum, f) => sum + f.cashUnits, 0);

  // Construction profit (for display only - NOT in 15-year revenue)
  const constructionProfit = calculateConstructionProfit();

  // Platform fees (3.5% on ALL sales)
  const platformFees = calculatePlatformFees();

  // Calculate mortgage interest per flip and aggregate
  let totalLoanAmount = 0;
  let totalMortgageInterest = 0;
  
  for (const flip of flips) {
    const loanPerUnit = flip.price * 0.80; // 20% down
    const loanAmount = loanPerUnit * flip.financedUnits;
    totalLoanAmount += loanAmount;
    
    const monthlyRate = apr / 100 / 12;
    const numPayments = termYears * 12;
    const monthlyPayment = loanAmount > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : 0;
    
    const totalPaid = monthlyPayment * numPayments;
    totalMortgageInterest += totalPaid - loanAmount;
  }

  // NO appreciation share - buyer owns 100%
  const appreciationShare = 0;

  // 15-Year Total Revenue (Platform Fees + Mortgage Interest only)
  const totalRevenue = platformFees + totalMortgageInterest;

  // Convert to millions
  const totalRevenueM = totalRevenue / 1_000_000;
  const constructionProfitM = constructionProfit / 1_000_000;
  const platformFeesM = platformFees / 1_000_000;
  const mortgageInterestM = totalMortgageInterest / 1_000_000;
  const appreciationShareM = 0;

  // Calculate IRR using mortgage-only 15-year cash flows
  const cashFlows = buildMortgageOnly15YearCashflows(
    platformFeesM,
    mortgageInterestM,
    termYears
  );
  const irr = newtonRaphsonIRR(cashFlows);
  const cashMultiple = totalRevenueM / INITIAL_CAPITAL;

  return {
    name,
    totalRevenue: totalRevenueM,
    constructionProfit: constructionProfitM,
    platformFees: platformFeesM,
    mortgageInterest: mortgageInterestM,
    appreciationShare: appreciationShareM,
    irr,
    cashMultiple,
    financedUnits,
    cashUnits,
    avgMonthlyPayment: totalLoanAmount > 0 ? (totalMortgageInterest * 1_000_000 / termYears / 12) / financedUnits : 0,
    totalLoanAmount: totalLoanAmount / 1_000_000,
  };
}

/**
 * Calculate tiered portfolio scenario with three distinct product types
 * @param cashRate - Percentage of units sold as full cash (e.g., 0.40 for 40%)
 * @param mortgageRate - Percentage of units sold with mortgage (e.g., 0.50 for 50%)
 * @param samRate - Percentage of units sold with SAM (e.g., 0.10 for 10%)
 * @param mortgageAPR - APR for mortgage units (e.g., 10.5 for 10.5%)
 * @param samAPR - APR for SAM units (e.g., 8.0 for 8%)
 * @param samShare - Platform's share of appreciation for SAM units (e.g., 0.20 for 20%)
 * @param termYears - Loan term in years (default 15)
 */
export function calculateTieredPortfolioScenario(
  cashRate: number,
  mortgageRate: number,
  samRate: number,
  mortgageAPR: number,
  samAPR: number,
  samShare: number,
  termYears: number = 15,
  name: string = "Tiered Portfolio"
): ScenarioResults {
  const flips = getFlips();
  const totalUnits = flips.reduce((sum, f) => sum + f.units, 0);

  // Calculate unit distribution
  const cashUnits = Math.round(totalUnits * cashRate);
  const mortgageUnits = Math.round(totalUnits * mortgageRate);
  const samUnits = Math.round(totalUnits * samRate);

  // Construction profit (for display only)
  const constructionProfit = calculateConstructionProfit();

  // Platform fees on ALL sales - include $10K premium on financed units
  let platformFees = 0;
  for (const flip of flips) {
    const flipCashUnits = Math.round(flip.units * cashRate);
    const flipMortgageUnits = Math.round(flip.units * mortgageRate);
    const flipSAMUnits = Math.round(flip.units * samRate);
    
    // Financed units (mortgage) have $10K premium, cash and SAM don't
    platformFees += FEE_RATE * (
      flip.price * flipCashUnits + 
      (flip.price + 10_000) * flipMortgageUnits + 
      flip.price * flipSAMUnits
    );
  }

  // Calculate IMMEDIATE CASH from cash sales (THIS IS THE FIX!)
  let cashSalesRevenue = 0;
  let downPaymentRevenue = 0;
  let totalMortgageInterest = 0;
  let totalSAMInterest = 0;
  let totalLoanAmount = 0;

  // Process each flip
  for (const flip of flips) {
    const flipCashUnits = Math.round(flip.units * cashRate);
    const flipMortgageUnits = Math.round(flip.units * mortgageRate);
    const flipSAMUnits = Math.round(flip.units * samRate);

    // IMMEDIATE CASH: Full cash sales
    cashSalesRevenue += flip.price * flipCashUnits;

    // Mortgage product: base price + $10K premium, 20% down
    const mortgagePrice = flip.price + 10000;
    const mortgageLoanPerUnit = mortgagePrice * 0.80;
    const mortgageLoanAmount = mortgageLoanPerUnit * flipMortgageUnits;
    
    // IMMEDIATE CASH: Down payments on mortgage units
    downPaymentRevenue += mortgagePrice * 0.20 * flipMortgageUnits;
    
    if (mortgageLoanAmount > 0) {
      const monthlyRate = mortgageAPR / 100 / 12;
      const numPayments = termYears * 12;
      const monthlyPayment = 
        (mortgageLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
      
      const totalPaid = monthlyPayment * numPayments;
      totalMortgageInterest += totalPaid - mortgageLoanAmount;
      totalLoanAmount += mortgageLoanAmount;
    }

    // SAM product: cash price, 20% down, lower APR
    const samLoanPerUnit = flip.price * 0.80;
    const samLoanAmount = samLoanPerUnit * flipSAMUnits;
    
    // IMMEDIATE CASH: Down payments on SAM units
    downPaymentRevenue += flip.price * 0.20 * flipSAMUnits;
    
    if (samLoanAmount > 0) {
      const monthlyRate = samAPR / 100 / 12;
      const numPayments = termYears * 12;
      const monthlyPayment = 
        (samLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
      
      const totalPaid = monthlyPayment * numPayments;
      totalSAMInterest += totalPaid - samLoanAmount;
      totalLoanAmount += samLoanAmount;
    }
  }

  // Calculate SAM appreciation share (only on SAM units)
  const weightedAvgPrice = getWeightedAvgPrice();
  const samFinalValue = samUnits * weightedAvgPrice * Math.pow(1 + 0.07, termYears);
  const samTotalAppreciation = samFinalValue - (samUnits * weightedAvgPrice);
  const appreciationShare = samTotalAppreciation * samShare;

  // Total revenue
  const totalRevenue = platformFees + totalMortgageInterest + totalSAMInterest + appreciationShare;

  // Convert to millions
  const totalRevenueM = totalRevenue / 1_000_000;
  const constructionProfitM = constructionProfit / 1_000_000;
  const platformFeesM = platformFees / 1_000_000;
  const totalInterestM = (totalMortgageInterest + totalSAMInterest) / 1_000_000;
  const appreciationShareM = appreciationShare / 1_000_000;
  
  // Development phase cash (Years 0-5)
  const totalImmediateCash = cashSalesRevenue + downPaymentRevenue + platformFees;
  const developmentPhaseCashM = totalImmediateCash / 1_000_000;

  // Calculate IRR with CORRECTED Year 0 cash flow
  const cashFlows: number[] = [];
  const annualInterest = totalInterestM / termYears;
  
  // Year 0: ALL IMMEDIATE CASH minus initial investment
  cashFlows[0] = developmentPhaseCashM - INITIAL_CAPITAL;
  
  for (let year = 1; year < termYears; year++) {
    cashFlows[year] = annualInterest;
  }
  cashFlows[termYears] = annualInterest + appreciationShareM;

  const irr = newtonRaphsonIRR(cashFlows);
  const cashMultiple = totalRevenueM / INITIAL_CAPITAL;

  // Calculate investor payback period
  let cumulativeCash = developmentPhaseCashM - INITIAL_CAPITAL;
  let paybackMonths = 0;
  
  if (cumulativeCash >= INITIAL_CAPITAL) {
    // Paid back in development phase (Years 0-5)
    paybackMonths = Math.ceil((INITIAL_CAPITAL / developmentPhaseCashM) * 60); // 5 years = 60 months
  } else {
    // Need mortgage income to pay back
    const monthlyInterest = totalInterestM / termYears / 12;
    const remainingCapital = INITIAL_CAPITAL - cumulativeCash;
    paybackMonths = 60 + Math.ceil(remainingCapital / monthlyInterest);
  }

  // Calculate weighted average monthly payment
  const avgMonthlyPayment = totalLoanAmount > 0 
    ? (totalInterestM * 1_000_000 / termYears / 12) / (mortgageUnits + samUnits)
    : 0;

  return {
    name,
    totalRevenue: totalRevenueM,
    constructionProfit: constructionProfitM,
    platformFees: platformFeesM,
    mortgageInterest: totalInterestM,
    appreciationShare: appreciationShareM,
    irr,
    cashMultiple,
    financedUnits: mortgageUnits + samUnits,
    cashUnits,
    avgMonthlyPayment,
    totalLoanAmount: totalLoanAmount / 1_000_000,
    investorPaybackMonths: paybackMonths,
    developmentPhaseCash: developmentPhaseCashM,
  };
}

/**
 * Generate tiered portfolio scenarios
 */
export function getCashOptimizedScenario(): ScenarioResults {
  const preset = SCENARIO_PRESETS.cashOptimized;
  return calculateTieredPortfolioScenario(
    preset.cashPurchaseRate,
    preset.mortgageRate!,
    preset.samRate!,
    preset.mortgageAPR!,
    preset.samAPR!,
    preset.samShare,
    preset.termYears,
    "Cash Optimized (40/50/10)"
  );
}

export function getMortgageHeavyScenario(): ScenarioResults {
  const preset = SCENARIO_PRESETS.mortgageHeavy;
  return calculateTieredPortfolioScenario(
    preset.cashPurchaseRate,
    preset.mortgageRate!,
    preset.samRate!,
    preset.mortgageAPR!,
    preset.samAPR!,
    preset.samShare,
    preset.termYears,
    "Mortgage Heavy (25/65/10)"
  );
}

export function getHelocStrategyScenario(): ScenarioResults {
  const preset = SCENARIO_PRESETS.helocStrategy;
  return calculateTieredPortfolioScenario(
    preset.cashPurchaseRate,
    preset.mortgageRate!,
    preset.samRate!,
    preset.mortgageAPR!,
    preset.samAPR!,
    preset.samShare,
    preset.termYears,
    "HELOC Strategy (50/40/10)"
  );
}

/**
 * Generate 15-year cash flow data for a scenario
 */
export function generateScenarioCashFlow(scenario: ScenarioResults) {
  const data = [];
  let cumulative = 0;
  
  const annualInterest = scenario.mortgageInterest / 15;
  
  for (let year = 0; year <= 15; year++) {
    let platformFees = 0;
    let interest = 0;
    let appreciation = 0;
    
    if (year === 0) {
      platformFees = scenario.platformFees;
    }
    
    if (year >= 1 && year <= 15) {
      interest = annualInterest;
    }
    
    if (year === 15) {
      appreciation = scenario.appreciationShare;
    }
    
    const yearlyRevenue = platformFees + interest + appreciation;
    cumulative += yearlyRevenue;
    
    data.push({
      year: year === 0 ? "Y0" : `Y${year}`,
      platformFees,
      interest,
      appreciation,
      total: yearlyRevenue,
      cumulative,
    });
  }
  
  return data;
}

/**
 * Generate phased timeline showing development (Years 0-5) vs mortgage income (Years 1-15)
 */
export function generatePhasedTimeline(
  cashRate: number,
  mortgageRate: number,
  samRate: number
): PhasedCashFlows {
  const flips = getFlips();
  const developmentPhase = [];
  
  // Development phase: 6 flips over 5 years
  for (const flip of flips) {
    const flipCashUnits = Math.round(flip.units * cashRate);
    const flipMortgageUnits = Math.round(flip.units * mortgageRate);
    const flipSAMUnits = Math.round(flip.units * samRate);
    
    const cashSales = flip.price * flipCashUnits;
    const mortgagePrice = flip.price + 10000;
    const mortgageDownPayments = mortgagePrice * 0.20 * flipMortgageUnits;
    const samDownPayments = flip.price * 0.20 * flipSAMUnits;
    const platformFees = FEE_RATE * flip.price * flip.units;
    
    const immediateCash = cashSales + mortgageDownPayments + samDownPayments + platformFees;
    const deferredPrincipal = (mortgagePrice * 0.80 * flipMortgageUnits) + (flip.price * 0.80 * flipSAMUnits);
    
    developmentPhase.push({
      year: parseInt(flip.flip.match(/\d+/)?.[0] || "0"),
      flip: flip.flip,
      immediateCash: immediateCash / 1_000_000,
      deferredPrincipal: deferredPrincipal / 1_000_000,
    });
  }
  
  // Mortgage phase: Years 1-15
  const mortgagePhase = [];
  const scenario = calculateTieredPortfolioScenario(cashRate, mortgageRate, samRate, 11.0, 8.0, 0.15);
  const annualInterest = scenario.mortgageInterest / 15;
  
  for (let year = 1; year <= 15; year++) {
    mortgagePhase.push({
      year,
      interestIncome: annualInterest,
    });
  }
  
  // Exit phase: Year 15 SAM appreciation
  const exitPhase = {
    year: 15,
    appreciationShare: scenario.appreciationShare,
  };
  
  return { developmentPhase, mortgagePhase, exitPhase };
}

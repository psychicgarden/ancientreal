/**
 * Revenue Model Scenario Calculations
 * Comparing different APR and cash purchase strategies
 */

// Business Model Constants
const BUILD_COST = 75_000; // $75k build cost per unit
const FEE_RATE = 0.035; // 3.5% platform fee on all sales
const INITIAL_CAPITAL = 3.0; // $3M initial investment

// Flip structure - exact 6 flips matching user's schedule
interface Flip {
  flip: string;
  price: number;
  units: number;
  financedUnits: number;
  cashUnits: number;
}

/**
 * Get exact 6-flip schedule with dynamic pricing $135k → $150k
 */
function getFlips(): Flip[] {
  return [
    { flip: 'Flip 1', price: 135_000, units: 15, financedUnits: 12, cashUnits: 3 },
    { flip: 'Flip 2', price: 138_000, units: 21, financedUnits: 16, cashUnits: 5 },
    { flip: 'Flip 3A', price: 141_000, units: 16, financedUnits: 12, cashUnits: 4 },
    { flip: 'Flip 3B', price: 144_000, units: 15, financedUnits: 12, cashUnits: 3 },
    { flip: 'Flip 4A', price: 147_000, units: 25, financedUnits: 20, cashUnits: 5 },
    { flip: 'Flip 4B', price: 150_000, units: 20, financedUnits: 16, cashUnits: 4 },
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
  
  return {
    flips: results,
    totalConstructionProfit,
    totalPlatformFees,
    totalImmediateCash,
    totalDeferredPrincipal,
    totalGrossSales,
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

  // Calculate IRR using 15-year financial cash flows only
  const cashFlows = build15YearCashflows(
    platformFeesM,
    mortgageInterestM,
    appreciationShareM,
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
 * Pre-defined scenarios
 */
export const SCENARIO_PRESETS = {
  current: {
    apr: 8,
    cashPurchaseRate: 0.20,
    totalUnits: 112,
    avgPropertyPrice: 143000,
    platformFeeRate: 0.035,
    termYears: 15,
    appreciationRate: 0.07,
    samShare: 0.30,
  },
  accelerated: {
    apr: 8,
    cashPurchaseRate: 0.20,
    totalUnits: 112,
    avgPropertyPrice: 143000,
    platformFeeRate: 0.035,
    termYears: 10,
    appreciationRate: 0.07,
    samShare: 0.30,
  },
  hybrid: {
    apr: 8,
    cashPurchaseRate: 0.20,
    totalUnits: 112,
    avgPropertyPrice: 143000,
    platformFeeRate: 0.035,
    termYears: 12.5, // 50/50 split between 10 and 15 years
    appreciationRate: 0.07,
    samShare: 0.30,
  },
  aggressive: {
    apr: 11.5,
    cashPurchaseRate: 0.30,
    totalUnits: 112,
    avgPropertyPrice: 143000,
    platformFeeRate: 0.035,
    termYears: 15,
    appreciationRate: 0.07,
    samShare: 0.30,
  },
  tiered: {
    apr: 9.75, // Weighted average of 8%, 10%, 11.5%
    cashPurchaseRate: 0.25,
    totalUnits: 112,
    avgPropertyPrice: 143000,
    platformFeeRate: 0.035,
    termYears: 15,
    appreciationRate: 0.07,
    samShare: 0.30,
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

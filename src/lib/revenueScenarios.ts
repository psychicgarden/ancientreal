/**
 * Revenue Model Scenario Calculations
 * Comparing different APR and cash purchase strategies
 */

// Business Model Constants
const BUILD_COST = 75_000; // $75k build cost per unit
const FEE_RATE = 0.035; // 3.5% platform fee

// Cohort structure for 6 flips across 3 years
interface Cohort {
  year: number;
  price: number;
  units: number;
}

/**
 * Get cohorts scaled to totalUnits
 * Flip 1-2 (Year 0): 37 units @ $135k
 * Flip 3-4 (Year 1): 38 units @ $142.5k
 * Flip 5-6 (Year 2): 37 units @ $150k
 */
function getCohorts(totalUnits: number): Cohort[] {
  const cohort0Units = Math.round(totalUnits * 37 / 112);
  const cohort1Units = Math.round(totalUnits * 38 / 112);
  const cohort2Units = totalUnits - cohort0Units - cohort1Units;
  
  return [
    { year: 0, price: 135_000, units: cohort0Units },
    { year: 1, price: 142_500, units: cohort1Units },
    { year: 2, price: 150_000, units: cohort2Units },
  ];
}

/**
 * Get weighted average sale price across all cohorts
 */
function getWeightedAvgPrice(totalUnits: number): number {
  const cohorts = getCohorts(totalUnits);
  const totalValue = cohorts.reduce((sum, c) => sum + c.price * c.units, 0);
  return totalValue / totalUnits;
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
 * Calculate true IRR using Newton-Raphson method
 * Solves for the rate where NPV of all cash flows equals zero
 */
function calculateTrueIRR(
  initialInvestment: number,
  platformFeesM: number,
  mortgageInterestM: number,
  appreciationShareM: number,
  termYears: number
): number {
  const annualInterest = mortgageInterestM / termYears;
  
  // Build cash flow array: Year 0 gets platform fees minus investment
  // Years 1-14 get annual mortgage interest
  // Year 15 gets mortgage interest plus appreciation share
  const cashFlows = [-initialInvestment + platformFeesM]; // Year 0
  for (let i = 1; i < termYears; i++) {
    cashFlows.push(annualInterest); // Years 1-14
  }
  cashFlows.push(annualInterest + appreciationShareM); // Year 15
  
  // Newton-Raphson solver for IRR (finds rate where NPV = 0)
  let rate = 0.15; // Initial guess: 15%
  const maxIterations = 100;
  const tolerance = 0.0001;
  
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let npv = 0;
    let dnpv = 0; // Derivative of NPV with respect to rate
    
    for (let i = 0; i < cashFlows.length; i++) {
      const discountFactor = Math.pow(1 + rate, i);
      npv += cashFlows[i] / discountFactor;
      dnpv -= (i * cashFlows[i]) / Math.pow(1 + rate, i + 1);
    }
    
    if (Math.abs(npv) < tolerance) break;
    
    rate = rate - npv / dnpv; // Newton-Raphson step
  }
  
  return rate * 100; // Convert to percentage
}

/**
 * Calculate construction profit across all cohorts
 */
function calculateConstructionProfit(totalUnits: number): number {
  const cohorts = getCohorts(totalUnits);
  return cohorts.reduce((sum, c) => sum + (c.price - BUILD_COST) * c.units, 0);
}

/**
 * Calculate platform fees on ALL sales (cash + financed)
 */
function calculatePlatformFees(totalUnits: number, feeRate: number = FEE_RATE): number {
  const cohorts = getCohorts(totalUnits);
  return cohorts.reduce((sum, c) => sum + feeRate * c.price * c.units, 0);
}

/**
 * Newton-Raphson IRR solver
 */
function newtonRaphsonIRR(cashFlows: number[]): number {
  let rate = 0.20; // Initial guess: 20%
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
 * Build mortgage-only cash flows with cohort timing
 */
function buildMortgageOnlyCashflows(
  initialInvestment: number,
  totalUnits: number,
  financedUnits: number,
  mortgageInterestM: number,
  termYears: number
): number[] {
  const cohorts = getCohorts(totalUnits);
  const cashFlows: number[] = [];
  
  // Year 0: Initial outflow + first cohort revenues
  const cohort0 = cohorts[0];
  const constructionProfit0 = (cohort0.price - BUILD_COST) * cohort0.units / 1_000_000;
  const platformFees0 = FEE_RATE * cohort0.price * cohort0.units / 1_000_000;
  cashFlows[0] = -initialInvestment + constructionProfit0 + platformFees0;
  
  // Year 1: Second cohort revenues + mortgage interest from cohort 0
  const cohort1 = cohorts[1];
  const constructionProfit1 = (cohort1.price - BUILD_COST) * cohort1.units / 1_000_000;
  const platformFees1 = FEE_RATE * cohort1.price * cohort1.units / 1_000_000;
  const share0 = cohort0.units / totalUnits;
  const interest1 = share0 * mortgageInterestM / termYears;
  cashFlows[1] = constructionProfit1 + platformFees1 + interest1;
  
  // Year 2: Third cohort revenues + mortgage interest from cohorts 0-1
  const cohort2 = cohorts[2];
  const constructionProfit2 = (cohort2.price - BUILD_COST) * cohort2.units / 1_000_000;
  const platformFees2 = FEE_RATE * cohort2.price * cohort2.units / 1_000_000;
  const share1 = cohort1.units / totalUnits;
  const interest2 = (share0 + share1) * mortgageInterestM / termYears;
  cashFlows[2] = constructionProfit2 + platformFees2 + interest2;
  
  // Years 3 to termYears: Full mortgage interest from all cohorts
  const fullAnnualInterest = mortgageInterestM / termYears;
  for (let year = 3; year <= termYears; year++) {
    cashFlows[year] = fullAnnualInterest;
  }
  
  return cashFlows;
}

/**
 * Calculate true IRR for mortgage-only model with cohort timing
 */
function calculateMortgageOnlyIRR(
  initialInvestment: number,
  totalUnits: number,
  financedUnits: number,
  mortgageInterestM: number,
  termYears: number
): number {
  const cashFlows = buildMortgageOnlyCashflows(
    initialInvestment,
    totalUnits,
    financedUnits,
    mortgageInterestM,
    termYears
  );
  return newtonRaphsonIRR(cashFlows);
}

/**
 * Calculate revenue for a given scenario
 */
export function calculateScenario(inputs: ScenarioInputs, name: string): ScenarioResults {
  const {
    apr,
    cashPurchaseRate,
    totalUnits,
    avgPropertyPrice,
    platformFeeRate,
    termYears,
    appreciationRate,
    samShare,
  } = inputs;

  // Calculate construction profit
  const constructionProfit = calculateConstructionProfit(totalUnits);

  // Calculate unit distribution
  const cashUnits = Math.round(totalUnits * cashPurchaseRate);
  const financedUnits = totalUnits - cashUnits;

  // Platform fees (on ALL sales: cash + financed)
  const platformFees = calculatePlatformFees(totalUnits, platformFeeRate);

  // Calculate mortgage interest revenue
  const downPaymentRate = 0.20; // 20% down payment
  const loanPerUnit = avgPropertyPrice * (1 - downPaymentRate);
  const totalLoanAmount = financedUnits * loanPerUnit;
  
  // Monthly payment calculation
  const monthlyRate = apr / 100 / 12;
  const numPayments = termYears * 12;
  const monthlyPayment = totalLoanAmount > 0
    ? (totalLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    : 0;
  
  const totalPaid = monthlyPayment * numPayments;
  const mortgageInterest = totalPaid - totalLoanAmount;

  // Calculate appreciation share (30% SAM)
  const finalValue = totalUnits * avgPropertyPrice * Math.pow(1 + appreciationRate, termYears);
  const totalAppreciation = finalValue - (totalUnits * avgPropertyPrice);
  const appreciationShare = totalAppreciation * samShare;

  // Total revenue (includes construction profit)
  const totalRevenue = constructionProfit + platformFees + mortgageInterest + appreciationShare;

  // Convert to millions for all calculations
  const totalRevenueM = totalRevenue / 1_000_000;
  const constructionProfitM = constructionProfit / 1_000_000;
  const platformFeesM = platformFees / 1_000_000;
  const mortgageInterestM = mortgageInterest / 1_000_000;
  const appreciationShareM = appreciationShare / 1_000_000;

  // Calculate true IRR using Newton-Raphson method for NPV=0
  const initialCapital = 3.0; // $3M initial capital
  const irr = calculateTrueIRR(
    initialCapital,
    platformFeesM,
    mortgageInterestM,
    appreciationShareM,
    termYears
  );
  const cashMultiple = totalRevenueM / initialCapital;

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
    avgMonthlyPayment: monthlyPayment / financedUnits,
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
 * Calculate mortgage-only scenario (no SAM - buyer owns 100% appreciation)
 */
export function calculateMortgageOnlyScenario(inputs: ScenarioInputs, name: string): ScenarioResults {
  const {
    apr,
    cashPurchaseRate,
    totalUnits,
    termYears,
  } = inputs;

  // Calculate construction profit
  const constructionProfit = calculateConstructionProfit(totalUnits);

  // Use weighted average price across all flips
  const avgPropertyPrice = getWeightedAvgPrice(totalUnits);

  // Calculate unit distribution
  const cashUnits = Math.round(totalUnits * cashPurchaseRate);
  const financedUnits = totalUnits - cashUnits;

  // Platform fees (on ALL sales: cash + financed)
  const platformFees = calculatePlatformFees(totalUnits, FEE_RATE);

  // Calculate mortgage interest revenue (only on financed units)
  const downPaymentRate = 0.20;
  const loanPerUnit = avgPropertyPrice * (1 - downPaymentRate);
  const totalLoanAmount = financedUnits * loanPerUnit;
  
  const monthlyRate = apr / 100 / 12;
  const numPayments = termYears * 12;
  const monthlyPayment = totalLoanAmount > 0
    ? (totalLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    : 0;
  
  const totalPaid = monthlyPayment * numPayments;
  const mortgageInterest = totalPaid - totalLoanAmount;

  // NO appreciation share - buyer owns 100%
  const appreciationShare = 0;

  // Total revenue
  const totalRevenue = constructionProfit + platformFees + mortgageInterest;

  // Convert to millions
  const totalRevenueM = totalRevenue / 1_000_000;
  const constructionProfitM = constructionProfit / 1_000_000;
  const platformFeesM = platformFees / 1_000_000;
  const mortgageInterestM = mortgageInterest / 1_000_000;
  const appreciationShareM = 0;

  // Calculate IRR with cohort timing
  const initialCapital = 3.0;
  const irr = calculateMortgageOnlyIRR(
    initialCapital,
    totalUnits,
    financedUnits,
    mortgageInterestM,
    termYears
  );
  const cashMultiple = totalRevenueM / initialCapital;

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
    avgMonthlyPayment: financedUnits > 0 ? monthlyPayment / financedUnits : 0,
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

/**
 * Revenue Model Scenario Calculations
 * Comparing different APR and cash purchase strategies
 */

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

  // Calculate unit distribution
  const cashUnits = Math.round(totalUnits * cashPurchaseRate);
  const financedUnits = totalUnits - cashUnits;

  // Platform fees (on all sales)
  const platformFees = totalUnits * avgPropertyPrice * platformFeeRate;

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

  // Total revenue
  const totalRevenue = platformFees + mortgageInterest + appreciationShare;

  // Calculate IRR (simplified formula)
  const initialCapital = 2.75; // $2.75M initial capital
  const irr = (Math.pow(totalRevenue / initialCapital, 1 / termYears) - 1) * 100;
  const cashMultiple = totalRevenue / initialCapital;

  return {
    name,
    totalRevenue: totalRevenue / 1_000_000, // Convert to millions
    platformFees: platformFees / 1_000_000,
    mortgageInterest: mortgageInterest / 1_000_000,
    appreciationShare: appreciationShare / 1_000_000,
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
 * Generate tiered scenario
 */
export function getTieredScenario(): ScenarioResults {
  return calculateScenario(SCENARIO_PRESETS.tiered, "Tiered Model");
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

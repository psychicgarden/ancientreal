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
 * Calculate construction profit across 6 development flips
 */
function calculateConstructionProfit(totalUnits: number): number {
  const buildCost = 75000; // $75k per unit
  
  // Flip 1-2: 37 units at $135k
  const flip12Units = 37;
  const flip12Price = 135000;
  const flip12Profit = flip12Units * (flip12Price - buildCost);
  
  // Flip 3-4: 38 units at $142.5k
  const flip34Units = 38;
  const flip34Price = 142500;
  const flip34Profit = flip34Units * (flip34Price - buildCost);
  
  // Flip 5-6: 37 units at $150k
  const flip56Units = 37;
  const flip56Price = 150000;
  const flip56Profit = flip56Units * (flip56Price - buildCost);
  
  return flip12Profit + flip34Profit + flip56Profit;
}

/**
 * Calculate weighted average property price across all flips
 */
function getWeightedAvgPrice(): number {
  const flip12 = 37 * 135000;
  const flip34 = 38 * 142500;
  const flip56 = 37 * 150000;
  return (flip12 + flip34 + flip56) / 112;
}

/**
 * Calculate true IRR for mortgage-only model (no SAM)
 * Includes construction profit, platform fees, and mortgage interest
 */
function calculateMortgageOnlyIRR(
  initialInvestment: number,
  constructionProfitM: number,
  platformFeesM: number,
  mortgageInterestM: number,
  termYears: number
): number {
  const annualInterest = mortgageInterestM / termYears;
  
  // Build cash flow array with early construction profit
  // Years 0-2: Construction profit realized as units are completed (~$3.78M/year)
  const annualConstructionProfit = constructionProfitM / 3; // Spread over 3 years
  
  const cashFlows = [-initialInvestment + platformFeesM + annualConstructionProfit]; // Year 0
  cashFlows.push(annualInterest + annualConstructionProfit); // Year 1
  cashFlows.push(annualInterest + annualConstructionProfit); // Year 2
  
  // Years 3-termYears: Only mortgage interest
  for (let i = 3; i <= termYears; i++) {
    cashFlows.push(annualInterest);
  }
  
  // Newton-Raphson solver for IRR
  let rate = 0.20; // Initial guess: 20%
  const maxIterations = 100;
  const tolerance = 0.0001;
  
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let npv = 0;
    let dnpv = 0;
    
    for (let i = 0; i < cashFlows.length; i++) {
      const discountFactor = Math.pow(1 + rate, i);
      npv += cashFlows[i] / discountFactor;
      dnpv -= (i * cashFlows[i]) / Math.pow(1 + rate, i + 1);
    }
    
    if (Math.abs(npv) < tolerance) break;
    
    rate = rate - npv / dnpv;
  }
  
  return rate * 100;
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

  // Platform fees (only on financed units)
  const platformFees = financedUnits * avgPropertyPrice * platformFeeRate;

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
    platformFeeRate,
    termYears,
  } = inputs;

  // Calculate construction profit
  const constructionProfit = calculateConstructionProfit(totalUnits);

  // Use weighted average price across all flips
  const avgPropertyPrice = getWeightedAvgPrice();

  // Calculate unit distribution
  const cashUnits = Math.round(totalUnits * cashPurchaseRate);
  const financedUnits = totalUnits - cashUnits;

  // Platform fees (only on financed units)
  const platformFees = financedUnits * avgPropertyPrice * platformFeeRate;

  // Calculate mortgage interest revenue
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

  // Total revenue (includes construction profit)
  const totalRevenue = constructionProfit + platformFees + mortgageInterest;

  // Convert to millions
  const totalRevenueM = totalRevenue / 1_000_000;
  const constructionProfitM = constructionProfit / 1_000_000;
  const platformFeesM = platformFees / 1_000_000;
  const mortgageInterestM = mortgageInterest / 1_000_000;
  const appreciationShareM = 0;

  // Calculate IRR with construction profit timing
  const initialCapital = 3.0;
  const irr = calculateMortgageOnlyIRR(
    initialCapital,
    constructionProfitM,
    platformFeesM,
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
    avgMonthlyPayment: monthlyPayment / financedUnits,
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

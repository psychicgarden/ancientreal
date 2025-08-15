// Professional mortgage calculation utilities
import { fromBase } from './money';

export interface MortgageData {
  loanAmountBase: bigint;
  principalPaidBase: bigint;
  interestPaidBase: bigint;
  aprBps: number;
  termMonths: number;
  purchaseDate: string;
}

export interface MortgageMetrics {
  remainingBalance: number;
  paidBalance: number;
  totalInterestPaid: number;
  ownershipPercentage: number;
  monthsElapsed: number;
  remainingMonths: number;
  monthlyPayment: number;
  nextPaymentDue: Date;
  timeToPayoff: string;
  equityBuilt: number;
  loanToValueRatio: number;
}

export function calculateMortgageMetrics(
  mortgage: MortgageData,
  propertyValue: number
): MortgageMetrics {
  const loanAmount = fromBase(mortgage.loanAmountBase);
  const principalPaid = fromBase(mortgage.principalPaidBase);
  const interestPaid = fromBase(mortgage.interestPaidBase);
  
  const remainingBalance = Math.max(0, loanAmount - principalPaid);
  const paidBalance = principalPaid;
  
  // Calculate ownership percentage based on principal paid + down payment
  const downPayment = propertyValue - loanAmount;
  const totalEquity = downPayment + principalPaid;
  const ownershipPercentage = propertyValue > 0 ? (totalEquity / propertyValue) * 100 : 0;
  
  // Calculate time metrics
  const purchaseDate = new Date(mortgage.purchaseDate);
  const now = new Date();
  const monthsElapsed = Math.floor((now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
  const remainingMonths = Math.max(0, mortgage.termMonths - monthsElapsed);
  
  // Calculate monthly payment using proper amortization
  const monthlyRate = (mortgage.aprBps / 10000) / 12;
  const monthlyPayment = loanAmount > 0 && monthlyRate > 0
    ? loanAmount * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -mortgage.termMonths)))
    : loanAmount / mortgage.termMonths;
  
  // Next payment due date
  const nextPaymentDue = new Date(purchaseDate);
  nextPaymentDue.setMonth(nextPaymentDue.getMonth() + monthsElapsed + 1);
  
  // Time to payoff calculation
  const yearsRemaining = remainingMonths / 12;
  const timeToPayoff = yearsRemaining >= 1 
    ? `${Math.floor(yearsRemaining)}y ${Math.round((yearsRemaining % 1) * 12)}m`
    : `${remainingMonths}m`;
  
  // LTV ratio
  const loanToValueRatio = propertyValue > 0 ? (remainingBalance / propertyValue) * 100 : 0;
  
  return {
    remainingBalance,
    paidBalance,
    totalInterestPaid: interestPaid,
    ownershipPercentage,
    monthsElapsed,
    remainingMonths,
    monthlyPayment,
    nextPaymentDue,
    timeToPayoff,
    equityBuilt: totalEquity,
    loanToValueRatio
  };
}

export function calculatePortfolioMetrics(mortgages: (MortgageData & { propertyValue: number })[]) {
  const totals = mortgages.reduce(
    (acc, mortgage) => {
      const metrics = calculateMortgageMetrics(mortgage, mortgage.propertyValue);
      return {
        totalValue: acc.totalValue + mortgage.propertyValue,
        totalEquity: acc.totalEquity + metrics.equityBuilt,
        totalDebt: acc.totalDebt + metrics.remainingBalance,
        totalMonthlyPayment: acc.totalMonthlyPayment + metrics.monthlyPayment,
        totalInterestPaid: acc.totalInterestPaid + metrics.totalInterestPaid,
        totalPrincipalPaid: acc.totalPrincipalPaid + metrics.paidBalance
      };
    },
    {
      totalValue: 0,
      totalEquity: 0,
      totalDebt: 0,
      totalMonthlyPayment: 0,
      totalInterestPaid: 0,
      totalPrincipalPaid: 0
    }
  );

  const portfolioLTV = totals.totalValue > 0 ? (totals.totalDebt / totals.totalValue) * 100 : 0;
  const portfolioOwnership = totals.totalValue > 0 ? (totals.totalEquity / totals.totalValue) * 100 : 0;
  const averageTimeToPayoff = mortgages.length > 0 
    ? mortgages.reduce((sum, m) => {
        const metrics = calculateMortgageMetrics(m, m.propertyValue);
        return sum + metrics.remainingMonths;
      }, 0) / mortgages.length / 12
    : 0;

  return {
    ...totals,
    portfolioLTV,
    portfolioOwnership,
    averageTimeToPayoff: `${Math.floor(averageTimeToPayoff)}y ${Math.round((averageTimeToPayoff % 1) * 12)}m`,
    numberOfProperties: mortgages.length
  };
}

export function projectEquityGrowth(
  currentEquity: number,
  monthlyPayment: number,
  remainingMonths: number,
  appreciationRate: number = 0.03 // 3% annual appreciation
): { month: number; equity: number; appreciation: number }[] {
  const projections = [];
  const monthlyAppreciation = appreciationRate / 12;
  
  for (let month = 0; month <= Math.min(remainingMonths, 60); month += 6) {
    const principalPortion = monthlyPayment * 0.7; // Approximate principal portion
    const additionalEquity = principalPortion * month;
    const appreciation = currentEquity * Math.pow(1 + monthlyAppreciation, month);
    
    projections.push({
      month,
      equity: currentEquity + additionalEquity,
      appreciation: appreciation - currentEquity
    });
  }
  
  return projections;
}
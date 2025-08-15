// Centralized mortgage and investment calculation service
// Uses dollars for amounts (not base units). All calculations standardized.

export interface PropertyMortgageData {
  propertyValue: number;
  downPayment: number;
  aprBps: number;
  termMonths: number;
  monthlyRent: number;
  platformFeePercent?: number;
}

export interface InvestmentCalculation {
  monthlyPayment: number;
  monthlyProfit: number;
  totalLoanAmount: number;
  cashFlowYield: number;
  totalInterestCost: number;
  totalEquityAtMaturity: number;
}

export function computeMonthlyPaymentUSD(loanAmountUSD: number, aprBps: number | null | undefined, termMonths: number | null | undefined): number {
  const loan = Math.max(0, Number(loanAmountUSD || 0));
  const apr = Math.max(0, Number(aprBps ?? 0)) / 10000; // bps -> decimal
  const n = Math.max(1, Number(termMonths || 120));
  if (loan === 0) return 0;
  const r = apr / 12;
  if (r === 0) return +(loan / n).toFixed(2);
  const pmt = loan * (r / (1 - Math.pow(1 + r, -n)));
  return +pmt.toFixed(2);
}

// Helper function to calculate property appreciation
export function calculatePropertyAppreciation(
  propertyValue: number, 
  appreciationPercent: number = 181, 
  buyerShare: number = 0.5
) {
  const totalAppreciation = propertyValue * (appreciationPercent / 100);
  const finalPropertyValue = propertyValue + totalAppreciation;
  const buyerAppreciationShare = totalAppreciation * buyerShare;
  const buyerTotalEquity = propertyValue + buyerAppreciationShare; // Original value + buyer's share
  
  return {
    totalAppreciation,
    finalPropertyValue,
    buyerAppreciationShare,
    buyerTotalEquity,
    ancientShare: totalAppreciation * 0.4, // 40% to Ancient LLC
    lenderShare: totalAppreciation * 0.1    // 10% to lending pool
  };
}

export function calculateInvestmentMetrics(
  investmentAmount: number,
  propertyData: PropertyMortgageData
): InvestmentCalculation {
  const platformFee = investmentAmount * (propertyData.platformFeePercent || 0.03);
  const netInvestment = investmentAmount - platformFee;
  const loanAmount = Math.max(0, propertyData.propertyValue - netInvestment);
  
  const monthlyPayment = computeMonthlyPaymentUSD(loanAmount, propertyData.aprBps, propertyData.termMonths);
  const monthlyProfit = propertyData.monthlyRent - monthlyPayment;
  const cashFlowYield = investmentAmount > 0 ? (monthlyProfit * 12 / investmentAmount) * 100 : 0;
  
  // Calculate total interest cost over loan term
  const totalPayments = monthlyPayment * propertyData.termMonths;
  const totalInterestCost = totalPayments - loanAmount;
  
  // Calculate buyer's total equity at maturity using 181% appreciation model
  const appreciation = calculatePropertyAppreciation(propertyData.propertyValue);
  const totalEquityAtMaturity = appreciation.buyerTotalEquity;
  
  return {
    monthlyPayment,
    monthlyProfit,
    totalLoanAmount: loanAmount,
    cashFlowYield,
    totalInterestCost,
    totalEquityAtMaturity
  };
}

// Next payment due date occurs monthly on the same day-of-month as the purchase date.
export function computeNextDueDate(purchaseDateISO: string | Date): Date {
  const p = new Date(purchaseDateISO);
  if (isNaN(p.getTime())) return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const today = new Date();
  const due = new Date(today.getFullYear(), today.getMonth(), p.getDate());
  if (due.getTime() < new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) {
    // Move to next month
    return new Date(today.getFullYear(), today.getMonth() + 1, p.getDate());
  }
  return due;
}

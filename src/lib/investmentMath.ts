// investmentMath.ts
export type PropertyRow = {
  id: string;
  purchase_price: number;          // e.g. 150000
  down_payment?: number | null;    // citizenship cost; if null → 20% of price
  gross_rent_month: number;        // e.g. 2350
  utilities_month?: number | null; // default 65
  property_tax_annual_pct?: number | null; // default 0.0015 (≈0.15%)
  mortgage_month?: number | null;  // or derive from apr/term if provided
  mortgage_apr?: number | null;    // optional
  mortgage_term_years?: number | null; // optional
};

export type InvestmentMetrics = {
  price: number;
  down: number;
  taxMonthly: number;
  rentAfterBills: number;
  mortgage: number;
  monthlyNetwork: number;
  finalValue: number;
  equityYear10: number;
  rentalProfit10y: number;
  roiMultiple: number;
};

const APPREC_MULT_10Y = 2.81;   // 181% increase
const APPREC_CAP = 1.10;        // 110% of price (amount)
const BUYER_SHARE_CAP = 0.50;   // buyer repays 50% of cap base
const DEFAULT_UTIL = 65;
const DEFAULT_TAX_PCT = 0.0015;

function pmnt(principal: number, apr: number, years: number): number {
  const r = apr / 12;
  const n = years * 12;
  return principal * r / (1 - Math.pow(1 + r, -n));
}

export function computeMetrics(p: PropertyRow): InvestmentMetrics {
  const price = p.purchase_price;
  const down = p.down_payment ?? price * 0.20;

  const taxMonthly = ((p.property_tax_annual_pct ?? DEFAULT_TAX_PCT) * price) / 12;
  const utilities = p.utilities_month ?? DEFAULT_UTIL;

  const mortgage =
    p.mortgage_month ??
    (p.mortgage_apr && p.mortgage_term_years
      ? pmnt(price - down, p.mortgage_apr, p.mortgage_term_years)
      : pmnt(price - down, 0.08, 10)); // Default: 8% APR, 10 years

  const rentAfterBills = p.gross_rent_month - utilities - taxMonthly;
  const monthlyNetwork = rentAfterBills - mortgage;

  const finalValue = price * APPREC_MULT_10Y;
  const actualApp = finalValue - price;          // actual appreciation amount
  const capApp = price * APPREC_CAP;             // 110% of price (amount)
  const repayBase = Math.min(actualApp, capApp); // cap applied to the amount
  const buyerRepay = BUYER_SHARE_CAP * repayBase;

  const equityYear10 = finalValue - buyerRepay;  // mortgage is fully paid by Y10
  const rentalProfit10y = monthlyNetwork * 12 * 10;
  const roiMultiple = (equityYear10 + rentalProfit10y) / down;

  return {
    price,
    down,
    taxMonthly,
    rentAfterBills,
    mortgage,
    monthlyNetwork,
    finalValue,
    equityYear10,
    rentalProfit10y,
    roiMultiple,
  };
}

// Helper function to convert FractionalProperty to PropertyRow
export function fractionalPropertyToPropertyRow(prop: any): PropertyRow {
  return {
    id: prop.id,
    purchase_price: prop.current_speculation_price || prop.original_purchase_price,
    down_payment: prop.min_investment || null, // Use min investment as down payment if available
    gross_rent_month: prop.monthly_base_rent,
    utilities_month: prop.utilities_month || null,
    property_tax_annual_pct: prop.property_tax_annual_pct || null,
    mortgage_month: prop.mortgage_month || null,
    mortgage_apr: prop.mortgage_apr || null,
    mortgage_term_years: prop.mortgage_term_years || null,
  };
}
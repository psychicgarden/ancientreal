interface PropertyData {
  purchase_price: number;
  citizenship_cost: number;
  monthly_base_rent: number;
  mortgage_month?: number;
  utilities_month?: number;
  property_tax_annual_pct?: number;
  mortgage_apr?: number;
  mortgage_term_years?: number;
}

export interface ComputedMetrics {
  monthlyNetworkValue: number;
  equityYear10: number;
  roiMultiple: number;
  mortgage: number;
}

export function computeMetrics(p: PropertyData): ComputedMetrics {
  const price = p.purchase_price;
  const down = p.citizenship_cost;
  const mortgage = p.mortgage_month != null 
    ? p.mortgage_month 
    : PMT(price - down, p.mortgage_apr || 0.08, p.mortgage_term_years || 10);

  const utilities = p.utilities_month ?? 65;
  const propertyTaxMonthly = ((p.property_tax_annual_pct ?? 0.0015) * price) / 12;

  const rentAfterBills = p.monthly_base_rent - utilities - propertyTaxMonthly;
  const monthlyNetworkValue = rentAfterBills - mortgage;

  // Appreciation & equity with 110% cap logic
  const finalValue = price * 2.81; // 181% appreciation over 10 years
  const repayBase = Math.min(finalValue - price, price * 1.10);
  const buyerRepay = 0.50 * repayBase;
  const equityYear10 = finalValue - buyerRepay;

  const rental10 = monthlyNetworkValue * 12 * 10;
  const roiMultiple = (equityYear10 + rental10) / down;

  return {
    monthlyNetworkValue: round(monthlyNetworkValue),
    equityYear10: round(equityYear10),
    roiMultiple: round(roiMultiple, 1),
    mortgage: round(mortgage),
  };
}

function PMT(principal: number, apr: number, years: number): number {
  const monthlyRate = apr / 12;
  const payments = years * 12;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -payments));
}

function round(value: number, decimals: number = 0): number {
  return Number(value.toFixed(decimals));
}
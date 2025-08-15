interface PropertyData {
  price: number;
  downPayment: number;
  grossRent: number;
  mortgage: number;
  utilities?: number;
  taxPct?: number;
}

export interface ComputedMetrics {
  monthlyNetworkValue: number;
  equityYear10: number;
  roiMultiple: number;
  mortgage: number;
}

export function computeMetrics(p: PropertyData): ComputedMetrics {
  // Monthly profit is simply rent minus mortgage (utilities/taxes already included in rent)
  const monthlyNetworkValue = p.grossRent - p.mortgage;

  // 50% share of 181% appreciation, no cap
  const equityYear10 = p.price * 1.905;

  const rental10 = monthlyNetworkValue * 120;
  const roiMultiple = (equityYear10 + rental10) / p.downPayment;

  return {
    monthlyNetworkValue: round(monthlyNetworkValue),
    equityYear10: round(equityYear10),
    roiMultiple: round(roiMultiple, 1),
    mortgage: round(p.mortgage),
  };
}

function round(value: unknown, decimals: number = 0): number {
  return Number(((typeof value === 'number' ? value : Number(value) || 0)).toFixed(decimals));
}
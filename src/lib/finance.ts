// Finance utilities for simple amortization and due date calculations
// Uses dollars for amounts (not base units). Keep logic minimal and deterministic.

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

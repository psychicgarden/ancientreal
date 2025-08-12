export const toBase = (x: number) => BigInt(Math.round(x * 1_000_000)); // 1 USD -> 1_000_000 (USDC-6)

export const fromBase = (b: bigint | number | null | undefined) =>
  Number(b ?? 0) / 1_000_000;

export const fmtUSD = (b: bigint | number | null | undefined) =>
  fromBase(b).toLocaleString(undefined, { style: "currency", currency: "USD" });

// Helpers for mixed legacy/base rows
export const asUSD = (base: bigint | number | null | undefined, legacy?: number | null) =>
  base != null ? fmtUSD(base) : (legacy != null ? `$${legacy.toLocaleString()}` : "$0");

export const principalBase = (p: any) =>
  (p?.purchase_price_base ?? null) != null && (p?.down_payment_base ?? null) != null
    ? Number(p.purchase_price_base) - Number(p.down_payment_base)
    : null;
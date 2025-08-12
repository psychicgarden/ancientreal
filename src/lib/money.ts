export const toBase = (x: number) => BigInt(Math.round(x * 1_000_000)); // 1 USD -> 1_000_000
export const fromBase = (b: bigint | number | null | undefined) =>
  Number(b ?? 0) / 1_000_000;
export const fmtUSD = (b: bigint | number | null | undefined) =>
  fromBase(b).toLocaleString(undefined, { style: "currency", currency: "USD" });
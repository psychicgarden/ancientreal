// src/lib/money.ts
export const SCALE = 1_000_000n; // USDC-6

export const toBase = (x: number) =>
  BigInt(Math.round(x * 1_000_000));     // 150000 -> 150000000000n

export const fromBase = (b: bigint | number | null) =>
  Number(b ?? 0) / 1_000_000;            // 150000000000 -> 150000

export const fmtUSD = (b: bigint | number | null) =>
  fromBase(b).toLocaleString(undefined, { style: 'currency', currency: 'USD' });
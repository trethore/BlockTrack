import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: price < 1 ? 8 : 2,
  }).format(price);
}
// TODO: refractor this duplicated code
export function formatMarketCap(cap: number | null | undefined): string {
  if (cap === null || cap === undefined) return 'N/A';
  if (cap >= 1_000_000_000_000) {
    return `$${(cap / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (cap >= 1_000_000_000) {
    return `$${(cap / 1_000_000_000).toFixed(2)}B`;
  }
  if (cap >= 1_000_000) {
    return `$${(cap / 1_000_000).toFixed(2)}M`;
  }
  if (cap >= 1_000) {
    return `$${(cap / 1_000).toFixed(2)}K`;
  }
  return `$${cap.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatPercentage(value: number | null | undefined, addPlusSign = true): string {
  if (value === null || value === undefined) return 'N/A';
  const formatted = `${value.toFixed(2)}%`;
  return addPlusSign && value > 0 ? `+${formatted}` : formatted;
}

export function parseBigInt(value: string | number | null | undefined): bigint | null {
  if (value === null || value === undefined) return null;
  try {
    return BigInt(String(value).split('.')[0]);
  } catch (e) {
    console.warn(`Could not parse BigInt from value: ${value}`);
    return null;
  }
}

export function formatSupplyDetailed(supply: bigint | null | undefined): string {
  if (supply === null || supply === undefined) return 'N/A';
  return supply.toLocaleString();
}


export function formatSupply(supply: bigint | null | undefined): string {
  if (supply === null || supply === undefined) return 'N/A';

  const num = Number(supply);

  if (num >= 1_000_000_000_000) {
    return (num / 1_000_000_000_000).toLocaleString(undefined, { maximumFractionDigits: 2 }) + 'T';
  }
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toLocaleString(undefined, { maximumFractionDigits: 2 }) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 2 }) + 'M';
  }
  if (num >= 10_000) {
    return (num / 1_000).toLocaleString(undefined, { maximumFractionDigits: 1 }) + 'K';
  }
  return formatSupplyDetailed(supply);
}

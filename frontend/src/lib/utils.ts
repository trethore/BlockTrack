import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { TokenLeaderboardData, SortConfig } from '../types/token.js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function formatLargeNumber(num: number | null | undefined, unitPrefix: string = '', unitSuffix: string = ''): string {
  if (num === null || num === undefined) return 'N/A';

  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum >= 1_000_000_000_000) {
    return `${sign}${unitPrefix}${(absNum / 1_000_000_000_000).toFixed(2)}T${unitSuffix}`;
  }
  if (absNum >= 1_000_000_000) {
    return `${sign}${unitPrefix}${(absNum / 1_000_000_000).toFixed(2)}B${unitSuffix}`;
  }
  if (absNum >= 1_000_000) {
    return `${sign}${unitPrefix}${(absNum / 1_000_000).toFixed(2)}M${unitSuffix}`;
  }
  if (absNum >= 1_000) {
    const precision = unitPrefix === '$' ? 2 : 1;
    return `${sign}${unitPrefix}${(absNum / 1_000).toFixed(precision)}K${unitSuffix}`;
  }
  return `${sign}${unitPrefix}${num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}${unitSuffix}`;
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

export function formatMarketCap(cap: number | null | undefined): string {
  return formatLargeNumber(cap, '$');
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

export function formatSupply(supply: bigint | null | undefined, symbol?: string): string {
  if (supply === null || supply === undefined) return 'N/A';
  const num = Number(supply);
  return formatLargeNumber(num, '', symbol ? ` ${symbol}` : '');
}

export function sortTokens(
  tokens: TokenLeaderboardData[],
  sortConfig: SortConfig
): TokenLeaderboardData[] {
  const sorted = [...tokens];
  sorted.sort((a, b) => {
    let valA_raw = a[sortConfig.key as keyof TokenLeaderboardData];
    let valB_raw = b[sortConfig.key as keyof TokenLeaderboardData];

    const valA = typeof valA_raw === 'string' && /^\d+n?$/.test(valA_raw) ? Number(BigInt(valA_raw.replace('n', ''))) : (typeof valA_raw === 'bigint' ? Number(valA_raw) : valA_raw);
    const valB = typeof valB_raw === 'string' && /^\d+n?$/.test(valB_raw) ? Number(BigInt(valB_raw.replace('n', ''))) : (typeof valB_raw === 'bigint' ? Number(valB_raw) : valB_raw);

    const aIsNull = valA === null || valA === undefined;
    const bIsNull = valB === null || valB === undefined;

    if (aIsNull && bIsNull) return 0;
    if (aIsNull) return 1;
    if (bIsNull) return -1;

    let comparison = 0;
    if (typeof valA === 'number' && typeof valB === 'number') {
      comparison = valA - valB;
    } else if (typeof valA === 'string' && typeof valB === 'string') {
      comparison = valA.localeCompare(valB, undefined, { sensitivity: 'base' });
    }

    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });
  return sorted;
}

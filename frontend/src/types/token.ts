export interface TokenLeaderboardData {
    id: string;
    rank: number;
    name: string;
    symbol: string;
    priceUSD: number;
    marketCapUsd: number | null;
    marketCapChange24h: number | null;
    circulatingSupply: bigint | null; // Prisma returns BigInt as string/number, handle appropriately
    totalSupply: bigint | null;       // Prisma returns BigInt as string/number
    maxSupply: bigint | null;         // Prisma returns BigInt as string/number
    percentChange1h: number | null;
    percentChange24h: number | null;
    percentChange7d: number | null;
    percentChange30d: number | null;
    percentChange1y: number | null;
}

export type TimePeriod = '1h' | '24h' | '7d' | '30d' | '1y';
export const TIME_PERIODS: TimePeriod[] = ['1h', '24h', '7d', '30d', '1y'];
export const DEFAULT_TIME_PERIOD: TimePeriod = '7d';

export type SortableTokenKey = 'rank' | 'name' | 'priceUSD' | 'marketCapUsd' | `percentChange${TimePeriod}`;
export const SORTABLE_KEYS: { value: SortableTokenKey; label: string }[] = [
    { value: 'marketCapUsd', label: 'Market Cap' },
    { value: 'rank', label: 'Rank' },
    { value: 'name', label: 'Name' },
    { value: 'priceUSD', label: 'Price' },
    { value: 'percentChange1h', label: '% 1h' },
    { value: 'percentChange24h', label: '% 24h' },
    { value: 'percentChange7d', label: '% 7d' },
    { value: 'percentChange30d', label: '% 30d' },
    { value: 'percentChange1y', label: '% 1y' },
];
export const DEFAULT_SORT_KEY: SortableTokenKey = 'marketCapUsd';

export type SortDirection = 'asc' | 'desc';
export const DEFAULT_SORT_DIRECTION: SortDirection = 'asc'; // Market cap typically desc, rank asc. For leaderboard, default to rank asc.

export interface SortConfig {
    key: SortableTokenKey;
    direction: SortDirection;
}
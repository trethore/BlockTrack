export type TokenLeaderboardData = {
    id: string;
    rank: number | null;
    name: string;
    symbol: string;
    priceUSD: number | null;
    marketCapUsd: number | null;
    circulatingSupply: bigint | null;
    totalSupply: bigint | null;
    maxSupply: bigint | null;
    percentChange1h: number | null;
    percentChange24h: number | null;
    percentChange7d: number | null;
    percentChange30d: number | null;
    percentChange1y: number | null;
    marketCapChange24h: number | null;
};

export type TimePeriod = '1h' | '24h' | '7d' | '30d' | '1y';

export type SortDirection = 'asc' | 'desc';

export type SortableTokenKey =
    | 'name'
    | 'symbol'
    | 'priceUSD'
    | 'marketCapUsd'
    | 'percentChange1h'
    | 'percentChange24h'
    | 'percentChange7d'
    | 'percentChange30d'
    | 'percentChange1y';

export type SortConfig = { key: SortableTokenKey; direction: SortDirection };

export const DEFAULT_TIME_PERIOD: TimePeriod = '24h';
export const DEFAULT_SORT_KEY: SortableTokenKey = 'marketCapUsd';
export const DEFAULT_SORT_DIRECTION: SortDirection = 'desc';
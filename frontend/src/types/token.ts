export interface TokenLeaderboardData {
    id: string;
    rank: number | null;
    name: string;
    symbol: string;
    priceUSD: number;
    marketCapUsd: number | null;
    circulatingSupply: bigint | null;
    totalSupply: bigint | null;
    volume24hUSD: number;
    maxSupply: number | null;
    percentChange1h: number | null;
    percentChange24h: number | null;
    percentChange7d: number | null;
    percentChange30d: number | null;
    percentChange1y: number | null;
    marketCapChange24h: number | null;
    lastUpdated: string | null;
    isFavorite?: boolean;
}

export interface SortConfig {
    key: SortableTokenKey;
    direction: SortDirection;
}
export interface RawDataPoint {
    date: string;
    priceUSD: number;
}

export interface ChartDataPoint {
    date: number;
    price: number;
}


export interface TokenDetailsData extends Omit<TokenLeaderboardData, 'priceChange24h' | 'volume24hUSD'> {
    description: string | null;
    websiteUrl: string | null;
    dataPoints: RawDataPoint[];
}


export type SortDirection = 'asc' | 'desc';
export type SortableTokenKey = keyof Omit<TokenLeaderboardData, 'id' | 'symbol' | 'isFavorite'>;
export type ChartTimeframe = '1h' | '1d' | '7d' | '30d' | '1y';
export const CHART_TIMEFRAMES: ChartTimeframe[] = ['1h', '1d', '7d', '30d', '1y'];
export const DEFAULT_CHART_TIMEFRAME: ChartTimeframe = '7d';

export const DEFAULT_SORT_DIRECTION: SortDirection = 'desc';

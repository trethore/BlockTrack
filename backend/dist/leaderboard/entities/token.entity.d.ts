export declare class TokenEntity {
    id: string;
    symbol: string;
    name: string;
    rank: number;
    priceUSD: number;
    marketCapUsd?: number | null;
    volume24hUsd?: number | null;
    circulatingSupply?: bigint | null;
    totalSupply?: bigint | null;
    maxSupply?: bigint | null;
    percentChange1h?: number | null;
    percentChange24h?: number | null;
    percentChange7d?: number | null;
    percentChange30d?: number | null;
    percentChange1y?: number | null;
    marketCapChange24h?: number | null;
    lastUpdated?: Date | null;
}

import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
interface CoinGeckoMarketData {
    id: string; symbol: string; name: string; image: string; current_price: number; market_cap: number | null; market_cap_rank: number | null; fully_diluted_valuation: number | null; total_volume: number | null; high_24h: number | null; low_24h: number | null; price_change_24h: number | null; price_change_percentage_24h: number | null; market_cap_change_24h: number | null; market_cap_change_percentage_24h: number | null; circulating_supply: number | null; total_supply: number | null; max_supply: number | null; ath: number | null; ath_change_percentage: number | null; ath_date: string | null; atl: number | null; atl_change_percentage: number | null; atl_date: string | null; roi: any | null; last_updated: string | null; price_change_percentage_1h_in_currency?: number | null; price_change_percentage_7d_in_currency?: number | null; price_change_percentage_30d_in_currency?: number | null; price_change_percentage_1y_in_currency?: number | null;
}

export interface MappedTokenData {
    id: string;
    symbol: string; name: string; rank: number; priceUSD: number; marketCapUsd?: number | null; volume24hUsd?: number | null; circulatingSupply?: bigint | null; totalSupply?: bigint | null; maxSupply?: bigint | null; percentChange1h?: number | null; percentChange24h?: number | null; percentChange7d?: number | null; percentChange30d?: number | null; percentChange1y?: number | null; marketCapChange24h?: number | null; lastUpdated?: Date | null;
}

interface CoinGeckoChartData {
    prices: [number, number][];
}

export interface MappedDataPoint {
    date: Date;
    priceUSD: number;
}

@Injectable()
export class TokenDataService {
    private readonly logger = new Logger(TokenDataService.name);
    private readonly coinGeckoApiBase = 'https://api.coingecko.com/api/v3';

    constructor(
        private readonly httpService: HttpService,
    ) { }

    async fetchAndMapTokenData(): Promise<MappedTokenData[]> {
        this.logger.log(`Fetching token data from CoinGecko...`);
        try {
            const marketsUrl = `${this.coinGeckoApiBase}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&price_change_percentage=1h,24h,7d,30d,1y`;
            const response = await firstValueFrom(
                this.httpService.get<CoinGeckoMarketData[]>(marketsUrl, {
                    headers: { 'Accept': 'application/json' }
                })
            );

            if (!response || response.status !== 200 || !Array.isArray(response.data)) {
                this.logger.error(`Failed fetching from CoinGecko. Status: ${response?.status}`);
                throw new Error('Invalid data from CoinGecko API.');
            }

            this.logger.log(`Fetched ${response.data.length} tokens. Mapping...`);
            return this.mapData(response.data);

        } catch (error) {
            this.logger.error('Error fetching/processing CoinGecko data:', error?.response?.data || error?.message || error);
            throw new Error('Failed to fetch/process token data from API.');
        }
    }

    private mapData(apiData: CoinGeckoMarketData[]): MappedTokenData[] {
        return apiData
            .filter(token => token.id && token.symbol && token.name && token.market_cap_rank != null && token.current_price != null)
            .map(token => ({
                id: token.id,
                symbol: token.symbol.toUpperCase(),
                name: token.name,
                rank: token.market_cap_rank!,
                priceUSD: token.current_price!,
                marketCapUsd: token.market_cap ?? null,
                volume24hUsd: token.total_volume ?? null,
                circulatingSupply: token.circulating_supply != null ? BigInt(Math.round(token.circulating_supply)) : null,
                totalSupply: token.total_supply != null ? BigInt(Math.round(token.total_supply)) : null,
                maxSupply: token.max_supply != null ? BigInt(Math.round(token.max_supply)) : null,
                percentChange1h: token.price_change_percentage_1h_in_currency ?? null,
                percentChange24h: token.price_change_percentage_24h ?? null,
                percentChange7d: token.price_change_percentage_7d_in_currency ?? null,
                percentChange30d: token.price_change_percentage_30d_in_currency ?? null,
                percentChange1y: token.price_change_percentage_1y_in_currency ?? null,
                marketCapChange24h: token.market_cap_change_24h ?? null,
                lastUpdated: token.last_updated ? new Date(token.last_updated) : null,
            }));
    }

    async fetchHistoricalData(
        coinGeckoId: string,
        days: number,
    ): Promise<MappedDataPoint[]> {
        const url = `${this.coinGeckoApiBase}/coins/${coinGeckoId}/market_chart?vs_currency=usd&days=${days}`;
        this.logger.log(`Fetching historical data for ${coinGeckoId}, ${days} days from ${url}`);

        try {
            const response = await firstValueFrom(
                this.httpService.get<CoinGeckoChartData>(url, {
                    headers: { 'Accept': 'application/json' }
                })
            );

            if (response?.status !== 200 || !Array.isArray(response?.data?.prices)) {
                this.logger.error(`Failed fetching historical data for ${coinGeckoId}. Status: ${response?.status}, Data: ${JSON.stringify(response?.data)}`);
                throw new Error(`Invalid historical data from CoinGecko API for ${coinGeckoId}.`);
            }

            if (response.data.prices.length === 0) {
                this.logger.warn(`Received empty prices array for ${coinGeckoId}, ${days} days.`);
                return [];
            }

            this.logger.log(`Fetched ${response.data.prices.length} historical points for ${coinGeckoId}.`);

            return response.data.prices.map(([timestamp, price]) => {
                if (timestamp == null || price == null) {
                    this.logger.warn(`Skipping invalid data point: [${timestamp}, ${price}] for ${coinGeckoId}`);
                    return null;
                }
                return {
                    date: new Date(timestamp),
                    priceUSD: price,
                };
            }).filter((p): p is MappedDataPoint => p !== null);

        } catch (error) {
            const errorMessage = error?.response?.data || error?.message || error;
            this.logger.error(`Error fetching/processing CoinGecko historical data for ${coinGeckoId}:`, errorMessage);
            return [];
        }
    }
}
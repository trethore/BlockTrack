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

    private async fetchSingleRangeHistoricalData(
        coinGeckoId: string,
        days: number,
        interval?: string, // Optionnel, pour information dans les logs
    ): Promise<MappedDataPoint[]> {
        const vs_currency = 'usd';
        // L'API CoinGecko ajuste l'intervalle automatiquement basé sur 'days'.
        // Le paramètre 'interval' ici est surtout pour la clarté des logs.
        const url = `${this.coinGeckoApiBase}/coins/${coinGeckoId}/market_chart?vs_currency=${vs_currency}&days=${days}`;

        this.logger.log(`Fetching historical data for ${coinGeckoId}: ${days} days (expected interval: ${interval || 'auto'}) from ${url}`);

        try {
            const response = await firstValueFrom(
                this.httpService.get<CoinGeckoChartData>(url, {
                    headers: { 'Accept': 'application/json' }
                })
            );

            if (response?.status !== 200 || !Array.isArray(response?.data?.prices)) {
                this.logger.error(`Failed fetching historical data for ${coinGeckoId} (${days} days). Status: ${response?.status}, Data: ${JSON.stringify(response?.data)}`);
                return []; // Retourner un tableau vide en cas d'erreur pour ne pas bloquer les autres appels
            }

            if (response.data.prices.length === 0) {
                this.logger.warn(`Received empty prices array for ${coinGeckoId}, ${days} days.`);
                return [];
            }

            this.logger.log(`Fetched ${response.data.prices.length} historical points for ${coinGeckoId} (${days} days).`);

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
            this.logger.error(`Error fetching/processing CoinGecko historical data for ${coinGeckoId} (${days} days):`, errorMessage);
            return []; // Important: retourner un tableau vide pour permettre aux autres promesses de se résoudre
        }
    }

    async fetchComprehensiveHistoricalData(coinGeckoId: string): Promise<MappedDataPoint[]> {
        this.logger.log(`Fetching comprehensive historical data for ${coinGeckoId}`);

        // Définir les plages de jours pour les différentes granularités
        // CoinGecko: 1 jour = 5min, 2-90 jours = horaire, >90 jours = journalier
        const ranges = [
            { days: 1, intervalLabel: '5-minutely' }, // Pour les dernières 24h
            { days: 90, intervalLabel: 'hourly' },    // Pour les 90 derniers jours (inclut les 24h précédentes)
            { days: 365, intervalLabel: 'daily' },   // Pour la dernière année (inclut les 90j précédents)
        ];

        const promises = ranges.map(range =>
            this.fetchSingleRangeHistoricalData(coinGeckoId, range.days, range.intervalLabel)
        );

        const results = await Promise.all(promises);
        const [data1Day, data90Days, data365Days] = results;

        this.logger.log(`Fetched granularities: 1-day (${data1Day.length}), 90-days (${data90Days.length}), 365-days (${data365Days.length}) for ${coinGeckoId}`);

        // Fusionner et dédoublonner les points de données, en privilégiant la granularité la plus fine.
        // Une Map est utilisée pour s'assurer que chaque timestamp est unique.
        // L'ordre d'insertion est important: les données les plus granulaires (1 jour) sont ajoutées en premier.
        const mergedDataPointsMap = new Map<number, MappedDataPoint>();

        const addPointsToMap = (points: MappedDataPoint[]) => {
            for (const point of points) {
                const timestamp = point.date.getTime();
                // Si le timestamp n'existe pas encore, ou pour donner priorité aux données plus récentes/granulaires
                // (si on s'attend à ce que CoinGecko puisse renvoyer des points légèrement différents pour le même timestamp à différentes granularités,
                // la stratégie actuelle "premier arrivé, premier servi" pour une granularité donnée est OK si on ajoute les plus fins d'abord)
                if (!mergedDataPointsMap.has(timestamp)) {
                    mergedDataPointsMap.set(timestamp, point);
                }
            }
        };

        // Ordre de priorité pour la fusion : 5-min, puis horaire, puis quotidien
        // Les données de 'data1Day' sont les plus précises pour le dernier jour
        addPointsToMap(data1Day);
        // Ensuite, ajoutez les points horaires des 90 derniers jours qui ne sont pas déjà couverts par les données 5-min
        addPointsToMap(data90Days);
        // Enfin, ajoutez les points quotidiens de la dernière année qui ne sont pas déjà couverts
        addPointsToMap(data365Days);


        const finalDataPoints = Array.from(mergedDataPointsMap.values());

        // Trier par date au cas où l'ordre aurait été perdu
        finalDataPoints.sort((a, b) => a.date.getTime() - b.date.getTime());

        this.logger.log(`Merged and de-duplicated data for ${coinGeckoId}. Total points: ${finalDataPoints.length}`);
        return finalDataPoints;
    }
}
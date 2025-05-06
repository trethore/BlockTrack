import { AppConfig } from '../../config/app-config';
import { Injectable, Inject, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ITokenRepository } from '../domain/ports/token.repository.interface';
import { IDataPointRepository, CreateDataPointInput } from '../domain/ports/datapoint.repository.interface';
import { TokenDataService } from '../domain/services/token-data.service';
import { Token } from '@generated/prisma';
import { ITokenUpdateLogRepository } from '../domain/ports/token-update-log.repository.interface';

interface GetTokenQuery {
  id?: string;
  symbol?: string;
}

@Injectable()
export class GetTokenUseCase {
  private readonly logger = new Logger(GetTokenUseCase.name);

  constructor(
    @Inject(ITokenRepository) private readonly tokenRepository: ITokenRepository,
    @Inject(IDataPointRepository) private readonly dataPointRepository: IDataPointRepository,
    private readonly tokenDataService: TokenDataService,
    @Inject(ITokenUpdateLogRepository)
    private readonly tokenUpdateLogRepository: ITokenUpdateLogRepository,
    private readonly configService: ConfigService, // +++
  ) { }

  private get DATA_POINTS_REFRESH_INTERVAL_MS(): number { // +++
    return this.configService.get<AppConfig>('app')?.refreshIntervals?.dataPoints ?? 1 * 60 * 60 * 1000;
  }

  private get ALL_TOKENS_REFRESH_INTERVAL_MS(): number { // +++
    return this.configService.get<AppConfig>('app')?.refreshIntervals?.allTokens ?? 1 * 60 * 60 * 1000;
  }

  async execute(query: GetTokenQuery): Promise<Token> {
    this.logger.log(`Executing GetTokenUseCase for query: ${JSON.stringify(query)}`);

    await this._refreshAllTokenDataIfNeeded();
    this.logger.log('Global token data refresh check complete.');

    let token: Token | null = null;

    if (query.id && query.symbol) {
      throw new BadRequestException('Provide either id or symbol, not both.');
    }

    if (query.id) {
      token = await this.tokenRepository.findById(query.id);
    } else if (query.symbol) {
      token = await this.tokenRepository.findBySymbol(query.symbol.toUpperCase());
    } else {
      throw new BadRequestException('Provide either id or symbol.');
    }

    if (!token) {
      const errorMessage = `Token with ${query.id ? `id '${query.id}'` : `symbol '${query.symbol}'`} not found.`;
      this.logger.warn(errorMessage + " (This might occur if the token was delisted or ID/Symbol is incorrect, even after global refresh attempt)");
      throw new NotFoundException(errorMessage);
    }

    await this.refreshDataPointsIfNeeded(token);

    const potentiallyUpdatedToken = await this.tokenRepository.findById(token.id);
    if (!potentiallyUpdatedToken) {
      this.logger.error(`Token ${token.id} disappeared after data point refresh attempt.`);
      throw new NotFoundException(`Token with id ${token.id} could not be retrieved after its data point update.`);
    }
    this.logger.log(`GetTokenUseCase finished successfully for ${potentiallyUpdatedToken.symbol}.`);
    return potentiallyUpdatedToken;
  }

  private async _refreshAllTokenDataIfNeeded(): Promise<void> {
    const log = await this.tokenUpdateLogRepository.getLog();
    const now = new Date();
    const lastRefreshedAt = log?.lastRefreshedAt;
    let shouldRefresh = true;
    const allTokensRefreshInterval = this.ALL_TOKENS_REFRESH_INTERVAL_MS;

    if (lastRefreshedAt) {
      const timeSinceLastRefresh = now.getTime() - lastRefreshedAt.getTime();
      shouldRefresh = timeSinceLastRefresh > allTokensRefreshInterval;
      this.logger.log(
        `[GetTokenUseCase - GlobalRefresh] Last token list refresh check: ${lastRefreshedAt.toISOString()}. Time since: ${Math.round(
          timeSinceLastRefresh / 1000,
        )}s. Interval: ${allTokensRefreshInterval / 1000}s. Refresh needed: ${shouldRefresh}`,
      );
    } else {
      this.logger.log('[GetTokenUseCase - GlobalRefresh] No token list refresh log found. Refresh needed.');
    }

    if (shouldRefresh) {
      this.logger.log('[GetTokenUseCase - GlobalRefresh] Starting global token data refresh process...');
      try {
        const mappedData = await this.tokenDataService.fetchAndMapTokenData();
        this.logger.log(`[GetTokenUseCase - GlobalRefresh] Fetched and mapped ${mappedData.length} tokens from API.`);

        if (mappedData.length > 0) {
          const upsertedCount = await this.tokenRepository.bulkUpsertTokens(mappedData);
          this.logger.log(`[GetTokenUseCase - GlobalRefresh] Bulk upsert completed. ${upsertedCount} records affected.`);
        } else {
          this.logger.warn('[GetTokenUseCase - GlobalRefresh] No valid token data received from API to upsert.');
        }

        await this.tokenUpdateLogRepository.updateLog(now);
        this.logger.log('[GetTokenUseCase - GlobalRefresh] Token list refresh log updated.');
        this.logger.log('[GetTokenUseCase - GlobalRefresh] Global token data refresh process finished successfully.');
      } catch (error) {
        this.logger.error('[GetTokenUseCase - GlobalRefresh] Failed during global token data refresh process:', error);
      }
    } else {
      this.logger.log('[GetTokenUseCase - GlobalRefresh] Global token data is recent enough. Skipping refresh.');
    }
  }

  private async refreshDataPointsIfNeeded(token: Token): Promise<void> {
    const now = new Date();
    const lastRefreshedAt = token.lastDataPointsUpdate;
    const dataPointsRefreshInterval = this.DATA_POINTS_REFRESH_INTERVAL_MS;
    let shouldRefresh = !lastRefreshedAt || (now.getTime() - lastRefreshedAt.getTime()) > dataPointsRefreshInterval;

    this.logger.log(
      `[GetTokenUseCase - DataPointsRefresh] Token ${token.symbol}: Last DP refresh check: ${lastRefreshedAt?.toISOString() ?? 'Never'
      }. Interval: ${dataPointsRefreshInterval / 1000}s. Refresh needed: ${shouldRefresh}`,
    );

    if (shouldRefresh) {
      this.logger.log(`[GetTokenUseCase - DataPointsRefresh] Token ${token.symbol}: Starting data points refresh process...`);
      try {
        const coinGeckoId = token.id;
        if (!coinGeckoId) {
          this.logger.warn(`[GetTokenUseCase - DataPointsRefresh] Token ${token.symbol}: CoinGecko ID (token.id) is missing. Skipping DP refresh.`);
          return;
        }

        const deletedCount = await this.dataPointRepository.deleteAllDataPointsByTokenId(token.id);
        this.logger.log(`[GetTokenUseCase - DataPointsRefresh] Token ${token.symbol}: Deleted ${deletedCount} old data points.`);
        this.logger.log(`[GetTokenUseCase - DataPointsRefresh] Token ${token.symbol}: Fetching 365-day data for CoinGecko ID '${coinGeckoId}'...`);
        const mappedPoints = await this.tokenDataService.fetchHistoricalData(coinGeckoId, 365);

        if (mappedPoints.length > 0) {
          const newDataPoints: CreateDataPointInput[] = mappedPoints.map(point => ({
            tokenId: token.id,
            date: point.date,
            priceUSD: point.priceUSD,
          }));

          const createdCount = await this.dataPointRepository.bulkCreate(newDataPoints);
          this.logger.log(`[GetTokenUseCase - DataPointsRefresh] Token ${token.symbol}: Bulk insert completed. ${createdCount} new data points created.`);
        } else {
          this.logger.warn(`[GetTokenUseCase - DataPointsRefresh] Token ${token.symbol}: No new data points fetched or prepared for insertion.`);
        }
        await this.tokenRepository.update(token.id, { lastDataPointsUpdate: now });

        this.logger.log(`[GetTokenUseCase - DataPointsRefresh] Token ${token.symbol}: Data points refresh process finished successfully.`);
      } catch (error) {
        this.logger.error(`[GetTokenUseCase - DataPointsRefresh] Token ${token.symbol}: Failed during data points refresh process:`, error);
      }
    } else {
      this.logger.log(`[GetTokenUseCase - DataPointsRefresh] Token ${token.symbol}: Data points are recent enough. Skipping refresh.`);
    }
  }
}

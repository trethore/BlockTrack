import { Injectable, Inject, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { ITokenRepository } from '../domain/ports/token.repository.interface';
import { IDataPointRepository, CreateDataPointInput } from '../domain/ports/datapoint.repository.interface';
import { TokenDataService } from '../domain/services/token-data.service';
import { Token } from '@generated/prisma';

interface GetTokenQuery {
  id?: string;
  symbol?: string;
}

@Injectable()
export class GetTokenUseCase {
  private readonly logger = new Logger(GetTokenUseCase.name);
  private readonly DATA_REFRESH_INTERVAL_MS = 1 * 60 * 60 * 1000;

  constructor(
    @Inject(ITokenRepository) private readonly tokenRepository: ITokenRepository,
    @Inject(IDataPointRepository) private readonly dataPointRepository: IDataPointRepository,
    private readonly tokenDataService: TokenDataService,
  ) { }

  async execute(query: GetTokenQuery): Promise<Token> {
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
      throw new NotFoundException(`Token with ${query.id ? `id ${query.id}` : `symbol ${query.symbol}`} not found.`);
    }

    await this.refreshDataPointsIfNeeded(token);

    const potentiallyUpdatedToken = await this.tokenRepository.findById(token.id);
    if (!potentiallyUpdatedToken) {
      this.logger.error(`Token ${token.id} disappeared after data point refresh attempt.`);
      throw new NotFoundException(`Token with id ${token.id} could not be retrieved after update.`);
    }
    return potentiallyUpdatedToken;
  }

  private async refreshDataPointsIfNeeded(token: Token): Promise<void> {
    const now = new Date();
    const lastRefreshedAt = token.lastDataPointsUpdate;
    let shouldRefresh = !lastRefreshedAt || (now.getTime() - lastRefreshedAt.getTime()) > this.DATA_REFRESH_INTERVAL_MS;

    this.logger.log(`Token ${token.symbol}: Last DP refresh check: ${lastRefreshedAt?.toISOString() ?? 'Never'}. Refresh needed: ${shouldRefresh}`);

    if (shouldRefresh) {
      this.logger.log(`Token ${token.symbol}: Starting data points refresh process...`);
      try {
        const coinGeckoId = token.name.toLowerCase().replace(/ /g, '-');
        if (!coinGeckoId) {
          this.logger.warn(`Token ${token.symbol}: Cannot determine CoinGecko ID. Skipping DP refresh.`);
          return;
        }

        const deletedCount = await this.dataPointRepository.deleteAllDataPointsByTokenId(token.id);
        this.logger.log(`Token ${token.symbol}: Deleted ${deletedCount} old data points.`);
        this.logger.log(`Token ${token.symbol}: Fetching 365-day data...`);
        const mappedPoints = await this.tokenDataService.fetchHistoricalData(coinGeckoId, 365);
        if (mappedPoints.length > 0) {
          const newDataPoints: CreateDataPointInput[] = mappedPoints.map(point => ({
            tokenId: token.id,
            date: point.date,
            priceUSD: point.priceUSD,
          }));

          const createdCount = await this.dataPointRepository.bulkCreate(newDataPoints);
          this.logger.log(`Token ${token.symbol}: Bulk insert completed. ${createdCount} new records created.`);
        } else {
          this.logger.warn(`Token ${token.symbol}: No new data points fetched or prepared for insertion.`);
        }
        await this.tokenRepository.update(token.id, { lastDataPointsUpdate: now });

        this.logger.log(`Token ${token.symbol}: Data points refresh process finished successfully.`);

      } catch (error) {
        this.logger.error(`Token ${token.symbol}: Failed during data points refresh process:`, error);
      }
    } else {
      this.logger.log(`Token ${token.symbol}: Data points are recent enough. Skipping refresh.`);
    }
  }
}

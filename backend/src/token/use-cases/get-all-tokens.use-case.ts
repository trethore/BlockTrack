import { AppConfig } from '../../config/app-config';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ITokenRepository } from '../domain/ports/token.repository.interface';
import { ITokenUpdateLogRepository } from '../domain/ports/token-update-log.repository.interface';
import { TokenDataService } from '../domain/services/token-data.service';
import { Token } from '@generated/prisma';

@Injectable()
export class GetAllTokensUseCase {
  private readonly logger = new Logger(GetAllTokensUseCase.name);

  constructor(
    @Inject(ITokenRepository)
    private readonly tokenRepository: ITokenRepository,
    @Inject(ITokenUpdateLogRepository)
    private readonly tokenUpdateLogRepository: ITokenUpdateLogRepository,
    @Inject(TokenDataService)
    private readonly tokenDataService: TokenDataService,
    private readonly configService: ConfigService, // +++
  ) { }

  private get REFRESH_INTERVAL_MS(): number { // +++
    return this.configService.get<AppConfig>('app')?.refreshIntervals?.allTokens ?? 1 * 60 * 60 * 1000;
  }

  async execute(): Promise<Token[]> {
    this.logger.log('Executing GetAllTokensUseCase...');
    await this.refreshTokenDataIfNeeded();
    this.logger.log('Fetching all tokens from DB after potential refresh.');
    return this.tokenRepository.findAllOrderByRank();
  }

  private async refreshTokenDataIfNeeded(): Promise<void> {
    const log = await this.tokenUpdateLogRepository.getLog();
    const now = new Date();
    const lastRefreshedAt = log?.lastRefreshedAt;

    let shouldRefresh = true;
    const refreshInterval = this.REFRESH_INTERVAL_MS;

    if (lastRefreshedAt) {
      const timeSinceLastRefresh = now.getTime() - lastRefreshedAt.getTime();
      shouldRefresh = timeSinceLastRefresh > refreshInterval;
      this.logger.log(`Last token refresh check: ${lastRefreshedAt.toISOString()}. Time since: ${Math.round(timeSinceLastRefresh / 1000)}s. Refresh needed: ${shouldRefresh}`);
    } else {
      this.logger.log('No token refresh log found. Refresh needed.');
    }

    if (shouldRefresh) {
      this.logger.log('Starting token data refresh process...');
      try {
        const mappedData = await this.tokenDataService.fetchAndMapTokenData();
        this.logger.log(`Fetched and mapped ${mappedData.length} tokens from API.`);

        if (mappedData.length > 0) {
          const upsertedCount = await this.tokenRepository.bulkUpsertTokens(mappedData);
          this.logger.log(`Bulk upsert completed. ${upsertedCount} records affected.`);
        } else {
          this.logger.warn('No valid token data received from API to upsert.');
        }

        await this.tokenUpdateLogRepository.updateLog(now);
        this.logger.log('Token data refresh log updated.');
        this.logger.log('Token data refresh process finished successfully.');

      } catch (error) {
        this.logger.error('Failed during token data refresh process:', error);
      }
    } else {
      this.logger.log('Token data is recent enough. Skipping refresh.');
    }
  }
}

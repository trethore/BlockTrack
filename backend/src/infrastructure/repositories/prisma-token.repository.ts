import { Injectable, Logger } from '@nestjs/common';
import { ITokenRepository } from '../../token/domain/ports/token.repository.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { Token, Prisma } from '@generated/prisma';
import { MappedTokenData } from '../../token/domain/services/token-data.service';

@Injectable()
export class PrismaTokenRepository implements ITokenRepository {
  private readonly logger = new Logger(PrismaTokenRepository.name);

  constructor(private readonly prisma: PrismaService) { }

  async findAllOrderByRank(): Promise<Token[]> {
    return this.prisma.token.findMany({
      orderBy: {
        rank: 'asc',
      },
    });
  }

  async findById(id: string): Promise<Token | null> {
    return this.prisma.token.findUnique({
      where: { id },
    });
  }

  async findBySymbol(symbol: string): Promise<Token | null> {
    return this.prisma.token.findUnique({
      where: { symbol },
    });
  }

  async bulkUpsertTokens(tokenDataList: MappedTokenData[]): Promise<number> {
    if (tokenDataList.length === 0) {
      this.logger.log('Bulk upsert skipped: empty list.');
      return 0;
    }
    this.logger.log(`Starting bulk upsert for ${tokenDataList.length} tokens.`);

    const operations = tokenDataList.map(tokenData => {
      const payload = {
        name: tokenData.name,
        rank: tokenData.rank,
        priceUSD: tokenData.priceUSD,
        marketCapUsd: tokenData.marketCapUsd,
        volume24hUsd: tokenData.volume24hUsd,
        circulatingSupply: tokenData.circulatingSupply,
        totalSupply: tokenData.totalSupply,
        maxSupply: tokenData.maxSupply,
        percentChange1h: tokenData.percentChange1h,
        percentChange24h: tokenData.percentChange24h,
        percentChange7d: tokenData.percentChange7d,
        percentChange30d: tokenData.percentChange30d,
        percentChange1y: tokenData.percentChange1y,
        marketCapChange24h: tokenData.marketCapChange24h,
        lastUpdated: tokenData.lastUpdated,
      };
      return this.prisma.token.upsert({
        where: { symbol: tokenData.symbol },
        update: payload,
        create: { id: tokenData.id, symbol: tokenData.symbol, ...payload },
      });
    });

    try {
      const results = await this.prisma.$transaction(operations);
      this.logger.log(`Bulk upsert transaction successful. ${results.length} records affected.`);
      return results.length;
    } catch (error) {
      this.logger.error('Bulk upsert transaction failed:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(`Prisma Error Code: ${error.code}`);
      }
      throw error;
    }
  }

  async update(id: string, data: Prisma.TokenUpdateInput): Promise<Token | null> {
    try {
      const updatedToken = await this.prisma.token.update({
        where: { id },
        data,
      });
      return updatedToken;
    } catch (error) {
      this.logger.error(`Failed to update token with id ${id}`, error);
      return null;
    }
  }
}
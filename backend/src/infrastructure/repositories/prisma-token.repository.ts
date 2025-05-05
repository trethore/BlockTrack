import { Injectable } from '@nestjs/common';
import { ITokenRepository } from '../../token/domain/ports/token.repository.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { Token } from '../../../generated/prisma';

@Injectable()
export class PrismaTokenRepository implements ITokenRepository {
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
}
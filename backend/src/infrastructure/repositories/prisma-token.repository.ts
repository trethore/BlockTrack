import { Injectable } from '@nestjs/common';
import { ITokenRepository } from '../../leaderboard/ports/token.repository.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { Token } from '../../../generated/prisma';

@Injectable()
export class PrismaTokenRepository implements ITokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllOrderByRank(): Promise<Token[]> {
    return this.prisma.token.findMany({
      orderBy: {
        rank: 'asc',
      },
    });
  }
}
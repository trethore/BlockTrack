import { Injectable } from '@nestjs/common';
import { IFavoriteRepository } from '../../token/domain/ports/favorite.repository.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { Token } from '../../../generated/prisma';

@Injectable()
export class PrismaFavoriteRepository implements IFavoriteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findTokensByUserId(userId: string): Promise<Token[]> {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId: userId },
      include: {
        token: true,
      },
      orderBy: {
        token: {
          rank: 'asc',
        }
      }
    });

    return favorites.map(fav => fav.token);
  }
}

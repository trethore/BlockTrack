import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IFavoriteRepository } from '../../token/domain/ports/favorite.repository.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { Token, Favorite } from '@generated/prisma';
import { Prisma } from '@generated/prisma';

@Injectable()
export class PrismaFavoriteRepository implements IFavoriteRepository {
  constructor(private readonly prisma: PrismaService) { }

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

  async findFavorite(userId: string, tokenId: string): Promise<Favorite | null> {
    return this.prisma.favorite.findUnique({
      where: {
        userId_tokenId: {
          userId: userId,
          tokenId: tokenId,
        },
      },
    });
  }

  async addFavorite(userId: string, tokenId: string): Promise<Favorite> {
    try {
      return await this.prisma.favorite.create({
        data: {
          userId: userId,
          tokenId: tokenId,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const existing = await this.findFavorite(userId, tokenId);
        if (existing) return existing;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        console.error("Foreign key constraint failed on creating favorite:", error);
      }
      console.error("Error adding favorite:", error);
      throw new InternalServerErrorException("Could not add token to favorites.");
    }
  }

  async removeFavorite(userId: string, tokenId: string): Promise<void> {
    try {
      await this.prisma.favorite.delete({
        where: {
          userId_tokenId: {
            userId: userId,
            tokenId: tokenId,
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        console.warn(`Attempted to delete non-existent favorite: User ${userId}, Token ${tokenId}`);
        return;
      }
      console.error("Error removing favorite:", error);
      throw new InternalServerErrorException("Could not remove token from favorites.");
    }
  }
}

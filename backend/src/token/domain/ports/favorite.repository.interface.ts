import { Favorite, Token } from '@generated/prisma';

export interface IFavoriteRepository {
  findTokensByUserId(userId: string): Promise<Token[]>;
  findFavorite(userId: string, tokenId: string): Promise<Favorite | null>;
  addFavorite(userId: string, tokenId: string): Promise<Favorite>;
  removeFavorite(userId: string, tokenId: string): Promise<void>;
}

export const IFavoriteRepository = Symbol('IFavoriteRepository');

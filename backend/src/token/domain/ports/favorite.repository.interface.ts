import { Token } from '../../../../generated/prisma'; // Or a domain entity Token if created

export interface IFavoriteRepository {
  findTokensByUserId(userId: string): Promise<Token[]>;
  // TODO: addFavorite(userId: string, tokenId: string): Promise<void>;
  // TODO: removeFavorite(userId: string, tokenId: string): Promise<void>;
}

export const IFavoriteRepository = Symbol('IFavoriteRepository');

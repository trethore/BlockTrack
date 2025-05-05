import { Token } from '@generated/prisma';

export interface ITokenRepository {
  findAllOrderByRank(): Promise<Token[]>;
  findById(id: string): Promise<Token | null>;
  findBySymbol(symbol: string): Promise<Token | null>;
}

export const ITokenRepository = Symbol('ITokenRepository');

import { Token } from '../../../generated/prisma'; // Using Prisma type for simplicity, ideally a domain entity

export interface ITokenRepository {
  findAllOrderByRank(): Promise<Token[]>;
}

export const ITokenRepository = Symbol('ITokenRepository');
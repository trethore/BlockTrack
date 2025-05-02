import { Token } from '../../../generated/prisma';
export interface ITokenRepository {
    findAllOrderByRank(): Promise<Token[]>;
}
export declare const ITokenRepository: unique symbol;

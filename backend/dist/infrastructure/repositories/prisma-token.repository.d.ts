import { ITokenRepository } from '../../token/domain/ports/token.repository.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { Token } from '@generated/prisma';
export declare class PrismaTokenRepository implements ITokenRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllOrderByRank(): Promise<Token[]>;
    findById(id: string): Promise<Token | null>;
    findBySymbol(symbol: string): Promise<Token | null>;
}

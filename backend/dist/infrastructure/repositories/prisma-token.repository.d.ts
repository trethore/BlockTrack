import { ITokenRepository } from '../../leaderboard/ports/token.repository.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { Token } from '../../../generated/prisma';
export declare class PrismaTokenRepository implements ITokenRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllOrderByRank(): Promise<Token[]>;
}

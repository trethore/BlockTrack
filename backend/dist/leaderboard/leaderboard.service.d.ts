import { ITokenRepository } from './ports/token.repository.interface';
import { Token } from '../../generated/prisma';
export declare class LeaderboardService {
    private readonly tokenRepository;
    constructor(tokenRepository: ITokenRepository);
    getLeaderboard(): Promise<Token[]>;
}

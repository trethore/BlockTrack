import { LeaderboardService } from './leaderboard.service';
import { TokenEntity } from './entities/token.entity';
export declare class LeaderboardResolver {
    private readonly leaderboardService;
    constructor(leaderboardService: LeaderboardService);
    getLeaderboard(): Promise<TokenEntity[]>;
}

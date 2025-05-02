import { Resolver, Query } from '@nestjs/graphql';
import { LeaderboardService } from './leaderboard.service';
import { TokenEntity } from './entities/token.entity';

@Resolver(() => TokenEntity)
export class LeaderboardResolver {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Query(() => [TokenEntity], {
    name: 'leaderboard',
    description: 'Returns all tokens ordered by rank (ascending)',
  })
  async getLeaderboard(): Promise<TokenEntity[]> {
    return this.leaderboardService.getLeaderboard();
  }
}
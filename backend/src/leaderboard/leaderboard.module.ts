import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardResolver } from './leaderboard.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { ITokenRepository } from './ports/token.repository.interface';
import { PrismaTokenRepository } from '../infrastructure/repositories/prisma-token.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    LeaderboardResolver,
    LeaderboardService,
    {
      provide: ITokenRepository,
      useClass: PrismaTokenRepository,
    },
  ],
})
export class LeaderboardModule {}
import { Injectable, Inject } from '@nestjs/common';
import { ITokenRepository } from './ports/token.repository.interface'; 
import { Token } from '../../generated/prisma'; 

@Injectable()
export class LeaderboardService {
  constructor(
    @Inject(ITokenRepository)
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async getLeaderboard(): Promise<Token[]> {
    return this.tokenRepository.findAllOrderByRank();
  }
}
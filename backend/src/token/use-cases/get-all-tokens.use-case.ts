import { Injectable, Inject } from '@nestjs/common';
import { ITokenRepository } from '../domain/ports/token.repository.interface';
import { Token } from '@generated/prisma';

@Injectable()
export class GetAllTokensUseCase {
  constructor(
    @Inject(ITokenRepository)
    private readonly tokenRepository: ITokenRepository,
  ) { }

  async execute(): Promise<Token[]> {
    return this.tokenRepository.findAllOrderByRank();
  }
}

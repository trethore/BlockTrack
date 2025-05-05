import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ITokenRepository } from '../domain/ports/token.repository.interface';
import { Token } from '@generated/prisma';

interface GetTokenQuery {
  id?: string;
  symbol?: string;
}

@Injectable()
export class GetTokenUseCase {
  constructor(
    @Inject(ITokenRepository)
    private readonly tokenRepository: ITokenRepository,
  ) { }

  async execute(query: GetTokenQuery): Promise<Token> {
    let token: Token | null = null;

    if (query.id && query.symbol) {
      throw new BadRequestException('Provide either id or symbol, not both.');
    }

    if (query.id) {
      token = await this.tokenRepository.findById(query.id);
    } else if (query.symbol) {
      token = await this.tokenRepository.findBySymbol(query.symbol.toUpperCase());
    } else {
      throw new BadRequestException('Provide either id or symbol.');
    }

    if (!token) {
      throw new NotFoundException(`Token with ${query.id ? `id ${query.id}` : `symbol ${query.symbol}`} not found.`);
    }

    return token;
  }
}

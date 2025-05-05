import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IFavoriteRepository } from '../domain/ports/favorite.repository.interface';
import { Token } from '../../../generated/prisma';
import { IUserRepository } from '../../user/domain/ports/user.repository.interface'; // Assuming a user module exists

interface GetFavoriteTokensQuery {
  userId: string;
}

@Injectable()
export class GetFavoriteTokensUseCase {
  constructor(
    @Inject(IFavoriteRepository)
    private readonly favoriteRepository: IFavoriteRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetFavoriteTokensQuery): Promise<Token[]> {
    const userExists = await this.userRepository.findById(query.userId);
    if (!userExists) {
        throw new NotFoundException(`User with id ${query.userId} not found.`);
    }

    return this.favoriteRepository.findTokensByUserId(query.userId);
  }
}

import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IFavoriteRepository } from '../domain/ports/favorite.repository.interface';
import { ITokenRepository } from '../domain/ports/token.repository.interface';
import { IUserRepository } from '../../user/domain/ports/user.repository.interface';
import { Token } from '@generated/prisma';

interface RemoveFavoriteTokenCommand {
    userId: string;
    tokenId: string;
}

@Injectable()
export class RemoveFavoriteTokenUseCase {
    constructor(
        @Inject(IFavoriteRepository) private readonly favoriteRepository: IFavoriteRepository,
        @Inject(ITokenRepository) private readonly tokenRepository: ITokenRepository,
        @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    ) { }

    async execute(command: RemoveFavoriteTokenCommand): Promise<Token> {
        const user = await this.userRepository.findById(command.userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${command.userId} not found.`);
        }

        const token = await this.tokenRepository.findById(command.tokenId);
        if (!token) {
            throw new NotFoundException(`Token with ID ${command.tokenId} not found.`);
        }

        const existingFavorite = await this.favoriteRepository.findFavorite(command.userId, command.tokenId);
        if (!existingFavorite) {
            throw new NotFoundException(`Token ${token.symbol} is not in your favorites.`);
        }

        await this.favoriteRepository.removeFavorite(command.userId, command.tokenId);
        return token;
    }
}

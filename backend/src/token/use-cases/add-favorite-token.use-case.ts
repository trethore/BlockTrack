import { Injectable, Inject, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { IFavoriteRepository } from '@/src/token/domain/ports/favorite.repository.interface';
import { ITokenRepository } from '@/src/token/domain/ports/token.repository.interface';
import { IUserRepository } from '@/src/user/domain/ports/user.repository.interface';
import { Token } from '@generated/prisma';

interface AddFavoriteTokenCommand {
    userId: string;
    tokenId: string;
}

@Injectable()
export class AddFavoriteTokenUseCase {
    constructor(
        @Inject(IFavoriteRepository) private readonly favoriteRepository: IFavoriteRepository,
        @Inject(ITokenRepository) private readonly tokenRepository: ITokenRepository,
        @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    ) { }

    async execute(command: AddFavoriteTokenCommand): Promise<Token> {
        const user = await this.userRepository.findById(command.userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${command.userId} not found.`);
        }

        const token = await this.tokenRepository.findById(command.tokenId);
        if (!token) {
            throw new NotFoundException(`Token with ID ${command.tokenId} not found.`);
        }

        const existingFavorite = await this.favoriteRepository.findFavorite(command.userId, command.tokenId);
        if (existingFavorite) {
            throw new ConflictException(`Token ${token.symbol} is already in favorites.`);
        }

        await this.favoriteRepository.addFavorite(command.userId, command.tokenId);
        return token;
    }
}

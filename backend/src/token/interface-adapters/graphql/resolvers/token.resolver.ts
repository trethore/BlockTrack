import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TokenEntity } from '../entities/token.entity';
import { GetAllTokensUseCase } from '../../../use-cases/get-all-tokens.use-case';
import { GetTokenUseCase } from '../../../use-cases/get-token.use-case';
import { GetFavoriteTokensUseCase } from '../../../use-cases/get-favorite-tokens.use-case';
import { GetTokenInput } from '../dto/get-token.input';
import { JwtAuthGuard } from '../../../../infrastructure/auth/jwt-auth.guard';
import { CurrentUser } from '../../../../infrastructure/auth/current-user.decorator';
import { AddFavoriteTokenUseCase } from '../../../use-cases/add-favorite-token.use-case';
import { RemoveFavoriteTokenUseCase } from '../../../use-cases/remove-favorite-token.use-case';
import { FavoriteTokenInput } from '../dto/favorite-token.input';

@Resolver(() => TokenEntity)
export class TokenResolver {
  constructor(
    private readonly getAllTokensUseCase: GetAllTokensUseCase,
    private readonly getTokenUseCase: GetTokenUseCase,
    private readonly getFavoriteTokensUseCase: GetFavoriteTokensUseCase,
    private readonly addFavoriteTokenUseCase: AddFavoriteTokenUseCase,
    private readonly removeFavoriteTokenUseCase: RemoveFavoriteTokenUseCase,
  ) { }

  @Query(() => [TokenEntity], {
    name: 'tokens',
    description: 'Returns all tokens ordered by rank (ascending)',
  })
  async getTokens(): Promise<TokenEntity[]> {
    return this.getAllTokensUseCase.execute();
  }

  @Query(() => TokenEntity, {
    name: 'token',
    description: 'Returns a single token by ID or symbol',
    nullable: true,
  })
  async getToken(@Args('input') input: GetTokenInput): Promise<TokenEntity> {
    return this.getTokenUseCase.execute(input);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [TokenEntity], {
    name: 'myFavoriteTokens',
    description: "Returns the authenticated user's favorite tokens",
  })
  async getMyFavoriteTokens(
    @CurrentUser() user: { id: string },
  ): Promise<TokenEntity[]> {
    return this.getFavoriteTokensUseCase.execute({ userId: user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => TokenEntity, { description: 'Adds a token to the authenticated user\'s favorites' })
  async addFavoriteToken(
    @Args('input') input: FavoriteTokenInput,
    @CurrentUser() user: { id: string },
  ): Promise<TokenEntity> {
    return this.addFavoriteTokenUseCase.execute({
      userId: user.id,
      tokenId: input.tokenId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => TokenEntity, { description: 'Removes a token from the authenticated user\'s favorites' })
  async removeFavoriteToken(
    @Args('input') input: FavoriteTokenInput,
    @CurrentUser() user: { id: string },
  ): Promise<TokenEntity> {
    return this.removeFavoriteTokenUseCase.execute({
      userId: user.id,
      tokenId: input.tokenId,
    });
  }
}

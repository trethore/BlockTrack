import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { UserEntity } from '@/src/user/interface-adapters/graphql/entities/user.entity';
import { TokenEntity } from '@/src/token/interface-adapters/graphql/entities/token.entity';
import { CreateUserInput } from '@/src/user/interface-adapters/graphql/dto/create-user.input';
import { UpdateUserInput } from '@/src/user/interface-adapters/graphql/dto/update-user.input';
import { CreateUserUseCase } from '@/src/user/use-cases/create-user.use-case';
import { GetUserUseCase } from '@/src/user/use-cases/get-user.use-case';
import { UpdateUserUseCase } from '@/src/user/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '@/src/user/use-cases/delete-user.use-case';
import { IFavoriteRepository } from '@/src/token/domain/ports/favorite.repository.interface';
import { JwtAuthGuard } from '@/src/infrastructure/auth/jwt-auth.guard';
import { CurrentUser } from '@/src/infrastructure/auth/current-user.decorator';
import { AuthPayload } from '@/src/user/interface-adapters/graphql/entities/auth-payload.entity';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    @Inject(IFavoriteRepository) private readonly favoriteRepository: IFavoriteRepository,
  ) { }

  @Mutation(() => AuthPayload, { description: 'Creates a new user account and returns a JWT' })
  async createUser(
    @Args('createUserData') createUserData: CreateUserInput,
  ): Promise<AuthPayload> {
    const result = await this.createUserUseCase.execute(createUserData);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => UserEntity, { name: 'me', description: 'Gets the currently authenticated user' })
  async getMe(@CurrentUser() user: { id: string }): Promise<UserEntity> {
    const foundUser = await this.getUserUseCase.execute({ userId: user.id });
    return foundUser;
  }

  @ResolveField(() => [TokenEntity], { name: 'favorites', nullable: 'itemsAndList' })
  async getFavorites(@Parent() user: UserEntity): Promise<TokenEntity[]> {
    const favoriteTokens = await this.favoriteRepository.findTokensByUserId(user.id);
    return favoriteTokens;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UserEntity, { description: 'Updates the authenticated user profile' })
  async updateUser(
    @Args('updateUserData') updateUserData: UpdateUserInput,
    @CurrentUser() user: { id: string },
  ): Promise<UserEntity> {
    const updatedUser = await this.updateUserUseCase.execute({
      userIdToUpdate: updateUserData.id,
      authenticatedUserId: user.id,
      ...updateUserData,
    });
    return updatedUser;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ID, { description: 'Deletes the authenticated user profile' })
  async deleteUser(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: { id: string },
  ): Promise<string> {
    await this.deleteUserUseCase.execute({
      userIdToDelete: id,
      authenticatedUserId: user.id,
    });
    return id;
  }
}
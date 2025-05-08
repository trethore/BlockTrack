import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { TokenEntity } from '../../../token/interface-adapters/graphql/entities/token.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateUserUseCase } from '../../use-cases/create-user.use-case';
import { GetUserUseCase } from '../../use-cases/get-user.use-case';
import { UpdateUserUseCase } from '../../use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../use-cases/delete-user.use-case';
import { IFavoriteRepository } from '../../../token/domain/ports/favorite.repository.interface';
import { JwtAuthGuard } from '../../../infrastructure/auth/jwt-auth.guard';
import { CurrentUser } from '../../../infrastructure/auth/current-user.decorator';
import { User } from '@generated/prisma';
import { AuthPayload } from './entities/auth-payload.entity'; // Assure-toi que ce chemin est correct

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
  ): Promise<AuthPayload> { // MODIFIÉ ICI le type de retour
    const result = await this.createUserUseCase.execute(createUserData);
    return result; // result contient maintenant { accessToken: '...' }
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
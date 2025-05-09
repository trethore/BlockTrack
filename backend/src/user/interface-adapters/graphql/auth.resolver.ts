import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { LoginInput } from '@/src/user/interface-adapters/graphql/dto/login.input';
import { AuthPayload } from '@/src/user/interface-adapters/graphql/entities/auth-payload.entity';
import { LoginUserUseCase } from '@/src/user/use-cases/login-user.use-case';
import { JwtAuthGuard } from '../../../infrastructure/auth/jwt-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly loginUserUseCase: LoginUserUseCase,
  ) { }

  @Mutation(() => AuthPayload, { description: 'Logs in a user and returns a JWT' })
  async login(@Args('loginData') loginData: LoginInput): Promise<AuthPayload> {
    const result = await this.loginUserUseCase.execute(loginData);
    return result;
  }

  @Query(() => Boolean, {
    name: 'isTokenValid',
    description: 'Checks if the current authentication token is valid (not expired and correctly signed).',
  })
  @UseGuards(JwtAuthGuard)
  async checkTokenValidity(): Promise<boolean> {
    return true;
  }
}
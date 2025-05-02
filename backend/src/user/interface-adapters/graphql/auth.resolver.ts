import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { LoginInput } from './dto/login.input';
import { AuthPayload } from './entities/auth-payload.entity';
import { LoginUserUseCase } from '../../use-cases/login-user.use-case';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  @Mutation(() => AuthPayload, { description: 'Logs in a user and returns a JWT' })
  async login(@Args('loginData') loginData: LoginInput): Promise<AuthPayload> {
    const result = await this.loginUserUseCase.execute(loginData);
    return result;
  }
}
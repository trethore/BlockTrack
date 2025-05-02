import { LoginInput } from './dto/login.input';
import { AuthPayload } from './entities/auth-payload.entity';
import { LoginUserUseCase } from '../../use-cases/login-user.use-case';
export declare class AuthResolver {
    private readonly loginUserUseCase;
    constructor(loginUserUseCase: LoginUserUseCase);
    login(loginData: LoginInput): Promise<AuthPayload>;
}

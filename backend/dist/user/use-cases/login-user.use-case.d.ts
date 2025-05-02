import { IUserRepository } from '../domain/ports/user.repository.interface';
import { IAuthService } from '../domain/ports/auth.service.interface';
interface LoginUserCommand {
    emailOrUsername: string;
    password: string;
}
interface LoginResult {
    accessToken: string;
}
export declare class LoginUserUseCase {
    private readonly userRepository;
    private readonly authService;
    constructor(userRepository: IUserRepository, authService: IAuthService);
    execute(command: LoginUserCommand): Promise<LoginResult>;
}
export {};

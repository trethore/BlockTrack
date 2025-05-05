import { IUserRepository } from '../domain/ports/user.repository.interface';
import { IAuthService } from '../domain/ports/auth.service.interface';
import { User } from '@generated/prisma';
interface CreateUserCommand {
    email: string;
    username: string;
    password: string;
}
export declare class CreateUserUseCase {
    private readonly userRepository;
    private readonly authService;
    constructor(userRepository: IUserRepository, authService: IAuthService);
    execute(command: CreateUserCommand): Promise<User>;
}
export {};

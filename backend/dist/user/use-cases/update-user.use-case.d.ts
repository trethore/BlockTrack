import { IUserRepository } from '../domain/ports/user.repository.interface';
import { IAuthService } from '../domain/ports/auth.service.interface';
import { User } from '../../../generated/prisma';
interface UpdateUserCommand {
    userIdToUpdate: string;
    authenticatedUserId: string;
    username?: string;
    password?: string;
    email?: string;
}
export declare class UpdateUserUseCase {
    private readonly userRepository;
    private readonly authService;
    constructor(userRepository: IUserRepository, authService: IAuthService);
    execute(command: UpdateUserCommand): Promise<User>;
}
export {};

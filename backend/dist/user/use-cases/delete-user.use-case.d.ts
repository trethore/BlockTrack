import { IUserRepository } from '../domain/ports/user.repository.interface';
interface DeleteUserCommand {
    userIdToDelete: string;
    authenticatedUserId: string;
}
export declare class DeleteUserUseCase {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    execute(command: DeleteUserCommand): Promise<void>;
}
export {};

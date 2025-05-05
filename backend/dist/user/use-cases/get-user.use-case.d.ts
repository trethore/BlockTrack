import { IUserRepository } from '../domain/ports/user.repository.interface';
import { User } from '@generated/prisma';
interface GetUserQuery {
    userId: string;
}
export declare class GetUserUseCase {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    execute(query: GetUserQuery): Promise<User>;
}
export {};

import { UserEntity } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateUserUseCase } from '../../use-cases/create-user.use-case';
import { GetUserUseCase } from '../../use-cases/get-user.use-case';
import { UpdateUserUseCase } from '../../use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../use-cases/delete-user.use-case';
export declare class UserResolver {
    private readonly createUserUseCase;
    private readonly getUserUseCase;
    private readonly updateUserUseCase;
    private readonly deleteUserUseCase;
    constructor(createUserUseCase: CreateUserUseCase, getUserUseCase: GetUserUseCase, updateUserUseCase: UpdateUserUseCase, deleteUserUseCase: DeleteUserUseCase);
    createUser(createUserData: CreateUserInput): Promise<UserEntity>;
    getMe(user: {
        id: string;
    }): Promise<UserEntity>;
    updateUser(updateUserData: UpdateUserInput, user: {
        id: string;
    }): Promise<UserEntity>;
    deleteUser(id: string, user: {
        id: string;
    }): Promise<string>;
}

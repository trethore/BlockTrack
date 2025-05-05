import { User } from '@generated/prisma';
export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    create(data: {
        email: string;
        username: string;
        passwordHash: string;
    }): Promise<User>;
    update(id: string, data: {
        email?: string;
        username?: string;
        passwordHash?: string;
    }): Promise<User>;
    delete(id: string): Promise<void>;
}
export declare const IUserRepository: unique symbol;

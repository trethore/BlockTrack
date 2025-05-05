import { IUserRepository } from '../../user/domain/ports/user.repository.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@generated/prisma';
export declare class PrismaUserRepository implements IUserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
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

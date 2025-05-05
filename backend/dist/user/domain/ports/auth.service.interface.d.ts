import { User } from '@generated/prisma';
export interface IAuthService {
    hashPassword(password: string): Promise<string>;
    comparePasswords(password: string, hash: string): Promise<boolean>;
    generateToken(user: User): Promise<string>;
}
export declare const IAuthService: unique symbol;

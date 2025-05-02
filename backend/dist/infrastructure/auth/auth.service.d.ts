import { JwtService } from '@nestjs/jwt';
import { IAuthService } from '../../user/domain/ports/auth.service.interface';
import { User } from '../../../generated/prisma';
export declare class AuthService implements IAuthService {
    private readonly jwtService;
    private readonly saltRounds;
    constructor(jwtService: JwtService);
    hashPassword(password: string): Promise<string>;
    comparePasswords(password: string, hash: string): Promise<boolean>;
    generateToken(user: User): Promise<string>;
}

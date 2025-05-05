import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { IAuthService } from '../../user/domain/ports/auth.service.interface';
import { User } from '@generated/prisma';

@Injectable()
export class AuthService implements IAuthService {
  private readonly saltRounds = 10;

  constructor(private readonly jwtService: JwtService) { }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async generateToken(user: User): Promise<string> {
    const payload = { userId: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }
}
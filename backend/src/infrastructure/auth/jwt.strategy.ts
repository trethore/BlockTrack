import { AppConfig } from '@/src/config/app-config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<AppConfig>('app')?.jwt?.secret;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in the configuration (app.jwt.secret).');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { userId: string; username: string; iat: number; exp: number }) {
    return { id: payload.userId, username: payload.username };
  }
}
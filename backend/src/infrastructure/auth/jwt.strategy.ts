import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'MY_SECRET_KEY',
    });
  }

  async validate(payload: { userId: string; username: string; iat: number; exp: number }) {
    // TODO: Maybe add a check to see if the user exists in the database
    return { id: payload.userId, username: payload.username };
  }
}
import { AppConfig } from '../../config/app-config';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { IAuthService } from '../../user/domain/ports/auth.service.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<AppConfig>('app')?.jwt?.secret,
        signOptions: { expiresIn: configService.get<AppConfig>('app')?.jwt?.expiresIn },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: IAuthService,
      useClass: AuthService,
    },
    JwtStrategy,

  ],
  exports: [
    IAuthService,
    JwtModule,
    PassportModule,
    JwtStrategy,

  ],
})
export class AuthModule { }
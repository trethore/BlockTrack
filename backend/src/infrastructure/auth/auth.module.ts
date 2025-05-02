import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { IAuthService } from '../../user/domain/ports/auth.service.interface';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'YOUR_SUPER_SECRET_KEY', 
      signOptions: { expiresIn: '1h' }, 
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
export class AuthModule {}
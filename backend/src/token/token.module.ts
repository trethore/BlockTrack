import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../infrastructure/auth/auth.module';
import { UserModule } from '../user/user.module';

import { ITokenRepository } from './domain/ports/token.repository.interface';
import { IFavoriteRepository } from './domain/ports/favorite.repository.interface';
import { PrismaTokenRepository } from '../infrastructure/repositories/prisma-token.repository';
import { PrismaFavoriteRepository } from '../infrastructure/repositories/prisma-favorite.repository';

import { GetAllTokensUseCase } from './use-cases/get-all-tokens.use-case';
import { GetTokenUseCase } from './use-cases/get-token.use-case';
import { GetFavoriteTokensUseCase } from './use-cases/get-favorite-tokens.use-case';

import { TokenResolver } from './interface-adapters/graphql/resolvers/token.resolver';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
  ],
  providers: [
   
    {
      provide: ITokenRepository,
      useClass: PrismaTokenRepository,
    },
    {
      provide: IFavoriteRepository,
      useClass: PrismaFavoriteRepository,
    },

    GetAllTokensUseCase,
    GetTokenUseCase,
    GetFavoriteTokensUseCase,

    TokenResolver,
  ],
  exports: [
     
  ]
})
export class TokenModule {}

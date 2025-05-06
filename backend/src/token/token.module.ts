import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../infrastructure/auth/auth.module';
import { UserModule } from '../user/user.module';

import { ITokenRepository } from './domain/ports/token.repository.interface';
import { IFavoriteRepository } from './domain/ports/favorite.repository.interface';
import { ITokenUpdateLogRepository } from './domain/ports/token-update-log.repository.interface';
import { IDataPointRepository } from './domain/ports/datapoint.repository.interface';

import { PrismaTokenRepository } from '../infrastructure/repositories/prisma-token.repository';
import { PrismaFavoriteRepository } from '../infrastructure/repositories/prisma-favorite.repository';
import { PrismaTokenUpdateLogRepository } from '../infrastructure/repositories/prisma-token-update-log.repository';
import { PrismaDataPointRepository } from '../infrastructure/repositories/prisma-datapoint.repository';

import { GetAllTokensUseCase } from './use-cases/get-all-tokens.use-case';
import { GetTokenUseCase } from './use-cases/get-token.use-case';
import { GetFavoriteTokensUseCase } from './use-cases/get-favorite-tokens.use-case';
import { AddFavoriteTokenUseCase } from './use-cases/add-favorite-token.use-case';
import { RemoveFavoriteTokenUseCase } from './use-cases/remove-favorite-token.use-case';

import { TokenDataService } from './domain/services/token-data.service';

import { TokenResolver } from './interface-adapters/graphql/resolvers/token.resolver';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    HttpModule,
    ConfigModule,
  ],
  providers: [
    { provide: ITokenRepository, useClass: PrismaTokenRepository },
    { provide: IFavoriteRepository, useClass: PrismaFavoriteRepository },
    { provide: ITokenUpdateLogRepository, useClass: PrismaTokenUpdateLogRepository },
    { provide: IDataPointRepository, useClass: PrismaDataPointRepository },

    TokenDataService,

    GetAllTokensUseCase,
    GetTokenUseCase,
    GetFavoriteTokensUseCase,
    AddFavoriteTokenUseCase,
    RemoveFavoriteTokenUseCase,

    TokenResolver,
  ],
  exports: []
})
export class TokenModule { }

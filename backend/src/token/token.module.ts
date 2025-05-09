import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/src/prisma/prisma.module';
import { AuthModule } from '@/src/infrastructure/auth/auth.module';
import { UserModule } from '@/src/user/user.module';

import { ITokenRepository } from './domain/ports/token.repository.interface';
import { IFavoriteRepository } from './domain/ports/favorite.repository.interface';
import { ITokenUpdateLogRepository } from './domain/ports/token-update-log.repository.interface';
import { IDataPointRepository } from './domain/ports/datapoint.repository.interface';

import { PrismaTokenRepository } from '@/src/infrastructure/repositories/prisma-token.repository';
import { PrismaFavoriteRepository } from '@/src/infrastructure/repositories/prisma-favorite.repository';
import { PrismaTokenUpdateLogRepository } from '@/src/infrastructure/repositories/prisma-token-update-log.repository';
import { PrismaDataPointRepository } from '@/src/infrastructure/repositories/prisma-datapoint.repository';

import { GetAllTokensUseCase } from './use-cases/get-all-tokens.use-case';
import { GetTokenUseCase } from './use-cases/get-token.use-case';
import { AddFavoriteTokenUseCase } from './use-cases/add-favorite-token.use-case';
import { RemoveFavoriteTokenUseCase } from './use-cases/remove-favorite-token.use-case';

import { TokenDataService } from './domain/services/token-data.service';

import { TokenResolver } from './interface-adapters/graphql/resolvers/token.resolver';
import { DataPointLoader } from './infrastructure/graphql/dataloaders/datapoint.loader';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    forwardRef(() => UserModule),
    HttpModule,
    ConfigModule,
  ],
  providers: [
    { provide: ITokenRepository, useClass: PrismaTokenRepository },
    { provide: IFavoriteRepository, useClass: PrismaFavoriteRepository },
    { provide: ITokenUpdateLogRepository, useClass: PrismaTokenUpdateLogRepository },
    { provide: IDataPointRepository, useClass: PrismaDataPointRepository },

    TokenDataService,
    DataPointLoader,

    GetAllTokensUseCase,
    GetTokenUseCase,
    AddFavoriteTokenUseCase,
    RemoveFavoriteTokenUseCase,

    TokenResolver,
  ],
  exports: [
    IFavoriteRepository,
    DataPointLoader,
  ]
})
export class TokenModule { }

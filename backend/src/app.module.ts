import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { TokenModule } from './token/token.module';
import { GraphQLBigInt, GraphQLDateTime } from 'graphql-scalars';
import { UserModule } from './user/user.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { appConfiguration } from './config/app-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfiguration],
      envFilePath: '.env',
      cache: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    TokenModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      resolvers: { BigInt: GraphQLBigInt, DateTime: GraphQLDateTime },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module'; 
import { GraphQLBigInt } from 'graphql-scalars';

@Module({
  imports: [
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true, 
      playground: true, 
      introspection: true, 
      resolvers: { BigInt: GraphQLBigInt }, 
    }),
    LeaderboardModule, 
  ],
})
export class AppModule {}

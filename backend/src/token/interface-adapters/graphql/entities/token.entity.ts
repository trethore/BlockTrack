import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';
import { GraphQLBigInt, GraphQLDateTime } from 'graphql-scalars';
import { DataPointEntity } from '@/src/token/interface-adapters/graphql/entities/datapoint.entity';
@ObjectType({ description: 'Represents a cryptocurrency token' })
export class TokenEntity {
  @Field(() => ID)
  id: string;

  @Field()
  symbol: string;

  @Field()
  name: string;

  @Field(() => Int)
  rank: number;

  @Field(() => Float)
  priceUSD: number;

  @Field(() => Float, { nullable: true })
  marketCapUsd?: number | null;

  @Field(() => Float, { nullable: true })
  volume24hUsd?: number | null;

  @Field(() => GraphQLBigInt, { nullable: true })
  circulatingSupply?: bigint | null;

  @Field(() => GraphQLBigInt, { nullable: true })
  totalSupply?: bigint | null;

  @Field(() => GraphQLBigInt, { nullable: true })
  maxSupply?: bigint | null;

  @Field(() => Float, { nullable: true })
  percentChange1h?: number | null;

  @Field(() => Float, { nullable: true })
  percentChange24h?: number | null;

  @Field(() => Float, { nullable: true })
  percentChange7d?: number | null;

  @Field(() => Float, { nullable: true })
  percentChange30d?: number | null;

  @Field(() => Float, { nullable: true })
  percentChange1y?: number | null;

  @Field(() => Float, { nullable: true })
  marketCapChange24h?: number | null;

  @Field(() => GraphQLDateTime, { nullable: true })
  lastUpdated?: Date | null;

  @Field(() => GraphQLDateTime, { nullable: true })
  lastDataPointsUpdate?: Date | null;

  @Field(() => [DataPointEntity], { nullable: true, description: 'Historical data points for the token.' })
  dataPoints?: DataPointEntity[];
}
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { GraphQLDateTime } from 'graphql-scalars';

@ObjectType({ description: 'Represents a historical data point for a token' })
export class DataPointEntity {
    @Field(() => ID)
    id: string;

    @Field(() => GraphQLDateTime)
    date: Date;

    @Field(() => Float)
    priceUSD: number;
}
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLDateTime } from 'graphql-scalars'; // Use a specific scalar for Date/DateTime

@ObjectType({ description: 'Represents a user account' })
export class UserEntity {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field(() => GraphQLDateTime)
  createdAt: Date;

  @Field(() => GraphQLDateTime)
  updatedAt: Date;

}
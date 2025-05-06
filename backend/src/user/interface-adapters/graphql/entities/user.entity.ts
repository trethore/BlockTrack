import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLDateTime } from 'graphql-scalars';
import { TokenEntity } from '../../../../token/interface-adapters/graphql/entities/token.entity'; // <<< Import TokenEntity

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

  @Field(() => [TokenEntity], { nullable: true, description: "The user's favorite tokens." })
  favorites?: TokenEntity[];
}
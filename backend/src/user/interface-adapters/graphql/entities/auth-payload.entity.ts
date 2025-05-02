import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType({ description: 'Authentication token payload' })
export class AuthPayload {
  @Field()
  accessToken: string;
}
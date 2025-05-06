import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class FavoriteTokenInput {
    @Field(() => ID)
    @IsNotEmpty()
    tokenId: string;
}

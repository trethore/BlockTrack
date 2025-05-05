import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class FavoriteTokenInput {
    @Field(() => ID)
    @IsNotEmpty()
    @IsUUID('4', { message: 'tokenId must be a valid UUID' })
    tokenId: string;
}

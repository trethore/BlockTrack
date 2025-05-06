import { InputType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID, ValidateIf, IsNotEmpty } from 'class-validator';

@InputType()
export class GetTokenInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString({ message: 'ID must be a string' })
  @ValidateIf(o => !o.symbol)
  @IsNotEmpty({ message: 'Either id or symbol must be provided' })
  id?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @ValidateIf(o => !o.id)
  @IsNotEmpty({ message: 'Either id or symbol must be provided' })
  symbol?: string;
}

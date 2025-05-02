import { InputType, Field, ID } from '@nestjs/graphql';
import { IsEmail, MinLength, IsOptional, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Must be a valid email address' })
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Username cannot be empty' })
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string;
}
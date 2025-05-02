import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, MinLength, IsNotEmpty } from 'class-validator';
@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Username cannot be empty' })
  username: string;

  @Field()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
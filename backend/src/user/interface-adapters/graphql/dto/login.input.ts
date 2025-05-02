import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsNotEmpty({ message: 'Email or username cannot be empty' })
  emailOrUsername: string;

  @Field()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}
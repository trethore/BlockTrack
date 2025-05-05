import { Module } from '@nestjs/common';
import { UserResolver } from './interface-adapters/graphql/user.resolver';
import { AuthResolver } from './interface-adapters/graphql/auth.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { IUserRepository } from './domain/ports/user.repository.interface';
import { PrismaUserRepository } from '../infrastructure/repositories/prisma-user.repository';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { LoginUserUseCase } from './use-cases/login-user.use-case';
import { GetUserUseCase } from './use-cases/get-user.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';
import { DeleteUserUseCase } from './use-cases/delete-user.use-case';
import { AuthModule } from '../infrastructure/auth/auth.module'; 

@Module({
  imports: [PrismaModule, AuthModule], 
  providers: [
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    
    CreateUserUseCase,
    LoginUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    
    UserResolver,
    AuthResolver,
  ],
  exports: [
    IUserRepository
  ], 
})
export class UserModule {}
import { Module, forwardRef } from '@nestjs/common';
import { UserResolver } from '@/src/user/interface-adapters/graphql/user.resolver';
import { AuthResolver } from '@/src/user/interface-adapters/graphql/auth.resolver';
import { PrismaModule } from '@/src/prisma/prisma.module';
import { IUserRepository } from '@/src/user/domain/ports/user.repository.interface';
import { PrismaUserRepository } from '@/src/infrastructure/repositories/prisma-user.repository';
import { CreateUserUseCase } from '@/src/user/use-cases/create-user.use-case';
import { LoginUserUseCase } from '@/src/user/use-cases/login-user.use-case';
import { GetUserUseCase } from '@/src/user/use-cases/get-user.use-case';
import { UpdateUserUseCase } from '@/src/user/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '@/src/user/use-cases/delete-user.use-case';
import { AuthModule } from '@/src/infrastructure/auth/auth.module';
import { TokenModule } from '@/src/token/token.module';

@Module({
  imports: [PrismaModule, AuthModule, forwardRef(() => TokenModule)],
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
export class UserModule { }
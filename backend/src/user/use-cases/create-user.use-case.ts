import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { IUserRepository } from '@/src/user/domain/ports/user.repository.interface';
import { IAuthService } from '@/src/user/domain/ports/auth.service.interface';

interface CreateUserCommand {
  email: string;
  username: string;
  password: string;
}

interface CreateUserResult {
  accessToken: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IAuthService)
    private readonly authService: IAuthService,
  ) { }

  async execute(command: CreateUserCommand): Promise<CreateUserResult> {
    const existingUserByEmail = await this.userRepository.findByEmail(command.email);
    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }
    const existingUserByUsername = await this.userRepository.findByUsername(command.username);
    if (existingUserByUsername) {
      throw new ConflictException('Username already exists');
    }

    const passwordHash = await this.authService.hashPassword(command.password);

    const newUser = await this.userRepository.create({
      email: command.email,
      username: command.username,
      passwordHash,
    });

    const accessToken = await this.authService.generateToken(newUser);

    return { accessToken };
  }
}
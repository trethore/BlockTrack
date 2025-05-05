import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { IUserRepository } from '../domain/ports/user.repository.interface';
import { IAuthService } from '../domain/ports/auth.service.interface';
import { User } from '@generated/prisma';

interface CreateUserCommand {
  email: string;
  username: string;
  password: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IAuthService)
    private readonly authService: IAuthService,
  ) { }

  async execute(command: CreateUserCommand): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(command.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const existingUsername = await this.userRepository.findByUsername(command.username);
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }


    const passwordHash = await this.authService.hashPassword(command.password);

    const newUser = await this.userRepository.create({
      email: command.email,
      username: command.username,
      passwordHash,
    });

    return newUser;
  }
}
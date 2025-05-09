import { Injectable, Inject, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { IUserRepository } from '@/src/user/domain/ports/user.repository.interface';
import { IAuthService } from '@/src/user/domain/ports/auth.service.interface';
import { User } from '@generated/prisma';

interface UpdateUserCommand {
  userIdToUpdate: string;
  authenticatedUserId: string;
  username?: string;
  password?: string;
  email?: string;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IAuthService)
    private readonly authService: IAuthService,
  ) { }

  async execute(command: UpdateUserCommand): Promise<User> {
    if (command.userIdToUpdate !== command.authenticatedUserId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const existingUser = await this.userRepository.findById(command.userIdToUpdate);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updateData: { email?: string; username?: string; passwordHash?: string } = {};

    if (command.email !== undefined && command.email !== existingUser.email) {
      const emailExists = await this.userRepository.findByEmail(command.email);
      if (emailExists) {
        throw new ConflictException('Email already exists');
      }
      updateData.email = command.email;
    }

    if (command.username !== undefined && command.username !== existingUser.username) {
      const usernameExists = await this.userRepository.findByUsername(command.username);
      if (usernameExists) {
        throw new ConflictException('Username already exists');
      }
      updateData.username = command.username;
    }

    if (command.password !== undefined) {
      updateData.passwordHash = await this.authService.hashPassword(command.password);
    }

    if (Object.keys(updateData).length === 0) {
      return existingUser;
    }

    const updatedUser = await this.userRepository.update(
      command.userIdToUpdate,
      updateData,
    );

    return updatedUser;
  }
}
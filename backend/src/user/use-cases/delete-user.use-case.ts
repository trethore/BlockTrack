import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IUserRepository } from '../domain/ports/user.repository.interface';

interface DeleteUserCommand {
  userIdToDelete: string;
  authenticatedUserId: string;
}

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    if (command.userIdToDelete !== command.authenticatedUserId) {
      throw new ForbiddenException('You can only delete your own profile');
    }

    const existingUser = await this.userRepository.findById(command.userIdToDelete);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(command.userIdToDelete);
  }
}
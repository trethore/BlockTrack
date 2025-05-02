import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../domain/ports/user.repository.interface';
import { User } from '../../../generated/prisma';

interface GetUserQuery {
  userId: string; 
}

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUserQuery): Promise<User> {
    const user = await this.userRepository.findById(query.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
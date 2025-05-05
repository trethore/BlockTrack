import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../user/domain/ports/user.repository.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@generated/prisma';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async create(data: { email: string; username: string; passwordHash: string }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: { email?: string; username?: string; passwordHash?: string }): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
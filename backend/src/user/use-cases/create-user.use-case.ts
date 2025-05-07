import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { IUserRepository } from '../domain/ports/user.repository.interface';
import { IAuthService } from '../domain/ports/auth.service.interface';
import { User } from '@generated/prisma'; // Garde User si tu en as besoin pour authService.generateToken

interface CreateUserCommand {
  email: string;
  username: string;
  password: string;
}

// Définit le type de retour attendu par le resolver
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

  async execute(command: CreateUserCommand): Promise<CreateUserResult> { // MODIFIÉ ICI le type de retour
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

    // Générer le token pour le nouvel utilisateur
    const accessToken = await this.authService.generateToken(newUser);

    return { accessToken }; // RETOURNE AuthPayload
  }
}
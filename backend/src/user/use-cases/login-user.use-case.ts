import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '@/src/user/domain/ports/user.repository.interface';
import { IAuthService } from '@/src/user/domain/ports/auth.service.interface';

interface LoginUserCommand {
  emailOrUsername: string;
  password: string;
}

interface LoginResult {
  accessToken: string;
}

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IAuthService)
    private readonly authService: IAuthService,
  ) { }

  async execute(command: LoginUserCommand): Promise<LoginResult> {
    const user =
      (await this.userRepository.findByEmail(command.emailOrUsername)) ||
      (await this.userRepository.findByUsername(command.emailOrUsername));

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.authService.comparePasswords(
      command.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.authService.generateToken(user);

    return { accessToken };
  }
}